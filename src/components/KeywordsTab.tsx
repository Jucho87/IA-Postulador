import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Filter,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  Sliders,
  Send,
  Zap,
  Globe,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Check,
  X,
  RefreshCw,
  Award,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { CandidateProfile, OfertaDB, JobMatchItem } from '../types';

interface KeywordsTabProps {
  profile: CandidateProfile;
  ofertas: OfertaDB[];
  onSelectJob: (job: OfertaDB) => void;
  onUpdateJobReviewStatus?: (jobId: string | number, status: 'pendiente' | 'aprobada' | 'descartada') => void;
  onApplyApprovedJobs?: (approvedJobs: OfertaDB[]) => void;
}

export const KeywordsTab: React.FC<KeywordsTabProps> = ({
  profile,
  ofertas,
  onSelectJob,
  onUpdateJobReviewStatus,
  onApplyApprovedJobs,
}) => {
  const [selectedKeyword, setSelectedKeyword] = useState<string>(
    profile.keywordsPrincipales?.[0] || 'Project Manager'
  );
  const [locationFilter, setLocationFilter] = useState('Colombia');
  const [timeFilter, setTimeFilter] = useState('Past 24 hours');
  const [easyApplyOnly, setEasyApplyOnly] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pendiente' | 'aprobada' | 'descartada' | 'high_match'>('all');

  // Search & Match AI State
  const [isSearchingWithAi, setIsSearchingWithAi] = useState(false);
  const [aiSearchResults, setAiSearchResults] = useState<JobMatchItem[]>([]);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  // Review states map for fast UI reactivity
  const [localReviewStatus, setLocalReviewStatus] = useState<Record<string, 'pendiente' | 'aprobada' | 'descartada'>>({});

  // Helper to get status of a job
  const getJobStatus = (job: OfertaDB | JobMatchItem): 'pendiente' | 'aprobada' | 'descartada' => {
    const key = String(job.id);
    if (localReviewStatus[key]) return localReviewStatus[key];
    return (job as any).estado_revision || 'pendiente';
  };

  const handleSetStatus = (jobId: string | number, newStatus: 'pendiente' | 'aprobada' | 'descartada', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLocalReviewStatus((prev) => ({ ...prev, [String(jobId)]: newStatus }));
    if (onUpdateJobReviewStatus) {
      onUpdateJobReviewStatus(jobId, newStatus);
    }
  };

  // Live AI Search & Match endpoint
  const handleLiveSearchWithAi = async () => {
    setIsSearchingWithAi(true);
    setSearchFeedback(null);

    try {
      const res = await fetch('/api/jobs/search-and-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          location: locationFilter,
          keywords: profile.keywordsPrincipales || [selectedKeyword],
          onlyEasyApply: easyApplyOnly,
          timeFilter,
          count: 8,
        }),
      });

      const data = await res.json();
      if (res.ok && data.jobs) {
        setAiSearchResults(data.jobs);
        setSearchFeedback(`¡Búsqueda completada! Se encontraron y evaluaron ${data.jobs.length} vacantes de alta afinidad para ${profile.nombre}.`);
      } else {
        setSearchFeedback('Error en la búsqueda con IA. Revisa los filtros e intenta de nuevo.');
      }
    } catch (err) {
      setSearchFeedback('Error al conectar con el servidor para la búsqueda en LinkedIn.');
    } finally {
      setIsSearchingWithAi(false);
    }
  };

  // Combine static/DB jobs and AI search results
  const allCurrentJobs: (OfertaDB | JobMatchItem)[] = aiSearchResults.length > 0
    ? aiSearchResults
    : ofertas;

  // Filter jobs matching the selected keyword, location and status
  const filteredJobs = allCurrentJobs.filter((job) => {
    const matchesKeyword =
      !selectedKeyword ||
      job.keyword_busqueda?.toLowerCase() === selectedKeyword.toLowerCase() ||
      job.titulo?.toLowerCase().includes(selectedKeyword.toLowerCase());

    const locLower = (job.ubicacion || '').toLowerCase();
    const targetLoc = (locationFilter || '').toLowerCase();
    const isForeignMismatch =
      locLower.includes('hamburg') ||
      locLower.includes('berlin') ||
      locLower.includes('germany') ||
      locLower.includes('essen');

    if (isForeignMismatch && targetLoc.includes('colombia')) {
      return false;
    }

    const matchesLocation =
      !locationFilter ||
      locLower.includes(targetLoc) ||
      (targetLoc.includes('colombia') &&
        (locLower.includes('bogot') ||
          locLower.includes('medellin') ||
          locLower.includes('latam') ||
          locLower.includes('worldwide') ||
          locLower.includes('remoto internacional')));

    if (!matchesLocation) return false;

    const status = getJobStatus(job);

    if (statusFilter === 'all') return matchesKeyword;
    if (statusFilter === 'pendiente') return matchesKeyword && status === 'pendiente';
    if (statusFilter === 'aprobada') return matchesKeyword && status === 'aprobada';
    if (statusFilter === 'descartada') return matchesKeyword && status === 'descartada';
    if (statusFilter === 'high_match') return matchesKeyword && (job.match_score || 0) >= 85;
    return matchesKeyword;
  });

  // Calculate counts
  const approvedCount = allCurrentJobs.filter((j) => getJobStatus(j) === 'aprobada').length;
  const pendingCount = allCurrentJobs.filter((j) => getJobStatus(j) === 'pendiente').length;
  const rejectedCount = allCurrentJobs.filter((j) => getJobStatus(j) === 'descartada').length;

  return (
    <div className="space-y-6">
      {/* Configuration & Rules Banner */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explorador de Vacantes & Revisión Inteligente • NexusApply Discovery</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <Search className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Explorador de Puestos en LinkedIn
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Candidato activo: <strong className="text-slate-200">{profile.nombre}</strong> ({profile.preferencias?.nivelExperiencia || 'Senior'})
            </p>
          </div>

          {/* Action: Search with AI */}
          <button
            id="search-linkedin-ai-btn"
            onClick={handleLiveSearchWithAi}
            disabled={isSearchingWithAi}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 transition-all cursor-pointer ${
              isSearchingWithAi
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20 active:scale-95'
            }`}
          >
            {isSearchingWithAi ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Buscando en LinkedIn con IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Buscar Puestos en LinkedIn con IA</span>
              </>
            )}
          </button>
        </div>

        {searchFeedback && (
          <div className="mt-4 p-3.5 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{searchFeedback}</span>
            </div>
            <button onClick={() => setSearchFeedback(null)} className="text-slate-400 hover:text-white cursor-pointer px-2">
              ✕
            </button>
          </div>
        )}

        {/* 7 Main Keywords List */}
        <div className="pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Keywords del Perfil ({profile.keywordsPrincipales?.length || 7} Ejes de Búsqueda)
            </h3>
            <span className="text-xs text-slate-500">Selecciona una keyword para filtrar</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {(profile.keywordsPrincipales || [
              'Project Manager',
              'Líder Técnico',
              'Data Engineer',
              'Software Developer',
            ]).map((kw, idx) => {
              const count = allCurrentJobs.filter(
                (o) => o.keyword_busqueda?.toLowerCase() === kw.toLowerCase()
              ).length;
              const isSelected = selectedKeyword.toLowerCase() === kw.toLowerCase();

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedKeyword(kw)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-sm ring-1 ring-emerald-500/30'
                      : 'bg-[#0B0F17] border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="text-xs font-semibold truncate">{kw}</span>
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">OFERTAS</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-md ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 font-mono'
                          : 'bg-slate-800 text-slate-300 font-mono'
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Expanded Keywords */}
        {profile.keywordsAmpliadas && profile.keywordsAmpliadas.length > 0 && (
          <div className="pt-4 mt-4 border-t border-slate-800 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Keywords Secundarias de Refuerzo
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.keywordsAmpliadas.map((ekw, eIdx) => (
                <button
                  key={eIdx}
                  onClick={() => setSelectedKeyword(ekw)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                    selectedKeyword.toLowerCase() === ekw.toLowerCase()
                      ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                      : 'bg-[#0B0F17] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  + {ekw}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Review Status Bar & Action Banner */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Estado:</span>
          
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-slate-800 text-white border-slate-700'
                : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-800/40 hover:text-white'
            }`}
          >
            Todas ({allCurrentJobs.length})
          </button>

          <button
            onClick={() => setStatusFilter('pendiente')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'pendiente'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-transparent text-slate-400 border-transparent hover:text-amber-400'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Por Revisar ({pendingCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('aprobada')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'aprobada'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-transparent text-slate-400 border-transparent hover:text-emerald-400'
            }`}
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Aprobadas ({approvedCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('descartada')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'descartada'
                ? 'bg-rose-950/40 text-rose-300 border-rose-500/40'
                : 'bg-transparent text-slate-400 border-transparent hover:text-rose-400'
            }`}
          >
            <X className="w-3.5 h-3.5 text-rose-400" />
            <span>Descartadas ({rejectedCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('high_match')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'high_match'
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                : 'bg-transparent text-slate-400 border-transparent hover:text-sky-400'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-sky-400" />
            <span>Alta Afinidad (85%+)</span>
          </button>
        </div>

        {/* Apply Approved Action */}
        {approvedCount > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-emerald-400">
              {approvedCount} puesto(s) listo(s)
            </span>
            <button
              id="apply-approved-jobs-btn"
              onClick={() => {
                const approved = allCurrentJobs.filter((j) => getJobStatus(j) === 'aprobada') as OfertaDB[];
                if (onApplyApprovedJobs) onApplyApprovedJobs(approved);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Postular a Puestos Aprobados ({approvedCount})</span>
            </button>
          </div>
        )}
      </div>

      {/* Interactive Search Simulator & Results Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Search Simulator Controls */}
        <div className="lg:col-span-1 bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs uppercase tracking-wider text-slate-300 font-bold">Parámetros de Búsqueda</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1 font-semibold">Keyword Activa:</label>
              <div className="p-3 bg-[#0B0F17] border border-slate-700/80 rounded-xl text-white font-bold text-sm">
                "{selectedKeyword}"
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1 font-semibold">Ubicación Geográfica:</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full p-2.5 bg-[#0B0F17] border border-slate-700/80 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Colombia">Colombia (Nacional)</option>
                <option value="Bogota">Bogotá, D.C., Colombia</option>
                <option value="Remoto Colombia">Remoto / Híbrido Colombia</option>
                <option value="Latinoamerica">Latinoamérica (Remoto)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1 font-semibold">Filtro Temporal:</label>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="w-full p-2.5 bg-[#0B0F17] border border-slate-700/80 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Past 24 hours">Últimas 24 horas (Past 24h - Mandatorio)</option>
                <option value="Past week">Última semana (Past week)</option>
              </select>
            </div>

            <div className="p-3 bg-[#0B0F17] border border-slate-800 rounded-xl flex items-center justify-between">
              <span className="text-slate-300 font-semibold text-xs">Solo Solicitud Sencilla (Easy Apply):</span>
              <span className="px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                OBLIGATORIO (100%)
              </span>
            </div>

            <div className="p-3.5 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-1 text-xs text-slate-400">
              <strong className="text-slate-300 block uppercase tracking-wider text-[11px]">Enlace Directo en LinkedIn:</strong>
              <a
                href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
                  selectedKeyword
                )}&location=${encodeURIComponent(locationFilter)}&f_TPR=r86400&f_AL=true`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1 mt-1 break-all"
              >
                <span>Abrir búsqueda en vivo en LinkedIn</span>
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Results with User Review Actions */}
        <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-xs uppercase tracking-wider text-slate-300 font-bold">
                Puestos para "{selectedKeyword}" ({filteredJobs.length} resultados)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Revisa cada vacante, evalúa el Match Score y aprueba para que NexusApply AI postule
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
              {locationFilter} • Easy Apply
            </span>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="p-8 text-center bg-[#0B0F17] border border-slate-800 rounded-xl space-y-3">
              <Search className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">
                No hay ofertas que coincidan con este filtro de revisión
              </p>
              <p className="text-xs text-slate-500">
                Haz clic en "Buscar Puestos en LinkedIn con IA" para descubrir nuevas ofertas en tiempo real.
              </p>
              <button
                onClick={handleLiveSearchWithAi}
                className="mt-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer"
              >
                Buscar Vacantes Ahora
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredJobs.map((job) => {
                const status = getJobStatus(job);
                const isApproved = status === 'aprobada';
                const isRejected = status === 'descartada';

                return (
                  <div
                    key={job.id}
                    className={`p-4.5 bg-[#0B0F17] rounded-xl border transition-all ${
                      isApproved
                        ? 'border-emerald-500/60 bg-emerald-500/5'
                        : isRejected
                        ? 'border-rose-900/40 opacity-60'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div
                        onClick={() => onSelectJob(job as OfertaDB)}
                        className="space-y-1.5 flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-base text-white hover:text-emerald-400 transition-colors">
                            {job.titulo}
                          </h4>
                          {job.es_easy_apply && (
                            <span className="px-2 py-0.5 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-md">
                              SOLICITUD SENCILLA
                            </span>
                          )}
                          {isApproved && (
                            <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500 rounded-md">
                              ✓ APROBADA POR TI
                            </span>
                          )}
                          {isRejected && (
                            <span className="px-2 py-0.5 text-[10px] font-bold text-rose-300 bg-rose-950/40 border border-rose-600 rounded-md">
                              ✕ DESCARTADA
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2.5 text-xs text-slate-400 flex-wrap">
                          <span className="text-slate-200 font-semibold">{job.empresa}</span>
                          <span>•</span>
                          <span>{job.ubicacion}</span>
                          <span>•</span>
                          <span className="text-slate-500 font-mono text-[11px]">
                            ID: {job.linkedin_job_id || job.id}
                          </span>
                        </div>

                        {job.descripcion && (
                          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                            {job.descripcion}
                          </p>
                        )}

                        {/* Match Analysis snippet */}
                        {(job as any).analisis_compatibilidad && (
                          <div className="mt-2 p-2.5 bg-[#111827] border border-slate-800 rounded-lg text-xs text-slate-300 font-mono">
                            <strong className="text-sky-400">Evaluación ATS:</strong>{' '}
                            {(job as any).analisis_compatibilidad}
                          </div>
                        )}
                      </div>

                      {/* Right: Score & Status Actions */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        {job.match_score && (
                          <span
                            className={`px-3 py-1 rounded-lg border font-bold text-xs ${
                              job.match_score >= 90
                                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                                : job.match_score >= 75
                                ? 'bg-sky-500/10 border-sky-500/40 text-sky-400'
                                : 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                            }`}
                          >
                            {job.match_score}% Compatibilidad
                          </span>
                        )}

                        <span className="text-[11px] text-slate-500">{job.fecha_publicacion}</span>

                        {/* User Review Action Buttons */}
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <button
                            id={`approve-job-${job.id}`}
                            onClick={(e) => handleSetStatus(job.id, 'aprobada', e)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer border ${
                              isApproved
                                ? 'bg-emerald-500 text-slate-950 border-emerald-500 font-bold'
                                : 'bg-[#111827] text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/20'
                            }`}
                            title="Aprobar puesto para postulación automática"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Aprobar</span>
                          </button>

                          <button
                            id={`reject-job-${job.id}`}
                            onClick={(e) => handleSetStatus(job.id, 'descartada', e)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer border ${
                              isRejected
                                ? 'bg-rose-600 text-white border-rose-600 font-bold'
                                : 'bg-[#111827] text-rose-400 border-rose-500/40 hover:bg-rose-950/40'
                            }`}
                            title="Descartar este puesto"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Descartar</span>
                          </button>

                          <button
                            onClick={() => onSelectJob(job as OfertaDB)}
                            className="p-2 bg-[#111827] text-slate-400 hover:text-white rounded-lg border border-slate-800 hover:border-slate-700 cursor-pointer"
                            title="Ver detalles completos y simular autollenado"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
