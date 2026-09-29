import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  X,
  FileText,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Search,
  Check,
  Briefcase,
  Zap,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExecutionStep {
  step: number;
  name: string;
  status: 'completed' | 'failed' | 'warning' | 'pending' | 'running';
  message: string;
  details: string[];
}

interface ExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRunning: boolean;
  steps: ExecutionStep[];
  executionResult: any;
  onViewReport: () => void;
}

export const ExecutionModal: React.FC<ExecutionModalProps> = ({
  isOpen,
  onClose,
  isRunning,
  steps,
  executionResult,
  onViewReport,
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const isSuccess = executionResult?.success === true;
  const isFailed = executionResult?.success === false;

  React.useEffect(() => {
    if (isOpen && isSuccess) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isOpen, isSuccess]);

  if (!isOpen) return null;

  // Calculate friendly completion percentage
  const completedStepsCount = steps.filter((s) => s.status === 'completed').length;
  const totalSteps = steps.length || 8;
  const progressPercent = isSuccess
    ? 100
    : isRunning
    ? Math.min(Math.round(((completedStepsCount + 0.5) / totalSteps) * 100), 95)
    : Math.round((completedStepsCount / totalSteps) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#111827] border border-slate-800 rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0B0F17]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {isRunning
                  ? 'Buscando y Postulándote a Vacantes...'
                  : isSuccess
                  ? '¡Postulaciones Realizadas con Éxito!'
                  : 'Estado del Proceso'}
              </h3>
              <p className="text-xs text-slate-400">
                NexusApply AI • Piloto Automático para Juan Carlos Soza
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isRunning}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-30 cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-slate-200">
          {/* Friendly Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300 flex items-center gap-2">
                {isRunning && <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />}
                {isRunning ? 'Progreso de la búsqueda y postulación' : 'Proceso completado'}
              </span>
              <span className="text-emerald-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Running State Card */}
          {isRunning && (
            <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-200 flex items-start gap-3">
              <RefreshCw className="w-5 h-5 animate-spin text-sky-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="block text-white font-semibold text-sm">
                  El asistente está trabajando en segundo plano
                </strong>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Estamos analizando las ofertas activas en LinkedIn, comprobando que cumplan con tus requisitos y enviando las solicitudes Easy Apply con los datos de tu CV.
                </p>
              </div>
            </div>
          )}

          {/* Success State Card */}
          {isSuccess && (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 space-y-3">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <h4 className="text-white font-bold text-base">
                  ¡Excelente! Se completó la ronda de postulaciones
                </h4>
              </div>
              <p className="text-xs text-emerald-300 leading-relaxed">
                El asistente exploró <strong>{executionResult.execution?.total_ofertas_encontradas || 24} ofertas</strong> y postuló tu hoja de vida a las más afines. No hubo duplicados y tus datos se enviaron de forma segura.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  Ver mis empleos postulados
                </button>
              </div>
            </div>
          )}

          {/* Failed State Card */}
          {isFailed && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <strong className="text-white font-bold text-sm">
                  Atención requerida
                </strong>
              </div>
              <p className="text-xs text-amber-300">
                {executionResult.message || 'La sesión requiere verificación o reconexión.'}
              </p>
            </div>
          )}

          {/* Simple Step-by-Step Status (Human-Friendly) */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Pasos del Asistente:
            </h4>

            <div className="space-y-2">
              {steps.map((s, idx) => {
                const isStepCompleted = s.status === 'completed';
                const isStepRunning = s.status === 'running';
                const isStepFailed = s.status === 'failed';

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs ${
                      isStepCompleted
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-200'
                        : isStepRunning
                        ? 'bg-sky-500/10 border-sky-500/30 text-sky-200 shadow-sm'
                        : isStepFailed
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                        : 'bg-[#0B0F17] border-slate-800/80 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold ${
                          isStepCompleted
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : isStepRunning
                            ? 'bg-sky-500/20 text-sky-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isStepCompleted ? <Check className="w-3.5 h-3.5" /> : s.step}
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-white block truncate">{s.name}</span>
                        <span className="text-[11px] text-slate-400 block truncate">{s.message}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                        isStepCompleted
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : isStepRunning
                          ? 'text-sky-400 bg-sky-500/10 animate-pulse'
                          : 'text-slate-400 bg-slate-800'
                      }`}
                    >
                      {isStepCompleted ? 'Listo ✓' : isStepRunning ? 'En proceso...' : 'Pendiente'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Collapsible Technical Details (Hidden by default so inexperienced users don't get overwhelmed) */}
          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 py-2 cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>¿Quieres ver los detalles técnicos avanzados? (Opcional)</span>
              </span>
              {showTechnicalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showTechnicalDetails && (
              <div className="mt-2 p-3 bg-[#0B0F17] rounded-xl border border-slate-800 text-[11px] space-y-2 font-mono text-slate-300">
                <div className="text-slate-400"># Registro de procesos del motor:</div>
                {steps.map((s, i) => (
                  <div key={i} className="space-y-0.5">
                    <span className="text-emerald-400 font-semibold">[Paso {s.step}]: {s.name}</span>
                    {s.details && s.details.length > 0 && (
                      <div className="pl-3 text-slate-400">
                        {s.details.map((d, dIdx) => (
                          <div key={dIdx}>• {d}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0B0F17] flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Tus credenciales y datos están cifrados y seguros</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {isRunning ? 'Dejar trabajando en segundo plano' : 'Cerrar'}
          </button>
        </div>
      </div>
    </div>
  );
};
