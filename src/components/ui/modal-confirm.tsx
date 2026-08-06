import * as React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from './button'; // Import de VOTRE bouton personnalisé

interface ModalConfirmProps {
  visible: boolean;
  title: string;
  message: string;
  icon?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  variant?: 'default' | 'destructive' | 'sky';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ModalConfirm: React.FC<ModalConfirmProps> = ({
  visible,
  title,
  message,
  icon = 'pi pi-exclamation-triangle text-amber-accent-500',
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  loading = false,
  variant = 'destructive',
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog
      visible={visible}
      onHide={onCancel}
      modal
      draggable={false}
      resizable={false}
      closable={!loading}
      showHeader={false} // On masque l'en-tête natif pour tout dessiner nous-mêmes
      style={{ width: '400px' }}
      className="rounded-xl border border-navy-100 bg-white p-5 shadow-2xl dark:bg-navy-900 dark:border-navy-800"
    >
      <div className="flex flex-col gap-4">
        {/* En-tête personnalisé */}
        <div className="flex items-center gap-2 pb-2 border-b border-navy-50 dark:border-navy-800">
          <i className={`${icon} text-lg`}></i>
          <span className="text-sm font-bold text-navy-800 dark:text-navy-50">
            {title}
          </span>
        </div>

        {/* Corps du texte */}
        <div className="text-xs text-navy-500 dark:text-navy-400 leading-relaxed py-1">
          {message}
        </div>

        {/* Pied de page utilisant VOS boutons du répertoire UI */}
        <div className="flex justify-end gap-2 pt-3 border-t border-navy-50 dark:border-navy-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={variant} // Injecte dynamiquement 'destructive' ou 'default'
            size="sm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Traitement...' : confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
