import React, { useEffect, useState, useRef } from 'react';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import type { EcritureComptableDto } from '@/types';
import { ecritureService } from '@/services/ecriture.service';
import { ModalConfirm } from '@/components/ui/modal-confirm';
import { Button } from '@/components/ui/button';
import { SaisieEcritureForm } from '@/components/forms/SaisieEcritureForm';
import { ListePiecesModal } from './ListePiecesModal';
import { useExerciceGlobal } from '@/contexts/ExerciceContext';

export const SaisieEcriturePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [initialisation, setInitialisation] = useState(true);
  const [modalPiecesVisible, setModalPiecesVisible] = useState(false);
  const [ecritureEnEdition, setEcritureEnEdition] = useState<EcritureComptableDto | null>(null);
  const toastRef = useRef<Toast>(null);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [pieceIdA_Supprimer, setPieceIdA_Supprimer] = useState<number | null>(null);
  const [pieceNumeroA_Supprimer, setPieceNumeroA_Supprimer] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const [journaux, setJournaux] = useState<{ label: string; value: string }[]>([]);
  const [comptes, setComptes] = useState<{ label: string; value: string }[]>([]);
  const { exerciceId, exercicesOptions } = useExerciceGlobal();

  const chargerDonneesReferentiels = async () => {
    try {
      const [listJournaux, listComptes] = await Promise.all([
        ecritureService.getJournaux(),
        ecritureService.getComptesDetail()
      ]);
      setJournaux(listJournaux.map(j => {
        const lbl = (j.libelle || j.libelleJournal || j.intitule || 'Journal').toUpperCase();
        const txt = `${j.code} - ${lbl.includes('JOURNAL') ? lbl : 'JOURNAL DES ' + lbl}`;
        return { label: txt, optionLabel: txt, text: txt, value: j.code };
      }));
      setComptes(listComptes.map(c => {
        const txt = `${c.code} - ${(c.intitule || '').toUpperCase()}`;
        return { label: txt, optionLabel: txt, text: txt, value: c.code };
      }));
    } catch (err) { console.error(err); } finally { setInitialisation(false); }
  };

  const handleChargerPieceDetails = async (id: number) => {
    setLoading(true);
    try {
      const apiData = await ecritureService.getPieceDetails(id);
      const struct: EcritureComptableDto = {
        id: apiData.id, numeroPiece: apiData.numeroPiece || '', datePiece: apiData.datePiece || '',
        libelleGeneral: apiData.libelleGeneral || apiData.reference || '',
        codeJournal: apiData.codeJournal || (apiData.journal ? apiData.journal.code : ''),
        exerciceId: Number(apiData.exerciceId || (apiData.exercice ? apiData.exercice.id : 0)),
        lignes: Array.isArray(apiData.lignes) ? apiData.lignes.map((l: any) => ({
          id: l.id, codeCompte: l.codeCompte || (l.compte ? l.compte.code : ''),
          libelleLigne: l.libelleLigne || l.libelle || '', debit: Number(l.debit) || 0, credit: Number(l.credit) || 0
        })) : []
      };
      setEcritureEnEdition(struct);
      toastRef.current?.show({ severity: 'info', summary: 'Chargement', detail: `Pièce N° ${struct.numeroPiece} prête.` });
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleExecuteDeletePiece = async () => {
    if (!pieceIdA_Supprimer) return;
    setDeleteLoading(true);
    try {
      await ecritureService.deletePiece(pieceIdA_Supprimer);
      setDeleteModalVisible(false); setPieceIdA_Supprimer(null); setModalPiecesVisible(true);
      toastRef.current?.show({ severity: 'success', summary: 'Supprimé', detail: `La pièce ${pieceNumeroA_Supprimer} a été effacée.` });
    } catch (err) { console.error(err); } finally { setDeleteLoading(false); }
  };

  useEffect(() => {
    (window as any).triggerDeletePieceComptable = (id: number, numero: string) => {
      setPieceIdA_Supprimer(id); setPieceNumeroA_Supprimer(numero); setModalPiecesVisible(false); setDeleteModalVisible(true);
    };
    chargerDonneesReferentiels();
    return () => { delete (window as any).triggerDeletePieceComptable; };
  }, []);

  const handleEnregistrerEcriture = async (payload: EcritureComptableDto) => {
    setLoading(true);
    try {
      if (ecritureEnEdition?.id) {
        await ecritureService.updatePiece(ecritureEnEdition.id, payload);
        toastRef.current?.show({ severity: 'success', summary: 'Mis à jour', detail: "Pièce modifiée avec succès." });
      } else {
        await ecritureService.enregistrerPiece(payload);
        toastRef.current?.show({ severity: 'success', summary: 'Enregistré', detail: "Pièce créée avec succès." });
      }
      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      console.error(err);
      toastRef.current?.show({ severity: 'error', summary: 'Erreur', detail: "Échec de l'enregistrement." });
    } finally { setLoading(false); }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in font-sans antialiased">
      <Toast ref={toastRef} position="top-right" className="text-xs font-bold font-sans" />
      <ModalConfirm visible={deleteModalVisible} title="⚠️ Suppression" message={`Confirmez-vous la destruction définitive de la pièce N° ${pieceNumeroA_Supprimer} ?`} confirmLabel="Supprimer" cancelLabel="Annuler" variant="destructive" loading={deleteLoading} onConfirm={handleExecuteDeletePiece} onCancel={() => { setDeleteModalVisible(false); setModalPiecesVisible(true); }} />

      <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 p-6 flex flex-col shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-base font-bold text-navy-900 dark:text-navy-50">{ecritureEnEdition ? `📝 Édition de la Pièce N° ${ecritureEnEdition.numeroPiece}` : "Saisie d'une Pièce Comptable (Partie Double)"}</h2>
            <p className="text-xs text-navy-400">Enregistrement et modification des écritures avec contrôle de contrepartie</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => setModalPiecesVisible(true)} className="font-bold text-xs h-[30px] border-navy-200 text-navy-700 hover:bg-navy-50"><i className="pi pi-search mr-2 text-xs"></i> Rechercher</Button>
        </div>
        
        <Divider className="my-4 border-navy-100" />
        
        {initialisation ? (
          <div className="flex flex-col items-center justify-center py-24"><span className="animate-spin inline-block w-6 h-6 border-2 border-navy-500 border-t-transparent rounded-full"></span></div>
        ) : (
          /* 💡 INCORPORATION : Le canal onCancelEdit nettoie l'état d'édition pour basculer sur une saisie neuve */
          <SaisieEcritureForm journaux={journaux} comptes={comptes} loading={loading} initialValues={ecritureEnEdition} onSubmit={handleEnregistrerEcriture} onCancelEdit={() => setEcritureEnEdition(null)} />
        )}
        
        <ListePiecesModal visible={modalPiecesVisible} onHide={() => setModalPiecesVisible(false)} onSelectPiece={handleChargerPieceDetails} journauxOptions={journaux} exercicesOptions={exercicesOptions} />
      </div>
    </div>
  );
};
