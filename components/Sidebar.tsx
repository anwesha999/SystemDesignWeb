
// Added missing React import to fix 'Cannot find namespace React' error
import React from 'react';
import { SYSTEM_TEMPLATES } from '../constants';
import { SystemTemplate } from '../types';

interface SidebarProps {
  onSelect: (template: SystemTemplate) => void;
  selectedId?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSelect, selectedId }) => {
  const systemDesign = SYSTEM_TEMPLATES.filter(t => !t.name.includes('Coding'));
  const machineCoding = SYSTEM_TEMPLATES.filter(t => t.name.includes('Coding'));

  return (
    <aside className="w-72 border-r border-slate-700 bg-slate-800/50 flex flex-col h-full">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Architect Pro
        </h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">
          System Design Mastery
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        <div>
          <h2 className="text-[10px] font-black text-slate-500 uppercase px-2 mb-3 tracking-widest">
            High Level Design (HLD)
          </h2>
          <div className="space-y-1">
            {systemDesign.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelect(t)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-3 ${
                  selectedId === t.id
                    ? 'bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/30 shadow-lg shadow-blue-900/20'
                    : 'hover:bg-slate-700/50 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-lg">{t.icon}</span>
                <span className="font-semibold text-xs">{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-[10px] font-black text-indigo-500 uppercase px-2 mb-3 tracking-widest">
            Machine Coding (Craft)
          </h2>
          <div className="space-y-1">
            {machineCoding.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelect(t)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-3 ${
                  selectedId === t.id
                    ? 'bg-indigo-600/20 text-indigo-400 ring-1 ring-indigo-500/30'
                    : 'hover:bg-slate-700/50 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-lg">{t.icon}</span>
                <span className="font-semibold text-xs">{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
