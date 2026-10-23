import React, { useState, useEffect, useRef } from 'react';
import { Divider } from 'primereact/divider'; import { Toast } from 'primereact/toast';
import { Select } from '@/components/ui/select'; import { Button } from '@/components/ui/button';
import { ModalConfirm } from '@/components/ui/modal-confirm'; import { ecritureService } from '@/services/ecriture.service';
import { parametreService } from '@/services/parametre.service'; import type { ParametreOD } from '@/types';

export const ParametreOdPage: React.FC = () => {
  const [loading, setLoading] = useState(false); const [sauving, setSauve] = useState(false);
  const [jnlOpt, setJnlOpt] = useState<any[]>([]); const [cptOpt, setCptOpt] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false); const toast = useRef<Toast>(null);
  const [form, setForm] = useState<ParametreOD>({ journalAN: '', journalOD: '', journalCL: '', compteBenefice: '', comptePerte: '', compteRs: '', compteBilanOuverture: '', compteAND: '', compteANC: '' });

  const loadRef = async () => {
    setLoading(true);
    try {
      const [cfg, jl, cp] = await Promise.all([parametreService.getParametres(), parametreService.getJournauxParametres(), parametreService.getComptesParametres()]);
      if (cfg && cfg.id) setForm(cfg);
      const rJ = Array.isArray(jl) ? jl : (jl && (jl as any).data) || []; const rC = Array.isArray(cp) ? cp : (cp && (cp as any).data) || [];
      setJnlOpt(rJ.map((j: any) => ({ label: `${j.code} - ${j.codeJournal || j.intitule || 'Jnl'}`, value: j.code })));
      setCptOpt(rC.map((c: any) => ({ label: `${c.code} - ${c.intitule || ''}`, value: c.code })));
    } catch { toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Échec de synchronisation.' }); } finally { setLoading(false); }
  };
  useEffect(() => { loadRef(); }, []);

  const handlePurge = async () => {
    setSauve(true); setModalOpen(false);
    try {
      await parametreService.purgerParametres();
      setForm({ journalAN: '', journalOD: '', journalCL: '', compteBenefice: '', comptePerte: '', compteRs: '', compteBilanOuverture: '', compteAND: '', compteANC: '' });
      toast.current?.show({ severity: 'info', summary: 'Purgé', detail: 'Configuration réinitialisée.' });
    } catch { toast.current?.show({ severity: 'error', summary: 'Échec', detail: 'Impossible de purger.' }); } finally { setSauve(false); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSauve(true);
    try {
      await parametreService.enregistrerParametres(form);
      toast.current?.show({ severity: 'success', summary: 'Succès', detail: 'Protocole enregistré au vert fixe !' });
    } catch { toast.current?.show({ severity: 'error', summary: 'Erreur', detail: "Échec de l'enregistrement." }); } finally { setSauve(false); }
  };

  if (loading) return <div className="flex justify-center items-center py-32"><span className="animate-spin w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full"></span></div>;

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans antialiased">
      <Toast ref={toast} position="top-right" className="text-xs font-bold font-sans" />
      <ModalConfirm visible={modalOpen} title="⚠️ Destruction de Configuration" message="Confirmez-vous la purge totale et définitive des paramètres du protocole annuel ?" confirmLabel="Purger" cancelLabel="Annuler" variant="destructive" loading={sauving} onConfirm={handlePurge} onCancel={() => setModalOpen(false)} />
      
      <form onSubmit={handleSave} className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 p-6 flex flex-col shadow-sm">
        <div><h2 className="text-base font-bold text-navy-900 dark:text-navy-50">Configuration du Protocole Fin d'Exercice</h2><p className="text-xs text-navy-400">Sélectionnez les comptes pivots et les journaux officiels de clôture/ouverture</p></div>
        <Divider className="my-4" />
        <div className="space-y-5">
          {/* 💡 SÉCURISATION DU STYLE : Remplacement de 'border' par 'border border-slate-100 dark:border-navy-800' pour adoucir le rendu graphique */}
          <div className="p-4 bg-slate-50/50 dark:bg-navy-950/20 rounded-xl border border-slate-100 dark:border-navy-800 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-sky-700 uppercase">📋 1. Journaux de Clôture & Ouverture</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1"><label className="text-[11px] font-bold text-navy-500">Journal OD</label><Select value={form.journalOD} options={jnlOpt} onChange={e => setForm({ ...form, journalOD: e.value })} placeholder="Choisir..." /></div>
              <div className="flex flex-col gap-1"><label className="text-[11px] font-bold text-navy-500">Journal Clôture (CL)</label><Select value={form.journalCL} options={jnlOpt} onChange={e => setForm({ ...form, journalCL: e.value })} placeholder="Choisir..." /></div>
              <div className="flex flex-col gap-1"><label className="text-[11px] font-bold text-navy-500">Journal À-Nouveaux (AN)</label><Select value={form.journalAN} options={jnlOpt} onChange={e => setForm({ ...form, journalAN: e.value })} placeholder="Choisir..." /></div>
            </div>
          </div>
          {/* 💡 SÉCURISATION DU STYLE : Application de la bordure adoucie sur la section 2 */}
          <div className="p-4 bg-slate-50/50 dark:bg-navy-950/20 rounded-xl border border-slate-100 dark:border-navy-800 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-emerald-700 uppercase">⚖️ 2. Liquidation du Résultat (Classe 12)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1"><label className="text-[11px] font-bold text-navy-500">Résultat Net Bénéficiaire</label><Select value={form.compteBenefice} options={cptOpt} onChange={e => setForm({ ...form, compteBenefice: e.value })} placeholder="Choisir..." className="text-emerald-700" /></div>
              <div className="flex flex-col gap-1"><label className="text-[11px] font-bold text-navy-500">Résultat Net Déficitaire</label><Select value={form.comptePerte} options={cptOpt} onChange={e => setForm({ ...form, comptePerte: e.value })} placeholder="Choisir..." className="text-rose-700" /></div>
            </div>
          </div>
          {/* 💡 SÉCURISATION DU STYLE : Application de la bordure adoucie sur la section 3 */}
          <div className="p-4 bg-slate-50/50 dark:bg-navy-950/20 rounded-xl border border-slate-100 dark:border-navy-800 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-indigo-700 uppercase">⚙️ 3. Comptes d'Ouverture & Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="flex flex-col gap-1"><label className="text-[11px] font-bold text-navy-500">Bilan d'Ouverture Pivot</label><Select value={form.compteBilanOuverture} options={cptOpt} onChange={e => setForm({ ...form, compteBilanOuverture: e.value })} placeholder="Choisir..." /></div><div className="flex flex-col gap-1"><label className="text-[11px] font-bold text-navy-500">Report à Nouveau (Solde)</label><Select value={form.compteRs || ''} options={cptOpt} onChange={e => setForm({ ...form, compteRs: e.value })} placeholder="Choisir..." /></div></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="flex flex-col gap-1"><label className="text-[11px] font-bold text-navy-500">Report Débiteur Attente</label><Select value={form.compteAND || ''} options={cptOpt} onChange={e => setForm({ ...form, compteAND: e.value })} placeholder="Optionnel..." /></div><div className="flex flex-col gap-1"><label className="text-[11px] font-bold text-navy-500">Report Créditeur Attente</label><Select value={form.compteANC || ''} options={cptOpt} onChange={e => setForm({ ...form, compteANC: e.value })} placeholder="Optionnel..." /></div></div>
          </div>
        </div>
        <div className="flex justify-end items-center gap-2 pt-4 border-t mt-5">
          {form.id && <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(true)} disabled={sauving} className="text-rose-600 w-[150px] h-[30px] font-bold text-xs"><i className="pi pi-trash mr-1.5" /> Initialiser</Button>}
          <Button type="submit" disabled={sauving} className="w-[150px] h-[30px] font-bold text-xs  "><i className="pi pi-save mr-1.5"></i>{sauving ? 'Traitement...' : 'Enregistrer '}</Button>
        </div>
      </form>
    </div>
  );
};
