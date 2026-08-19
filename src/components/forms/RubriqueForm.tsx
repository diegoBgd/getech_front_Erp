import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { rubriqueService, type RubriqueFinanciere } from '@/services/rubrique.service';


interface FormProps {
  typeEtat: 'BILAN' | 'COMPTE_RESULTAT';
  onSuccess: () => void;
}

export const RubriqueForm: React.FC<FormProps> = ({ typeEtat, onSuccess }) => {
  // --- ÉTATS DU FORMULAIRE ---
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [intitule, setIntitule] = useState('');
  const [nature, setNature] = useState<'ACTIF' | 'PASSIF' | 'PRODUIT' | 'CHARGE'>('ACTIF');
  const [modeCalcul, setModeCalcul] = useState<'COMPTES' | 'SOMME'>('COMPTES');
  const [plagePrincipal, setPlagePrincipal] = useState('');
  const [plageCorrectif, setPlageCorrectif] = useState('');
  const [sensSolde, setSensSolde] = useState<'TOUS' | 'DEBITEUR' | 'CREDITEUR'>('TOUS');
  const [ordre, setOrdre] = useState('10');
  
  // Élément d'arborescence pour les totaux
  const [parentId, setParentId] = useState<number | null>(null);
  const [listeParentsPossibles, setListeParentsPossibles] = useState<{ label: string; value: number | null }[]>([]);

  // --- CHARGEMENT DES COMPTES PARENTS SANS RESTRICTION SUR LE MODE ---
  const chargerRubriquesPivots = async () => {
    try {
      const data = await rubriqueService.getToutesParEtat(typeEtat);
      
      const options: { label: string; value: number | null }[] = [];
      
      if (data && Array.isArray(data)) {
        data.forEach(node => {
          //  OPTIMISATION : On accepte toutes les rubriques existantes comme parent potentiel
          if (node.id !== undefined && node.id !== null) {
            options.push({
              label: `[${node.code}] ${node.intitule.toUpperCase()} (${node.modeCalcul})`,
              value: node.id
            });
          }
        });
      }

      // Option par défaut en tête de liste pour rendre le parent optionnel
      setListeParentsPossibles([
        { label: 'AUCUN PARENT (RUBRIQUE RACINE / NIVEAU 0)', value: null }, 
        ...options
      ]);
    } catch (err) {
      console.error("Erreur lors du pré-chargement des rubriques", err);
      setListeParentsPossibles([{ label: 'AUCUN PARENT (RUBRIQUE RACINE / NIVEAU 0)', value: null }]);
    }
  };

  useEffect(() => {
    chargerRubriquesPivots();
  }, [typeEtat]);

  // --- CONFIGURATION DES OPTIONS DE VOS COMPOSANTS SELECT ---
  const optionsNature = [
    { label: 'ACTIF (Bilan)', value: 'ACTIF' },
    { label: 'PASSIF (Bilan)', value: 'PASSIF' },
    { label: 'PRODUIT (Résultat)', value: 'PRODUIT' },
    { label: 'CHARGE (Résultat)', value: 'CHARGE' }
  ];

  const optionsMode = [
    { label: 'COMPTES (Interroger Balance)', value: 'COMPTES' },
    { label: 'SOMME (Calculer sous-totaux)', value: 'SOMME' }
  ];

  const optionsSens = [
    { label: 'Tous Soldes Confondus', value: 'TOUS' },
    { label: 'Strictement Débiteur (> 0)', value: 'DEBITEUR' },
    { label: 'Strictement Créditeur (> 0)', value: 'CREDITEUR' }
  ];

  // --- TRAITEMENT ET PERSISTANCE ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !intitule) return;

    setLoading(true);
    try {
      const payload: RubriqueFinanciere = {
        code: code.trim().toUpperCase(),
        intitule: intitule.trim(),
        typeEtat,
        nature,
        modeCalcul,
        plageComptesPrincipal: modeCalcul === 'COMPTES' ? plagePrincipal.trim() : undefined,
        plageComptesCorrectif: modeCalcul === 'COMPTES' ? plageCorrectif.trim() : undefined,
        sensSoldeAdmis: modeCalcul === 'COMPTES' ? sensSolde : 'TOUS',
        ordre: Number(ordre),
        parentId: parentId
      };

      await rubriqueService.save(payload);
      
      // Nettoyage complet des champs de saisie
      setCode('');
      setIntitule('');
      setPlagePrincipal('');
      setPlageCorrectif('');
      setParentId(null);
      setOrdre('10');
      
      // Actualisation des listes
      onSuccess();
      await chargerRubriquesPivots();
    } catch (err) {
      console.error("Erreur d'écriture de la rubrique financière", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white dark:bg-navy-900 p-4 rounded-xl border border-navy-100 dark:border-navy-800 shadow-sm animate-fade-in">
      
      {/*  LIGNE 1 : STRUCTURE ET HIERARCHIE DE LA LIGNE COMPTABLE */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-navy-800 dark:text-navy-200  tracking-wider">Code Ligne Unique</label>
          <Input value={code} onChange={e => setCode(e.target.value)} placeholder="ex: TOT_ACTIF_IMMOB" required className="text-xs font-mono font-bold" />
        </div>
        
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-xs font-bold text-navy-800 dark:text-navy-200  tracking-wider">Désignation Officielle du Poste</label>
          <Input value={intitule} onChange={e => setIntitule(e.target.value)} placeholder="ex: Immobilisations Corporelles" required className="text-xs font-bold" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-navy-800 dark:text-navy-200  tracking-wider">Rattacher au Sous-Total (Parent)</label>
          <Select 
            value={parentId} 
            options={listeParentsPossibles}
            onChange={(e: any) => setParentId(e.value)} 
            placeholder="Sélectionner un parent"
            className="w-full text-xs font-medium" 
          />
        </div>
      </div>

      {/* LIGNE 2 : NATURE ET ALGORITHME DE CALCUL */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-navy-800 dark:text-navy-200  tracking-wider">Nature Comptable</label>
          <Select 
            value={nature} 
            options={optionsNature}
            onChange={(e: any) => setNature(e.value)} 
            className="w-full text-xs " 
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-navy-800 dark:text-navy-200  tracking-wider">Mode Opératoire</label>
          <Select 
            value={modeCalcul} 
            options={optionsMode}
            onChange={(e: any) => setModeCalcul(e.value)} 
            className="w-full text-xs " 
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-navy-800 dark:text-navy-200  tracking-wider">Sens Solde Admis</label>
          <Select 
            value={sensSolde} 
            options={optionsSens}
            onChange={(e: any) => setSensSolde(e.value)} 
            className="w-full text-xs " 
            disabled={modeCalcul === 'SOMME'} 
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-navy-800 dark:text-navy-200  tracking-wider">Index Ordre d'affichage</label>
          <Input type="number" value={ordre} onChange={e => setOrdre(e.target.value)} required className="text-xs font-bold" />
        </div>
      </div>

      {/* COMPTES SOURCES (Affiché uniquement pour le mode COMPTES) */}
      {modeCalcul === 'COMPTES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-dashed border-navy-100 dark:border-navy-800 pt-3 mt-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-emerald-700 dark:text-emerald-400  tracking-wider">Comptes Sources Principaux (Valeurs Brutes)</label>
            <Input value={plagePrincipal} onChange={e => setPlagePrincipal(e.target.value)} placeholder="Séparer par virgules. ex: 21,22,24,!245" className="text-xs font-mono font-bold tracking-wide" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-rose-700 dark:text-rose-400  tracking-wider">Comptes Correctifs Annexes (Amortissements / Provisions)</label>
            <Input value={plageCorrectif} onChange={e => setPlageCorrectif(e.target.value)} placeholder="Séparer par virgules. ex: 281,284,291" className="text-xs font-mono font-bold tracking-wide" />
          </div>
        </div>
      )}

      {/* ACTION BLOCK */}
      <div className="flex justify-end border-t border-navy-100 dark:border-navy-800 pt-3">
        <Button type="submit" disabled={loading} variant="default" size="sm" className="w-[150px] font-bold  text-xs tracking-wider h-[38px] shadow-xs">
          {loading ? (
            <>
              <i className="pi pi-spin pi-spinner mr-2 text-xs"></i>
              Enregistrement encours...
            </>
          ) : (
            <>
              <i className="pi pi-save mr-2 text-xs"></i>
              Enregistrer
            </>
          )}
        </Button>
      </div>

    </form>
  );
};
