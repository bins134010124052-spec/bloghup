import { useEffect, useState } from 'react';

const toastKey = 'assignment-toast';

export default function Toast() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handler = () => {
      const stored = sessionStorage.getItem(toastKey);
      if (stored) {
        setMessage(stored);
        setTimeout(() => {
          sessionStorage.removeItem(toastKey);
          setMessage('');
        }, 3000);
      }
    };
    window.addEventListener('storage', handler);
    handler();
    return () => window.removeEventListener('storage', handler);
  }, []);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-slate-900 px-5 py-3 text-sm text-white shadow-xl">
      {message}
    </div>
  );
}

export const showToast = (text) => {
  sessionStorage.setItem(toastKey, text);
  window.dispatchEvent(new Event('storage'));
};
