import React, { useEffect, useState } from 'react';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';

import { RubriqueForm } from '../../components/forms/RubriqueForm';
import { Select } from '../../components/ui/select';
import { rubriqueService, type RubriqueFinanciere } from '@/services/rubrique.service';
import { RubriqueTable } from './RubriqueTable';

export const RubriqueFinancierePage: React.FC = () => {
  const [typeEtat, setTypeEtat] = useState<'BILAN' | 'COMPTE_RESULTAT'>('BILAN');
  const [rubriques, setRubriques] = useState<RubriqueFinanciere[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Configuration pour le sélecteur d'en-tête ERP
  const optionsEtat = [
    { label: 'Le Bilan Comptable', value: 'BILAN' },
    { label: 'Le Compte de Résultat', value: 'COMPTE_RESULTAT' }
  ];

  const aplatirRubriques = (nodes: RubriqueFinanciere[]): RubriqueFinanciere[] => {
    if (!nodes || !Array.isArray(nodes)) return [];
    let result: RubriqueFinanciere[] = [];
    
    nodes.forEach(node => {
      result.push(node);
      if (node.enfants && node.enfants.length > 0) {
        result = result.concat(aplatirRubriques(node.enfants));
      }
    });
    
    return result;
  };

  const chargerDonnees = async () => {
    setLoading(true);
    try {
      const data = await rubriqueService.getParEtat(typeEtat);
      const listeBrute = Array.isArray(data) ? data : [];
      const listeAplatie = aplatirRubriques(listeBrute);
      setRubriques(listeAplatie);
    } catch (err) {
      console.error("Erreur de récupération des rubriques", err);
      setRubriques([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerDonnees();
  }, [typeEtat]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette règle de calcul ?")) return;
    try {
      await rubriqueService.delete(id);
      chargerDonnees();
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 dark:border-navy-800 p-6 flex flex-col shadow-sm">
        
        {/* EN-TÊTE CONFIGURATION */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-navy-900 dark:text-navy-50">
              Moteur de Configuration des États Financiers
            </h2>
            <p className="text-xs text-navy-400 dark:text-navy-500">
              Paramétrez les rubriques réglementaires et associez-les aux plages du plan comptable
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-navy-400 uppercase tracking-wider">État :</span>
            <Select 
              value={typeEtat} 
              options={optionsEtat}
              onChange={(e: any) => setTypeEtat(e.value)} 
              className="w-[200px] text-xs font-bold uppercase h-[32px]" 
            />
          </div>
        </div>

        <Divider className="my-4 border-navy-100 dark:border-navy-800" />

        <div className="flex flex-col gap-6">
          <RubriqueForm typeEtat={typeEtat} onSuccess={chargerDonnees} />

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <ProgressSpinner style={{ width: '32px' }} />
              <span className="text-xs text-navy-400">Chargement de la cartographie comptable...</span>
            </div>
          ) : rubriques.length === 0 ? (
            <div className="text-center p-12 border border-dashed border-navy-200 dark:border-navy-800 text-xs text-navy-400 rounded-xl bg-navy-50/5">
              <i className="pi pi-sliders-h text-lg mb-2 text-navy-300 block"></i>
              Aucune règle de calcul n'est encore définie pour cet état financier. Saisissez votre première ligne ci-dessus.
            </div>
          ) : (
            <RubriqueTable rubriques={rubriques} onDelete={handleDelete} />
          )}
        </div>

      </div>
    </div>
  );
};
