import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { Navbar } from './components/Navbar';
import { SimpleCandidateView } from './components/SimpleCandidateView';
import { DashboardTab } from './components/DashboardTab';
import { CandidateProfileTab } from './components/CandidateProfileTab';
import { KeywordsTab } from './components/KeywordsTab';
import { PipelineTab } from './components/PipelineTab';
import { AiFormFillerTab } from './components/AiFormFillerTab';
import { ZeroCostIntegrationsTab } from './components/ZeroCostIntegrationsTab';
import { PricingAndBillingTab } from './components/PricingAndBillingTab';
import { AuthModal } from './components/AuthModal';
import { ReportsTab } from './components/ReportsTab';
import { DatabasePlaybookTab } from './components/DatabasePlaybookTab';
import { ExecutionModal } from './components/ExecutionModal';
import { JobDetailModal } from './components/JobDetailModal';
import { CANDIDATE_PROFILE, FORM_ANSWER_TEMPLATES } from './data/candidateProfile';
import { INITIAL_OFERTAS, INITIAL_POSTULACIONES, INITIAL_EJECUCIONES } from './data/mockDatabase';
import { DEMO_USERS } from './data/plansAndPricing';
import { OfertaDB, PostulacionDB, EjecucionDB, LinkedInSessionState, CandidateProfile, UserAccount } from './types';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [userMode, setUserMode] = useState<'candidate' | 'admin'>('candidate');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sessionState, setSessionState] = useState<LinkedInSessionState>('activa');
  const [activeProfile, setActiveProfile] = useState<CandidateProfile>(CANDIDATE_PROFILE);
  const [ofertas, setOfertas] = useState<OfertaDB[]>(INITIAL_OFERTAS);
  const [postulaciones, setPostulaciones] = useState<PostulacionDB[]>(INITIAL_POSTULACIONES);
  const [ejecuciones, setEjecuciones] = useState<EjecucionDB[]>(INITIAL_EJECUCIONES);
  const [selectedJob, setSelectedJob] = useState<OfertaDB | null>(null);

  // User Authentication & Multi-tenant State
  const [currentUser, setCurrentUser] = useState<UserAccount>(DEMO_USERS[0]);
  const [allUsers, setAllUsers] = useState<UserAccount[]>(DEMO_USERS);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Execution modal state
  const [isExecutionModalOpen, setIsExecutionModalOpen] = useState(false);
  const [isRunningCycle, setIsRunningCycle] = useState(false);
  const [executionSteps, setExecutionSteps] = useState<any[]>([]);
  const [executionResult, setExecutionResult] = useState<any>(null);


  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync state with server
  const refreshData = async () => {
    try {
      const [statusRes, tablesRes, userRes] = await Promise.all([
        fetch('/api/status'),
        fetch('/api/database/tables'),
        fetch('/api/auth/current-user'),
      ]);

      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setSessionState(statusData.sessionState || 'activa');
      }

      if (tablesRes.ok) {
        const tablesData = await tablesRes.json();
        if (tablesData.ofertas) setOfertas(tablesData.ofertas);
        if (tablesData.postulaciones) setPostulaciones(tablesData.postulaciones);
        if (tablesData.ejecuciones) setEjecuciones(tablesData.ejecuciones);
      }

      if (userRes.ok) {
        const userData = await userRes.json();
        if (userData.user) setCurrentUser(userData.user);
        if (userData.allUsers) setAllUsers(userData.allUsers);
      }
    } catch (err) {
      console.warn('Using local fallback state:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Update job review status
  const handleUpdateJobReviewStatus = async (
    jobId: string | number,
    newStatus: 'pendiente' | 'aprobada' | 'descartada'
  ) => {
    try {
      setOfertas((prev) =>
        prev.map((job) =>
          job.id === Number(jobId) || job.linkedin_job_id === String(jobId)
            ? { ...job, estado_revision: newStatus }
            : job
        )
      );

      await fetch('/api/jobs/update-review-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, newStatus }),
      });

      showToast(
        newStatus === 'aprobada'
          ? '✓ Puesto aprobado para postulación automática'
          : newStatus === 'descartada'
          ? 'Puesto marcado como descartado'
          : 'Puesto marcado como pendiente',
        newStatus === 'aprobada' ? 'success' : 'info'
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Run automation cycle for approved jobs or standard daily routine
  const handleRunDailyCycle = async () => {
    setIsRunningCycle(true);
    setIsExecutionModalOpen(true);
    setExecutionResult(null);

    setExecutionSteps([
      {
        step: 1,
        name: 'Preparando tu Perfil y Hoja de Vida',
        status: 'running',
        message: `Cargando el currículum de ${activeProfile.nombre} e iniciando navegación segura...`,
        details: [`Candidato activo: ${activeProfile.nombre}`, 'Entorno de navegación seguro inicializado'],
      },
      {
        step: 2,
        name: 'Verificando Postulaciones Previas',
        status: 'pending',
        message: 'Comprobando empresas donde ya te has postulado para evitar duplicados...',
        details: ['Protección anti-duplicados activada'],
      },
      {
        step: 3,
        name: 'Conectando con LinkedIn',
        status: 'pending',
        message: 'Verificando conexión segura con LinkedIn Jobs...',
        details: ['Acceso autorizado a vacantes activas'],
      },
      {
        step: 4,
        name: 'Buscando Vacantes para tu Perfil',
        status: 'pending',
        message: `Consultando ofertas para ${activeProfile.rolesObjetivo?.[0] || 'tus cargos objetivo'}...`,
        details: ['Filtros: Easy Apply, Colombia & Remoto'],
      },
      {
        step: 5,
        name: 'Evaluando Afinidad y Requisitos',
        status: 'pending',
        message: 'Comparando requisitos de las empresas con tu experiencia...',
        details: ['Calculando porcentaje de coincidencia con tu CV'],
      },
      {
        step: 6,
        name: 'Completando Postulaciones Easy Apply',
        status: 'pending',
        message: `Respondiendo preguntas de los reclutadores con datos verídicos de ${activeProfile.nombre}...`,
        details: ['Formularios completados con precisión'],
      },
      {
        step: 7,
        name: 'Registrando Tus Postulaciones',
        status: 'pending',
        message: 'Guardando los puestos aplicados en tu historial personal...',
        details: ['Historial sincronizado'],
      },
      {
        step: 8,
        name: 'Resumen Diario Listo',
        status: 'pending',
        message: 'Resumen generado y listo para que lo revises...',
        details: ['Proceso completado con éxito'],
      },
    ]);

    try {
      const res = await fetch('/api/automation/run-cycle', { method: 'POST' });
      if (!res.ok) {
        throw new Error(`Error en el servidor (${res.status})`);
      }
      const data = await res.json();
      setExecutionResult(data);

      if (data.steps && data.steps.length > 0) {
        setExecutionSteps(data.steps);
      }

      await refreshData();

      if (data.success) {
        showToast(`Corrida diaria finalizada y registrada para ${activeProfile.nombre}`, 'success');
      } else {
        showToast(data.message || 'Corrida abortada por seguridad', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error en la conexión con el motor de automatización', 'error');
    } finally {
      setIsRunningCycle(false);
    }
  };

  // Apply to approved jobs specifically
  const handleApplyApprovedJobs = (approvedJobs: OfertaDB[]) => {
    showToast(`Iniciando postulación a ${approvedJobs.length} puestos aprobados por el usuario...`, 'info');
    handleRunDailyCycle();
  };

  // Clean Chrome Zombies
  const handleCleanZombies = async () => {
    try {
      const res = await fetch('/api/automation/clean-zombies', { method: 'POST' });
      if (!res.ok) throw new Error('Error ejecutando limpieza');
      const data = await res.json();
      showToast(data.message || 'Procesos zombie limpiados correctamente', 'success');
    } catch (err) {
      showToast('Comando de limpieza ejecutado', 'info');
    }
  };

  // Toggle Session state
  const handleToggleSession = async () => {
    try {
      const res = await fetch('/api/session/toggle', { method: 'POST' });
      if (!res.ok) throw new Error('Error alternando sesión');
      const data = await res.json();
      setSessionState(data.sessionState);
      showToast(
        data.sessionState === 'activa'
          ? 'Sesión de LinkedIn marcada como ACTIVA'
          : 'Sesión de LinkedIn marcada como CERRADA (/login)',
        data.sessionState === 'activa' ? 'success' : 'info'
      );
    } catch (err) {
      const newState = sessionState === 'activa' ? 'sesion_cerrada' : 'activa';
      setSessionState(newState);
      showToast(`Estado de sesión alternado a: ${newState}`, 'info');
    }
  };

  // Reset DB
  const handleResetDb = async () => {
    if (!window.confirm('¿Deseas restaurar la base de datos a su estado inicial de prueba?')) return;
    try {
      const res = await fetch('/api/database/reset', { method: 'POST' });
      if (!res.ok) throw new Error('Error restaurando base de datos');
      const data = await res.json();
      await refreshData();
      showToast(data.message || 'Base de datos restaurada', 'success');
    } catch (err) {
      showToast('Error restaurando base de datos', 'error');
    }
  };

  if (viewMode === 'landing') {
    return (
      <div className="min-h-screen bg-[#070A11] text-slate-100 font-sans">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div
              className={`flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-2xl border text-xs font-semibold ${
                toastMessage.type === 'success'
                  ? 'bg-[#0A0A0A] border-emerald-600/60 text-emerald-400'
                  : toastMessage.type === 'error'
                  ? 'bg-[#0A0A0A] border-rose-600/60 text-rose-400'
                  : 'bg-[#0A0A0A] border-[#0077B5]/60 text-[#00A3FF]'
              }`}
            >
              {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#00FF41]" />}
              {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
              {toastMessage.type === 'info' && <Info className="w-4 h-4 text-[#00A3FF]" />}
              <span className="font-mono text-[11px]">{toastMessage.text}</span>
            </div>
          </div>
        )}

        <LandingPage
          profile={activeProfile}
          onEnterCandidateApp={() => {
            setUserMode('candidate');
            setViewMode('app');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onEnterAdminApp={() => {
            setUserMode('admin');
            setViewMode('app');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-200 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-2xl border text-xs font-semibold ${
              toastMessage.type === 'success'
                ? 'bg-[#0A0A0A] border-emerald-600/60 text-emerald-400'
                : toastMessage.type === 'error'
                ? 'bg-[#0A0A0A] border-rose-600/60 text-rose-400'
                : 'bg-[#0A0A0A] border-[#0077B5]/60 text-[#00A3FF]'
            }`}
          >
            {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#00FF41]" />}
            {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            {toastMessage.type === 'info' && <Info className="w-4 h-4 text-[#00A3FF]" />}
            <span className="font-mono text-[11px]">{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sessionState={sessionState}
        onRunCycle={handleRunDailyCycle}
        onCleanZombies={handleCleanZombies}
        isRunning={isRunningCycle}
        onToggleSession={handleToggleSession}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        userMode={userMode}
        setUserMode={setUserMode}
        onGoToLanding={() => {
          setViewMode('landing');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {userMode === 'candidate' ? (
          <SimpleCandidateView
            profile={activeProfile}
            onUpdateProfile={(newProfile) => {
              setActiveProfile(newProfile);
              showToast(`Perfil de ${newProfile.nombre} actualizado`, 'success');
            }}
            ofertas={ofertas}
            postulaciones={postulaciones}
            sessionState={sessionState}
            onRunCycle={handleRunDailyCycle}
            isRunning={isRunningCycle}
            onSelectJob={(job) => setSelectedJob(job)}
            onSwitchToAdmin={() => setUserMode('admin')}
            onShowToast={showToast}
            onRefreshData={refreshData}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardTab
                ofertas={ofertas}
                postulaciones={postulaciones}
                ejecuciones={ejecuciones}
                sessionState={sessionState}
                onRunCycle={handleRunDailyCycle}
                isRunning={isRunningCycle}
                onSelectJob={(job) => setSelectedJob(job)}
                onViewReports={() => setActiveTab('reports')}
                onViewPipeline={() => setActiveTab('pipeline')}
              />
            )}

            {activeTab === 'pipeline' && (
              <PipelineTab
                ofertas={ofertas}
                postulaciones={postulaciones}
                onSelectJob={(job) => setSelectedJob(job)}
                onRefresh={refreshData}
              />
            )}

            {activeTab === 'profile' && (
              <CandidateProfileTab
                profile={activeProfile}
                formTemplates={FORM_ANSWER_TEMPLATES}
                onUpdateProfile={(newProfile) => {
                  setActiveProfile(newProfile);
                  showToast(`Perfil de ${newProfile.nombre} activado para búsquedas y postulaciones`, 'success');
                }}
                onResetProfile={() => {
                  setActiveProfile(CANDIDATE_PROFILE);
                  showToast('Perfil restaurado a Juan Carlos Soza Calderón', 'info');
                }}
              />
            )}

            {activeTab === 'keywords' && (
              <KeywordsTab
                profile={activeProfile}
                ofertas={ofertas}
                onSelectJob={(job) => setSelectedJob(job)}
                onUpdateJobReviewStatus={handleUpdateJobReviewStatus}
                onApplyApprovedJobs={handleApplyApprovedJobs}
              />
            )}

            {activeTab === 'aiform' && <AiFormFillerTab profile={activeProfile} />}

            {activeTab === 'integrations' && (
              <ZeroCostIntegrationsTab
                ofertas={ofertas}
                postulaciones={postulaciones}
                ejecuciones={ejecuciones}
                profile={activeProfile}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'pricing' && (
              <PricingAndBillingTab
                currentUser={currentUser}
                onUserUpdated={(u) => setCurrentUser(u)}
                onShowToast={showToast}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
              />
            )}

            {activeTab === 'reports' && <ReportsTab onRefresh={refreshData} />}

            {activeTab === 'db-playbook' && <DatabasePlaybookTab onResetDb={handleResetDb} />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0F172A]/70 border-t border-slate-800/80 py-5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-200">NexusApply AI Agent</span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-400">
              Candidato Activo:{' '}
              <strong className="text-emerald-400 font-semibold">{activeProfile.nombre}</strong>
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Evaluación ATS Gemini 3.7</span>
            <span className="text-slate-700">•</span>
            <span>Rutina Diaria 05:00 AM (Bogotá)</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        allUsers={allUsers}
        onUserChanged={(u) => {
          setCurrentUser(u);
          // Also fetch updated allUsers list
          fetch('/api/auth/current-user')
            .then((r) => r.json())
            .then((d) => {
              if (d.allUsers) setAllUsers(d.allUsers);
            });
        }}
        onShowToast={showToast}
      />

      <ExecutionModal
        isOpen={isExecutionModalOpen}
        onClose={() => setIsExecutionModalOpen(false)}
        isRunning={isRunningCycle}
        steps={executionSteps}
        executionResult={executionResult}
        onViewReport={() => {
          setIsExecutionModalOpen(false);
          setActiveTab('reports');
        }}
      />

      <JobDetailModal
        job={selectedJob}
        postulaciones={postulaciones}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
}
