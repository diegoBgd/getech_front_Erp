import { api } from '@/services/api';
import React, { useEffect, useState } from 'react';


export const NetworkOverlay: React.FC = () => {
  const [isServerOffline, setIsServerOffline] = useState<boolean>(() => {
    return sessionStorage.getItem('gatech_v3_clear') === 'true';
  });
  
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleOffline = () => {
      sessionStorage.setItem('gatech_v3_clear', 'true');
      setIsServerOffline(true);
    };
    
    window.addEventListener('erp:network_offline', handleOffline);
    return () => window.removeEventListener('erp:network_offline', handleOffline);
  }, []);

  // 💡 SOLUTION RADICALE : Pas de setInterval automatique qui provoque des conflits de boucles avec vos contextes.
  // L'écran reste 100% fixe et stable. C'est l'utilisateur qui décide quand retenter la liaison d'un simple clic.
  const declencherVerificationManuelle = async () => {
    setIsVerifying(true);
    setErrorMsg(null); 
    
    const base = api.defaults.baseURL || import.meta.env.VITE_API_BASE_URL || 'http://192.168.30.156:8080';
    const targetUrl = `${base}/compta/balance/0`;

    try {
      // Utilisation de fetch natif pour ne pas déclencher les intercepteurs axios.ts
      const res = await window.fetch(targetUrl, { 
        method: 'GET', 
        mode: 'cors'
      });
      
      // On n'autorise le rechargement de la page QUE si le serveur répond activement
      if (res && res.status) {
        sessionStorage.removeItem('gatech_v3_clear');
        window.location.reload();
      }
    } catch (err) {
      // Si le serveur refuse toujours (ERR_CONNECTION_REFUSED), on affiche le message en interne sans recharger
      setErrorMsg("Le serveur est toujours injoignable. Veuillez vérifier que l'API Spring Boot est bien démarrée.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isServerOffline) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-500/10 backdrop-blur-xl p-4 animate-fade-in transition-all duration-300">
      <div className="bg-white dark:bg-navy-900 border border-slate-100 dark:border-navy-800/80 p-6 rounded-2xl max-w-sm w-full text-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] flex flex-col items-center gap-5">
        
        <div className="h-14 w-14 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 flex items-center justify-center">
          <i className={`pi text-xl ${isVerifying ? 'pi-spin pi-spinner' : 'pi-wifi animate-pulse'}`} />
        </div>
        
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-black tracking-tight text-slate-900 dark:text-navy-50 uppercase">Liaison serveur perdue</h2>
          <p className="text-[11.5px] font-medium text-slate-400 dark:text-navy-400 leading-relaxed px-2">
            La connexion avec l'API Gateway centrale a été interrompue. La session de travail est temporairement suspendue.
          </p>
        </div>

        <div className="w-full bg-slate-50/60 dark:bg-navy-950/50 p-3 rounded-xl border border-slate-200/50 dark:border-navy-800/60 font-mono text-[10px] text-left text-slate-500 dark:text-navy-400 leading-normal select-none">
          <div className="flex items-center gap-1.5 mb-1 text-[9px] font-bold text-slate-400 dark:text-navy-500 uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Diagnostic Réseau
          </div>
          <span className="font-bold text-rose-600 dark:text-rose-400">Status:</span> net::ERR_CONNECTION_REFUSED
          <br />
          <span className="font-bold">Target:</span> http://192.168.30*
        </div>

        {errorMsg && (
          <div className="w-full text-left bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 p-2.5 rounded-lg text-[10.5px] font-semibold leading-relaxed flex gap-2">
            <i className="pi pi-exclamation-circle text-xs mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button 
          onClick={declencherVerificationManuelle} 
          disabled={isVerifying}
          className={`w-full h-[38px] rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-sm ${
            isVerifying 
              ? 'bg-slate-100 text-slate-400 dark:bg-navy-800 dark:text-navy-600 cursor-not-allowed' 
              : 'bg-navy-900 hover:bg-navy-950 dark:bg-sky-accent-500 dark:hover:bg-sky-accent-600 text-white active:scale-[0.98]'
          }`}
        >
          <i className={`pi ${isVerifying ? 'pi-spin pi-spinner' : 'pi-refresh'} text-[10px]`} /> 
          {isVerifying ? 'Analyse du réseau...' : 'Tenter une reconnexion'}
        </button>
      </div>
    </div>
  );
};
