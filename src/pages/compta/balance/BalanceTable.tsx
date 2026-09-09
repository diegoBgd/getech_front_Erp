import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Select } from '../../../components/ui/select';

interface TableProps { lignes: any[]; typeCols: string; fmt: (v: number) => string; }

export const BalanceTable: React.FC<TableProps> = ({ lignes, typeCols, fmt }) => {
  const [size, setSize] = useState<number>(25);
  const [start, setStart] = useState<number>(0);

  useEffect(() => { setStart(0); }, [typeCols, size]);

  const dt = lignes.filter(l => l.codeCompte && (l.codeCompte.length >= 4 || !lignes.some(s => s.codeCompte.startsWith(l.codeCompte) && s.codeCompte !== l.codeCompte)));
  const sID = dt.reduce((s, l) => s + (l.soldeInitialDebiteur || 0), 0);
  const sIC = dt.reduce((s, l) => s + (l.soldeInitialCrediteur || 0), 0);
  const sMD = dt.reduce((s, l) => s + (l.cumulDebitPeriode || 0), 0);
  const sMC = dt.reduce((s, l) => s + (l.cumulCreditPeriode || 0), 0);
  const sFD = dt.reduce((s, l) => s + (l.soldeFinalDebiteur || 0), 0);
  const sFC = dt.reduce((s, l) => s + (l.soldeFinalCrediteur || 0), 0);

  // 💡 HARMONISATION : Utilisation de vos vraies variables de police Inter & JetBrains du CSS principal
  const sty = (r: any) => {
    const len = r.codeCompte ? r.codeCompte.length : 4;
    return len < 3 ? 'bg-navy-100/70 font-black text-navy-950 py-1 text-[10.5px] font-tabular' : len === 3 ? 'bg-navy-50/50 font-bold text-navy-900 py-1 text-[10.5px] font-tabular' : 'font-medium py-1 text-navy-700 text-[9.5px] font-tabular';
  };

  const styTxt = (r: any) => {
    const len = r.codeCompte ? r.codeCompte.length : 4;
    return len < 3 ? 'bg-navy-100/70 font-black text-navy-950 py-1 text-[10.5px]' : len === 3 ? 'bg-navy-50/50 font-bold text-navy-900 py-1 text-[10.5px]' : 'font-medium py-1 text-navy-700 text-[9.5px] uppercase';
  };

  const h4 = <ColumnGroup><Row><Column header="CODE" rowSpan={2} className="w-[85px] text-center font-bold border border-navy-200 bg-navy-50/50 text-[10.5px]" /><Column header="INTITULÉ DU COMPTE" rowSpan={2} className="font-bold border border-navy-200 bg-navy-50/50 text-left pl-4 text-[10.5px]" /><Column header="MOUVEMENTS" colSpan={2} className="text-center font-bold border border-navy-200 bg-navy-50/30 text-[10.5px]" /><Column header="SOLDES FINAUX" colSpan={2} className="text-center font-bold border border-navy-200 bg-navy-50/30 text-[10.5px]" /></Row><Row><Column header="DÉBIT" className="text-right font-bold border border-navy-200 bg-white text-[9.5px]" /><Column header="CRÉDIT" className="text-right font-bold border border-navy-200 bg-white text-[9.5px]" /><Column header="DÉBIT" className="text-right font-bold border border-navy-200 bg-white text-[9.5px]" /><Column header="CRÉDIT" className="text-right font-bold border border-navy-200 bg-white text-[9.5px]" /></Row></ColumnGroup>;
  const f4 = <ColumnGroup><Row className="bg-navy-950 text-white font-black text-xs border-t-2 border-navy-900"><Column footer="TOTAL GÉNÉRAL DU SYSTÈME" colSpan={2} className="pl-4 py-3 text-left font-black tracking-wider text-[11px]" /><Column footer={fmt(sMD)} footerStyle={{ textAlign: 'right' }} className="py-3 border border-navy-800 text-[11px] font-black font-tabular" /><Column footer={fmt(sMC)} footerStyle={{ textAlign: 'right' }} className="py-3 border border-navy-800 text-[11px] font-black font-tabular" /><Column footer={fmt(sFD)} footerStyle={{ textAlign: 'right' }} className="text-emerald-400 bg-emerald-950/20 py-3 border border-navy-800 text-[11px] font-black font-tabular" /><Column footer={fmt(sFC)} footerStyle={{ textAlign: 'right' }} className="text-rose-400 bg-rose-950/20 py-3 border border-navy-800 text-[11px] font-black font-tabular" /></Row></ColumnGroup>;

  const h6 = <ColumnGroup><Row><Column header="CODE" rowSpan={2} className="w-[85px] text-center font-bold border border-navy-200 bg-navy-50/50 text-[10.5px]" /><Column header="INTITULÉ DU COMPTE" rowSpan={2} className="font-bold border border-navy-200 bg-navy-50/50 text-left pl-4 text-[10.5px]" /><Column header="SOLDES INITIAUX" colSpan={2} className="text-center font-bold border border-navy-200 bg-navy-50/30 text-[10.5px]" /><Column header="MOUVEMENTS PÉRIODE" colSpan={2} className="text-center font-bold border border-navy-200 bg-navy-50/30 text-[10.5px]" /><Column header="SOLDES FINAUX" colSpan={2} className="text-center font-bold border border-navy-200 bg-navy-50/30 text-[10.5px]" /></Row><Row><Column header="DÉBIT" className="text-right font-bold border border-navy-200 bg-white text-[9.5px]" /><Column header="CRÉDIT" className="text-right font-bold border border-navy-200 bg-white text-[9.5px]" /><Column header="DÉBIT" className="text-right font-bold border border-navy-200 bg-white text-[9.5px]" /><Column header="CRÉDIT" className="text-right font-bold border border-navy-200 bg-white text-[9.5px]" /><Column header="DÉBIT" className="text-right font-bold border border-navy-200 bg-white text-[9.5px]" /><Column header="CRÉDIT" className="text-right font-bold border border-navy-200 bg-white text-[9.5px]" /></Row></ColumnGroup>;
  const f6 = <ColumnGroup><Row className="bg-navy-950 text-white font-black text-xs border-t-2 border-navy-900"><Column footer="TOTAL GÉNÉRAL DU SYSTÈME" colSpan={2} className="pl-4 py-3 text-left font-black tracking-wider text-[11px]" /><Column footer={fmt(sID)} footerStyle={{ textAlign: 'right' }} className="py-3 border border-navy-800 text-[11px] font-black font-tabular" /><Column footer={fmt(sIC)} footerStyle={{ textAlign: 'right' }} className="py-3 border border-navy-800 text-[11px] font-black font-tabular" /><Column footer={fmt(sMD)} footerStyle={{ textAlign: 'right' }} className="py-3 border border-navy-800 text-[11px] font-black font-tabular" /><Column footer={fmt(sMC)} footerStyle={{ textAlign: 'right' }} className="py-3 border border-navy-800 text-[11px] font-black font-tabular" /><Column footer={fmt(sFD)} footerStyle={{ textAlign: 'right' }} className="text-emerald-400 bg-emerald-950/20 py-3 border border-navy-800 text-[11px] font-black font-tabular" /><Column footer={fmt(sFC)} footerStyle={{ textAlign: 'right' }} className="text-rose-400 bg-rose-950/20 py-3 border border-navy-800 text-[11px] font-black font-tabular" /></Row></ColumnGroup>;

  return (
    <div className="w-full border border-navy-200 rounded-xl bg-white dark:bg-navy-950 shadow-xs overflow-hidden">
      {typeCols === '4' ? (
        <DataTable key={`T4-${size}`} value={lignes} headerColumnGroup={h4} footerColumnGroup={f4} paginator={lignes.length > size} rows={size} first={start} onPage={e => setStart(e.first)} paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport" currentPageReportTemplate="{first} à {last} sur {totalRecords}" showGridlines className="p-datatable-sm w-full">
          <Column field="codeCompte" bodyClassName={r => `${styTxt(r)} font-tabular ${r.codeCompte?.length < 4 ? 'text-center font-bold' : 'pl-3 text-navy-500'}`} />
          <Column field="intituleCompte" bodyClassName={r => `${styTxt(r)} ${r.codeCompte?.length === 3 ? 'pl-4' : r.codeCompte?.length >= 4 ? 'pl-8' : 'pl-2'}`} />
          <Column body={r => fmt(r.cumulDebitPeriode)} align="right" bodyClassName={sty} />
          <Column body={r => fmt(r.cumulCreditPeriode)} align="right" bodyClassName={sty} />
          <Column body={r => fmt(r.soldeFinalDebiteur)} align="right" bodyClassName={sty} />
          <Column body={r => fmt(r.soldeFinalCrediteur)} align="right" bodyClassName={sty} />
        </DataTable>
      ) : (
        <DataTable key={`T6-${size}`} value={lignes} headerColumnGroup={h6} footerColumnGroup={f6} paginator={lignes.length > size} rows={size} first={start} onPage={e => setStart(e.first)} paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport" currentPageReportTemplate="{first} à {last} sur {totalRecords}" showGridlines className="p-datatable-sm w-full">
          <Column field="codeCompte" bodyClassName={r => `${styTxt(r)} font-tabular ${r.codeCompte?.length < 4 ? 'text-center font-bold' : 'pl-3 text-navy-500'}`} />
          <Column field="intituleCompte" bodyClassName={r => `${styTxt(r)} ${r.codeCompte?.length === 3 ? 'pl-4' : r.codeCompte?.length >= 4 ? 'pl-8' : 'pl-2'}`} />
          <Column body={r => fmt(r.soldeInitialDebiteur)} align="right" bodyClassName={sty} />
          <Column body={r => fmt(r.soldeInitialCrediteur)} align="right" bodyClassName={sty} />
          <Column body={r => fmt(r.cumulDebitPeriode)} align="right" bodyClassName={sty} />
          <Column body={r => fmt(r.cumulCreditPeriode)} align="right" bodyClassName={sty} />
          <Column body={r => fmt(r.soldeFinalDebiteur)} align="right" bodyClassName={sty} />
          <Column body={r => fmt(r.soldeFinalCrediteur)} align="right" bodyClassName={sty} />
        </DataTable>
      )}
      {lignes.length > 0 && (
        <div className="p-2 bg-navy-50/30 border-t border-navy-100 flex items-center">
          <div className="w-[180px] flex items-center gap-2"><span className="text-[10px] font-black text-navy-400 uppercase tracking-wider">Lignes:</span>
            <Select value={size} options={[{ label: '10 fiches', value: 10 }, { label: '25 fiches', value: 25 }, { label: '50 fiches', value: 50 }]} className="text-xs h-[28px] w-full" onChange={(e: any) => { setSize(Number(e.value)); setStart(0); }} />
          </div>
        </div>
      )}
    </div>
  );
};
