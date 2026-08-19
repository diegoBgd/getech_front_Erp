import React, { useEffect, useState } from 'react';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { bilanService, type BilanCompletResponseDto } from '@/services/bilan.service';
import { BilanActifTable } from './BilanActifTable';
import { BilanPassifTable } from './BilanPassifTable';

export const BilanPage: React.FC = () => {
    const [exerciceId, setExerciceId] = useState<number>(2026);
    const [dateFin, setDateFin] = useState<string>('2026-12-31');
    const [loading, setLoading] = useState<boolean>(false);
    const [donnees, setDonnees] = useState<BilanCompletResponseDto | null>(null);

    const optionsExercices = [
        { label: 'Exercice Comptable 2026', value: 2026 },
        { label: 'Exercice Comptable 2025', value: 2025 },
        { label: 'Exercice Comptable 2024', value: 2024 }
    ];

    const chargerBilan = async () => {
        setLoading(true);
        try {
            const data = await bilanService.extraireBilan(exerciceId, dateFin);
            setDonnees(data);
        } catch (err) {
            console.error("Erreur lors de l'extraction du bilan", err);
            setDonnees(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        chargerBilan();
    }, [exerciceId]);

    const formatMontant = (valeur: number) => {
        if (valeur === 0 || !valeur) return '-';
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(valeur);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
            <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 dark:border-navy-800 p-6 flex flex-col shadow-sm">

                {/* BANDEAU SUPERIEUR */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-base font-bold text-navy-900 dark:text-navy-50">
                            Bilan Comptable Réglementaire
                        </h2>
                        <p className="text-xs text-navy-400 dark:text-navy-500">
                            Restitution synchrone du patrimoine de l'entreprise (Actif / Passif) comparé sur deux exercices
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="w-[200px]">
                            <Select
                                value={exerciceId}
                                options={optionsExercices}
                                onChange={(e: any) => setExerciceId(e.value)}
                                className="text-xs font-bold"
                            />
                        </div>
                        <div className="w-[150px]">
                            <Input
                                type="date"
                                value={dateFin}
                                onChange={(e) => setDateFin(e.target.value)}
                                className="text-xs font-bold h-[38px]"
                            />
                        </div>
                        <Button
                            variant="default"
                            size="sm"
                            onClick={chargerBilan}
                            disabled={loading}
                            className="font-bold uppercase text-xs h-[38px] px-4"
                        >
                            <i className="pi pi-refresh mr-2 text-xs"></i> Calculer
                        </Button>
                    </div>
                </div>

                <Divider className="my-4 border-navy-100 dark:border-navy-800" />

                {/* AFFICHAGE DES TABLES ISOLEES */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-2">
                        <ProgressSpinner style={{ width: '36px' }} />
                        <span className="text-xs text-navy-400">Interrogation récursive de la balance générale...</span>
                    </div>
                ) : !donnees ? (
                    <div className="text-center p-16 border border-dashed border-navy-200 dark:border-navy-800 text-xs text-navy-400 rounded-xl bg-navy-50/5">
                        <i className="pi pi-chart-bar text-xl mb-2 text-navy-300 block"></i>
                        Aucune donnée à afficher. Modifiez vos filtres ou lancez un calcul ci-dessus.
                    </div>
                ) : (
                    
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                        {/* L'opérateur || [] garantit qu'un tableau vide est transmis si l'API renvoie null/undefined */}
                        <BilanActifTable
                            lignes={donnees?.actif || []}
                            formatMontant={formatMontant}
                        />
                        <BilanPassifTable
                            lignes={donnees?.passif || []}
                            formatMontant={formatMontant}
                        />
                    </div>

                )}

            </div>
        </div>
    );
};
