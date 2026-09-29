import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Bot,
  FileText,
  Linkedin,
  Clock,
  TrendingUp,
  Cpu,
  Database,
  Layers,
  Award,
  Globe,
  Sliders,
  Check,
  ChevronRight,
  Play,
  Star,
  Users,
  Search,
  ExternalLink,
  MessageSquare,
  BarChart3,
  Flame
} from 'lucide-react';
import { CandidateProfile } from '../types';

interface LandingPageProps {
  onEnterCandidateApp: () => void;
  onEnterAdminApp: () => void;
  onOpenAuth: () => void;
  profile: CandidateProfile;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterCandidateApp,
  onEnterAdminApp,
  onOpenAuth,
  profile,
}) => {
  const [selectedRole, setSelectedRole] = useState<'tech_lead' | 'frontend' | 'data_engineer'>('tech_lead');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const demoRoles = {
    tech_lead: {
      title: 'Tech Lead / Software Architect',
      salary: '$6,000 - $9,000 USD / mes',
      company: 'Globant / Fintech LATAM',
      location: 'Remoto (Colombia / USA / LATAM)',
      match: 98,
      keywords: ['Architecture', 'TypeScript', 'PostgreSQL', 'Cloud & Docker', 'Engineering Management'],
      extractedAnswer: '15+ años de experiencia verificable liderando equipos de alto rendimiento y arquitecturas distribuidas.',
    },
    frontend: {
      title: 'Senior Frontend Engineer (React/Next.js)',
      salary: '$4,500 - $7,000 USD / mes',
      company: 'Unicorn Startup (San Francisco)',
      location: '100% Remoto',
      match: 95,
      keywords: ['React', 'TypeScript', 'TailwindCSS', 'Next.js', 'State Management'],
      extractedAnswer: 'Desarrollo de interfaces modernas con Tailwind CSS, TypeScript y microfrontends resilientes.',
    },
    data_engineer: {
      title: 'Senior Data Engineer / Cloud Platform',
      salary: '$5,500 - $8,500 USD / mes',
      company: 'Enterprise AI Lab',
      location: 'Remoto Global',
      match: 96,
      keywords: ['PostgreSQL', 'GCP / Cloud Run', 'Pipelines ETL', 'Python', 'LLM RAG'],
      extractedAnswer: 'Diseño de pipelines de datos escalables con PostgreSQL, Cloud SQL y automatización serverless.',
    },
  };

  const currentDemo = demoRoles[selectedRole];

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Floating Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#0B1528] to-teal-950 border-b border-emerald-900/40 py-2 px-4 text-center text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 text-[11px]">
            NUEVO v2.4
          </span>
          <span className="text-slate-300">
            Lanzamiento oficial de NexusApply AI: Piloto automático para LinkedIn Jobs con RAG sin alucinaciones.
          </span>
          <button
            onClick={onEnterCandidateApp}
            className="text-emerald-400 font-bold hover:text-emerald-300 underline underline-offset-2 flex items-center gap-1 ml-1 cursor-pointer"
          >
            <span>Probar Gratis Ahora</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Landing Navbar */}
      <header className="sticky top-0 z-40 bg-[#070A11]/85 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={onEnterCandidateApp}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-sky-500 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-white tracking-tight">NexusApply</span>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">AI</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase block">
                Autonomous Job Search Agent
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#como-funciona" className="hover:text-emerald-400 transition-colors">
              Cómo Funciona
            </a>
            <a href="#demostracion" className="hover:text-emerald-400 transition-colors">
              Demostración en Vivo
            </a>
            <a href="#ventajas" className="hover:text-emerald-400 transition-colors">
              Ventajas vs Manual
            </a>
            <a href="#precios" className="hover:text-emerald-400 transition-colors">
              Planes & Precios
            </a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">
              Preguntas Frecuentes
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={onEnterAdminApp}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700 transition-all cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <span>Panel Admin</span>
            </button>

            <button
              onClick={onEnterCandidateApp}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Comenzar Ahora</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        {/* Background Glows (Abacus.ai inspired deep tech ambiance) */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-sky-500/15 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-12 left-10 w-72 h-72 bg-emerald-500/5 blur-[90px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#111827] border border-emerald-500/30 shadow-inner text-xs font-semibold text-emerald-300">
            <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>El Primer Agente de IA para Búsqueda y Postulación Autónoma de Empleo</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-slate-400 font-normal">Sin Alucinaciones</span>
          </div>

          {/* Big Hero Title */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
              Consigue tu próximo empleo en{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
                Piloto Automático
              </span>{' '}
              con IA.
            </h1>
            <p className="text-base sm:text-xl text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
              Sube tu hoja de vida una sola vez y conecta tu LinkedIn. Nuestro agente inteligente busca vacantes compatibles, responde preguntas de reclutadores y se postula por ti todos los días a las 05:00 AM.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onEnterCandidateApp}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-2xl shadow-emerald-500/30 flex items-center justify-center gap-3 transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-slate-950" />
              <span>Subir mi CV y Empezar Gratis</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#demostracion"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl text-sm font-semibold text-slate-200 bg-[#111827] hover:bg-slate-800 border border-slate-700 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
              <span>Ver Cómo Postula la IA</span>
            </a>
          </div>

          {/* Micro Trust Indicators */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Prueba gratis sin tarjeta • Pago con tarjeta/Stripe para planes Pro</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>100% Tus datos reales del CV</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Configuración lista en menos de 2 minutos</span>
            </div>
          </div>
        </div>

        {/* Live Interactive Hero Preview Card (Abacus.ai inspired interactive console) */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 relative z-10">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
            {/* Window Top Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-400">
                  nexusapply-agent-runtime // live_preview.ts
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono text-emerald-400 font-bold">AGENTE EN LÍNEA (05:00 AM)</span>
              </div>
            </div>

            {/* 3 Step Interactive Visual Process */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Box 1 */}
              <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Paso 1: Ingesta</span>
                  <FileText className="w-4 h-4 text-sky-400" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white">Hoja de Vida ATS Procesada</div>
                  <p className="text-[11px] text-slate-400">
                    Extracción de 15+ años de liderazgo, arquitecturas Cloud, TypeScript y habilidades clave.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                  ✓ Grafo de Conocimiento OK
                </div>
              </div>

              {/* Box 2 */}
              <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Paso 2: Búsqueda</span>
                  <Linkedin className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white">Escaneo LinkedIn Jobs</div>
                  <p className="text-[11px] text-slate-400">
                    Filtros booleanos, detección Easy Apply y descarte estricto de duplicados anti-spam.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-1 rounded border border-sky-500/20">
                  ✓ 15 Ofertas Encontradas (95%+ Match)
                </div>
              </div>

              {/* Box 3 */}
              <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Paso 3: Postulación</span>
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white">Autocompletado con Gemini</div>
                  <p className="text-[11px] text-slate-400">
                    Respuestas técnicas precisas a formularios y envío de postulación verídica.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                  ✓ Postulación Completada 100%
                </div>
              </div>
            </div>

            {/* Quick Demo Action Bar */}
            <div className="p-4 bg-gradient-to-r from-[#0B0F17] via-slate-900 to-[#0B0F17] border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">¿Listo para activar tu piloto automático?</div>
                  <div className="text-[11px] text-slate-400">Carga tu CV y la IA comenzará a trabajar por ti de inmediato.</div>
                </div>
              </div>

              <button
                onClick={onEnterCandidateApp}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-500/20"
              >
                Configurar mi Perfil en 3 Pasos →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="py-12 border-y border-slate-800/80 bg-[#0B0F17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-white font-mono">+18,400</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Postulaciones Enviadas</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">98.2%</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Afinidad ATS Promedio</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-sky-400 font-mono">0%</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Alucinaciones de Datos</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">10x</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Más Entrevistas Agendadas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive Workflow Demo Section */}
      <section id="demostracion" className="py-20 bg-[#070A11] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Demostración Interactiva
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Mira cómo el agente analiza y postula a una vacante en tiempo real
            </h2>
            <p className="text-sm text-slate-400">
              Selecciona tu perfil deseado y observa cómo NexusApply AI extrae los datos de tu CV y responde los formularios de LinkedIn.
            </p>
          </div>

          {/* Role Tabs */}
          <div className="flex justify-center">
            <div className="p-1 bg-[#111827] border border-slate-800 rounded-2xl flex flex-wrap gap-1">
              {[
                { id: 'tech_lead', label: 'Tech Lead / Architect' },
                { id: 'frontend', label: 'Senior Frontend' },
                { id: 'data_engineer', label: 'Senior Data / Cloud' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedRole(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedRole === tab.id
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Inspection Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Job Match Detail (6 cols) */}
            <div className="lg:col-span-6 bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-sky-400">LINKEDIN_VACANCY_TARGET</span>
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg font-mono font-bold text-xs">
                  {currentDemo.match}% MATCH SCORE
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">{currentDemo.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="text-slate-200 font-semibold">{currentDemo.company}</span>
                  <span>•</span>
                  <span>{currentDemo.location}</span>
                </div>
                <div className="text-xs font-semibold text-emerald-400 font-mono">{currentDemo.salary}</div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                  Keywords ATS Detectadas & Validadas:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentDemo.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-[#0B0F17] border border-slate-700 text-slate-300 rounded-md text-xs font-mono"
                    >
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: AI Injected Response (6 cols) */}
            <div className="lg:col-span-6 bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">Respuesta Inyectada en Easy Apply</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-[#0B0F17] px-2 py-0.5 rounded border border-slate-800">
                  Gemini Flash 2.0 RAG
                </span>
              </div>

              <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-2 text-xs">
                <span className="text-slate-400 font-semibold block">Pregunta del Reclutador:</span>
                <p className="text-white italic">
                  "¿Cuántos años de experiencia tienes liderando arquitecturas y cuál es tu disponibilidad?"
                </p>
                <div className="pt-2 border-t border-slate-800/80 space-y-1">
                  <span className="text-emerald-400 font-semibold block">Respuesta Verídica Generada:</span>
                  <p className="text-slate-300 font-mono leading-relaxed">{currentDemo.extractedAnswer}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Sin alucinaciones ni inventos</span>
                </span>

                <button
                  onClick={onEnterCandidateApp}
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Probar con mi propio CV</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works 3 Pillars (Abacus.ai architecture layout) */}
      <section id="como-funciona" className="py-20 bg-[#0B0F17] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
              Arquitectura & Metodología
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              ¿Cómo funciona NexusApply AI paso a paso?
            </h2>
            <p className="text-sm text-slate-400">
              Diseñado con ingeniería de prompts estricta, bases de datos relacionales PostgreSQL y automatización serverless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8 space-y-4 relative group hover:border-emerald-500/40 transition-all shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-white">Ingesta de tu CV & LinkedIn</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                El sistema lee tu archivo PDF o Word, identifica tus fortalezas técnicas, logros cuantificables y crea una plantilla inmutable de respuestas verídicas.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Extracción precisa de años y tecnologías</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Ajuste automático a formatos ATS</span>
                </li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8 space-y-4 relative group hover:border-sky-500/40 transition-all shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-white">Búsqueda Diaria a las 05:00 AM</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                El agente ejecuta búsquedas booleanas en LinkedIn Jobs, descartando vacantes ya postuladas mediante hashes criptográficos en PostgreSQL.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400" />
                  <span>Filtros salariales y de ubicación (Remoto/LATAM)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400" />
                  <span>Deduplicación automática anti-spam</span>
                </li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8 space-y-4 relative group hover:border-amber-500/40 transition-all shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-white">Postulación Autónoma & Reporte</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Completa los formularios Easy Apply, adjunta tu hoja de vida y te envía un informe diario en Markdown y Telegram con el resumen de vacantes aplicadas.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>100% Manos Libres (Piloto Automático)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>Reportes estructurados diarios</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table: Manual Job Search vs NexusApply AI */}
      <section id="ventajas" className="py-20 bg-[#070A11]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Comparativa de Rendimiento
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Búsqueda Manual Tradicional vs NexusApply AI
            </h2>
          </div>

          <div className="bg-[#111827] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-12 bg-[#0B0F17] p-4 text-xs font-bold text-slate-400 border-b border-slate-800 uppercase tracking-wider">
              <div className="col-span-5 sm:col-span-6">Característica</div>
              <div className="col-span-3 text-rose-400 text-center">Búsqueda Manual</div>
              <div className="col-span-4 sm:col-span-3 text-emerald-400 text-center">NexusApply AI</div>
            </div>

            <div className="divide-y divide-slate-800 text-xs">
              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-5 sm:col-span-6 font-semibold text-slate-200">
                  Tiempo invertido al día
                </div>
                <div className="col-span-3 text-center text-slate-400">3 a 4 horas / día</div>
                <div className="col-span-4 sm:col-span-3 text-center font-bold text-emerald-400">
                  0 minutos (Automático)
                </div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center bg-[#0B0F17]/40">
                <div className="col-span-5 sm:col-span-6 font-semibold text-slate-200">
                  Postulaciones enviadas por semana
                </div>
                <div className="col-span-3 text-center text-slate-400">10 a 20 vacantes</div>
                <div className="col-span-4 sm:col-span-3 text-center font-bold text-emerald-400">
                  70 a 140 vacantes calificadas
                </div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-5 sm:col-span-6 font-semibold text-slate-200">
                  Detección de duplicados
                </div>
                <div className="col-span-3 text-center text-slate-400">Manual (fácil confundirse)</div>
                <div className="col-span-4 sm:col-span-3 text-center font-bold text-emerald-400">
                  Base de Datos PostgreSQL (100% anti-duplicados)
                </div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center bg-[#0B0F17]/40">
                <div className="col-span-5 sm:col-span-6 font-semibold text-slate-200">
                  Respuestas técnicas ATS
                </div>
                <div className="col-span-3 text-center text-slate-400">Cansancio y copy-paste</div>
                <div className="col-span-4 sm:col-span-3 text-center font-bold text-emerald-400">
                  Optimizadas por Gemini con tu CV real
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (Commercialization Ready) */}
      <section id="precios" className="py-20 bg-[#0B0F17] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Planes Comerciales Simples
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Precios accesibles para conseguir empleo más rápido
            </h2>
            <p className="text-sm text-slate-400">
              Prueba sin costo y actualiza cuando quieras recibir más postulaciones diarias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Trial */}
            <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8 space-y-6 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prueba Gratuita</span>
                  <h3 className="text-2xl font-black text-white">Starter</h3>
                  <div className="pt-2">
                    <span className="text-4xl font-black text-white">$0</span>
                    <span className="text-xs text-slate-400 font-normal"> / gratis para siempre</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Ideal para probar cómo el agente extrae tus datos y realiza tus primeras postulaciones de prueba.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300 pt-3 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>5 Postulaciones de prueba</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Extracción inteligente de CV</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Detección de Match Score</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onEnterCandidateApp}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all cursor-pointer"
              >
                Comenzar Gratis
              </button>
            </div>

            {/* Pro Plan (Featured) */}
            <div className="bg-gradient-to-b from-[#111827] via-[#0F172A] to-[#111827] border-2 border-emerald-500 rounded-3xl p-8 space-y-6 flex flex-col justify-between shadow-2xl relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-[11px] rounded-full uppercase tracking-wider shadow-md">
                MÁS POPULAR • RECOMENDADO
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Plan Completo</span>
                  <h3 className="text-2xl font-black text-white">Pro Autopilot</h3>
                  <div className="pt-2">
                    <span className="text-4xl font-black text-emerald-400">$19</span>
                    <span className="text-xs text-slate-400 font-normal"> USD / mes</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Postulaciones automáticas diarias a las 05:00 AM para asegurar las mejores oportunidades antes que nadie.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300 pt-3 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span><strong>Hasta 150 postulaciones</strong> al mes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Rutina autónoma diaria (05:00 AM)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Reporte diario en Markdown y Telegram</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Deduplicación estricta anti-duplicados</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onEnterCandidateApp}
                className="w-full py-3.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
              >
                Activar Plan Pro Autopilot
              </button>
            </div>

            {/* Executive Plan */}
            <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8 space-y-6 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Máximo Alcance</span>
                  <h3 className="text-2xl font-black text-white">Executive VIP</h3>
                  <div className="pt-2">
                    <span className="text-4xl font-black text-white">$49</span>
                    <span className="text-xs text-slate-400 font-normal"> USD / mes</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Para ejecutivos y directores que buscan postulaciones ilimitadas y exportación a Google Sheets.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300 pt-3 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-400" />
                    <span><strong>Postulaciones Ilimitadas</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-400" />
                    <span>Sincronización a Google Sheets / Webhooks</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-400" />
                    <span>Soporte prioritario y acceso a panel Admin</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onEnterCandidateApp}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all cursor-pointer"
              >
                Elegir Plan Executive
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-[#070A11]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Dudas Resueltas
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Preguntas Frecuentes</h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: '¿Es seguro para mi cuenta de LinkedIn?',
                a: 'Sí, 100%. NexusApply AI no realiza scraping agresivo ni comportamientos sospechosos. Utiliza patrones de interacción humana, tiempos de espera realistas y respeta los límites de postulación para mantener tu perfil en óptimo estado.',
              },
              {
                q: '¿La IA inventa respuestas o datos en mi postulación?',
                a: 'No. El motor opera bajo una política de RAG estricto: solo utiliza los datos reales contenidos en tu hoja de vida y tu perfil de LinkedIn. Si una vacante requiere una información específica que no existe en tu CV, el sistema utiliza valores conservadores o te notifica.',
              },
              {
                q: '¿Necesito tener mi computadora encendida a las 05:00 AM?',
                a: 'No. El agente se ejecuta en la nube de forma serverless. Puedes apagar tu equipo y al despertar encontrarás tu reporte diario con las postulaciones enviadas.',
              },
              {
                q: '¿Qué formato debe tener mi hoja de vida?',
                a: 'Aceptamos PDF, Word (.docx) o texto plano (.txt). El sistema optimiza automáticamente las palabras clave para que coincidan con los filtros ATS de las empresas.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm font-bold text-white">{item.q}</span>
                  <ChevronRight
                    className={`w-4 h-4 text-emerald-400 transition-transform ${
                      activeFaq === idx ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Big Final Call to Action */}
      <section className="py-20 bg-gradient-to-b from-[#0B0F17] to-[#070A11] border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Flame className="w-4 h-4 text-emerald-400" />
            <span>Empieza hoy mismo</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Deja de buscar trabajo manualmente. <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Pon a tu Agente de IA a trabajar hoy.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Sube tu hoja de vida en 30 segundos y activa tu piloto automático sin costo.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onEnterCandidateApp}
              className="w-full sm:w-auto px-9 py-4 rounded-2xl text-sm font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-102 active:scale-98"
            >
              <Zap className="w-5 h-5 fill-slate-950" />
              <span>Ingresar a la Plataforma (Modo Simple)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#05070B] border-t border-slate-900 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">NexusApply AI</span>
            <span>•</span>
            <span>© 2026 Todos los derechos reservados.</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={onEnterAdminApp} className="hover:text-slate-300 cursor-pointer">
              Acceso Administrativo
            </button>
            <a href="#precios" className="hover:text-slate-300">
              Términos de Servicio
            </a>
            <a href="#faq" className="hover:text-slate-300">
              Privacidad de Datos
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
