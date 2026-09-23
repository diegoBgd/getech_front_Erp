import React, { useState, useEffect } from 'react';
import { Divider } from 'primereact/divider';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RubriqueForm } from '@/components/forms/RubriqueForm';
import { rubriqueService, type RubriqueFinanciere } from '@/services/rubrique.service';

export const RubriqueFinancierePage: React.FC = () => {
  // 💡 CENTRALISATION DU TYPE ETAT AUTORISÉ PAR VOTRE SERVICE
  const [typeEtat, setTypeEtat] = useState<'BILAN' | 'COMPTE_RESULTAT' | 'FLUX_TRESO'>('BILAN');
  const [rubriques, setRubriques] = useState<RubriqueFinanciere[]>([]);
  const [ligneEnEdition, setLigneEnEdition] = useState<RubriqueFinanciere | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 💡 CORRECTIF DE TYPAGE STRICT POUR LE COMPOSANT SELECT DE L'UI
  const optionsEtats = [
    { label: '💼 BILAN COMPTABLE PATRIMONIAL', value: 'BILAN' },
    { label: '📈 COMPTE DE RÉSULTAT (SIG)', value: 'COMPTE_RESULTAT' },
    { label: '🧮 ETAT DES FLUX DE TRÉSORERIE (TFT)', value: 'FLUX_TRESO' }
  ];

  const chargerDonnees = async () => {
    setLoading(true);
    try {
      // Utilise désormais l'instance unifiée "api" de votre rubriqueService corrigé
      const data = await rubriqueService.getToutesParEtat(typeEtat);
      setRubriques(data || []);
    } catch (err) {
      console.error("Erreur de récupération des règles", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerDonnees();
    setLigneEnEdition(null); // Réinitialise l'édition en cas de bascule d'onglet
  }, [typeEtat]);

  const handleSuppression = async (id: number) => {
    if (!window.confirm("Confirmez-vous la suppression définitive de cette règle de paramétrage ?")) return;
    try {
      await rubriqueService.delete(id);
      await chargerDonnees();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 dark:border-navy-800 p-6 flex flex-col shadow-sm">
        
        {/* BARRE DE SÉLECTION SUPÉRIEURE */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-base font-bold text-navy-900 dark:text-navy-50">Dictionnaire des États Financiers</h2>
            <p className="text-xs text-navy-400 dark:text-navy-500">Configuration des rubriques et affectation des plages de comptes</p>
          </div>
          <div className="w-full sm:w-[320px]">
            {/* 💡 SÉLECTEUR CENTRALISÉ LIÉ AU CONTROLE DES COMPOSANTS */}
            <Select 
              value={typeEtat} 
              options={optionsEtats} 
              onChange={(e: any) => setTypeEtat(e.value)} 
              placeholder="Sélectionner l'état à configurer"
              className="text-xs font-bold"
            />
          </div>
        </div>

        <Divider className="my-5 border-navy-100 dark:border-navy-800" />

        {/* FORMULAIRE DYNAMIQUE ADAPTATIF */}
        <div className="mb-6">
          <RubriqueForm 
            typeEtat={typeEtat} 
            initialValues={ligneEnEdition} 
            onSuccess={() => { chargerDonnees(); setLigneEnEdition(null); }} 
            onCancelEdit={() => setLigneEnEdition(null)} 
          />
        </div>

        {/* GRILLE RECAPITULATIVE DES REGLES DE CONFIGURATION */}
        <div className="border border-navy-100 dark:border-navy-800 rounded-xl overflow-hidden bg-white dark:bg-navy-950 w-full mt-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-navy-50/40 dark:bg-navy-900/20 border-b border-navy-100 dark:border-navy-800 text-[10px] font-bold text-navy-400 dark:text-navy-500 uppercase tracking-wider">
                  <th className="p-3 pl-5">Code</th>
                  <th className="p-3">Désignation de la Ligne</th>
                  <th className="p-3">Mode</th>
                  <th className="p-3">Plages de Comptes</th>
                  <th className="p-3 text-center w-[100px]">Ordre</th>
                  <th className="p-3 text-center w-[120px] pr-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50 dark:divide-navy-800 text-xs text-navy-700 dark:text-navy-300">
                {loading ? (
                  <tr><td colSpan={6} className="text-center p-8 text-navy-400 font-bold font-mono">Chargement de la structure...</td></tr>
                ) : rubriques.length === 0 ? (
                  <tr><td colSpan={6} className="text-center p-8 text-navy-400 italic">Aucune rubrique configurée pour cet état financier.</td></tr>
                ) : (
                  rubriques.map((r) => (
                    <tr key={r.code} className="hover:bg-navy-50/10 dark:hover:bg-navy-800/10 transition-colors">
                      <td className="p-2.5 pl-5 font-mono font-bold text-navy-900 dark:text-navy-50">{r.code}</td>
                      <td className="p-2.5 font-medium">{r.intitule}</td>
                      <td className="p-2.5"><span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${r.modeCalcul === 'SOMME' ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/40' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40'}`}>{r.modeCalcul}</span></td>
                      <td className="p-2.5 font-mono text-slate-500 max-w-[200px] truncate">{r.plageComptesPrincipal || '-'}</td>
                      <td className="p-2.5 text-center font-bold">{r.ordre}</td>
                      <td className="p-2.5 text-center flex justify-center gap-1.5 pr-5">
                        <Button variant="outline" size="sm" onClick={() => setLigneEnEdition(r)} className="h-7 w-7 p-0 border-navy-200 text-navy-600 dark:border-navy-700 dark:text-navy-300"><i className="pi pi-pencil text-[10px]" /></Button>
                        <Button variant="outline" size="sm" onClick={() => handleSuppression(r.id!)} className="h-7 w-7 p-0 border-navy-200 text-rose-600 dark:border-navy-700"><i className="pi pi-trash text-[10px]" /></Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
