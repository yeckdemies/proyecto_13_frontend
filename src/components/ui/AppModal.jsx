import { useState, useEffect } from 'react';

const AppModal = ({
  isOpen,
  title,
  description,
  type = 'confirm', // 'confirm' | 'prompt'
  label,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  inputRequired = false,
  onConfirm,
  onCancel
}) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!isOpen) setInputValue('');
  }, [isOpen]);

  const handleConfirm = () => {
    if (type === 'prompt' && inputRequired && !inputValue.trim()) return;
    onConfirm(type === 'prompt' ? inputValue.trim() : undefined);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">{title}</h2>
        {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}

        {type === 'prompt' && (
          <div className="mb-4">
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {inputRequired && !inputValue.trim() && (
              <p className="text-xs text-red-500 mt-1">Este campo es obligatorio</p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppModal;
