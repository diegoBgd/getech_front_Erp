import React, { useState, useEffect } from 'react';
import { Divider } from 'primereact/divider';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { ModalConfirm } from '@/components/ui/modal-confirm';
import { useExerciceGlobal } from '@/contexts/ExerciceContext';
import { periodeService, type PeriodeComptable } from '@/services/periode.service';

export const GestionPeriodesPage: React.FC = () => {
    const [periodes, setPeriodes] = useState<PeriodeComptable[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [generant, setGenerant] = useState<boolean>(false);
    const [rythme, setRythme] = useState<string>('MENSUEL');
    const [modeEditionRythme, setModeEditionRythme] = useState<boolean>(false);
    const { exerciceId } = useExerciceGlobal();

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [periodeCible, setPeriodeCible] = useState<{ id: number; cloturee: boolean; libelle: string } | null>(null);

    const optionsRythme = [
        { label: '📅 MENSUEL (12 PÉRIODES)', value: 'MENSUEL' },
        { label: '📊 TRIMESTRIEL (4 PÉRIODES)', value: 'TRIMESTRIEL' },
        { label: '💼 SEMESTRIEL (2 PÉRIODES)', value: 'SEMESTRIEL' },
        { label: '🏦 ANNUEL (1 PÉRIODE LIAISON)', value: 'ANNUEL' }
    ];

    const chargerPeriodes = async () => {
        if (!exerciceId) return;
        setLoading(true);
        try {
            const data = await periodeService.getPeriodesParExercice(Number(exerciceId));
            setPeriodes(data || []);
            if (data && data.length > 0) setModeEditionRythme(false);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => { chargerPeriodes(); }, [exerciceId]);

    const handleInitialiserPeriodes = async () => {
        if (!exerciceId) return;
        setGenerant(true);
        try {
            await periodeService.genererPeriodes(Number(exerciceId), rythme);
            await chargerPeriodes();
        } catch (err) {
            const msg = (err as any).response?.data?.message || "Action impossible.";
            alert(msg);
        } finally { setGenerant(false); }
    };

    const OuvrirPopUpConfirmation = (id: number, statutActuel: boolean, libelle: string) => {
        setPeriodeCible({ id, cloturee: statutActuel, libelle });
        setModalOpen(true);
    };

    const executerBasculeVerrou = () => {
        if (!periodeCible) return;
        periodeService.basculerVerrou(periodeCible.id, !periodeCible.cloturee)
            .then(() => {
                setPeriodes(prev => prev.map(p => p.id === periodeCible.id ? { ...p, cloturee: !periodeCible.cloturee } : p));
            })
            .catch(console.error)
            .finally(() => {
                setModalOpen(false);
                setPeriodeCible(null);
            });
    };

    const formaterDate = (dStr: string) => dStr ? new Date(dStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-';

    return (
        <div className="p-6 max-w-5xl mx-auto animate-fade-in font-sans antialiased">

            {/* 💡 CORRECTIF : La fonction onCancel nettoie désormais intégralement l'état local au clic */}
            {periodeCible && (
                <ModalConfirm
                    visible={modalOpen}
                    onCancel={() => {
                        setModalOpen(false);
                        setPeriodeCible(null);
                    }}
                    title="🛡️ Validation du Pare-feu Comptable"
                    message={`Voulez-vous vraiment ${periodeCible.cloturee ? 'RÉOUVRIR' : 'CLÔTURER DEFINITIVEMENT'} la période [${periodeCible.libelle}] ? Cette action impactera les contrôles de saisie.`}
                    onConfirm={executerBasculeVerrou}
                    confirmLabel={periodeCible.cloturee ? "Confirmer la réouverture" : "Confirmer la clôture"}
                    cancelLabel="Annuler l'action"
                    variant={periodeCible.cloturee ? "sky" : "destructive"}
                />
            )}

            <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 p-6 flex flex-col shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-base font-bold text-navy-900 dark:text-navy-50">Pare-feu & Clôtures Périodiques</h2>
                        <p className="text-xs text-navy-400">Verrouillage chirurgical des journaux pour figer les écritures et sécuriser le rapprochement</p>
                    </div>
                    {periodes.length > 0 && !modeEditionRythme && (
                        <Button type="button" variant="outline" size="sm" onClick={() => setModeEditionRythme(true)} className="text-xs border-dashed text-sky-600 border-sky-200">
                            <i className="pi pi-pencil mr-1 text-[10px]"></i> Changer la périodicité
                        </Button>
                    )}
                </div>

                <Divider className="my-5 border-navy-100" />

                {(periodes.length === 0 || modeEditionRythme) && !loading && (
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-[65%_35%] gap-4 p-4 bg-amber-50/40 border border-amber-200 rounded-xl items-end">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-amber-800 uppercase">Définir ou écraser le rythme de contrôle pour cet exercice</label>
                            <Select value={rythme} options={optionsRythme} onChange={(e: any) => setRythme(e.value)} className="w-full text-xs font-bold bg-white" />
                        </div>
                        <div className="flex gap-2">
                            {modeEditionRythme && <Button type="button" variant="outline" size="sm" onClick={() => setModeEditionRythme(false)} className="w-1/3 h-[38px] text-xs font-bold">Annuler</Button>}
                            <Button type="button" onClick={handleInitialiserPeriodes} disabled={generant || !exerciceId} className={`font-bold text-xs uppercase text-white shadow-sm h-[38px] ${modeEditionRythme ? 'w-2/3 bg-sky-600 hover:bg-sky-700' : 'w-full bg-amber-600 hover:bg-amber-700'}`}>
                                <i className={generant ? "pi pi-spinner mr-2 text-xs" : "pi pi-cog mr-2 text-xs"}></i> {generant ? 'Génération...' : modeEditionRythme ? 'Réinitialiser' : 'Générer'}
                            </Button>
                        </div>
                    </div>
                )}

                <div className="border border-navy-100 rounded-xl overflow-hidden bg-white w-full">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-navy-50/40 border-b border-navy-100 text-[10px] font-bold text-navy-400 uppercase tracking-wider">
                                <th className="p-4 pl-6">Désignation de la Période</th>
                                <th className="p-4 text-center w-[120px]">Date Début</th>
                                <th className="p-4 text-center w-[120px]">Date Fin</th>
                                <th className="p-4 text-center w-[130px]">Statut</th>
                                <th className="p-4 text-center w-[140px] pr-6">Actionneur</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-navy-50 text-navy-700">
                            {loading ? (
                                <tr><td colSpan={5} className="text-center p-10 font-bold text-navy-400">Interrogation des verrous système...</td></tr>
                            ) : periodes.length === 0 ? (
                                <tr><td colSpan={5} className="text-center p-10 text-navy-400 italic">Registre vierge. Sélectionnez un rythme ci-dessus.</td></tr>
                            ) : (
                                periodes.map((p) => (
                                    <tr key={p.id} className="hover:bg-navy-50/10 transition-colors">
                                        <td className="p-3.5 pl-6 font-bold text-navy-800 uppercase text-[11px]">{p.libellePeriode}</td>
                                        <td className="p-3.5 text-center font-semibold text-slate-500">{formaterDate(p.dateDebut)}</td>
                                        <td className="p-3.5 text-center font-semibold text-slate-500">{formaterDate(p.dateFin)}</td>
                                        <td className="p-3.5 text-center">
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${p.cloturee ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                                                {p.cloturee ? ' CLÔTURÉE' : ' OUVERTE'}
                                            </span>
                                        </td>
                                        <td className="p-2.5 text-center pr-6">
                                            <Button type="button" onClick={() => OuvrirPopUpConfirmation(p.id, p.cloturee, p.libellePeriode)} className={`h-7 px-3 text-[10px] font-bold uppercase tracking-wider ${p.cloturee ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-navy-900 hover:bg-navy-950 text-white'}`}>
                                                <i className={`pi ${p.cloturee ? 'pi-unlock' : 'pi-lock'} mr-1 text-[9px]`}></i> {p.cloturee ? 'Réouvrir' : 'Clôturer'}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};
