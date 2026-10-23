import React, { useEffect, useState, useRef } from 'react';
import { Divider } from 'primereact/divider'; import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast'; import { ProgressSpinner } from 'primereact/progressspinner';
import { ecritureService } from '@/services/ecriture.service'; import { Button } from '@/components/ui/button';
import { CustomDataTable } from '@/components/ui/data-table'; import { ModalConfirm } from '@/components/ui/modal-confirm';
import { useExerciceGlobal } from '@/contexts/ExerciceContext';
import { VoletAuditValidation } from './VoletAuditValidation';

export const ValidationEcrituresPage: React.FC = () => {
  const [loading, setLoading] = useState(false); const [pieces, setPieces] = useState<any[]>([]);
  const { exerciceId, exerciceActif } = useExerciceGlobal(); const toastRef = useRef<Toast>(null);

  const [modalVisualisationOpen, setModalVisualisationOpen] = useState(false); const [pieceEnCoursDAudit, setPieceEnCoursDAudit] = useState<any>(null);
  const [modalValiderOpen, setModalValiderOpen] = useState(false); const [modalRejeterOpen, setModalRejeterOpen] = useState(false);

  const estExerciceCloture = exerciceActif?.statut === 'CLOTURE';

  const chargerPiecesEnAttente = async () => {
    if (!exerciceId) return; setLoading(true);
    try {
      const data = await ecritureService.rechercherPieces(Number(exerciceId));
      // 💡 SÉCURITÉ DRILL-DOWN : On filtre strictement les pièces non validées pour éliminer les doublons
      setPieces((data || []).filter((p: any) => p.validee !== true && p.valide !== true));
    } catch {
      toastRef.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Échec du chargement.' });
    } finally { setLoading(false); }
  };

  useEffect(() => { chargerPiecesEnAttente(); }, [exerciceId]);

  const handleOuvrirVoletAudit = async (pieceLégère: any) => {
    setLoading(true);
    try {
      const pieceComplete = await ecritureService.getPieceByNumero(pieceLégère.numeroPiece);
      setPieceEnCoursDAudit(pieceComplete); setModalVisualisationOpen(true);
    } catch {
      toastRef.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Détail introuvable.' });
    } finally { setLoading(false); }
  };

  const handleConfirmerValidation = async () => {
    if (!pieceEnCoursDAudit) return; setLoading(true); setModalValiderOpen(false); setModalVisualisationOpen(false);
    try {
      await ecritureService.validerDefinitivement(pieceEnCoursDAudit.id);
      toastRef.current?.show({ severity: 'success', summary: '🎯 Validée', detail: `La pièce ${pieceEnCoursDAudit.numeroPiece} est scellée.` });
      setPieceEnCoursDAudit(null); chargerPiecesEnAttente();
    } catch (err: any) { toastRef.current?.show({ severity: 'error', summary: 'Erreur', detail: err.response?.data || "Échec." }); } finally { setLoading(false); }
  };

  const handleConfirmerRejet = async () => {
    if (!pieceEnCoursDAudit) return; setLoading(true); setModalRejeterOpen(false); setModalVisualisationOpen(false);
    try {
      await ecritureService.deletePiece(pieceEnCoursDAudit.id);
      toastRef.current?.show({ severity: 'warn', summary: 'Purgée', detail: "Le brouillon a été supprimé." });
      setPieceEnCoursDAudit(null); chargerPiecesEnAttente();
    } catch (err: any) { toastRef.current?.show({ severity: 'error', summary: 'Erreur', detail: err.response?.data || "Échec." }); } finally { setLoading(false); }
  };

  const fmt = (v: number) => !v ? '-' : new Intl.NumberFormat('fr-BI').format(v);

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans antialiased animate-fade-in">
      <Toast ref={toastRef} position="top-right" className="text-xs font-bold font-sans" />
      <ModalConfirm visible={modalValiderOpen} title="🎯 Ancrage Définitif" message={`Valider définitivement la pièce ${pieceEnCoursDAudit?.numeroPiece} ?`} confirmLabel="Graver l'écriture" cancelLabel="Annuler" variant="default" onConfirm={handleConfirmerValidation} onCancel={() => setModalValiderOpen(false)} />
      <ModalConfirm visible={modalRejeterOpen} title="❌ Purge du Brouillon" message={`Supprimer définitivement la pièce ${pieceEnCoursDAudit?.numeroPiece} ?`} confirmLabel="Supprimer" cancelLabel="Annuler" variant="destructive" onConfirm={handleConfirmerRejet} onCancel={() => setModalRejeterOpen(false)} />
      <VoletAuditValidation visible={modalVisualisationOpen} onHide={() => setModalVisualisationOpen(false)} piece={pieceEnCoursDAudit} fmt={fmt} onOuvrirRejet={() => setModalRejeterOpen(true)} onOuvrirApprobation={() => setModalValiderOpen(true)} />

      <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 p-6 flex flex-col shadow-sm">
        <div><h2 className="text-base font-bold text-navy-900 dark:text-navy-50">Validation des Opérations Comptables</h2><p className="text-xs text-navy-400">Auditez et approuvez les pièces avant ancrage définitif au Grand Livre</p></div>
        <Divider className="my-4 border-navy-100" />
        {estExerciceCloture && <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold select-none">ℹ️ INFO : L'exercice courant est clôturé annuellement. Les approbations sont gelées.</div>}
        <div className="relative w-full min-h-[300px]">
          {loading && <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10"><ProgressSpinner style={{ width: '36px', height: '36px' }} /></div>}
          <CustomDataTable value={pieces} emptyMessage="Aucune pièce en attente de validation.">
            <Column header="Date" body={r => r.datePiece ? new Date(r.datePiece).toLocaleDateString('fr-FR') : '-'} className="text-center w-[110px] font-semibold text-slate-600" />
            <Column field="numeroPiece" header="N° Pièce" className="font-bold text-sky-600 text-center w-[140px]" />
            <Column field="codeJournal" header="Jnl" className="text-center w-[60px] font-bold uppercase" />
            <Column field="reference" header="Référence / Libellé Général" className="uppercase font-medium text-navy-800" />
            <Column header="Montant" body={r => <span className="font-black text-navy-950 tracking-tight">{fmt(r.montantTotal || 0)} Fbu</span>} className="text-right w-[150px]" />
            <Column header="Audit & Décision" className="w-[150px] text-center" body={r => (
              <Button type="button" variant="outline" size="sm" disabled={estExerciceCloture} onClick={() => handleOuvrirVoletAudit(r)} className="h-7 text-[10px] uppercase font-bold text-sky-700 border-sky-100"><i className="pi pi-eye mr-1" /> Auditer la pièce</Button>
            )} />
          </CustomDataTable>
        </div>
      </div>
    </div>
  );
};
