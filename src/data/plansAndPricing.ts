import { PlanDetails, UserAccount, InvoiceItem, UsageMetric } from '../types';
import { CANDIDATE_PROFILE } from './candidateProfile';

export const SUBSCRIPTION_PLANS: PlanDetails[] = [
  {
    id: 'free',
    name: 'Starter Gratuito',
    badge: '$0 / Mes',
    priceMonthly: 0,
    priceYearly: 0,
    description: 'Para exploración manual y primeros pasos en automatización de empleo.',
    maxApplicationsPerMonth: 15,
    maxDailySearches: 2,
    supportTelegramAlerts: false,
    supportCronRunner: false,
    supportGoogleSheetsSync: true, // Manual sync
    supportMultiCv: false,
    geminiModelTier: 'Gemini 3.7 Flash (Standard Rate)',
    features: [
      '15 postulaciones Easy Apply al mes',
      '2 búsquedas con IA por día en LinkedIn',
      'Evaluación de compatibilidad ATS básica',
      'Sincronización manual a Google Sheets ($0)',
      'Exportación a Excel / CSV',
      'Soporte comunitario',
    ],
    cta: 'Plan Actual',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro Agent (Estilo OpenAI / Claude Pro)',
    badge: 'MÁS POPULAR',
    priceMonthly: 20,
    priceYearly: 190, // $15.8/mo
    description: 'El estándar para profesionales buscando empleo activo en piloto automático diario.',
    maxApplicationsPerMonth: 300,
    maxDailySearches: 20,
    supportTelegramAlerts: true,
    supportCronRunner: true,
    supportGoogleSheetsSync: true,
    supportMultiCv: false,
    geminiModelTier: 'Gemini 3.7 Flash + Thinking (Priority)',
    features: [
      '300 postulaciones Easy Apply al mes (~10/día)',
      'Búsqueda y deduplicación a las 05:00 AM (Bogotá)',
      'Cron Headless serverless con GitHub Actions ($0)',
      'Alertas instantáneas a Telegram y Discord',
      'Sincronización bidireccional automática con Google Sheets',
      'Autollenado dinámico de preguntas complejas con IA',
      'Garantía anti-duplicados por ID de vacante',
    ],
    cta: 'Suscribirse a Pro ($20/mes)',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Max / Enterprise (Estilo Abacus.AI)',
    badge: 'MÁXIMA POTENCIA',
    priceMonthly: 50,
    priceYearly: 480, // $40/mo
    description: 'Para headhunters, agencias de recolocación o candidatos con múltiples perfiles técnicos.',
    maxApplicationsPerMonth: 1500,
    maxDailySearches: 100,
    supportTelegramAlerts: true,
    supportCronRunner: true,
    supportGoogleSheetsSync: true,
    supportMultiCv: true,
    geminiModelTier: 'Gemini 3.7 Flash & Pro (Cluster Dedicado)',
    features: [
      '1,500 postulaciones mensuales (Multi-país & Latam)',
      'Gestión de múltiples hojas de vida y perfiles',
      'Generación de Cover Letters personalizadas por empresa',
      'Proxy residencial rotativo para navegación desatendida',
      'Integración con webhooks custom (Zapier, Make, n8n)',
      'Tableros de métricas en Google Looker Studio',
      'Soporte prioritario 1 a 1 por WhatsApp / Telegram',
    ],
    cta: 'Activar Plan Enterprise ($50/mes)',
    popular: false,
  },
];

export const PAY_AS_YOU_GO_RATES = {
  perApplication: 0.05, // $0.05 USD por postulación enviada
  perAtsScan: 0.01,       // $0.01 USD por evaluación de vacante
  perFormFillAi: 0.02,   // $0.02 USD por generación de respuestas complejas
  starterCreditsBonus: 5.00, // $5 USD gratis de bienvenida (= 100 postulaciones)
};

export const DEMO_USERS: UserAccount[] = [
  {
    uid: 'usr_monjsoza',
    email: 'monjsoza@gmail.com',
    displayName: 'Juan Carlos Soza Calderón',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    provider: 'google',
    plan: 'pro',
    planBillingCycle: 'monthly',
    planRenewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    creditBalance: 20.00,
    autoTopUp: true,
    monthlyApplicationsUsed: 0,
    monthlyApplicationsLimit: 300,
    totalTokensUsed: 0,
    joinedAt: new Date().toISOString(),
    candidateProfile: CANDIDATE_PROFILE,
  },
];

export const INITIAL_INVOICES: InvoiceItem[] = [];

export const INITIAL_USAGE_METRICS: UsageMetric[] = [];
