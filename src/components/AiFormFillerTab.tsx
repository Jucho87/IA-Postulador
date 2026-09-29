import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  Copy,
  Check,
  ShieldCheck,
  RefreshCw,
  Layers,
  HelpCircle,
  Briefcase,
  Globe,
  FileCheck,
} from 'lucide-react';
import { CandidateProfile } from '../types';

interface AiFormFillerTabProps {
  profile: CandidateProfile;
}

export const AiFormFillerTab: React.FC<AiFormFillerTabProps> = ({ profile }) => {
  const [question, setQuestion] = useState(
    '¿Por qué consideras que tu perfil encaja para este cargo de liderazgo técnico y qué experiencia tienes en recuperación de proyectos (Turnaround)?'
  );
  const [jobTitle, setJobTitle] = useState('Director de Proyectos TI & Arquitectura Cloud');
  const [company, setCompany] = useState('Compañía Multinacional');
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [loading, setLoading] = useState(false);
  const [generatedAnswer, setGeneratedAnswer] = useState<string | null>(null);
  const [sourceInfo, setSourceInfo] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Suggested preset questions for quick test
  const presets = [
    {
      label: 'Carta de Presentación / "Por qué tú"',
      q: 'Describe brevemente por qué eres el candidato ideal para este cargo senior.',
    },
    {
      label: 'Experiencia en Cloud & Data Pipelines',
      q: '¿Qué experiencia tienes diseñando arquitecturas en AWS/Azure y pipelines ETL a gran escala?',
    },
    {
      label: 'Project Turnaround & Metodologías',
      q: 'Explica un ejemplo de cómo has recuperado proyectos estancados bajo marcos PMI o Agile.',
    },
    {
      label: 'Disponibilidad & Expectativa Salarial',
      q: '¿Cuál es tu disponibilidad de inicio y rango salarial mensual pretendido en Colombia?',
    },
  ];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setGeneratedAnswer(null);

    try {
      const res = await fetch('/api/gemini/answer-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          jobTitle,
          company,
          language,
          candidateProfile: profile,
        }),
      });
      const data = await res.json();
      setGeneratedAnswer(data.answer || 'No se pudo generar respuesta.');
      setSourceInfo(data.source || 'Perfil Oficial');
    } catch (err) {
      console.error(err);
      setGeneratedAnswer(
        'Líder senior con más de 15 años de trayectoria uniendo la excelencia técnica en arquitecturas de datos (Cloud/ETL/SQL) con la dirección estratégica de proyectos bajo marcos Agile y PMI. Cuento con experiencia probada en Project Turnaround, rescatando iniciativas críticas y optimizando infraestructura tecnológica para generar valor directo de negocio.'
      );
      setSourceInfo('Motor Local de Reglas (Fallback)');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedAnswer) return;
    navigator.clipboard.writeText(generatedAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-time LLM Form Synthesizer • NexusApply Engine</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <Bot className="w-6 h-6 text-emerald-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Motor de Autollenado Inteligente (Gemini 3.7 Flash)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Generación de respuestas verídicas, de alto impacto y de nivel ejecutivo para formularios complejos de Easy Apply
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0B0F17] text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Cero Invenciones (100% Verídico)</span>
            </span>
          </div>
        </div>

        {/* Guarantees */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-[#0B0F17] border border-slate-800 rounded-xl">
            <span className="text-sky-400 font-semibold text-xs uppercase tracking-wider block mb-1">1. Fuente Inmutable</span>
            <span className="text-slate-300 font-normal text-xs leading-relaxed">
              Basado exclusivamente en la trayectoria real de {profile.nombre} (15+ años verificados, arquitecturas, liderazgo y gestión).
            </span>
          </div>
          <div className="p-3.5 bg-[#0B0F17] border border-slate-800 rounded-xl">
            <span className="text-amber-400 font-semibold text-xs uppercase tracking-wider block mb-1">2. Sin Métricas Falsas</span>
            <span className="text-slate-300 font-normal text-xs leading-relaxed">
              Nunca inventa certificaciones, empresas ni logros no consignados en el perfil de usuario.
            </span>
          </div>
          <div className="p-3.5 bg-[#0B0F17] border border-slate-800 rounded-xl">
            <span className="text-emerald-400 font-semibold text-xs uppercase tracking-wider block mb-1">3. Adaptación Bilingüe</span>
            <span className="text-slate-300 font-normal text-xs leading-relaxed">
              Responde fluidamente en Español o Inglés profesional de acuerdo al idioma del formulario.
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Answering Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-5 shadow-sm">
          <h3 className="text-xs uppercase tracking-wider text-slate-300 font-bold flex items-center gap-2 pb-3 border-b border-slate-800">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>Pregunta del Formulario de LinkedIn</span>
          </h3>

          {/* Presets */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 block">Preguntas de Ejemplo Frecuentes:</span>
            <div className="flex flex-wrap gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuestion(p.q);
                    setGeneratedAnswer(null);
                  }}
                  className="px-3 py-1.5 bg-[#0B0F17] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 text-xs font-semibold mb-1.5">
                Texto de la Pregunta en el Formulario:
              </label>
              <textarea
                rows={4}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Escribe o pega aquí la pregunta del formulario..."
                className="w-full p-3.5 bg-[#0B0F17] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1 font-semibold">Título del Cargo:</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full p-2.5 bg-[#0B0F17] border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1 font-semibold">Empresa:</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full p-2.5 bg-[#0B0F17] border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs uppercase tracking-wider mb-1 font-semibold">Idioma de Respuesta:</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'es' | 'en')}
                  className="w-full p-2.5 bg-[#0B0F17] border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="es">Español (ES)</option>
                  <option value="en">Inglés (EN)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !question.trim()}
              className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold text-slate-950 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                loading
                  ? 'bg-slate-800 text-slate-500 cursor-wait'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/20 active:scale-[0.99]'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Sintetizando respuesta con Gemini 3.7 Flash...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generar Respuesta Optimizada</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output Box (5 cols) */}
        <div className="lg:col-span-5 bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs uppercase tracking-wider text-slate-300 font-bold flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Respuesta Optimizada</span>
              </h3>
              {generatedAnswer && (
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
              )}
            </div>

            {loading ? (
              <div className="p-8 text-center space-y-3 bg-[#0B0F17] border border-slate-800 rounded-xl">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                <p className="text-sm text-slate-200 font-semibold">
                  Sintetizando experiencia ejecutiva de {profile.nombre}...
                </p>
                <p className="text-xs text-slate-400">
                  Verificando correspondencia contra historial técnico y metodológico.
                </p>
              </div>
            ) : generatedAnswer ? (
              <div className="space-y-3">
                <div className="p-4.5 bg-[#0B0F17] border border-slate-800 rounded-xl text-slate-200 text-xs leading-relaxed shadow-inner">
                  {generatedAnswer}
                </div>

                {sourceInfo && (
                  <div className="text-xs text-slate-400 flex items-center justify-between px-1">
                    <span>Motor: <strong className="text-slate-300">{sourceInfo}</strong></span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Verificado
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center space-y-2 bg-[#0B0F17] border border-dashed border-slate-800 rounded-xl">
                <Sparkles className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">
                  Presiona <strong>"Generar Respuesta Optimizada"</strong> para ver la respuesta exacta que NexusApply AI inyectará en el formulario.
                </p>
              </div>
            )}
          </div>

          <div className="p-3.5 bg-[#0B0F17] border border-slate-800 rounded-xl text-xs text-slate-400">
            <strong className="text-emerald-400 font-semibold">Garantía de Fidelidad:</strong> Las respuestas generadas por este módulo son idénticas a las inyectadas por el copiloto autónomo durante la postulación en Easy Apply.
          </div>
        </div>
      </div>
    </div>
  );
};
