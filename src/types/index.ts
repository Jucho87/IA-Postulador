export type ApplicationState = 'postulado' | 'no_postulado' | 'omitido_duplicado' | 'error';

export type LinkedInSessionState = 'activa' | 'sesion_cerrada' | 'captcha_bloqueo';

export type JobReviewStatus = 'pendiente' | 'aprobada' | 'descartada' | 'postulada';

export interface CandidateProfile {
  id?: string;
  nombre: string;
  titular?: string;
  ubicacion: string;
  telefono: string;
  email: string;
  linkedinUrl: string;
  resumenProfesional: string;
  rolesObjetivo: string[];
  keywordsPrincipales: string[];
  keywordsAmpliadas: string[];
  aptitudesPrincipales?: {
    gestionYProyectos: string[];
    gerenciaDatosYBases: string[];
    infraDevOps: string[];
  };
  habilidades: {
    cloud: string[];
    basesDeDatos: string[];
    etlYDatos: string[];
    gestionYSeguridad: string[];
    metodologias: string[];
  };
  experiencia: {
    empresa: string;
    cargo: string;
    periodo: string;
    destacados?: string[];
  }[];
  trayectoriaAnterior?: {
    categoria: string;
    empresas: string;
  }[];
  educacion: {
    titulo: string;
    institucion: string;
    anio?: number;
    periodo?: string;
  }[];
  certificaciones: string[];
  certificacionesDetalle?: {
    nombre: string;
    emisor?: string;
  }[];
  preferencias: {
    ubicacion: string;
    modalidad: string;
    nivelExperiencia: string;
    salarioMin: number;
    salarioMax: number;
    salarioMoneda: string;
    autorizacionColombia: boolean;
    disponibilidad: string;
    idiomas: { idioma: string; nivel: string }[];
  };
  cvFile?: {
    nombre: string;
    ruta: string;
    tamanio: string;
    tipo: string;
  };
  formTemplates?: FormAnswerTemplate[];
}

export interface JobMatchItem {
  id: string;
  linkedin_job_id: string;
  job_url: string;
  titulo: string;
  empresa: string;
  ubicacion: string;
  modalidad?: 'Presencial' | 'Híbrido' | 'Remoto';
  keyword_busqueda: string;
  fecha_publicacion: string;
  es_easy_apply: boolean;
  descripcion: string;
  match_score: number;
  match_level: 'Excelente' | 'Alto' | 'Medio' | 'Bajo';
  analisis_compatibilidad: string;
  fortalezas_coincidentes: string[];
  requisitos_faltantes: string[];
  recomendacion: 'Postular con Easy Apply' | 'Revisar Detalle' | 'Descartar';
  direct_search_url?: string;
  estado_revision: JobReviewStatus;
  notas_usuario?: string;
}

export interface OfertaDB {
  id: number;
  linkedin_job_id: string;
  job_url: string;
  titulo: string;
  empresa: string;
  ubicacion: string;
  keyword_busqueda: string;
  fecha_deteccion: string;
  fecha_publicacion: string;
  es_easy_apply: boolean;
  descripcion?: string;
  match_score?: number;
  estado_revision?: JobReviewStatus;
  fuente?: string;
  is_live_external?: boolean;
  linkedin_direct_url?: string;
}

export interface PostulacionDB {
  id: number;
  oferta_id: number;
  linkedin_job_id: string;
  estado: ApplicationState;
  motivo_error: string | null;
  fecha_postulacion: string;
  datos_formulario?: {
    nombre: string;
    email: string;
    telefono: string;
    anios_experiencia: number;
    cv_adjunto: string;
    respuestas_clave?: Record<string, string>;
  };
}

export interface EjecucionDB {
  id: number;
  fecha_ejecucion: string;
  total_ofertas_encontradas: number;
  total_postulaciones_exitosas: number;
  total_omitidas_duplicadas: number;
  total_no_postuladas: number;
  total_errores: number;
  notas: string;
  estado_sesion: LinkedInSessionState;
  duracion_segundos: number;
  keywords_ejecutadas: string[];
}

export interface ExecutionStepLog {
  stepNumber: number;
  title: string;
  timestamp: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'warning';
  message: string;
  details?: string[];
}

export interface DailyReportSummary {
  id: string;
  filename: string;
  fecha: string;
  candidato: string;
  estado_ejecucion: string;
  total_encontradas: number;
  total_postuladas: number;
  total_omitidas: number;
  total_errores: number;
  markdownContent: string;
}

export interface FormAnswerTemplate {
  pregunta: string;
  categoria: string;
  respuesta_es: string;
  respuesta_en: string;
  regla: string;
}

export interface GoogleSheetsConfig {
  webhookUrl: string;
  sheetUrl?: string;
  autoSync: boolean;
  lastSync?: string;
  status: 'connected' | 'unconfigured' | 'error';
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  enabled: boolean;
  notifyOnHighMatch: boolean;
  notifyOnDailySummary: boolean;
  notifyOnSessionError: boolean;
}

export interface DiscordConfig {
  webhookUrl: string;
  enabled: boolean;
  notifyOnHighMatch: boolean;
  notifyOnDailySummary: boolean;
}

export interface ZeroCostIntegrationsState {
  sheets: GoogleSheetsConfig;
  telegram: TelegramConfig;
  discord: DiscordConfig;
  githubActions: {
    cronSchedule: string;
    timezone: string;
    autoRunEnabled: boolean;
  };
}

export type PlanType = 'free' | 'pro' | 'enterprise';

export interface PlanDetails {
  id: PlanType;
  name: string;
  badge: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  maxApplicationsPerMonth: number;
  maxDailySearches: number;
  supportTelegramAlerts: boolean;
  supportCronRunner: boolean;
  supportGoogleSheetsSync: boolean;
  supportMultiCv: boolean;
  geminiModelTier: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

export interface UserAccount {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: 'google' | 'linkedin' | 'password';
  plan: PlanType;
  planBillingCycle: 'monthly' | 'yearly';
  planRenewsAt: string;
  creditBalance: number; // in USD or credits ($1 = 20 applications)
  autoTopUp: boolean;
  monthlyApplicationsUsed: number;
  monthlyApplicationsLimit: number;
  totalTokensUsed: number;
  joinedAt: string;
  candidateProfile?: CandidateProfile;
}

export interface UsageMetric {
  id: string;
  userId: string;
  type: 'easy_apply' | 'ats_scan' | 'gemini_form_fill' | 'sheets_sync';
  description: string;
  cost: number;
  timestamp: string;
  jobTitle?: string;
  company?: string;
}

export interface InvoiceItem {
  id: string;
  date: string;
  amount: number;
  planOrItem: string;
  status: 'paid' | 'pending' | 'failed';
  invoicePdfUrl?: string;
}


