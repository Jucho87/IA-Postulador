import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  ChevronDown,
  HelpCircle,
  Zap,
  Sliders,
  Globe,
  Activity,
  Database,
  User,
  Search,
  Bot,
  FileSpreadsheet,
  CreditCard,
  FileText,
  Terminal,
  CheckCircle2,
  X,
  Play,
  RefreshCw,
  Info
} from 'lucide-react';
import { LinkedInSessionState, UserAccount } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sessionState: LinkedInSessionState;
  onRunCycle: () => void;
  onCleanZombies: () => void;
  isRunning: boolean;
  onToggleSession: () => void;
  currentUser: UserAccount;
  onOpenAuthModal: () => void;
  userMode: 'candidate' | 'admin';
  setUserMode: (mode: 'candidate' | 'admin') => void;
  onGoToLanding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  sessionState,
  onRunCycle,
  onCleanZombies,
  isRunning,
  onToggleSession,
  currentUser,
  onOpenAuthModal,
  userMode,
  setUserMode,
  onGoToLanding,
}) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const adminTabs = [
    { id: 'dashboard', label: 'Monitor General', icon: Activity },
    { id: 'pipeline', label: 'Postulaciones & Ofertas', icon: Database },
    { id: 'profile', label: 'Perfil ATS Detallado', icon: User },
    { id: 'keywords', label: 'Keywords de Búsqueda', icon: Search },
    { id: 'aiform', label: 'Respuestas IA (Gemini)', icon: Bot },
    { id: 'integrations', label: 'Google Sheets / Telegram', icon: FileSpreadsheet },
    { id: 'pricing', label: 'Facturación & Saldo', icon: CreditCard },
    { id: 'reports', label: 'Reportes Diarios', icon: FileText },
    { id: 'db-playbook', label: 'Consola Base de Datos', icon: Terminal },
  ];

  return (
    <>
      <header className="bg-[#0B0F17]/95 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40 transition-all">
        {/* Simple & Clean Top Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3">
              <div
                onClick={onGoToLanding}
                className="flex items-center gap-3 cursor-pointer group"
                title="Volver a la portada de presentación"
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-sky-500 p-0.5 shadow-md shadow-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-[#0B0F17] rounded-[14px] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold tracking-tight text-white font-sans">
                      NexusApply
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                      AI COPILOT
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 block -mt-0.5">
                    Tu copiloto para encontrar empleo
                  </span>
                </div>
              </div>
            </div>

            {/* Middle: Friendly Status & Help (For Candidate Mode) */}
            <div className="hidden md:flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Asistente Activo & Conectado</span>
              </div>

              <button
                type="button"
                onClick={() => setIsHelpOpen(true)}
                className="flex items-center gap-1.5 text-slate-300 hover:text-white px-3 py-1.5 rounded-full bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                <span>¿Cómo funciona?</span>
              </button>
            </div>

            {/* Right: Actions, User Profile & Mode Switch */}
            <div className="flex items-center gap-3">
              {/* Public Landing Link */}
              {onGoToLanding && (
                <button
                  type="button"
                  onClick={onGoToLanding}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer"
                  title="Ver la página de presentación pública"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Portada</span>
                </button>
              )}

              {/* User Account Button */}
              <button
                id="navbar-user-sso-pill"
                type="button"
                onClick={onOpenAuthModal}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#161F30] hover:bg-slate-800 border border-slate-700 rounded-full transition-all cursor-pointer group shadow-sm text-xs"
                title="Ver tu cuenta o cambiar de plan"
              >
                <img
                  src={currentUser.photoURL || 'https://api.dicebear.com/7.x/bottts/svg'}
                  alt={currentUser.displayName}
                  className="w-5 h-5 rounded-full border border-slate-600 object-cover"
                />
                <span className="font-semibold text-slate-200 group-hover:text-white max-w-[110px] truncate">
                  {currentUser.displayName.split(' ')[0]}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-500/20 text-emerald-300">
                  {currentUser.plan === 'free' ? 'Gratis' : currentUser.plan.toUpperCase()}
                </span>
              </button>

              {/* Simple vs Admin Mode Toggle */}
              <div className="p-1 bg-[#161F30] border border-slate-800 rounded-2xl flex items-center text-xs">
                <button
                  type="button"
                  onClick={() => setUserMode('candidate')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    userMode === 'candidate'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Modo fácil e intuitivo para cualquier usuario"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Modo Fácil</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUserMode('admin')}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    userMode === 'admin'
                      ? 'bg-slate-800 text-white border border-slate-700 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Modo avanzado con acceso a base de datos, filtros técnicos y consola"
                >
                  <Sliders className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">Modo Avanzado</span>
                </button>
              </div>
            </div>
          </div>

          {/* Admin Navigation Tabs (Only visible when user explicitly switches to Admin Mode) */}
          {userMode === 'admin' && (
            <div className="pt-3 mt-3 border-t border-slate-800 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 text-xs text-slate-400">
                <span className="text-[11px] text-sky-400 font-semibold flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Panel de Control Avanzado (Base de Datos & Configuración Técnica)</span>
                </span>
                <button
                  onClick={() => setUserMode('candidate')}
                  className="text-[11px] text-slate-400 hover:text-emerald-400 underline cursor-pointer"
                >
                  Volver al Modo Fácil →
                </button>
              </div>
              <nav className="flex space-x-1.5 overflow-x-auto scrollbar-none pb-1">
                {adminTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      id={`tab-btn-${tab.id}`}
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-slate-800 text-white font-bold border border-slate-700 text-emerald-400 shadow-sm'
                          : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Friendly Help Modal "¿Cómo funciona?" */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">¿Cómo funciona NexusApply?</h3>
                  <p className="text-xs text-slate-400">Tu guía rápida en 3 pasos sencillos</p>
                </div>
              </div>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-slate-300">
              <div className="p-3.5 bg-[#0B0F17] rounded-2xl border border-slate-800 space-y-1">
                <strong className="text-white font-bold flex items-center gap-1.5 text-sm">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-black">1</span>
                  Sube tu Hoja de Vida una sola vez
                </strong>
                <p className="text-slate-400 pl-6 text-xs">
                  El sistema lee automáticamente tus años de experiencia, herramientas que dominas y educación para responder las preguntas de las empresas.
                </p>
              </div>

              <div className="p-3.5 bg-[#0B0F17] rounded-2xl border border-slate-800 space-y-1">
                <strong className="text-white font-bold flex items-center gap-1.5 text-sm">
                  <span className="w-5 h-5 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center text-xs font-black">2</span>
                  Elige qué trabajo buscas
                </strong>
                <p className="text-slate-400 pl-6 text-xs">
                  Indica el cargo deseado (ej: Tech Lead, Desarrollador, Gerente de Proyectos) y si prefieres trabajar 100% remoto o presencial.
                </p>
              </div>

              <div className="p-3.5 bg-[#0B0F17] rounded-2xl border border-slate-800 space-y-1">
                <strong className="text-white font-bold flex items-center gap-1.5 text-sm">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">3</span>
                  Presiona "Iniciar" y relájate
                </strong>
                <p className="text-slate-400 pl-6 text-xs">
                  El asistente busca las vacantes más afines en LinkedIn y completa las postulaciones por ti. Cuando un reclutador te seleccione, te contactará directamente a tu LinkedIn o correo.
                </p>
              </div>
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2.5 text-xs text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>100% seguro: Nunca inventamos datos y tus credenciales están protegidas.</span>
            </div>

            <button
              onClick={() => setIsHelpOpen(false)}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              ¡Entendido! Comenzar ahora
            </button>
          </div>
        </div>
      )}
    </>
  );
};
