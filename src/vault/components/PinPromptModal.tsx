import React, { useState, useEffect } from 'react';
import { vaultService } from '../services/vaultService';

interface PinPromptModalProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const PinPromptModal: React.FC<PinPromptModalProps> = ({ onSuccess, onCancel }) => {
  const [pin, setPin] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsCreating(!vaultService.hasPin());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) {
      setError('PIN must be at least 4 characters');
      return;
    }
    
    if (isCreating) {
      await vaultService.setPin(pin);
      onSuccess();
    } else {
      const isValid = await vaultService.verifyPin(pin);
      if (isValid) {
        onSuccess();
      } else {
        setError('Incorrect PIN');
        setPin('');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 relative text-white">
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-2xl font-bold mb-2">
          {isCreating ? 'Create Journal PIN' : 'Enter Journal PIN'}
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          {isCreating 
            ? 'Set a PIN to lock your sensitive entries. Do not forget it!' 
            : 'Enter your PIN to unlock the journal.'}
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-center text-2xl tracking-[0.5em] text-white placeholder-gray-600"
              placeholder="••••"
              maxLength={8}
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          
          <button 
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            {isCreating ? 'Set PIN' : 'Unlock'}
          </button>
        </form>
      </div>
    </div>
  );
};
