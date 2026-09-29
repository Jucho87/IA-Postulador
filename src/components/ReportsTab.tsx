import React, { useState, useEffect } from 'react';
import {
  FileText,
  Code,
  Download,
  Copy,
  Check,
  Calendar,
  Layers,
  ChevronRight,
  RefreshCw,
  Eye,
  FileCode,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { DailyReportSummary } from '../types';

interface ReportsTabProps {
  onRefresh: () => void;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({ onRefresh }) => {
  const [reports, setReports] = useState<DailyReportSummary[]>([]);
  const [selectedReport, setSelectedReport] = useState<DailyReportSummary | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'markdown' | 'raw' | 'json'>('markdown');
  const [jsonContent, setJsonContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      setReports(data.reports || []);
      if (data.reports && data.reports.length > 0 && !selectedReport) {
        setSelectedReport(data.reports[0]);
      }

      const jsonRes = await fetch('/api/results-json');
      const jsonData = await jsonRes.json();
      setJsonContent(JSON.stringify(jsonData, null, 2));
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Daily Run Diagnostics & Artifacts</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Reportes Diarios de Postulaciones (Markdown & JSON)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Archivos generados automáticamente al finalizar la corrida de las 05:00 AM (<code className="text-sky-400 bg-[#0B0F17] px-1.5 py-0.5 border border-slate-800 rounded font-mono">linkedin_postulaciones_YYYY-MM-DD.md</code> y <code className="text-emerald-400 bg-[#0B0F17] px-1.5 py-0.5 border border-slate-800 rounded font-mono">resultados_linkedin.json</code>)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchReports}
              className="px-4 py-2 bg-[#0B0F17] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
              <span>FETCH_LOGS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Left List & Right Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of reports (4 cols) */}
        <div className="lg:col-span-4 bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="text-xs uppercase tracking-wider text-slate-300 font-bold flex items-center gap-2 pb-3 border-b border-slate-800">
            <Calendar className="w-4 h-4 text-emerald-400" />
            Historial de Reportes Generados
          </h3>

          <div className="space-y-2">
            {reports.map((report) => {
              const isSelected = selectedReport?.id === report.id;
              return (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                      : 'bg-[#0B0F17] border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold truncate text-slate-200">{report.filename}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800/80 rounded-md border border-slate-700 text-slate-400">
                      {report.fecha}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span>Encontradas: <strong className="text-slate-200">{report.total_encontradas}</strong></span>
                    <span>•</span>
                    <span className="text-emerald-400">Postuladas: <strong>{report.total_postuladas}</strong></span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={() => setActiveSubTab('json')}
              className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                activeSubTab === 'json'
                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                  : 'bg-[#0B0F17] border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-mono font-bold text-xs">resultados_linkedin.json</div>
                  <div className="text-[11px] text-slate-500 font-mono">Salida estructurada JSON</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Right Column: Viewer (8 cols) */}
        <div className="lg:col-span-8 bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          {/* Sub-Tab Selector & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-1.5 bg-[#0B0F17] p-1 border border-slate-800 rounded-xl">
              <button
                onClick={() => setActiveSubTab('markdown')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeSubTab === 'markdown'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Markdown Render</span>
              </button>

              <button
                onClick={() => setActiveSubTab('raw')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeSubTab === 'raw'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Raw .md</span>
              </button>

              <button
                onClick={() => setActiveSubTab('json')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeSubTab === 'json'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>
            </div>

            {/* Action Buttons: Copy & Download */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const content =
                    activeSubTab === 'json'
                      ? jsonContent
                      : selectedReport?.markdownContent || '';
                  handleCopy(content);
                }}
                className="px-3 py-1.5 bg-[#0B0F17] hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'COPIED' : 'COPY'}</span>
              </button>

              <button
                onClick={() => {
                  if (activeSubTab === 'json') {
                    handleDownload('resultados_linkedin.json', jsonContent, 'application/json');
                  } else if (selectedReport) {
                    handleDownload(selectedReport.filename, selectedReport.markdownContent, 'text/markdown');
                  }
                }}
                className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>EXPORT_FILE</span>
              </button>
            </div>
          </div>

          {/* Viewer Area */}
          <div className="max-h-[600px] overflow-y-auto pr-1">
            {activeSubTab === 'markdown' && selectedReport && (
              <div className="p-5 bg-[#0B0F17] border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed font-sans space-y-4 prose prose-invert max-w-none">
                <div className="markdown-body">
                  <ReactMarkdown>{selectedReport.markdownContent}</ReactMarkdown>
                </div>
              </div>
            )}

            {activeSubTab === 'raw' && selectedReport && (
              <pre className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl text-xs text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {selectedReport.markdownContent}
              </pre>
            )}

            {activeSubTab === 'json' && (
              <pre className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl text-xs text-emerald-400 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {jsonContent}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
