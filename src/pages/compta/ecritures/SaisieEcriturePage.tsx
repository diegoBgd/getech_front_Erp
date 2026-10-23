import React, { useEffect, useState, useRef } from 'react';
import { Divider } from 'primereact/divider'; 
import { Toast } from 'primereact/toast';
import { ecritureService } from '@/services/ecriture.service'; 
import { Button } from '@/components/ui/button';
import { SaisieEcritureForm } from '@/components/forms/SaisieEcritureForm'; 
import { ListePiecesModal } from './ListePiecesModal';
import { useExerciceGlobal } from '@/contexts/ExerciceContext';

export const SaisieEcriturePage: React.FC = () => {
  const [loading, setLoading] = useState(false); 
  const [initialisation, setInitialisation] = useState(true);
  const [modalPiecesVisible, setModalPiecesVisible] = useState(false); 
  const [ecritureEnEdition, setEcritureEnEdition] = useState<any>(null);
  const toastRef = useRef<Toast>(null); 
  const [journaux, setJournaux] = useState<any[]>([]); 
  const [comptes, setComptes] = useState<any[]>([]);
  const { exercicesOptions, exerciceActif } = useExerciceGlobal();

  const estCloture = exerciceActif?.statut === 'CLOTURE';
  const estDejaValidee = ecritureEnEdition?.validee === true; 
  const estVerrouilleAEdition = estCloture || estDejaValidee;

  const chargerReferentiels = async () => {
    try {
      const [listJournaux, listComptes] = await Promise.all([
        ecritureService.getJournaux(),
        ecritureService.getComptesDetail()
      ]);
      setJournaux((listJournaux || []).map(j => ({ 
        label: `${j.code} - ${(j.intitule || 'Journal').toUpperCase()}`, 
        value: j.code 
      })));
      setComptes((listComptes || []).map(c => ({ 
        label: `${c.code} - ${(c.intitule || '').toUpperCase()}`, 
        value: c.code 
      })));
    } catch { 
      console.error("Erreur d'extraction des référentiels"); 
    } finally { 
      setInitialisation(false); 
    }
  };

  useEffect(() => { chargerReferentiels(); }, []);

  const handleEnregistrerEcriture = async (payload: any) => {
    if (estVerrouilleAEdition) return;
    setLoading(true);
    try {
      if (ecritureEnEdition?.id) {
        await ecritureService.updatePiece(Number(ecritureEnEdition.id), payload);
        toastRef.current?.show({ severity: 'success', summary: 'Mis à jour', detail: "La pièce a été modifiée avec succès." });
      } else {
        await ecritureService.enregistrerPiece(payload);
        toastRef.current?.show({ severity: 'success', summary: 'Enregistré', detail: "La pièce a été créée avec succès." });
      }
      setTimeout(() => window.location.reload(), 1100);
    } catch (err: any) {
      // 💡 CORRECTIF DE SÉCURITÉ TEXTUELLE : Extrait le message textuel pur pour le Toast
      let detailErreurTextuel = "Erreur de validation réseau.";
      
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          detailErreurTextuel = err.response.data;
        } else if (err.response.data.message) {
          detailErreurTextuel = err.response.data.message;
        } else if (err.response.data.error) {
          detailErreurTextuel = err.response.data.error;
        }
      }

      toastRef.current?.show({ 
        severity: 'error', 
        summary: '🔒 Action Refusée', 
        detail: detailErreurTextuel,
        life: 5000
      });
    } finally { setLoading(false); }
  };

  const handleSelectionnerPieceDepuisModal = async (pieceChoisie: any) => {
    setModalPiecesVisible(false); 
    if (!pieceChoisie) return;
    const numeroPieceComposite = pieceChoisie.numeroPiece || pieceChoisie.reference;
    setLoading(true);
    try {
      const resData = await ecritureService.getPieceByNumero(numeroPieceComposite);
      setEcritureEnEdition(Array.isArray(resData) ? resData : resData);
    } catch {
      toastRef.current?.show({ severity: 'error', summary: 'Échec', detail: "Erreur lors du chargement des écritures." });
    } finally { setLoading(false); }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans antialiased animate-fade-in">
      <Toast ref={toastRef} position="top-right" className="text-xs font-bold font-sans" />
      <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 p-6 flex flex-col shadow-sm">
        
        {estDejaValidee && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 select-none">
            <i className="pi pi-verified text-sm"></i> 🔒 SCELLÉ D'AUDIT : Cette pièce comptable a été validée définitivement. La modification et la suppression sont désactivées.
          </div>
        )}

        {estCloture && (
          <div className="mb-5 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-3 font-semibold select-none">
            <i className="pi pi-lock text-base text-rose-600 animate-pulse" />
            <div>
              <p className="font-bold text-rose-900">📚 EXERCICE COMPTABLE ARCHIVÉ & CLÔTURÉ ANNUELLEMENT</p>
              <p className="text-rose-700 font-medium text-[11px] mt-0.5">Cet exercice est clos de manière contractuelle. Aucun mouvement de débit/crédit n'est toléré.</p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-navy-900 dark:text-navy-100">
              {ecritureEnEdition ? `📝 Pièce : ${ecritureEnEdition.numeroPiece}` : "Saisie d'une Pièce Comptable (Partie Double)"}
            </h2>
            <p className="text-xs text-navy-400">Enregistrement sous contrôle de validation, clôtures périodiques et clôture annuelle globale</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => setModalPiecesVisible(true)} className="font-bold text-xs h-8 border-navy-200 text-navy-700 hover:bg-navy-50"><i className="pi pi-search mr-1.5"></i> Rechercher</Button>
        </div>
        
        <Divider className="my-4 border-navy-100" />
        {initialisation || loading ? (
          <div className="flex justify-center items-center py-20"><span className="animate-spin w-5 h-5 border-2 border-sky-600 border-t-transparent rounded-full" /></div>
        ) : (
          <SaisieEcritureForm journaux={journaux} comptes={comptes} loading={loading} initialValues={ecritureEnEdition} onSubmit={handleEnregistrerEcriture} isReadOnly={estVerrouilleAEdition} onCancelEdit={() => setEcritureEnEdition(null)} />
        )}
        <ListePiecesModal visible={modalPiecesVisible} onHide={() => setModalPiecesVisible(false)} onSelectPiece={handleSelectionnerPieceDepuisModal} journauxOptions={journaux} exercicesOptions={(exercicesOptions || []).map(e => ({ label: e.label, value: Number(e.value) }))} />
      </div>
    </div>
  );
};
