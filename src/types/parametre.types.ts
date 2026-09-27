
export interface ParametreOD {
  id?: number;
  journalAN: string;
  journalOD: string;
  journalCL: string;
  compteBenefice: string;
  comptePerte: string;
  compteRs: string | null;
  compteAND: string | null;
  compteANC: string | null;
  compteBilanOuverture: string;
}
