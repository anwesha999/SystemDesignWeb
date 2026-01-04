
import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import mermaid from 'mermaid';

interface DesignDisplayProps {
  content: string;
  diagramCode?: string;
  isBlogMode?: boolean;
}

export const DesignDisplay: React.FC<DesignDisplayProps> = ({ content, diagramCode, isBlogMode }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (diagramCode && mermaidRef.current) {
      mermaidRef.current.innerHTML = diagramCode;
      mermaid.initialize({ 
        startOnLoad: false, 
        theme: isBlogMode ? 'default' : 'dark',
        securityLevel: 'loose'
      });
      mermaid.render('mermaid-svg-' + Math.random().toString(36).substr(2, 9), diagramCode).then(({ svg }) => {
        if (mermaidRef.current) mermaidRef.current.innerHTML = svg;
      });
    }
  }, [diagramCode, isBlogMode]);

  return (
    <div className={`space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 ${isBlogMode ? 'max-w-3xl mx-auto' : ''}`}>
      {diagramCode && (
        <div className={`rounded-3xl p-8 border shadow-xl overflow-x-auto ${
          isBlogMode ? 'bg-slate-50 border-slate-100' : 'bg-slate-800/50 border-slate-700'
        }`}>
          <h3 className={`text-xs font-bold mb-6 uppercase tracking-widest ${isBlogMode ? 'text-slate-400' : 'text-slate-500'}`}>
            System Architecture Blueprint
          </h3>
          <div ref={mermaidRef} className="flex justify-center min-h-[350px]" />
        </div>
      )}

      <div className={`prose max-w-none ${
        isBlogMode 
          ? 'prose-slate prose-lg prose-headings:text-slate-900 prose-p:text-slate-600 prose-strong:text-slate-900 prose-code:text-indigo-600' 
          : 'prose-invert prose-blue'
      }`}>
        <ReactMarkdown
          components={{
            h1: ({ ...props }) => <h1 className={`${isBlogMode ? 'text-4xl font-black mt-16' : 'text-3xl font-bold mb-6 text-white'}`} {...props} />,
            h2: ({ ...props }) => <h2 className={`${isBlogMode ? 'text-2xl font-bold mt-12 mb-6 text-slate-900' : 'text-2xl font-bold mt-10 mb-4 text-blue-300 border-b border-slate-700 pb-2'}`} {...props} />,
            h3: ({ ...props }) => <h3 className={`${isBlogMode ? 'text-xl font-bold mt-8 text-slate-800' : 'text-xl font-semibold mt-6 mb-2 text-indigo-300'}`} {...props} />,
            p: ({ ...props }) => <p className={`${isBlogMode ? 'leading-relaxed text-lg mb-6 text-slate-600' : 'text-slate-300 leading-relaxed mb-4'}`} {...props} />,
            code: ({ inline, ...props }: any) => 
              inline ? (
                <code className={`px-1.5 py-0.5 rounded text-sm font-mono ${isBlogMode ? 'bg-slate-100 text-indigo-600' : 'bg-slate-800 text-blue-300'}`} {...props} />
              ) : (
                <div className="relative group">
                   <div className="absolute right-4 top-4 text-[10px] text-slate-500 font-mono uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity">Production Code</div>
                   <pre className={`rounded-2xl p-6 overflow-x-auto my-8 shadow-inner border ${
                     isBlogMode ? 'bg-slate-900 text-slate-300 border-slate-800' : 'bg-slate-950 border-slate-800'
                   }`}>
                     <code className="text-sm font-mono text-emerald-400" {...props} />
                   </pre>
                </div>
              ),
            blockquote: ({ ...props }) => (
              <blockquote className={`border-l-4 py-1 px-6 my-8 italic ${isBlogMode ? 'border-indigo-500 bg-indigo-50/30' : 'border-blue-500 bg-blue-500/5'}`} {...props} />
            )
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};
