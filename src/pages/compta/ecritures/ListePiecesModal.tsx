import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
import { Divider } from 'primereact/divider';
import { ecritureService } from '@/services/ecriture.service';

import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useExerciceGlobal } from '@/contexts/ExerciceContext'; // 💡 Import du contexte
import { CustomDataTable } from '@/components/ui/data-table';

interface ListePiecesModalProps {
  visible: boolean;
  onHide: () => void;
  onSelectPiece: (id: number) => void;
  journauxOptions: { label: string; value: string }[];
  exercicesOptions: { label: string; value: number }[];
}

export const ListePiecesModal: React.FC<ListePiecesModalProps> = ({
  visible, onHide, onSelectPiece, journauxOptions
}) => {
  const [jnlCode, setJnlCode] = useState<string>('');
  const [dtDebut, setDtDebut] = useState<string>('');
  const [dtFin, setDtFin] = useState<string>('');
  const [pieces, setPieces] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 💡 LIAISON COMPTABLE COMMUNE : Récupère l'ID sélectionné dans la TopBar
  const { exerciceId } = useExerciceGlobal();

  const lancerRecherchePieces = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!exerciceId) return;
    setLoading(true);
    try {
      const data = await ecritureService.rechercherPieces(
        Number(exerciceId), 
        jnlCode || undefined, 
        dtDebut || undefined, 
        dtFin || undefined
      );
      setPieces(data);
    } catch (err) {
      console.error(err);
      setPieces([]);
    } finally {
      setLoading(false);
    }
  };

  // Déclenche la recherche à l'ouverture de la popup ou au changement d'exercice global
  useEffect(() => {
    if (visible && exerciceId) lancerRecherchePieces();
  }, [visible, exerciceId]);

  return (
    <Dialog header="🔎 Recherche & Registre des Pièces" visible={visible} onHide={onHide} modal style={{ width: '900px' }} className="dark:bg-navy-900 border dark:border-navy-800 rounded-xl" contentClassName="p-4 bg-white dark:bg-navy-900" headerClassName="p-4 bg-navy-50/50 dark:bg-navy-800/40 border-b border-navy-100 dark:border-navy-800 text-sm font-bold text-navy-800 dark:text-navy-50 rounded-t-xl">
      <div className="space-y-4">
        
        {/* FORMULAIRE DE FILTRAGE ÉPURÉ (SUR TROIS COLONNES) */}
        <form onSubmit={lancerRecherchePieces} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-navy-50/30 p-3 rounded-xl border border-navy-100">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-navy-400 uppercase">Journal</label>
            <Select value={jnlCode} options={[{ label: 'Tous les journaux', value: '' }, ...journauxOptions]} onChange={(e: any) => setJnlCode(e.value)} className="text-xs font-bold" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-navy-400 uppercase">Du (Date début)</label>
            <Input type="date" value={dtDebut} onChange={(e) => setDtDebut(e.target.value)} className="text-xs h-[34px]" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-navy-400 uppercase">Au (Date fin)</label>
            <div className="flex gap-2">
              <Input type="date" value={dtFin} onChange={(e) => setDtFin(e.target.value)} className="text-xs h-[34px] flex-1" />
              <Button type="submit" disabled={loading} variant="default" size="sm" className="h-[34px] font-bold px-3">Filtrer</Button>
            </div>
          </div>
        </form>

        <Divider className="my-2" />

        {/* GRILLE TECHNIQUE COMPACTE ET QUADRILLÉE */}
        <CustomDataTable value={pieces} loading={loading} emptyMessage="Aucune pièce trouvée pour cet exercice.">
          <Column header="Date" body={(r) => r.datePiece || '-'} className="font-mono text-center w-[110px]" />
          <Column field="numeroPiece" header="N° Pièce" className="font-bold text-navy-600 font-mono w-[130px]" />
          <Column field="codeJournal" header="Jnl" className="text-center w-[60px] font-bold uppercase" />
          <Column field="reference" header="Libellé / Référence" className="uppercase font-medium text-navy-800" />
          <Column header="Montant Total" body={(r) => <span className="font-mono font-bold text-navy-950 dark:text-navy-100">{new Intl.NumberFormat('fr-BI').format(r.montantTotal)}</span>} className="text-right w-[140px]" />
          <Column header="Actions" className="w-[140px] text-center" body={(r) => (
            <div className="flex items-center justify-center gap-1.5">
              <Button type="button" variant="outline" size="sm" onClick={() => { onSelectPiece(r.id); onHide(); }} className="h-7 text-[10px] uppercase font-bold px-2">Charger</Button>
              <Button type="button" variant="outline" size="sm" onClick={() => (window as any).triggerDeletePieceComptable(r.id, r.numeroPiece)} className="h-7 text-[10px] uppercase font-bold border-rose-200 text-rose-600 hover:bg-rose-50 px-2"><i className="pi pi-trash text-[9px]"></i></Button>
            </div>
          )} />
        </CustomDataTable>
      </div>
    </Dialog>
  );
};
