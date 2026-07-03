const PIN_KEY = 'vault_pin_hash';
const SESSION_KEY = 'vault_unlocked';

export const vaultService = {
  hashPin: async (pin: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  hasPin: (): boolean => {
    return typeof window !== 'undefined' ? !!localStorage.getItem(PIN_KEY) : false;
  },

  setPin: async (pin: string): Promise<void> => {
    const hash = await vaultService.hashPin(pin);
    localStorage.setItem(PIN_KEY, hash);
    sessionStorage.setItem(SESSION_KEY, 'true');
  },

  verifyPin: async (pin: string): Promise<boolean> => {
    const storedHash = localStorage.getItem(PIN_KEY);
    if (!storedHash) return false;
    const hash = await vaultService.hashPin(pin);
    const isValid = hash === storedHash;
    if (isValid) {
      sessionStorage.setItem(SESSION_KEY, 'true');
    }
    return isValid;
  },

  isUnlocked: (): boolean => {
    return typeof window !== 'undefined' ? sessionStorage.getItem(SESSION_KEY) === 'true' : false;
  },

  lockVault: (): void => {
    sessionStorage.removeItem(SESSION_KEY);
  }
};
