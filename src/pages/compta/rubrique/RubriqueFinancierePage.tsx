import React, { useState, useEffect } from 'react';
import { Divider } from 'primereact/divider';
import { Select } from '@/components/ui/select';

import { RubriqueForm } from '@/components/forms/RubriqueForm';
import { RubriqueTable } from './RubriqueTable'; // 💡 IMPORT DU SOUS-COMPOSANT TABLE
import { rubriqueService, type RubriqueFinanciere } from '@/services/rubrique.service';
import { ModalConfirm } from '@/components/ui/modal-confirm';

export const RubriqueFinancierePage: React.FC = () => {
  const [typeEtat, setTypeEtat] = useState<'BILAN' | 'COMPTE_RESULTAT' | 'FLUX_TRESO'>('BILAN');
  const [rubriques, setRubriques] = useState<RubriqueFinanciere[]>([]);
  const [ligneEnEdition, setLigneEnEdition] = useState<RubriqueFinanciere | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [suppressionLoading, setSuppressionLoading] = useState<boolean>(false);

  const [confirmVisible, setConfirmOpen] = useState<boolean>(false);
  const [idASupprimer, setIdASupprimer] = useState<number | null>(null);
  const [codeASupprimer, setCodeASupprimer] = useState<string>('');

  const optionsEtats = [
    { label: '💼 BILAN COMPTABLE PATRIMONIAL', value: 'BILAN' },
    { label: '📈 COMPTE DE RÉSULTAT (SIG)', value: 'COMPTE_RESULTAT' },
    { label: '🧮 ETAT DES FLUX DE TRÉSORERIE (TFT)', value: 'FLUX_TRESO' }
  ];

  const chargerDonnees = async () => {
    setLoading(true);
    try {
      const data = await rubriqueService.getToutesParEtat(typeEtat);
      setRubriques(data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => {
    chargerDonnees();
    setLigneEnEdition(null);
  }, [typeEtat]);

  const handleSuccessFormulaire = async () => {
    setLigneEnEdition(null);
    await chargerDonnees();
  };

  const declencherOuvertureSuppression = (id: number, codeLigne: string) => {
    setIdASupprimer(id);
    setCodeASupprimer(codeLigne);
    setConfirmOpen(true);
  };

  const executerSuppressionComptable = async () => {
    if (!idASupprimer) return;
    setSuppressionLoading(true);
    try {
      await rubriqueService.delete(idASupprimer);
      await chargerDonnees();
    } catch (err) { console.error(err); } finally {
      setSuppressionLoading(false);
      setConfirmOpen(false);
      setIdASupprimer(null);
      setCodeASupprimer('');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <ModalConfirm
        visible={confirmVisible}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={executerSuppressionComptable}
        title="Confirmation de suppression"
        message={`Voulez-vous vraiment supprimer la rubrique [${codeASupprimer}] ? Cette action est irréversible.`}
        variant="destructive" 
        loading={suppressionLoading}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
      />
      <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 dark:border-navy-800 p-6 flex flex-col shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-base font-bold text-navy-900 dark:text-navy-50">Dictionnaire des États Financiers</h2>
            <p className="text-xs text-navy-400 dark:text-navy-500">Configuration des rubriques et générateurs automatiques de clés</p>
          </div>
          <div className="w-full sm:w-[320px]">
            <Select value={typeEtat} options={optionsEtats} onChange={(e: any) => setTypeEtat(e.value)} placeholder="Sélectionner l'état" className="text-xs font-bold" />
          </div>
        </div>
        <Divider className="my-5 border-navy-100 dark:border-navy-800" />
        <div className="mb-6">
          <RubriqueForm typeEtat={typeEtat} initialValues={ligneEnEdition} onSuccess={handleSuccessFormulaire} onCancelEdit={() => setLigneEnEdition(null)} />
        </div>
        
        {/* 💡 INTEGRATION DE VOTRE COMPOSANT TABLE DÉCOUPÉ ET SÉPARÉ */}
        <RubriqueTable 
          rubriques={rubriques} 
          rubriqueEnEdition={ligneEnEdition} 
          onEdit={(r) => setLigneEnEdition(r)} 
          onDelete={declencherOuvertureSuppression} 
        />
      </div>
    </div>
  );
};
