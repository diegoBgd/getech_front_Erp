import React, { useState, useEffect, useRef } from 'react';
import { Divider } from 'primereact/divider'; import { Toast } from 'primereact/toast';
import { Button } from '@/components/ui/button'; import { ModalConfirm } from '@/components/ui/modal-confirm';
import { useExerciceGlobal } from '@/contexts/ExerciceContext'; import { clotureService } from '@/services/cloture.service';
import { TableAuditCloture } from './TableAuditCloture';

export const ClotureExercicePage: React.FC = () => {
  const { exerciceId, exerciceActif } = useExerciceGlobal();
  const [loading, setLoading] = useState(false); const [traitant, setTraitant] = useState(false);
  const [simulation, setSimulation] = useState<any>(null);
  const [modalClotureOpen, setModalClotureOpen] = useState(false); const [modalDeclotureOpen, setModalDeclotureOpen] = useState(false);
  const [msgBlocagePeriodes, setMsgBlocagePeriodes] = useState<string | null>(null);
  const toastRef = useRef<Toast>(null);

  // 💡 Extraction du statut de l'exercice actif sans aucun blocage applicatif
  const estDejaCloture = exerciceActif?.statut === 'CLOTURE';

  const chargerEcrituresOuSimulation = async () => {
    if (!exerciceId) return;
    setLoading(true); setMsgBlocagePeriodes(null);
    try {
      const data = await clotureService.simulerResultat(Number(exerciceId));
      setSimulation(data);
    } catch (err: any) {
      const msg = err.response?.data || 'Erreur lors du traitement.';
      setMsgBlocagePeriodes(msg); setSimulation(null);
    } finally { setLoading(false); }
  };

  useEffect(() => { setSimulation(null); setMsgBlocagePeriodes(null); if (exerciceId) chargerEcrituresOuSimulation(); }, [exerciceId]);

  const handleConfirmerCloture = () => {
    if (!exerciceId) return; setTraitant(true);
    clotureService.executerCloture(Number(exerciceId))
      .then(() => { toastRef.current?.show({ severity: 'success', summary: '🎯 Succès', detail: 'Exercice clôturé.' }); setTimeout(() => window.location.reload(), 1200); })
      .catch(err => toastRef.current?.show({ severity: 'error', summary: 'Erreur', detail: err.response?.data || 'Échec' }))
      .finally(() => { setTraitant(false); setModalClotureOpen(false); });
  };

  const handleConfirmerDecloture = () => {
    if (!exerciceId) return; setTraitant(true);
    clotureService.annulerCloture(Number(exerciceId))
      .then(() => { toastRef.current?.show({ severity: 'info', summary: '🔓 Réouvert', detail: 'Clôture annulée avec succès.' }); setTimeout(() => window.location.reload(), 1200); })
      .catch(() => toastRef.current?.show({ severity: 'error', summary: 'Échec', detail: 'Erreur lors de la réouverture.' }))
      .finally(() => { setTraitant(false); setModalDeclotureOpen(false); });
  };

  const fmt = (v: number) => !v ? '-' : new Intl.NumberFormat('fr-BI').format(v);

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans antialiased animate-fade-in">
      <Toast ref={toastRef} position="top-right" className="text-xs font-bold font-sans" />
      <ModalConfirm visible={modalClotureOpen} title="🔒 Verrouillage Définitif" message="Confirmez-vous le déversement de cette pièce globale de clôture ?" confirmLabel="Clôturer" cancelLabel="Annuler" variant="destructive" loading={traitant} onConfirm={handleConfirmerCloture} onCancel={() => setModalClotureOpen(false)} />
      <ModalConfirm visible={modalDeclotureOpen} title="🔓 Protocole de Déclôture" message="Confirmez-vous la suppression de la pièce de clôture et la réouverture de l'exercice ?" confirmLabel="Réouvrir" cancelLabel="Annuler" variant="sky" loading={traitant} onConfirm={handleConfirmerDecloture} onCancel={() => setModalDeclotureOpen(false)} />

      <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 p-6 flex flex-col shadow-xs">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-navy-900 dark:text-navy-50">Clôture de l'Exercice Comptable</h2>
            <p className="text-xs text-navy-400">Consultation historique des écritures de clôture ou simulation de fin d'année</p>
          </div>
          {/* 💡 INDICATEUR SÉCURISÉ : Badge rouge vif si l'exercice est clos */}
          {estDejaCloture && (
            <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-black animate-pulse select-none">
              🔒 STATUS : CLÔTURÉ & FIGÉ
            </span>
          )}
        </div>
        <Divider className="my-4" />

        {loading ? (
          <div className="flex justify-center items-center py-20"><span className="animate-spin w-5 h-5 border-2 border-navy-600 border-t-transparent rounded-full" /></div>
        ) : msgBlocagePeriodes && !estDejaCloture ? (
          <div className="p-8 rounded-xl border border-dashed border-rose-200 bg-rose-50/10 text-center flex flex-col items-center gap-2">
            <i className="pi pi-exclamation-triangle text-rose-600 text-2xl" />
            <h4 className="text-xs font-black text-rose-700 uppercase">Périodes non validées</h4>
            <p className="text-[11px] text-navy-500 max-w-md leading-relaxed">{msgBlocagePeriodes}</p>
            <a href="/compta/periodes" className="mt-3 inline-flex items-center justify-center px-5 h-9 bg-navy-900 text-white font-bold text-xs rounded-lg shadow-sm"><i className="pi pi-verified mr-2 text-[11px]" /> Fermer les périodes intermédiaires</a>
          </div>
        ) : !simulation ? (
          <div className="p-8 rounded-xl border border-dashed border-navy-200 bg-slate-50/40 text-center flex flex-col items-center gap-2">
            <i className="pi pi-sliders-h text-navy-400 text-2xl" />
            <h4 className="text-xs font-bold text-navy-700 uppercase">Configuration du protocole requise</h4>
            <p className="text-[11px] text-navy-400 max-w-sm">Veuillez renseigner les comptes pivots et codes journaux sur l'écran des paramètres.</p>
            <a href="/compta/parametres-od" className="mt-2 inline-flex items-center justify-center px-4 h-8 bg-sky-600 text-white font-bold text-xs rounded-lg"><i className="pi pi-cog mr-1.5 text-[10px]" /> Configurer maintenant</a>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-navy-50/40 p-3 rounded-xl border border-slate-100 text-xs text-navy-900 font-bold">
              <span>Journal affecté : <span className="text-sky-700 font-black">{simulation.messageStatut}</span></span>
              <div className="flex items-center gap-2">
                <span>Nature du Résultat :</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black ${simulation.estBenefice ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{simulation.estBenefice ? '🎯 BÉNÉFICE NET' : '⚠️ PERTE NETTE'}</span>
                <span className={simulation.estBenefice ? 'text-emerald-700 font-black' : 'text-rose-700 font-black'}>{fmt(simulation.resultatNet)} Fbu</span>
              </div>
            </div>
            
            <TableAuditCloture ecritures={simulation.ecrituresPrevisionnelles} fmt={fmt} />
            
            {/* 💡 SÉCURITÉ DE WORKFLOW COMPACTE : */}
            <div className="flex justify-end pt-2 border-t mt-4">
              {estDejaCloture ? (
                // Si clos, on n'affiche QUE la réouverture pour éviter le doublon d'exécution
                <Button type="button" onClick={() => setModalDeclotureOpen(true)} className="w-[280px] h-[36px] font-bold text-xs bg-navy-900 hover:bg-navy-950 text-white shadow-xs">
                  <i className="pi pi-unlock mr-2 text-xs" /> Annuler la Clôture / Réouvrir
                </Button>
              ) : (
                // Si ouvert, l'opération de scellé initiale est disponible
                <Button type="button" onClick={() => setModalClotureOpen(true)} className="w-[250px] h-[36px] font-bold text-xs uppercase bg-rose-600 hover:bg-rose-700 text-white shadow-xs">
                  <i className="pi pi-lock mr-2 text-xs" /> Valider & Clôturer l'exercice
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
