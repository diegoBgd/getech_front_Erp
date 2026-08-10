import React, { useEffect, useState, useRef } from 'react';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast'; // 💡 Import du Toast
import { ecritureService } from '@/services/ecriture.service';
import type { PieceComptableSaisie } from '@/types';
import { Button } from '@/components/ui/button';
import { ModalConfirm } from '@/components/ui/modal-confirm';
import { SaisieEcritureForm } from '@/components/forms/SaisieEcritureForm';
import { Input } from '@/components/ui/input';
import { CustomDataTable } from '@/components/ui/data-table';

// Fonction de formatage des milliers
const formatBIF = (val: number) => {
  return new Intl.NumberFormat('fr-BI', { style: 'currency', currency: 'BIF', maximumFractionDigits: 0 }).format(val);
};

export const SaisieEcriturePage: React.FC = () => {
  const toast = useRef<Toast>(null); // 💡 Référence pour piloter le Toast
  const [journaux, setJournaux] = useState<any[]>([]);
  const [exercices, setExercices] = useState<any[]>([]);
  const [comptes, setComptes] = useState<any[]>([]);
  const [fetching, setFetching] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const [historiqueVisible, setHistoriqueVisible] = useState<boolean>(false);
  const [piecesSaisies, setPiecesSaisies] = useState<any[]>([]);
  const [searchFilter, setSearchFilter] = useState<string>('');
  
  const [idPieceEnCours, setIdPieceEnCours] = useState<number | null>(null);
  const [pieceSelectionnee, setPieceSelectionnee] = useState<any | null>(null);

  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [chronoToDelete, setChronoToDelete] = useState<string>('');

  const chargerDonneesConfiguration = async () => {
    setFetching(true);
    try {
      const [resJ, resE, resC, resP] = await Promise.all([
        ecritureService.getJournaux(),
        ecritureService.getExercices(),
        ecritureService.getComptesDetail(),
        ecritureService.getAllPieces()
      ]);
      setJournaux(resJ.map(j => ({ label: `${j.code} - ${j.intitule}`, value: j.code })));
      setExercices(resE.map(e => ({ label: e.libelle, value: e.id })));
      setComptes(resC.map(c => ({ label: `${c.code} - ${c.intitule}`, value: c.code })));
      setPiecesSaisies(resP);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { chargerDonneesConfiguration(); }, []);

  const handleOpenHistorique = async () => {
    try {
      const data = await ecritureService.getAllPieces();
      setPiecesSaisies(data);
      setHistoriqueVisible(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChargerPiecePourModification = async (id: number) => {
    try {
      const detailedPiece = await ecritureService.getPieceDetails(id);
      setIdPieceEnCours(id);
      setPieceSelectionnee({
        codeJournal: detailedPiece.codeJournal,
        idExercice: detailedPiece.idExercice,
        reference: detailedPiece.reference || '',
        datePiece: detailedPiece.datePiece,
        lignes: detailedPiece.lignes
      });
      setHistoriqueVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExecuteSuppression = async () => {
    if (!idToDelete) return;
    setLoading(true);
    try {
      await ecritureService.deletePiece(idToDelete);
      setDeleteVisible(false);
      if (idPieceEnCours === idToDelete) handleAnnulerModeEdition();
      await chargerDonneesConfiguration();
      
      // 💡 Notification Succès
      toast.current?.show({ severity: 'success', summary: 'Suppression réussie', detail: `La pièce ${chronoToDelete} a été retirée du journal.`, life: 4000 });
    } catch (error: any) {
      const msg = error.response?.headers['x-error-message'] || "Erreur lors de la suppression.";
      toast.current?.show({ severity: 'error', summary: 'Échec de l\'opération', detail: msg, life: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const handleAnnulerModeEdition = () => {
    setIdPieceEnCours(null);
    setPieceSelectionnee(null);
  };

  const handleValidationPiece = async (data: PieceComptableSaisie) => {
    setLoading(true);
    try {
      if (idPieceEnCours) {
        await ecritureService.updatePiece(idPieceEnCours, data);
        toast.current?.show({ severity: 'success', summary: 'Modification enregistrée', detail: 'Les écritures ont été rectifiées avec succès.', life: 4000 });
      } else {
        await ecritureService.enregistrerPiece(data);
        toast.current?.show({ severity: 'success', summary: 'Pièce comptable créée', detail: 'L\'écriture en partie double a été validée au journal.', life: 4000 });
      }
      handleAnnulerModeEdition();
      await chargerDonneesConfiguration();
    } catch (error: any) {
      const msg = error.response?.headers['x-error-message'] || "Erreur lors du traitement.";
      toast.current?.show({ severity: 'error', summary: 'Erreur comptable (400)', detail: msg, life: 6000 });
    } finally {
      setLoading(false);
    }
  };

  const actionsTemplate = (row: any) => (
    <div className="flex gap-1 justify-end">
      <Button 
        type="button" variant="ghost" className="h-7 w-7 text-sky-accent-500 p-0 rounded-full cursor-pointer"
        onClick={() => handleChargerPiecePourModification(row.id)} title="Ouvrir / Modifier"
      >
        <i className="pi pi-folder-open text-xs"></i>
      </Button>
      <Button 
        type="button" variant="ghost" className="h-7 w-7 text-red-accent-500 p-0 rounded-full cursor-pointer"
        onClick={() => { setIdToDelete(row.id); setChronoToDelete(row.numeroPiece); setDeleteVisible(true); }} title="Supprimer"
      >
        <i className="pi pi-trash text-xs"></i>
      </Button>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 💡 Composant Toast pour les messages animés */}
      <Toast ref={toast} position="top-right" />
      
      <ModalConfirm
        visible={deleteVisible} title="Suppression de pièce"
        message={`Voulez-vous supprimer définitivement la pièce comptable ${chronoToDelete} ?`}
        confirmLabel="Supprimer" cancelLabel="Annuler" variant="destructive" loading={loading}
        onConfirm={handleExecuteSuppression} onCancel={() => setDeleteVisible(false)}
      />
      
      <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 dark:border-navy-800 shadow-sm p-5 flex flex-col">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-navy-900 dark:text-navy-50">
              {idPieceEnCours ? "Modification d'Écriture" : "Saisie d'Écritures"}
            </h2>
            <p className="text-xs text-navy-400">
              {idPieceEnCours ? "Mise à jour corrective de la pièce" : "Gestion des pièces de l'exercice"}
            </p>
          </div>
          <div className="flex gap-2">
            {idPieceEnCours && (
              <Button type="button" variant="outline" size="sm" onClick={handleAnnulerModeEdition}>
                <i className="pi pi-plus text-xs mr-1.5"></i> Nouvelle Saisie
              </Button>
            )}
            <Button type="button" variant="outline" size="sm" onClick={handleOpenHistorique}>
              <i className="pi pi-search text-xs mr-1.5"></i> Historique des pièces
            </Button>
          </div>
        </div>

        <Divider className="my-4 border-navy-100 dark:border-navy-800" />

        {fetching ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <ProgressSpinner style={{ width: '40px', height: '40px' }} strokeWidth="4" />
            <span className="text-xs text-navy-400">Chargement...</span>
          </div>
        ) : (
          <SaisieEcritureForm 
            journaux={journaux} exercices={exercices} comptes={comptes}
            loading={loading} onSubmit={handleValidationPiece}
            initialValues={pieceSelectionnee || undefined}
          />
        )}
      </div>

      <Dialog header="Historique du journal de saisie" visible={historiqueVisible} style={{ width: '750px' }} modal onHide={() => setHistoriqueVisible(false)} draggable={false} resizable={false}>
        <div className="flex flex-col gap-3 pt-2">
          <div className="relative w-full md:w-72">
            <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-navy-300 text-xs"></i>
            <Input type="text" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} placeholder="Filtrer..." className="pl-8 w-full" />
          </div>
          <div className="rounded-lg overflow-hidden">
            <CustomDataTable value={piecesSaisies} dataKey="id" globalFilter={searchFilter} globalFilterFields={['numeroPiece', 'reference', 'codeJournal']}>
              <Column field="numeroPiece" header="N° Chrono" sortable className="font-tabular font-bold text-navy-900" style={{ width: '30%' }} />
              <Column field="datePiece" header="Date" sortable style={{ width: '20%' }} />
              <Column field="reference" header="Référence" sortable style={{ width: '25%' }} />
              <Column field="codeJournal" header="Journal" sortable className="font-bold text-center" headerClassName="justify-center" style={{ width: '15%' }} />
              <Column header="Actions" className="text-right" style={{ width: '10%' }} body={actionsTemplate} />
            </CustomDataTable>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
