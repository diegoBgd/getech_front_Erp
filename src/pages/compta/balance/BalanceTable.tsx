import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';

interface TableProps { lignes: any; typeCols: string; fmt: (v: number) => string; }

export const BalanceTable: React.FC<TableProps> = ({ lignes, typeCols, fmt }) => {
  const [size] = useState<number>(25);
  const [start, setStart] = useState<number>(0);

  useEffect(() => { setStart(0); }, [typeCols, size]);

  const rawData = Array.isArray(lignes) ? lignes : (lignes && typeof lignes === 'object' && 'lignes' in lignes) ? (lignes as any).lignes : [];
  
  // 💡 CORRECTIF CORE COMPTABILITÉ : Filtre strict pour sommer UNIQUEMENT les comptes feuilles de mouvements (sans enfant)
  const dt = rawData.filter((l: any) => l.codeCompte && !rawData.some((s: any) => s.codeCompte !== l.codeCompte && s.codeCompte.startsWith(l.codeCompte)));

  const sID = dt.reduce((s: number, l: any) => s + (l.soldeInitialDebiteur || 0), 0);
  const sIC = dt.reduce((s: number, l: any) => s + (l.soldeInitialCrediteur || 0), 0);
  const sMD = dt.reduce((s: number, l: any) => s + (l.cumulDebitPeriode || 0), 0);
  const sMC = dt.reduce((s: number, l: any) => s + (l.cumulCreditPeriode || 0), 0);
  const sFD = dt.reduce((s: number, l: any) => s + (l.soldeFinalDebiteur || 0), 0);
  const sFC = dt.reduce((s: number, l: any) => s + (l.soldeFinalCrediteur || 0), 0);

  const sty = (r: any) => {
    const len = r.codeCompte ? r.codeCompte.length : 4;
    return len < 3 ? 'bg-navy-100/70 font-black text-navy-950 py-1 text-[10.5px] font-sans antialiased' : len === 3 ? 'bg-navy-50/50 font-bold text-navy-900 py-1 text-[10.5px] font-sans antialiased' : 'font-medium py-1 text-navy-700 text-[9.5px] font-sans antialiased';
  };

  const styTxt = (r: any) => {
    const len = r.codeCompte ? r.codeCompte.length : 4;
    return len < 3 ? 'bg-navy-100/70 font-black text-navy-950 py-1 text-[10.5px] font-sans' : len === 3 ? 'bg-navy-50/50 font-bold text-navy-900 py-1 text-[10.5px] font-sans' : 'font-medium py-1 text-navy-700 text-[9.5px] uppercase font-sans';
  };

  const h4 = <ColumnGroup><Row><Column header="CODE" rowSpan={2} className="w-[85px] text-center font-bold border border-navy-200 bg-navy-50/50 text-[10.5px] font-sans" /><Column header="INTITULÉ DU COMPTE" rowSpan={2} className="font-bold border border-navy-200 bg-navy-50/50 text-left pl-4 text-[10.5px] font-sans" /><Column header="MOUVEMENTS" colSpan={2} className="text-center font-bold border border-navy-200 bg-navy-50/30 text-[10.5px] font-sans" /><Column header="SOLDES FINAUX" colSpan={2} className="text-center font-bold border border-navy-200 bg-navy-50/30 text-[10.5px] font-sans" /></Row><Row><Column header="DÉBIT" className="text-right font-bold border border-navy-200 bg-white text-[9.5px] font-sans" /><Column header="CRÉDIT" className="text-right font-bold border border-navy-200 bg-white text-[9.5px] font-sans" /><Column header="DÉBIT" className="text-right font-bold border border-navy-200 bg-white text-[9.5px] font-sans" /><Column header="CRÉDIT" className="text-right font-bold border border-navy-200 bg-white text-[9.5px] font-sans" /></Row></ColumnGroup>;
  const f4 = <ColumnGroup><Row className="bg-navy-950 text-white font-black text-xs border-t-2 border-navy-900 font-sans"><Column footer="TOTAL GÉNÉRAL" colSpan={2} className="pl-4 py-3 text-left font-black tracking-wider text-[11px]" /><Column footer={fmt(sMD)} footerStyle={{ textAlign: 'right' }} className="py-3 border border-navy-800 text-[11px] font-black" /><Column footer={fmt(sMC)} footerStyle={{ textAlign: 'right' }} className="py-3 border border-navy-800 text-[11px] font-black" /><Column footer={fmt(sFD)} footerStyle={{ textAlign: 'right' }} className="text-emerald-400 py-3 border border-navy-800 text-[11px] font-black" /><Column footer={fmt(sFC)} footerStyle={{ textAlign: 'right' }} className="text-rose-400 py-3 border border-navy-800 text-[11px] font-black" /></Row></ColumnGroup>;

  const h6 = <ColumnGroup><Row><Column header="CODE" rowSpan={2} className="w-[85px] text-center font-bold border border-navy-200 bg-navy-50/50 text-[10.5px] font-sans" /><Column header="INTITULÉ" rowSpan={2} className="font-bold border border-navy-200 bg-navy-50/50 text-left pl-4 text-[10.5px] font-sans" /><Column header="SOLDES INITIAUX" colSpan={2} className="text-center font-bold border border-navy-200 bg-navy-50/30 text-[10.5px] font-sans" /><Column header="MOUVEMENTS" colSpan={2} className="text-center font-bold border border-navy-200 bg-navy-50/30 text-[10.5px] font-sans" /><Column header="SOLDES FINAUX" colSpan={2} className="text-center font-bold border border-navy-200 bg-navy-50/30 text-[10.5px] font-sans" /></Row><Row><Column header="DÉBIT" className="text-right font-bold border border-navy-200 bg-white text-[9.5px] font-sans" /><Column header="CRÉDIT" className="text-right font-bold border border-navy-200 bg-white text-[9.5px] font-sans" /><Column header="DÉBIT" className="text-right font-bold border border-navy-200 bg-white text-[9.5px] font-sans" /><Column header="CRÉDIT" className="text-right font-bold border border-navy-200 bg-white text-[9.5px] font-sans" /><Column header="DÉBIT" className="text-right font-bold border border-navy-200 bg-white text-[9.5px] font-sans" /><Column header="CRÉDIT" className="text-right font-bold border border-navy-200 bg-white text-[9.5px] font-sans" /></Row></ColumnGroup>;
  const f6 = <ColumnGroup><Row className="bg-navy-950 text-white font-black text-xs border-t-2 border-navy-900 font-sans"><Column footer="TOTAL GÉNÉRAL" colSpan={2} className="pl-4 py-3 text-left font-black tracking-wider text-[11px]" /><Column footer={fmt(sID)} footerStyle={{ textAlign: 'right' }} className="py-3 border border-navy-800 text-[11px] font-black" /><Column footer={fmt(sIC)} footerStyle={{ textAlign: 'right' }} className="py-3 border border-navy-800 text-[11px] font-black" /><Column footer={fmt(sMD)} footerStyle={{ textAlign: 'right' }} className="py-3 border border-navy-800 text-[11px] font-black" /><Column footer={fmt(sMC)} footerStyle={{ textAlign: 'right' }} className="py-3 border border-navy-800 text-[11px] font-black" /><Column footer={fmt(sFD)} footerStyle={{ textAlign: 'right' }} className="text-emerald-400 py-3 border border-navy-800 text-[11px] font-black" /><Column footer={fmt(sFC)} footerStyle={{ textAlign: 'right' }} className="text-rose-400 py-3 border border-navy-800 text-[11px] font-black" /></Row></ColumnGroup>;

  return (
    <div className="w-full border border-navy-200 rounded-xl bg-white dark:bg-navy-950 shadow-xs overflow-hidden">
      {typeCols === '4' ? (
        <DataTable key={`T4-${size}`} value={rawData} headerColumnGroup={h4} footerColumnGroup={f4} paginator={rawData.length > size} rows={size} first={start} onPage={e => setStart(e.first)} showGridlines className="p-datatable-sm w-full">
          <Column field="codeCompte" bodyClassName={r => `${styTxt(r)} ${r.codeCompte?.length < 4 ? 'text-center font-bold' : 'pl-3 text-navy-500 font-medium'}`} />
          <Column field="intituleCompte" bodyClassName={r => `${styTxt(r)} ${r.codeCompte?.length === 3 ? 'pl-4' : r.codeCompte?.length >= 4 ? 'pl-8' : 'pl-2'}`} />
          <Column body={r => fmt(r.cumulDebitPeriode)} align="right" bodyClassName={sty} />
          <Column body={r => fmt(r.cumulCreditPeriode)} align="right" bodyClassName={sty} />
          <Column body={r => fmt(r.soldeFinalDebiteur)} align="right" bodyClassName={sty} />
          <Column body={r => fmt(r.soldeFinalCrediteur)} align="right" bodyClassName={sty} />
        </DataTable>
      ) : (
        <DataTable key={`T6-${size}`} value={rawData} headerColumnGroup={h6} footerColumnGroup={f6} paginator={rawData.length > size} rows={size} first={start} onPage={e => setStart(e.first)} showGridlines className="p-datatable-sm w-full">
          <Column field="codeCompte" bodyClassName={r => `${styTxt(r)} ${r.codeCompte?.length < 4 ? 'text-center font-bold' : 'pl-3 text-navy-500 font-medium'}`} />
          <Column field="intituleCompte" bodyClassName={r => `${styTxt(r)} ${r.codeCompte?.length === 3 ? 'pl-4' : r.codeCompte?.length >= 4 ? 'pl-8' : 'pl-2'}`} />
          <Column body={r => fmt(r.soldeInitialDebiteur)} align="right" bodyClassName={sty} />
          <Column body={r => fmt(r.soldeInitialCrediteur)} align="right" bodyClassName={sty} />
          <Column body={r => fmt(r.cumulDebitPeriode)} align="right" bodyClassName={sty} />
          <Column body={r => fmt(r.cumulCreditPeriode)} align="right" bodyClassName={sty} />
          <Column body={r => fmt(r.soldeFinalDebiteur)} align="right" bodyClassName={sty} />
          <Column body={r => fmt(r.soldeFinalCrediteur)} align="right" bodyClassName={sty} />
        </DataTable>
      )}
    </div>
  );
};
