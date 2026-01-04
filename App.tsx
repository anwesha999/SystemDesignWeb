
import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DesignDisplay } from './components/DesignDisplay';
import { gemini } from './services/geminiService';
import { DesignPhase, SystemTemplate } from './types';

// Declaring global window extensions for aistudio key selection
declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const App: React.FC = () => {
  const [selectedSystem, setSelectedSystem] = useState<SystemTemplate | null>(null);
  const [activePhase, setActivePhase] = useState<DesignPhase>(DesignPhase.REQUIREMENTS);
  const [loading, setLoading] = useState(false);
  const [contentCache, setContentCache] = useState<Record<string, string>>({});
  const [diagramCache, setDiagramCache] = useState<Record<string, string>>({});
  const [blogCovers, setBlogCovers] = useState<Record<string, string>>({});
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [viewMode, setViewMode] = useState<'workspace' | 'blog'>('workspace');

  const fetchContent = useCallback(async (system: SystemTemplate, phase: DesignPhase) => {
    const cacheKey = `${system.id}-${phase}`;
    if (contentCache[cacheKey]) return;

    setLoading(true);
    try {
      const result = await gemini.generateDesignSection(system.id, system.name, phase, system.prompt);
      setContentCache(prev => ({ ...prev, [cacheKey]: result }));

      if (phase === DesignPhase.HLD && !diagramCache[system.id]) {
        const diagram = await gemini.generateMermaidDiagram(system.id, system.name);
        setDiagramCache(prev => ({ ...prev, [system.id]: diagram }));
      }

      if (!blogCovers[system.id]) {
        const cover = await gemini.generateBlogCover(system.id, system.name);
        if (cover) setBlogCovers(prev => ({ ...prev, [system.id]: cover }));
      }
    } catch (error) {
      console.error("Design generation failed", error);
    } finally {
      setLoading(false);
    }
  }, [contentCache, diagramCache, blogCovers]);

  const handleSystemSelect = (system: SystemTemplate) => {
    setSelectedSystem(system);
    setActivePhase(DesignPhase.REQUIREMENTS);
    setVideoUrl(null);
    fetchContent(system, DesignPhase.REQUIREMENTS);
  };

  const handlePhaseChange = (phase: DesignPhase) => {
    setActivePhase(phase);
    if (selectedSystem) {
      fetchContent(selectedSystem, phase);
    }
  };

  const handleGenerateVideo = async () => {
    if (!selectedSystem) return;
    setGeneratingVideo(true);
    try {
      // Check for API Key if using Veo models as per guidelines
      if (typeof window.aistudio !== 'undefined') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          // Provide a button or trigger to select key if not selected
          await window.aistudio.openSelectKey();
          // After openSelectKey, we assume success to mitigate race conditions as per guidelines
        }
      }

      const url = await gemini.generateExplainerVideo(selectedSystem.name);
      if (url) setVideoUrl(url);
    } catch (e: any) {
      console.error("Video generation failed", e);
      // Reset key selection state and prompt if requested entity was not found
      if (e.message?.includes("Requested entity was not found.") && typeof window.aistudio !== 'undefined') {
        await window.aistudio.openSelectKey();
      }
    } finally {
      setGeneratingVideo(false);
    }
  };

  const handlePublish = () => {
    setViewMode(viewMode === 'workspace' ? 'blog' : 'workspace');
  };

  return (
    <div className={`flex h-screen overflow-hidden ${viewMode === 'blog' ? 'bg-slate-50' : 'bg-slate-900'}`}>
      {viewMode === 'workspace' && (
        <Sidebar onSelect={handleSystemSelect} selectedId={selectedSystem?.id} />
      )}
      
      <main className={`flex-1 flex flex-col overflow-hidden relative ${viewMode === 'blog' ? 'text-slate-900' : 'text-slate-100'}`}>
        {/* Header */}
        <header className={`h-16 border-b flex items-center justify-between px-8 backdrop-blur-md z-10 ${
          viewMode === 'blog' ? 'bg-white/80 border-slate-200 shadow-sm' : 'bg-slate-800/30 border-slate-700'
        }`}>
          <div className="flex items-center gap-4">
            {viewMode === 'blog' && (
              <button 
                onClick={() => setViewMode('workspace')}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path></svg>
              </button>
            )}
            <h2 className={`text-lg font-bold ${viewMode === 'blog' ? 'text-slate-900' : 'text-slate-100'}`}>
              {selectedSystem ? (viewMode === 'blog' ? 'Article Preview' : selectedSystem.name) : 'Architectural Mastery'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
             <button
              onClick={handleGenerateVideo}
              disabled={!selectedSystem || generatingVideo}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                viewMode === 'blog' 
                ? 'bg-slate-900 text-white hover:bg-slate-800' 
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 text-white'
              } disabled:opacity-50`}
            >
              {generatingVideo ? 'Processing Video...' : 'Create Video'}
            </button>
            <button
              onClick={handlePublish}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                viewMode === 'blog' 
                ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700' 
                : 'border-slate-600 hover:bg-slate-700 text-white'
              }`}
            >
              {viewMode === 'blog' ? 'Back to Workspace' : 'Preview as Blog'}
            </button>
          </div>
        </header>

        {/* Workspace Nav */}
        {selectedSystem && viewMode === 'workspace' && (
          <nav className="bg-slate-800/20 border-b border-slate-700/50 px-8 py-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <div className="flex gap-2">
              {Object.values(DesignPhase).map((phase) => (
                <button
                  key={phase}
                  onClick={() => handlePhaseChange(phase)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activePhase === phase
                      ? 'bg-slate-700 text-blue-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
                >
                  {phase}
                </button>
              ))}
            </div>
          </nav>
        )}

        {/* Content Area */}
        <div className={`flex-1 overflow-y-auto custom-scrollbar ${viewMode === 'blog' ? 'bg-white' : 'bg-slate-900/50'}`}>
          {!selectedSystem ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-6 ring-1 ring-blue-500/20 shadow-2xl">
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Architect Pro Workspace</h3>
              <p className="text-slate-400 max-w-md">
                Master system design at an SDE-3 level. Select a blueprint to begin your deep dive.
              </p>
              {!process.env.API_KEY && (
                 <p className="mt-4 text-xs text-amber-500 bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20 font-bold uppercase tracking-widest">
                   Demo Mode: Running with Static Fallbacks
                 </p>
              )}
            </div>
          ) : (
            <div className={`${viewMode === 'blog' ? 'max-w-4xl mx-auto py-12 px-6' : 'max-w-5xl mx-auto p-8'}`}>
              
              {/* Blog Header */}
              {viewMode === 'blog' && (
                <div className="mb-12">
                   <div className="mb-8 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 aspect-[21/9] bg-slate-100">
                     {blogCovers[selectedSystem.id] ? (
                       <img src={blogCovers[selectedSystem.id]} alt="Cover" className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-slate-300">Generating AI Artwork...</div>
                     )}
                   </div>
                   <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
                     Designing {selectedSystem.name.split('/')[0]}: An SDE-3 Deep Dive
                   </h1>
                   <div className="flex items-center gap-4 text-slate-500 mb-8 border-b border-slate-100 pb-8">
                     <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">AP</div>
                     <div>
                       <p className="font-bold text-slate-900">Architect Pro Editorial</p>
                       <p className="text-sm">Published • 12 min read • Engineering Blog</p>
                     </div>
                   </div>
                </div>
              )}

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="text-slate-400 font-medium animate-pulse">Consulting the Architect Guild...</p>
                </div>
              ) : (
                <div className="space-y-12">
                   {videoUrl && (
                    <div className={`rounded-2xl overflow-hidden shadow-2xl overflow-hidden border ${viewMode === 'blog' ? 'border-slate-200' : 'border-slate-700'} aspect-video bg-black`}>
                       <video src={videoUrl} controls className="w-full h-full" />
                    </div>
                  )}
                  
                  <DesignDisplay 
                    content={viewMode === 'blog' 
                      ? Object.keys(DesignPhase).map(key => contentCache[`${selectedSystem.id}-${DesignPhase[key as keyof typeof DesignPhase]}`]).filter(Boolean).join('\n\n---\n\n')
                      : (contentCache[`${selectedSystem.id}-${activePhase}`] || '')} 
                    diagramCode={activePhase === DesignPhase.HLD || viewMode === 'blog' ? diagramCache[selectedSystem.id] : undefined}
                    isBlogMode={viewMode === 'blog'}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${viewMode === 'blog' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.1)'};
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default App;
