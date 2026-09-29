import React, { useState } from 'react';
import {
  Database,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  FileCheck,
  Check,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { OfertaDB, PostulacionDB, ApplicationState } from '../types';

interface PipelineTabProps {
  ofertas: OfertaDB[];
  postulaciones: PostulacionDB[];
  onSelectJob: (job: OfertaDB) => void;
  onRefresh: () => void;
}

export const PipelineTab: React.FC<PipelineTabProps> = ({
  ofertas,
  postulaciones,
  onSelectJob,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [keywordFilter, setKeywordFilter] = useState<string>('all');
  const [checkJobId, setCheckJobId] = useState('');
  const [dedupResult, setDedupResult] = useState<{
    tested: boolean;
    isDuplicate: boolean;
    existingJob?: OfertaDB;
  }>({ tested: false, isDuplicate: false });

  // Deduplication tester
  const handleTestDedup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkJobId.trim()) return;
    const cleanId = checkJobId.trim();
    const existing = ofertas.find((o) => o.linkedin_job_id === cleanId);
    setDedupResult({
      tested: true,
      isDuplicate: !!existing,
      existingJob: existing,
    });
  };

  // Filter jobs
  const filteredJobs = ofertas.filter((job) => {
    const post = postulaciones.find((p) => p.oferta_id === job.id);
    const status = post ? post.estado : 'pendiente';

    const matchesSearch =
      job.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.linkedin_job_id.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    const matchesKeyword = keywordFilter === 'all' || job.keyword_busqueda === keywordFilter;

    return matchesSearch && matchesStatus && matchesKeyword;
  });

  const keywordsList = Array.from(new Set(ofertas.map((o) => o.keyword_busqueda)));

  return (
    <div className="space-y-6">
      {/* Top Banner & Deduplication Engine Inspector */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold mb-1 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>Relational Storage & Indexing Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Pipeline de Ofertas & Postulaciones (PostgreSQL)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Tablas: <code className="text-sky-400 bg-[#0B0F17] px-1.5 py-0.5 border border-slate-800 rounded font-mono">ofertas</code> y <code className="text-sky-400 bg-[#0B0F17] px-1.5 py-0.5 border border-slate-800 rounded font-mono">postulaciones</code> • Clave única <code className="text-amber-400 bg-[#0B0F17] px-1.5 py-0.5 border border-slate-800 rounded font-mono">UNIQUE(linkedin_job_id)</code>
            </p>
          </div>

          {/* Deduplication Verification Widget */}
          <div className="bg-[#0B0F17] p-4 border border-slate-800 rounded-xl max-w-md w-full">
            <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verificador O(1) de Deduplicación
              </span>
              <span className="font-mono text-slate-500 text-[10px]">IDEMPOTENCIA</span>
            </h3>
            <form onSubmit={handleTestDedup} className="flex gap-2">
              <input
                type="text"
                placeholder="Ej. 4019283711 o ID LinkedIn..."
                value={checkJobId}
                onChange={(e) => {
                  setCheckJobId(e.target.value);
                  setDedupResult({ tested: false, isDuplicate: false });
                }}
                className="flex-1 px-3 py-2 bg-[#111827] border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-slate-950 rounded-xl transition-all cursor-pointer shadow-sm shadow-emerald-500/20"
              >
                TEST_DB
              </button>
            </form>

            {dedupResult.tested && (
              <div
                className={`mt-2.5 p-3 rounded-xl text-xs font-medium border ${
                  dedupResult.isDuplicate
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}
              >
                {dedupResult.isDuplicate ? (
                  <div>
                    <span className="font-bold block font-mono">[ OMITIDO_DUPLICADO ]</span>
                    <span className="text-xs text-slate-300 mt-0.5 block">
                      Existe en DB: <em>"{dedupResult.existingJob?.titulo}"</em> ({dedupResult.existingJob?.empresa}).
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="font-bold block font-mono">[ ID NUEVO / READY ]</span>
                    <span className="text-xs text-slate-300 mt-0.5 block">Este ID no existe en DB. El agente procederá a postularse.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search text */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por cargo, empresa o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#0B0F17] border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 bg-[#0B0F17] border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Todos los Estados ({ofertas.length})</option>
              <option value="postulado">Postulado / Exitoso</option>
              <option value="omitido_duplicado">Omitido Duplicado</option>
              <option value="no_postulado">No Postulado (Externo)</option>
              <option value="error">Error Técnico</option>
            </select>
          </div>

          {/* Keyword Filter */}
          <div>
            <select
              value={keywordFilter}
              onChange={(e) => setKeywordFilter(e.target.value)}
              className="w-full p-2 bg-[#0B0F17] border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Todas las Keywords ({keywordsList.length})</option>
              {keywordsList.map((kw, i) => (
                <option key={i} value={kw}>
                  {kw}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <div className="flex items-center justify-end">
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-[#0B0F17] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>SYNC_DB_STATE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="border border-slate-800 bg-[#111827] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0B0F17] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[11px]">
              <tr>
                <th className="py-3.5 px-4 font-mono">Job ID</th>
                <th className="py-3.5 px-4">Oferta & Empresa</th>
                <th className="py-3.5 px-4">Ubicación</th>
                <th className="py-3.5 px-4">Keyword</th>
                <th className="py-3.5 px-4">Match</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-mono">
                    No se encontraron registros con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => {
                  const postulacion = postulaciones.find((p) => p.oferta_id === job.id);
                  const estado: ApplicationState = postulacion ? postulacion.estado : 'postulado';

                  return (
                    <tr
                      key={job.id}
                      onClick={() => onSelectJob(job)}
                      className="hover:bg-slate-800/30 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-400">
                        #{job.linkedin_job_id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-sm text-white hover:text-emerald-400 transition-colors">
                          {job.titulo}
                        </div>
                        <div className="text-slate-400 text-xs font-normal">{job.empresa}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{job.ubicacion}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 bg-[#0B0F17] border border-slate-700/80 rounded-lg text-slate-300 text-[11px] font-mono">
                          {job.keyword_busqueda}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs font-bold text-emerald-400">
                        {job.match_score ? `${job.match_score}%` : '95%'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs whitespace-nowrap">
                        {estado === 'postulado' && (
                          <span className="text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">POSTULADO</span>
                        )}
                        {estado === 'omitido_duplicado' && (
                          <span className="text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">DUP_OMIT</span>
                        )}
                        {estado === 'no_postulado' && (
                          <span className="text-slate-400 font-semibold px-2 py-0.5 rounded bg-slate-800 border border-slate-700">EXTERNO</span>
                        )}
                        {estado === 'error' && (
                          <span className="text-rose-400 font-semibold px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">ERROR</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectJob(job);
                            }}
                            className="px-3 py-1 bg-[#0B0F17] hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Detalles
                          </button>
                          <a
                            href={job.job_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 bg-[#0B0F17] hover:bg-slate-800 text-slate-400 hover:text-emerald-400 border border-slate-700 rounded-lg transition-colors"
                            title="Abrir en LinkedIn"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
