import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  CheckCircle2,
  Copy,
  Check,
  Globe,
  DollarSign,
  Shield,
  HelpCircle,
  History,
  Server,
  Database,
  UploadCloud,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { CandidateProfile, FormAnswerTemplate } from '../types';
import { CANDIDATE_PROFILE } from '../data/candidateProfile';

interface CandidateProfileTabProps {
  profile: CandidateProfile;
  formTemplates: FormAnswerTemplate[];
  onUpdateProfile: (newProfile: CandidateProfile) => void;
  onResetProfile: () => void;
}

export const CandidateProfileTab: React.FC<CandidateProfileTabProps> = ({
  profile,
  formTemplates,
  onUpdateProfile,
  onResetProfile,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'view' | 'upload'>('view');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'es' | 'en'>('es');

  // CV Upload / Text State
  const [cvText, setCvText] = useState('');
  const [linkedinUrlInput, setLinkedinUrlInput] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parseSuccessMessage, setParseSuccessMessage] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Handle file upload text reading
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setCvText(text);
      }
    };
    reader.readAsText(file);
  };

  // Parse CV with Gemini AI
  const handleParseCvWithAi = async () => {
    if (!cvText || cvText.trim().length < 20) {
      setParseError('Por favor ingresa o pega el contenido de la hoja de vida o perfil de LinkedIn (mínimo 20 caracteres).');
      return;
    }

    setIsParsing(true);
    setParseError(null);
    setParseSuccessMessage(null);

    try {
      const res = await fetch('/api/profile/parse-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvText,
          linkedinUrl: linkedinUrlInput,
          additionalNotes,
        }),
      });

      const data = await res.json();

      if (res.ok && data.profile) {
        onUpdateProfile(data.profile);
        setParseSuccessMessage(`¡Hoja de vida de ${data.profile.nombre} procesada con éxito con Gemini 3.7 Flash! Se han configurado sus roles objetivo, keywords de búsqueda y respuestas de autollenado.`);
        setActiveSubTab('view');
      } else {
        setParseError(data.error || 'Error al procesar la hoja de vida con IA');
      }
    } catch (err: any) {
      setParseError('Error en la comunicación con el servidor. Intenta nuevamente.');
    } finally {
      setIsParsing(false);
    }
  };

  // Quick Preset Selector for Juan Carlos Soza
  const handleLoadDefaultJuanCarlos = () => {
    onResetProfile();
    setActiveSubTab('view');
  };

  const isDefaultProfile = profile.nombre === CANDIDATE_PROFILE.nombre;

  // Active form templates
  const activeTemplates = profile.formTemplates && profile.formTemplates.length > 0
    ? profile.formTemplates
    : formTemplates;

  return (
    <div className="space-y-6">
      {/* Profile Mode & Switcher Bar */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-xs text-slate-400 font-semibold">Candidato Activo:</span>
          <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-white font-semibold text-xs rounded-lg">
            {profile.nombre}
          </span>
          {isDefaultProfile && (
            <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verificado Oficial</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="subtab-view-btn"
            onClick={() => setActiveSubTab('view')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'view'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : 'bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Ver Hoja de Vida</span>
          </button>

          <button
            id="subtab-upload-btn"
            onClick={() => setActiveSubTab('upload')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'upload'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ Analizar CV / LinkedIn con IA</span>
          </button>

          {!isDefaultProfile && (
            <button
              id="reset-to-default-profile-btn"
              onClick={handleLoadDefaultJuanCarlos}
              className="px-3 py-2 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors cursor-pointer"
              title="Restaurar al perfil preconfigurado de Juan Carlos Soza Calderón"
            >
              Restaurar Juan Carlos Soza
            </button>
          )}
        </div>
      </div>

      {/* SUCCESS / ERROR FEEDBACK */}
      {parseSuccessMessage && (
        <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-300 rounded-2xl flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{parseSuccessMessage}</span>
          </div>
          <button onClick={() => setParseSuccessMessage(null)} className="text-slate-400 hover:text-white cursor-pointer px-2">
            ✕
          </button>
        </div>
      )}

      {/* UPLOAD / PASTE ANY CV TAB */}
      {activeSubTab === 'upload' && (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analizador Universal de Perfiles • Motor Gemini 3.7</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1.5">
              Introduce cualquier Hoja de Vida o Perfil de LinkedIn
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              NexusApply AI procesará la experiencia, habilidades y extraerá automáticamente las <strong className="text-slate-200">7 keywords óptimas en LinkedIn</strong>, roles objetivo y el <strong className="text-slate-200">diccionario de respuestas Easy Apply</strong>.
            </p>
          </div>

          {parseError && (
            <div className="p-3.5 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <span>⚠️ {parseError}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  URL del Perfil de LinkedIn (Opcional):
                </label>
                <div className="relative">
                  <Linkedin className="w-4 h-4 absolute left-3.5 top-3.5 text-sky-400" />
                  <input
                    type="url"
                    value={linkedinUrlInput}
                    onChange={(e) => setLinkedinUrlInput(e.target.value)}
                    placeholder="https://www.linkedin.com/in/nombre-candidato"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#0B0F17] border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Subir Archivo de Hoja de Vida (.txt / .md / .json / .pdf):
                </label>
                <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-[#0B0F17] border border-dashed border-slate-700 hover:border-emerald-500 rounded-xl text-xs text-slate-400 hover:text-white cursor-pointer transition-colors">
                  <UploadCloud className="w-4 h-4 text-emerald-400" />
                  <span>Seleccionar archivo o arrastrar aquí</span>
                  <input
                    type="file"
                    accept=".txt,.md,.json,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Texto Completo de la Hoja de Vida / Extracto de LinkedIn:
                </label>
                <span className="text-[11px] font-mono text-slate-500">
                  {cvText.length} caracteres
                </span>
              </div>
              <textarea
                rows={9}
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Pega aquí el contenido completo del CV o resumen de LinkedIn..."
                className="w-full p-3.5 bg-[#0B0F17] border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed resize-y"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Instrucciones Adicionales o Preferencias Salariales (Opcional):
              </label>
              <input
                type="text"
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Ej: Enfoque en roles Remotos, rango salarial aspirado 10M - 18M COP, nivel de inglés C1..."
                className="w-full px-3.5 py-2.5 bg-[#0B0F17] border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Extracción inteligente con Gemini 3.7 y calibración ATS instantánea.</span>
              </div>

              <button
                id="parse-cv-submit-btn"
                onClick={handleParseCvWithAi}
                disabled={isParsing || !cvText.trim()}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-slate-950 transition-all cursor-pointer ${
                  isParsing || !cvText.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20 active:scale-95'
                }`}
              >
                {isParsing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Analizando Hoja de Vida con Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analizar Hoja de Vida y Activar Candidato</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Header & Contact Card */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500/20 to-sky-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 font-bold text-xl flex-shrink-0">
              {profile.nombre
                .split(' ')
                .slice(0, 2)
                .map((n) => n[0])
                .join('') || 'CV'}
            </div>
            <div className="space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Perfil de Postulación Activo
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {profile.nombre}
                </h2>
                <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold text-xs rounded-full">
                  {profile.preferencias?.nivelExperiencia || 'SENIOR'}
                </span>
                <span className="px-2.5 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/30 font-semibold text-xs rounded-full">
                  ATS OPTIMIZED
                </span>
              </div>
              <p className="text-xs text-sky-400 font-medium font-sans">
                {profile.titular || 'Especialista en Tecnología y Liderazgo'}
              </p>
            </div>
          </div>

          {/* Quick Contact Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B0F17] border border-slate-700 hover:border-slate-600 rounded-xl text-slate-300 hover:text-white text-xs transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>{profile.email}</span>
              </a>
            )}
            {profile.telefono && (
              <a
                href={`tel:${profile.telefono.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B0F17] border border-slate-700 hover:border-slate-600 rounded-xl text-slate-300 hover:text-white text-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{profile.telefono}</span>
              </a>
            )}
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-500/10 border border-sky-500/30 rounded-xl text-sky-300 hover:text-white text-xs hover:bg-sky-500/20 transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        </div>

        {/* Extracto Profesional */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Extracto Profesional
            </h3>
            <span className="text-xs text-slate-500">{profile.ubicacion || 'Colombia'}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#0B0F17] p-4 rounded-xl border border-slate-800 font-sans">
            {profile.resumenProfesional}
          </p>
        </div>

        {/* Operational Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
          <div className="bg-[#0B0F17] p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block font-medium">Ubicación</span>
            <span className="text-xs font-semibold text-white flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              {profile.ubicacion || 'Colombia'}
            </span>
          </div>
          <div className="bg-[#0B0F17] p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block font-medium">Modalidad</span>
            <span className="text-xs font-semibold text-white flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              {profile.preferencias?.modalidad || 'Híbrido / Remoto'}
            </span>
          </div>
          <div className="bg-[#0B0F17] p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block font-medium">Aspiración Salarial</span>
            <span className="text-xs font-semibold text-white flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              {profile.preferencias?.salarioMin && profile.preferencias?.salarioMax
                ? `${(profile.preferencias.salarioMin / 1000000).toFixed(0)}M - ${(profile.preferencias.salarioMax / 1000000).toFixed(0)}M ${profile.preferencias.salarioMoneda}`
                : 'A convenir (8M - 15M COP)'}
            </span>
          </div>
          <div className="bg-[#0B0F17] p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block font-medium">Disponibilidad</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {profile.preferencias?.disponibilidad || 'Inmediata'}
            </span>
          </div>
        </div>
      </div>

      {/* Aptitudes Principales (Categorías de la Hoja de Vida) */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Aptitudes Principales (Categorías del CV)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Categoría 1: Gestión de Proyectos y Liderazgo */}
          <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-sky-400">
              <Briefcase className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Gestión y Liderazgo
              </h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {profile.aptitudesPrincipales?.gestionYProyectos?.map((apt, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mt-0.5" />
                  <span>{apt}</span>
                </li>
              )) || [
                <li key={1} className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mt-0.5" /><span>Dirección de Proyectos TI</span></li>,
                <li key={2} className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mt-0.5" /><span>Metodologías: Scrum, PMI, PRINCE2</span></li>,
                <li key={3} className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mt-0.5" /><span>Gestión de Stakeholders y Riesgos</span></li>,
              ]}
            </ul>
          </div>

          {/* Categoría 2: Gerencia de Datos y Bases de Datos */}
          <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <Database className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Datos & Arquitectura
              </h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {profile.aptitudesPrincipales?.gerenciaDatosYBases?.map((apt, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{apt}</span>
                </li>
              )) || [
                <li key={1} className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" /><span>Estrategia y Gobernanza de Datos</span></li>,
                <li key={2} className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" /><span>PostgreSQL, Oracle, SQL Server</span></li>,
                <li key={3} className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" /><span>ETL/ELT, Big Data & Analytics</span></li>,
              ]}
            </ul>
          </div>

          {/* Categoría 3: Infraestructura y DevOps */}
          <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <Server className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Infraestructura & Cloud
              </h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {profile.aptitudesPrincipales?.infraDevOps?.map((apt, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{apt}</span>
                </li>
              )) || [
                <li key={1} className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" /><span>Arquitectura Cloud (AWS, GCP, Azure)</span></li>,
                <li key={2} className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" /><span>DevOps y CI/CD Pipelines</span></li>,
                <li key={3} className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" /><span>Seguridad y Alta Disponibilidad</span></li>,
              ]}
            </ul>
          </div>
        </div>
      </div>
      {/* Target Roles & Stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Roles Objetivo */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Briefcase className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Roles Objetivo en LinkedIn</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.rolesObjetivo?.map((role, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-[#0B0F17] border border-slate-700/80 rounded-xl text-xs text-slate-200 flex items-center gap-1.5 font-medium"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                {role}
              </span>
            )) || <span className="text-xs text-slate-500">No especificados</span>}
          </div>
        </div>

        {/* 7 Keywords Principales de LinkedIn */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Award className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Keywords Principales de Búsqueda ({profile.keywordsPrincipales?.length || 7})
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.keywordsPrincipales?.map((kw, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-semibold text-emerald-300 flex items-center gap-1.5"
              >
                <span className="text-[10px] text-emerald-500 font-mono">#{idx + 1}</span> {kw}
              </span>
            )) || <span className="text-xs text-slate-500">No especificadas</span>}
          </div>
        </div>
      </div>

      {/* Experiencia Profesional & Trayectoria */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Experiencia Profesional Estratégica</h3>
            </div>
            <span className="text-xs font-semibold text-emerald-400">Trayectoria Verificada</span>
          </div>

          <div className="space-y-6">
            {profile.experiencia?.map((exp, idx) => (
              <div
                key={idx}
                className="relative pl-6 pb-2 border-l-2 border-slate-800 last:border-l-0 space-y-1"
              >
                <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-sky-400 border-2 border-[#111827]" />
                <div className="space-y-1.5 bg-[#0B0F17] p-4 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <h4 className="text-sm font-bold text-white">{exp.cargo}</h4>
                    <span className="text-xs text-sky-400 font-semibold">{exp.periodo}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold">{exp.empresa}</p>
                  {exp.destacados && (
                    <ul className="mt-2 space-y-1.5 pt-2 border-t border-slate-800/60">
                      {exp.destacados.map((item, dIdx) => (
                        <li key={dIdx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                          <span className="text-emerald-400">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Trayectoria Anterior (si existe) */}
          {profile.trayectoriaAnterior && profile.trayectoriaAnterior.length > 0 && (
            <div className="pt-5 border-t border-slate-800 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <History className="w-4 h-4 text-sky-400" />
                <span>Trayectoria Anterior Consolidada</span>
              </h4>
              <div className="space-y-2 text-xs">
                {profile.trayectoriaAnterior.map((t, idx) => (
                  <div key={idx} className="p-3 bg-[#0B0F17] border border-slate-800 rounded-xl">
                    <strong className="text-sky-300 font-semibold block text-xs">{t.categoria}:</strong>
                    <span className="text-slate-400 text-xs leading-relaxed">{t.empresas}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education & Certs */}
          <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-sky-400" />
                <span>Educación Formal</span>
              </h4>
              <div className="space-y-2 text-xs">
                {profile.educacion?.map((edu, eIdx) => (
                  <div key={eIdx} className="p-3 bg-[#0B0F17] border border-slate-800 rounded-xl">
                    <strong className="text-white block font-bold text-xs">{edu.titulo}</strong>
                    <span className="text-slate-400 text-xs">
                      {edu.institucion} {edu.periodo ? `(${edu.periodo})` : edu.anio ? `(${edu.anio})` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Certificaciones Destacadas</span>
              </h4>
              <div className="space-y-2 text-xs">
                {profile.certificaciones?.map((cert, cIdx) => (
                  <div key={cIdx} className="p-2.5 bg-[#0B0F17] border border-slate-800 rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="text-slate-200">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Answer Dictionary */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Diccionario de Respuestas para Formularios Easy Apply
              </h3>
              <p className="text-xs text-slate-400">
                Reglas y respuestas estandarizadas basadas estrictamente en la hoja de vida de {profile.nombre}
              </p>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-[#0B0F17] p-1 border border-slate-700/80 rounded-xl">
            <button
              onClick={() => setSelectedLanguage('es')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedLanguage === 'es'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Español (ES)
            </button>
            <button
              onClick={() => setSelectedLanguage('en')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedLanguage === 'en'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English (EN)
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {activeTemplates.map((tpl, idx) => (
            <div key={idx} className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
                    {tpl.categoria}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-0.5">{tpl.pregunta}</h4>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
                      selectedLanguage === 'es' ? tpl.respuesta_es : tpl.respuesta_en,
                      `tpl-${idx}`
                    )
                  }
                  className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
                  title="Copiar respuesta"
                >
                  {copiedField === `tpl-${idx}` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="p-3 bg-[#111827] border border-slate-800 rounded-lg text-xs font-mono text-slate-200">
                {selectedLanguage === 'es' ? tpl.respuesta_es : tpl.respuesta_en}
              </div>

              {tpl.regla && (
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Regla ATS: {tpl.regla}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
