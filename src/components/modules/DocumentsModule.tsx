import React, { useState } from 'react';
import { 
  Download, 
  CheckCircle2 
} from 'lucide-react';
import { Persona } from '../../types';

interface DocumentsModuleProps {
  persona: Persona;
}

export const DocumentsModule: React.FC<DocumentsModuleProps> = ({ persona: _persona }) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const corporateDocs = [
    { title: 'Employment Agreement & NDA', date: '15 Mar 2023', issuer: 'Nexus Technologies Ltd', size: '1.4 MB', type: 'Contract' },
    { title: 'Appointment Letter (NX-4092)', date: '15 Mar 2023', issuer: 'People Operations', size: '820 KB', type: 'Official' },
    { title: 'Annual Compensation Revision Letter 2026', date: '01 Oct 2026', issuer: 'Board of Directors', size: '640 KB', type: 'Compensation' },
    { title: 'Relieving & Experience Certificate (Apex Labs)', date: '28 Feb 2023', issuer: 'Apex Labs Inc (Prior Employer)', size: '1.1 MB', type: 'Historical' },
  ];

  const handleDownload = (docTitle: string) => {
    setDownloadSuccess(`Downloaded "${docTitle}" securely.`);
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Corporate Document Vault
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-[#94A3B8]">Official Employment Documents</span>
          </div>
          <h2 className="text-2xl font-bold text-[#F8FAFC]">Employment Documents</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Access appointment letters, company certificates, and historical relieving documents.
          </p>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center justify-between animate-fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {downloadSuccess}
          </span>
          <span className="text-[10px] text-emerald-400/80">Encrypted Download</span>
        </div>
      )}

      {/* Document Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {corporateDocs.map((doc) => (
          <div
            key={doc.title}
            className="p-5 rounded-2xl bg-[#10182A] border border-[#1E293B] hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/40">
                  {doc.type}
                </span>
                <span className="text-xs text-slate-500 font-mono">{doc.size}</span>
              </div>
              <h3 className="text-sm font-bold text-[#F8FAFC]">{doc.title}</h3>
              <p className="text-xs text-[#94A3B8]">{doc.issuer} • Issued {doc.date}</p>
            </div>

            <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs">
              <span className="text-[#64748B] font-mono">Verified Digital Copy</span>
              <button
                onClick={() => handleDownload(doc.title)}
                className="py-1.5 px-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-cyan-300 border border-blue-500/40 font-medium flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
