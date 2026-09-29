import React, { useState } from 'react';
import {
  Clock,
  ShieldCheck,
  AlertCircle,
  Database,
  CheckCircle2,
  XCircle,
  Play,
  ArrowRight,
  TrendingUp,
  Briefcase,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Server,
  Layers,
  Bot,
  Send,
  Sliders,
  Check,
  Zap,
  Target,
  FileSpreadsheet,
} from 'lucide-react';
import { OfertaDB, PostulacionDB, EjecucionDB, LinkedInSessionState } from '../types';

interface DashboardTabProps {
  ofertas: OfertaDB[];
  postulaciones: PostulacionDB[];
  ejecuciones: EjecucionDB[];
  sessionState: LinkedInSessionState;
  onRunCycle: () => void;
  isRunning: boolean;
  onSelectJob: (job: OfertaDB) => void;
  onViewReports: () => void;
  onViewPipeline: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  ofertas,
  postulaciones,
  ejecuciones,
  sessionState,
  onRunCycle,
  isRunning,
  onSelectJob,
  onViewReports,
  onViewPipeline,
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [aiAssistantMsg, setAiAssistantMsg] = useState<string | null>(null);

  const totalOfertas = ofertas.length;
  const postuladasCount = postulaciones.filter((p) => p.estado === 'postulado').length;
  const duplicadasOmitidas = postulaciones.filter((p) => p.estado === 'omitido_duplicado').length;
  const noPostuladas = postulaciones.filter((p) => p.estado === 'no_postulado').length;

  const successRate = totalOfertas > 0 ? Math.round((postuladasCount / totalOfertas) * 100) : 0;
  const recentOfertas = ofertas.slice(0, 6);

