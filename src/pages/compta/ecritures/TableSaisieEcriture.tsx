import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import React from 'react';

interface TableProps {
    lignes: any[];
    comptes: any[];
    isReadOnly: boolean;
    msgBloque: string | null;
    changeL: (id: string, f: any, v: any) => void;
    setLignes: React.Dispatch<React.SetStateAction<any[]>>;
}

export const TableSaisieEcriture: React.FC<TableProps> = ({ lignes, comptes, isReadOnly, msgBloque, changeL, setLignes }) => {

    // 💡 ALGORITHME CORE : Détermine si la saisie viole la nature physique et le solde du compte
    const verifierViolationSolde = (l: any): { viole: boolean; msg: string } => {
        if (!l.codeCompte || !l.soldeActuel) return { viole: false, msg: '' };

        const c = l.codeCompte.trim();
        const soldeInitialSysteme = l.soldeActuel; // Positif = Débiteur, Négatif = Créditeur

        // Classe 5 (Caisse/Banque), Classe 6 (Charges), Classe 2 (Immos), Classe 3 (Stocks) -> Nature DÉBITRICE
        const estNatureDebiteur = c.startsWith('2') || c.startsWith('3') || c.startsWith('6') || c.startsWith('52') || c.startsWith('57') || c.startsWith('41');

        // Classe 7 (Produits), Classe 1 (Capitaux), Comptes Fournisseurs (40) -> Nature CRÉDITRICE
        const estNatureCrediteur = c.startsWith('1') || c.startsWith('7') || c.startsWith('40');

        if (estNatureDebiteur) {
            // Nouveau solde = Solde actuel + Saisie Débit - Saisie Crédit
            const simulationSolde = soldeInitialSysteme + (l.debit || 0) - (l.credit || 0);
            if (simulationSolde < 0) {
                return {
                    viole: true,
                    msg: `🚨 Alerte Trésorerie : Ce crédit de ${new Intl.NumberFormat('fr-BI').format(l.credit)} Fbu rend le compte négatif (Solde dispo : ${new Intl.NumberFormat('fr-BI').format(soldeInitialSysteme)} Fbu).`
                };
            }
        }

        if (estNatureCrediteur) {
            // Pour un compte créditeur, le solde final doit rester négatif ou nul dans notre arithmétique (Crédit > Débit)
            // Nouveau solde = Solde actuel (négatif) + Saisie Débit - Saisie Crédit
            const simulationSolde = soldeInitialSysteme + (l.debit || 0) - (l.credit || 0);
            if (simulationSolde > 0) {
                return {
                    viole: true,
                    msg: `🚨 Violation Nature : Ce débit de ${new Intl.NumberFormat('fr-BI').format(l.debit)} Fbu dépasse le solde créditeur disponible.`
                };
            }
        }

        return { viole: false, msg: '' };
    };

    return (
        <div className="w-full overflow-hidden border border-navy-200 bg-white rounded-xl shadow-xs">
            <table className="w-full text-left border-collapse text-xs font-sans antialiased">
                <thead>
                    <tr className="bg-navy-50 font-bold border-b border-navy-200 [&_th]:p-2 text-navy-800 uppercase text-[11px]">
                        <th className="w-[320px] pl-4">Compte Général</th>
                        <th>Libellé de l'écriture</th>
                        <th className="w-[140px] text-right pr-4">Débit</th>
                        <th className="w-[140px] text-right pr-4">Crédit</th>
                        {!isReadOnly && !msgBloque && <th className="w-[50px] text-center">X</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-navy-100">
                    {lignes.map((l) => {
                        const alerte = verifierViolationSolde(l);

                        // Injecte dynamiquement un drapeau de blocage pour empêcher la soumission du formulaire maître
                        l.aUneViolationSolde = alerte.viole;

                        return (
                            <tr key={l.idUnique} className={`[&_td]:p-2 hover:bg-navy-50/10 transition-colors ${alerte.viole ? 'bg-rose-50/30' : ''}`}>
                                <td className="pl-4 flex flex-col gap-1 py-3">
                                    <Select value={l.codeCompte || ''} options={comptes} filter onChange={e => changeL(l.idUnique, 'codeCompte', e.value)} disabled={isReadOnly || !!msgBloque} className="w-full text-xs font-bold" />
                                    {l.codeCompte && !alerte.viole && (
                                        <span className={`text-[10px] font-black tracking-wide ${l.soldeActuel >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            ℹ️ Solde actuel : {new Intl.NumberFormat('fr-BI').format(Math.abs(l.soldeActuel || 0))} Fbu {l.soldeActuel >= 0 ? '(Db)' : '(Cr)'}
                                        </span>
                                    )}
                                    {/* 💡 AFFICHAGE DU MESSAGE DE VIOLATION DE SOLDE EN ROUGE VIF SOUS LE COMPTE */}
                                    {alerte.viole && (
                                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 p-1 rounded border border-rose-100 animate-pulse leading-snug">
                                            {alerte.msg}
                                        </span>
                                    )}
                                </td>
                                <td><Input type="text" value={l.libelleLigne || ''} onChange={e => changeL(l.idUnique, 'libelleLigne', e.target.value)} disabled={isReadOnly || !!msgBloque} placeholder="Opération..." className="w-full text-xs font-bold uppercase" /></td>
                                <td><Input type="text" value={l.displayDebit || ''} onChange={e => changeL(l.idUnique, 'displayDebit', e.target.value)} placeholder="0" disabled={isReadOnly || !!msgBloque} className={`w-full text-right font-black pr-2 ${alerte.viole && l.debit > 0 ? 'text-rose-600 border-rose-400 bg-rose-50/40' : 'text-emerald-700'}`} /></td>
                                <td><Input type="text" value={l.displayCredit || ''} onChange={e => changeL(l.idUnique, 'displayCredit', e.target.value)} placeholder="0" disabled={isReadOnly || !!msgBloque} className={`w-full text-right font-black pr-2 ${alerte.viole && l.credit > 0 ? 'text-rose-600 border-rose-400 bg-rose-50/40' : 'text-rose-700'}`} /></td>
                                {!isReadOnly && !msgBloque && <td className="text-center"><Button type="button" variant="ghost" disabled={lignes.length <= 2} onClick={() => setLignes(lignes.filter(x => x.idUnique !== l.idUnique))} className="text-rose-600 p-1 h-7 w-7"><i className="pi pi-trash text-xs" /></Button></td>}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
