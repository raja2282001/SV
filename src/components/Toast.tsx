import React from 'react';
import { useStore } from '../context/StoreContext';

export const Toast: React.FC = () => {
  const { toast } = useStore();

  if (!toast.visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#131b2e] text-white px-5 py-3 rounded-lg shadow-2xl border border-white/10 transition-all duration-300 transform translate-y-0 opacity-100">
      <span className="material-symbols-outlined text-[#fea619] text-[20px]">
        {toast.type === 'warning' ? 'warning' : 'verified'}
      </span>
      <span className="text-sm font-medium tracking-wide font-['Plus_Jakarta_Sans']">
        {toast.message}
      </span>
    </div>
  );
};