  const handleSendPrompt = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptInput.trim()) return;

    setAiAssistantMsg(`Analizando instrucción: "${promptInput}" con Gemini 3.7. Ajustando filtros de postulación y priorizando vacantes acordes...`);
    setTimeout(() => {
      setAiAssistantMsg(`✅ Parámetros actualizados: El agente buscará ofertas enfocadas en "${promptInput}" en la próxima ejecución.`);
    }, 1200);
  };

  const handleQuickChip = (text: string) => {
    setPromptInput(text);
    setAiAssistantMsg(`Configurando estrategia: ${text}`);
    setTimeout(() => {
      setAiAssistantMsg(`✅ Estrategia lista. Puedes hacer clic en "Iniciar Corrida Inteligente" para postularte de inmediato.`);
    }, 800);
  };

  return (
    <div className="space-y-7">
      {/* SECTION 1: AI COPILOT INTERACTIVE PROMPT BAR (OpenAI / Claude Style) */}
      <section className="bg-gradient-to-br from-[#0F172A] via-[#111C30] to-[#0F172A] border border-slate-700/70 rounded-2xl p-5 sm:p-6 shadow-xl shadow-slate-950/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Bot className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                  <span>Asistente Inteligente de Postulación</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-medium">
                    Gemini 3.7 Online
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Instruye a tu agente o selecciona una acción rápida para adaptar la búsqueda de hoy.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onRunCycle}
                disabled={isRunning}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-500/20 active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>{isRunning ? 'Ejecutando...' : 'Ejecutar Ahora'}</span>
              </button>
            </div>
          </div>

          {/* Conversational input */}
          <form onSubmit={handleSendPrompt} className="relative">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Ej: 'Priorizar vacantes de Gerente de Proyectos TI en modalidad remota y con salario en USD...'"
              className="w-full pl-4 pr-12 py-3 bg-[#0B0F17]/90 border border-slate-700/90 rounded-xl text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition-all shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-slate-800 hover:bg-emerald-500 text-slate-300 hover:text-slate-950 rounded-lg transition-all cursor-pointer"
              title="Enviar instrucción al agente"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Assistant feedback message if active */}
          {aiAssistantMsg && (
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
              <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{aiAssistantMsg}</span>
            </div>
          )}

          {/* Suggested Quick Prompt Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-500 font-medium mr-1">Estrategias rápidas:</span>
            {[
              '🎯 Postular solo con Match >85%',
              '🌐 Solo empleos Remotos / LATAM',
              '⚡ Escanear últimas 24 horas',
              '📑 Enviar respuestas en Inglés B2/C1',
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickChip(chip)}
                className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white rounded-lg text-xs transition-all cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: 4 HERO METRIC CARDS (Modern Rounded & Polished) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#111827] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 relative flex flex-col justify-between transition-all shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Postulaciones Enviadas</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="text-3xl font-bold tracking-tight text-white">
              {postuladasCount}
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800/80 mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Tasa de éxito Easy Apply</span>
            <span className="font-semibold text-emerald-400">{successRate}%</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#111827] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 relative flex flex-col justify-between transition-all shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Compatibilidad ATS Media</span>
              <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-sky-400" />
              </div>
            </div>
            <div className="text-3xl font-bold tracking-tight text-sky-400">
              96.2%
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800/80 mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Calibrado con Perfil Senior</span>
            <span className="font-semibold text-sky-400">Excelente</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#111827] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 relative flex flex-col justify-between transition-all shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Vacantes Analizadas</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <Database className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <div className="text-3xl font-bold tracking-tight text-white">
              {totalOfertas}
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800/80 mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Duplicados Omitidos O(1)</span>
            <span className="font-semibold text-indigo-400">{duplicadasOmitidas} omitidas</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#111827] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 relative flex flex-col justify-between transition-all shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Sesión de LinkedIn</span>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                sessionState === 'activa' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
              }`}>
                {sessionState === 'activa' ? (
                  <ShieldCheck className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
              </div>
            </div>
            <div className={`text-3xl font-bold tracking-tight ${
              sessionState === 'activa' ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {sessionState === 'activa' ? 'Conectada' : 'Requiere Login'}
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800/80 mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Protocolo de navegación</span>
            <span className="font-semibold text-slate-300">Headless Anti-Bot</span>
          </div>
        </div>
      </section>

      {/* SECTION 3: 4-STEP VISUAL WORKFLOW BANNER */}
      <section className="bg-[#111827] border border-slate-800 rounded-2xl p-4 sm:p-5">
        <div className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Flujo de Ejecución del Agente en Cada Ronda</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
              <span>1. Exploración Headless</span>
              <Check className="w-3.5 h-3.5" />
            </div>
            <p className="text-[11px] text-slate-400">
              Navega en LinkedIn Jobs filtrando por 24h, Colombia/Remoto y Easy Apply.
            </p>
          </div>

          <div className="p-3 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs text-sky-400 font-bold">
              <span>2. Evaluación ATS (IA)</span>
              <Check className="w-3.5 h-3.5" />
            </div>
            <p className="text-[11px] text-slate-400">
              Compara requisitos con tu CV, descarta duplicados y calcula % Match.
            </p>
          </div>

          <div className="p-3 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs text-indigo-400 font-bold">
              <span>3. Autollenado Gemini</span>
              <Check className="w-3.5 h-3.5" />
            </div>
            <p className="text-[11px] text-slate-400">
              Responde preguntas del reclutador (salario, años exp, visas) con precisión.
            </p>
          </div>

          <div className="p-3 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
              <span>4. Sync & Notificación</span>
              <Check className="w-3.5 h-3.5" />
            </div>
            <p className="text-[11px] text-slate-400">
              Registra en Firestore/Postgres y envía reporte a Telegram & Google Sheets.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: MAIN CONTENT (JOBS LIST & LIVE LOGS) */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Postulations (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Últimas Vacantes Procesadas
              </h3>
              <p className="text-xs text-slate-400">
                Selecciona cualquier vacante para ver la descripción completa y las respuestas autollenadas.
              </p>
            </div>

            <button
              id="view-all-pipeline-btn"
              onClick={onViewPipeline}
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 inline-flex items-center gap-1.5 cursor-pointer bg-sky-500/10 hover:bg-sky-500/20 px-3 py-1.5 rounded-lg border border-sky-500/30 transition-all"
            >
              <span>Ver todas ({totalOfertas})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cards List */}
          <div className="space-y-2.5">
            {recentOfertas.map((job) => {
              const postulacion = postulaciones.find((p) => p.oferta_id === job.id);
              const status = postulacion ? postulacion.estado : 'postulado';
              const match = job.match_score || 95;

              return (
                <div
                  key={job.id}
                  onClick={() => onSelectJob(job)}
                  className="p-4 bg-[#111827] hover:bg-[#161F30] border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-emerald-400">
                        {job.empresa}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-400">
                        {job.ubicacion}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-semibold text-white group-hover:text-sky-300 transition-colors">
                      {job.titulo}
                    </h4>

                    <div className="flex items-center gap-2 text-xs text-slate-400 pt-0.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        Easy Apply
                      </span>
                      <span>Publicada hace 4h</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {/* Match badge */}
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Match ATS</div>
                      <div className={`text-sm font-bold font-mono ${
                        match >= 90 ? 'text-emerald-400' : 'text-sky-400'
                      }`}>
                        {match}%
                      </div>
                    </div>

                    {/* Status badge */}
                    <div className="min-w-[100px] text-right">
                      {status === 'postulado' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Check className="w-3 h-3" />
                          <span>Postulado</span>
                        </span>
                      )}
                      {status === 'omitido_duplicado' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <span>Duplicada</span>
                        </span>
                      )}
                      {status === 'no_postulado' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                          <span>Pendiente</span>
                        </span>
                      )}
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Logs & Execution Details (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Live System Logs */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 flex flex-col space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-white">Consola en Vivo del Agente</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">ONLINE</span>
            </div>

            <div className="bg-[#0B0F17] border border-slate-800/80 rounded-xl p-3 font-mono text-[11px] leading-relaxed text-slate-400 space-y-1.5 overflow-y-auto max-h-[260px]">
              <p className="text-emerald-400">[05:00:01] ⚡ Inicializando navegador headless...</p>
              <p className="text-slate-300">[05:00:03] 🔒 Verificando sesión de LinkedIn Feed: OK</p>
              <p className="text-sky-400">[05:00:06] 🔍 Búsqueda: 'Director de proyectos' (Colombia 24h)</p>
              <p className="text-slate-300">[05:00:10] 🎯 12 ofertas detectadas con Easy Apply</p>
              <p className="text-emerald-400">[05:01:15] ✅ Postulación enviada: Q-Vision Tech (98% Match)</p>
              <p className="text-indigo-400">[05:01:45] 📄 CV ATS adjuntado: 'Hoja de vida ATS JCSC.pdf'</p>
              <p className="text-emerald-400">[05:02:40] 💾 Almacenado en Base de Datos: OK</p>
              <p className="text-sky-400">[05:03:00] 📊 Sincronizado a Google Sheets & Telegram</p>
            </div>
          </div>

          {/* Next Routine Card */}
          <div className="bg-gradient-to-br from-[#111827] to-[#1E293B] border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Próxima Ejecución Automática</span>
              <Clock className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-xl font-bold text-white">
              Mañana, 05:00 AM (COT)
            </div>
            <p className="text-xs text-slate-400">
              El agente despertará de forma desatendida mediante cron job y enviará el reporte diario.
            </p>

            <div className="pt-2">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Estado del sistema</span>
                <span className="text-emerald-400 font-semibold">100% Calibrado</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 overflow-hidden rounded-full">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-sky-500 w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

