import React, { useEffect, useState, useRef } from 'react';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import type { ParametreOD } from '@/types';
import { parametreService } from '@/services/parametre.service';
import { ecritureService } from '@/services/ecriture.service';
import { ParametresForm } from '@/components/forms/ParametresForm';


export const ParametresPage: React.FC = () => {
  const toast = useRef<Toast>(null);
  const [fetching, setFetching] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [journaux, setJournaux] = useState<any[]>([]);
  const [comptes, setComptes] = useState<any[]>([]);
  const [config, setConfig] = useState<ParametreOD>({
    journalAN: 'AN', journalOD: 'OD', compteRs: '', compteAND: '', compteANC: ''
  });

  useEffect(() => {
    const initPage = async () => {
      setFetching(true);
      try {
        const [resConfig, resJ, resC] = await Promise.all([
          parametreService.getParametres(),
          ecritureService.getJournaux(),
          ecritureService.getComptesDetail()
        ]);
        if (resConfig) setConfig(resConfig);
        setJournaux(resJ.map(j => ({ label: `${j.code} - ${j.intitule}`, value: j.code })));
        setComptes(resC.map(c => ({ label: `${c.code} - ${c.intitule}`, value: c.code })));
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    initPage();
  }, []);

  const handleSave = async (values: ParametreOD) => {
    setLoading(true);
    try {
      await parametreService.enregistrerParametres(values);
      toast.current?.show({ severity: 'success', summary: 'Succès', detail: 'Configuration mise à jour.', life: 3000 });
    } catch (err) {
      toast.current?.show({ severity: 'error', summary: 'Échec', detail: 'Erreur lors de la sauvegarde.', life: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Toast ref={toast} position="top-right" />
      <div className="bg-white dark:bg-navy-900 rounded-xl border border-navy-100 dark:border-navy-800 shadow-sm p-5 flex flex-col">
        <div>
          <h2 className="text-base font-bold text-navy-900 dark:text-navy-50">Paramètres Comptables</h2>
          <p className="text-xs text-navy-400">Configuration des options système et clôtures</p>
        </div>
        <Divider className="my-4 border-navy-100" />
        {fetching ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <ProgressSpinner style={{ width: '40px', height: '40px' }} strokeWidth="4" />
            <span className="text-xs text-navy-400">Lecture des paramètres...</span>
          </div>
        ) : (
          <ParametresForm journaux={journaux} comptes={comptes} loading={loading} initialValues={config} onSubmit={handleSave} />
        )}
      </div>
    </div>
  );
};
