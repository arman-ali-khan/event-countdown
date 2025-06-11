import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
  type?: 'danger' | 'warning' | 'info';
  details?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isProcessing = false,
  type = 'danger',
  details
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return {
          iconBg: 'bg-yellow-100 dark:bg-yellow-900/20',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          confirmBg: 'bg-yellow-600 hover:bg-yellow-700',
          borderColor: 'border-yellow-200 dark:border-yellow-800'
        };
      case 'info':
        return {
          iconBg: 'bg-blue-100 dark:bg-blue-900/20',
          iconColor: 'text-blue-600 dark:text-blue-400',
          confirmBg: 'bg-blue-600 hover:bg-blue-700',
          borderColor: 'border-blue-200 dark:border-blue-800'
        };
      default: // danger
        return {
          iconBg: 'bg-red-100 dark:bg-red-900/20',
          iconColor: 'text-red-600 dark:text-red-400',
          confirmBg: 'bg-red-600 hover:bg-red-700',
          borderColor: 'border-red-200 dark:border-red-800'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className={`p-2 ${styles.iconBg} rounded-lg`}>
              <AlertTriangle className={`w-6 h-6 ${styles.iconColor}`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {message}
          </p>
          
          {details && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Details:</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {details}
              </p>
            </div>
          )}

          <div className={`bg-gray-50 dark:bg-gray-700 border ${styles.borderColor} rounded-lg p-4 mb-6`}>
            <div className="flex items-start space-x-3">
              <AlertTriangle className={`w-5 h-5 ${styles.iconColor} mt-0.5 flex-shrink-0`} />
              <div>
                <h4 className={`text-sm font-medium ${styles.iconColor} mb-1`}>
                  Warning
                </h4>
                <p className={`text-sm ${styles.iconColor.replace('600', '700').replace('400', '400')}`}>
                  This action cannot be undone. Please make sure you want to proceed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className={`px-4 py-2 ${styles.confirmBg} text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2`}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
