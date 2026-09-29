import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Zap,
  Check,
  Shield,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Download,
  Clock,
  RefreshCw,
  Sliders,
  DollarSign,
  AlertCircle,
  FileText,
  User,
  PlusCircle,
  CheckCircle2,
} from 'lucide-react';
import { UserAccount, PlanDetails, InvoiceItem, UsageMetric, PlanType } from '../types';
import { SUBSCRIPTION_PLANS, PAY_AS_YOU_GO_RATES } from '../data/plansAndPricing';

interface PricingAndBillingTabProps {
  currentUser: UserAccount;
  onUserUpdated: (user: UserAccount) => void;
  onShowToast: (text: string, type: 'success' | 'error' | 'info') => void;
  onOpenAuthModal: () => void;
}

export const PricingAndBillingTab: React.FC<PricingAndBillingTabProps> = ({
  currentUser,
  onUserUpdated,
  onShowToast,
  onOpenAuthModal,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [usageMetrics, setUsageMetrics] = useState<UsageMetric[]>([]);
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState<string | null>(null);
  const [isAddingCredits, setIsAddingCredits] = useState(false);
  const [customCreditAmount, setCustomCreditAmount] = useState<number>(25);

  // Load invoices and usage
  useEffect(() => {
    fetch('/api/billing/invoices')
      .then((res) => res.json())
      .then((data) => {
        if (data.invoices) setInvoices(data.invoices);
        if (data.usageMetrics) setUsageMetrics(data.usageMetrics);
      })
      .catch(() => {});
  }, [currentUser]);

  // Handle Subscribe to a Plan (Stripe checkout simulation)
  const handleSubscribe = async (planId: PlanType) => {
    setIsProcessingUpgrade(planId);
    try {
      const res = await fetch('/api/billing/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, billingCycle }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        onUserUpdated(data.user);
        onShowToast(data.message || `Plan ${planId.toUpperCase()} activado exitosamente`, 'success');
        // Refresh invoices
        fetch('/api/billing/invoices')
          .then((r) => r.json())
          .then((d) => {
            if (d.invoices) setInvoices(d.invoices);
          });
      } else {
        onShowToast(data.message || 'Error al procesar la suscripción', 'error');
      }
    } catch (err) {
      onShowToast('Error conectando con el servicio de facturación', 'error');
    } finally {
      setIsProcessingUpgrade(null);
    }
  };

  // Handle Add Pay-As-You-Go Credits
  const handleAddCredits = async (amount: number) => {
    setIsAddingCredits(true);
    try {
      const res = await fetch('/api/billing/topup-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (res.ok) {
        onUserUpdated({
          ...currentUser,
          creditBalance: data.creditBalance,
        });
        onShowToast(data.message, 'success');
        // Refresh invoices and metrics
        fetch('/api/billing/invoices')
          .then((r) => r.json())
          .then((d) => {
            if (d.invoices) setInvoices(d.invoices);
            if (d.usageMetrics) setUsageMetrics(d.usageMetrics);
          });
      } else {
        onShowToast(data.message || 'Error al recargar saldo', 'error');
      }
    } catch (err) {
      onShowToast('Error al procesar recarga', 'error');
    } finally {
      setIsAddingCredits(false);
    }
  };

  // Toggle Auto-Topup
  const handleToggleAutoTopup = async () => {
    const newState = !currentUser.autoTopUp;
    try {
      await fetch('/api/billing/toggle-auto-topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoTopUp: newState }),
      });
      onUserUpdated({ ...currentUser, autoTopUp: newState });
      onShowToast(
        newState ? 'Recarga automática de $10 USD activada al bajar de $2 USD' : 'Recarga automática desactivada',
        'info'
      );
    } catch (err) {
      onShowToast('Error al actualizar preferencia', 'error');
    }
  };

  // Percentage of applications used
  const usagePercent = Math.min(
    100,
    Math.round((currentUser.monthlyApplicationsUsed / (currentUser.monthlyApplicationsLimit || 1)) * 100)
  );

  return (
    <div className="space-y-8">
      {/* Current Plan & Wallet Summary Banner */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Suscripción Mensual & Pago por Uso • NexusApply SaaS</span>
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-full">
                Sesión: {currentUser.displayName}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1.5">
              Planes, Facturación & Saldo de Créditos
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Esquema transparente de tarifas mensuales y pago por consumo inspirado en OpenAI, Claude y Abacus.AI.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAuthModal}
              className="px-4 py-2.5 bg-[#0B0F17] hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <User className="w-4 h-4 text-sky-400" />
              <span>Gestionar Sesión / SSO</span>
            </button>

            <button
              onClick={() => handleAddCredits(25)}
              disabled={isAddingCredits}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Recargar $25 USD</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Summary Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
          {/* Card 1: Active Subscription */}
          <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4.5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="uppercase tracking-wider font-semibold text-[11px]">Plan Activo</span>
              <CreditCard className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              <span>{currentUser.plan.toUpperCase()}</span>
              <span className="text-xs font-normal text-slate-400">
                ({currentUser.planBillingCycle === 'yearly' ? 'Anual -20%' : 'Mensual'})
              </span>
            </div>
            <div className="text-xs text-slate-500">
              Renovación automática el {new Date(currentUser.planRenewsAt).toLocaleDateString('es-CO')}
            </div>
          </div>

          {/* Card 2: Applications quota */}
          <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4.5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="uppercase tracking-wider font-semibold text-[11px]">Postulaciones del Mes</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white flex items-center justify-between">
              <span>
                {currentUser.monthlyApplicationsUsed} / {currentUser.monthlyApplicationsLimit}
              </span>
              <span className="text-xs font-semibold text-emerald-400">{usagePercent}%</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${usagePercent}%` }}
              ></div>
            </div>
          </div>

          {/* Card 3: Pay-As-You-Go Wallet */}
          <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-4.5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="uppercase tracking-wider font-semibold text-[11px]">Billetera Pay-As-You-Go</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              ${currentUser.creditBalance.toFixed(2)} USD
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>~{Math.round(currentUser.creditBalance / PAY_AS_YOU_GO_RATES.perApplication)} postulaciones extra</span>
              <button
                onClick={handleToggleAutoTopup}
                className="text-sky-400 hover:underline cursor-pointer font-medium"
              >
                Auto-recarga: {currentUser.autoTopUp ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: SUBSCRIPTION PLANS (TIERS) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">Planes de Suscripción Mensual</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Elige el plan ideal según tu intensidad de búsqueda laboral y frecuencia de ejecuciones.
            </p>
          </div>

          {/* Billing Cycle Switch */}
          <div className="flex items-center gap-1.5 bg-[#111827] border border-slate-800 p-1.5 rounded-xl text-xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${
                billingCycle === 'monthly'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Facturación Mensual
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 font-semibold ${
                billingCycle === 'yearly'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Anual (Ahorra 20%)</span>
              <span className="px-1.5 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-bold rounded">20% OFF</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = currentUser.plan === plan.id;
            const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
            const pricePerMonthDisplay =
              billingCycle === 'yearly' && plan.priceYearly > 0
                ? (plan.priceYearly / 12).toFixed(1)
                : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                className={`relative bg-[#111827] border rounded-2xl p-6 flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/5'
                    : plan.popular
                    ? 'border-emerald-500/50 hover:border-emerald-400'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Plan header */}
                  <div className="border-b border-slate-800 pb-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-bold text-white">{plan.name}</h4>
                      {isCurrent && (
                        <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold rounded-full">
                          PLAN ACTUAL
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{plan.description}</p>
                  </div>

                  {/* Price display */}
                  <div className="py-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold text-white">${pricePerMonthDisplay}</span>
                      <span className="text-xs text-slate-400">USD / mes</span>
                    </div>
                    {billingCycle === 'yearly' && plan.priceYearly > 0 && (
                      <span className="text-xs text-emerald-400 font-medium">
                        Facturado anualmente (${plan.priceYearly} USD / año)
                      </span>
                    )}
                  </div>

                  {/* Model Tier & Specs */}
                  <div className="p-3.5 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-1.5 text-xs">
                    <div className="text-sky-400 font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{plan.geminiModelTier}</span>
                    </div>
                    <div className="text-slate-300">
                      • Hasta <strong className="text-white">{plan.maxApplicationsPerMonth}</strong> postulaciones/mes
                    </div>
                    <div className="text-slate-300">
                      • <strong className="text-white">{plan.maxDailySearches}</strong> búsquedas automáticas por día
                    </div>
                  </div>

                  {/* Features list */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
                      Incluye:
                    </span>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-6">
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isCurrent || isProcessingUpgrade === plan.id}
                    className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-[#0B0F17] hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {isProcessingUpgrade === plan.id ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Activando...</span>
                      </>
                    ) : isCurrent ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Plan Activo</span>
                      </>
                    ) : (
                      <span>{plan.cta}</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: PAY-AS-YOU-GO CREDITS WALLET */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>Micro-consumo Sin Compromiso Fijo</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              Esquema de Pago por Uso (Pay-As-You-Go)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Recarga saldo a demanda para enviar postulaciones adicionales cuando agotes tu cuota mensual.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Saldo disponible:</span>
            <span className="text-2xl font-bold text-emerald-400">
              ${currentUser.creditBalance.toFixed(2)} USD
            </span>
          </div>
        </div>

        {/* Rate Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-1.5">
            <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold block">Por Postulación Easy Apply</span>
            <div className="text-xl font-bold text-white">${PAY_AS_YOU_GO_RATES.perApplication.toFixed(2)} USD</div>
            <p className="text-xs text-slate-400">Incluye navegación headless, adjunto de CV y confirmación.</p>
          </div>

          <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-1.5">
            <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold block">Por Escaneo ATS con IA</span>
            <div className="text-xl font-bold text-white">${PAY_AS_YOU_GO_RATES.perAtsScan.toFixed(2)} USD</div>
            <p className="text-xs text-slate-400">Evaluación semántica de compatibilidad y filtro de keywords.</p>
          </div>

          <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-1.5">
            <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold block">Por Autollenado Complejo</span>
            <div className="text-xl font-bold text-white">${PAY_AS_YOU_GO_RATES.perFormFillAi.toFixed(2)} USD</div>
            <p className="text-xs text-slate-400">Generación de respuestas abiertas personalizadas con Gemini AI.</p>
          </div>
        </div>

        {/* Top-up Quick Buttons */}
        <div className="p-5 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-3">
          <span className="text-xs text-white font-semibold block">
            Selecciona un monto de recarga inmediata:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[10, 25, 50, 100].map((amt) => (
              <button
                key={amt}
                onClick={() => handleAddCredits(amt)}
                disabled={isAddingCredits}
                className="py-3.5 px-4 bg-[#111827] hover:bg-slate-800 border border-slate-700 hover:border-emerald-500 text-white rounded-xl text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-all"
              >
                <span className="text-base font-bold text-emerald-400">+${amt} USD</span>
                <span className="text-[11px] text-slate-400">
                  ~{Math.round(amt / PAY_AS_YOU_GO_RATES.perApplication)} postulaciones
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: INVOICES & USAGE AUDIT HISTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoices Table */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs uppercase tracking-wider text-white font-bold">
                Historial de Facturación & Recibos
              </h4>
            </div>
            <span className="text-xs text-slate-400">{invoices.length} facturas</span>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-xl max-h-72 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B0F17] text-slate-400 border-b border-slate-800 sticky top-0 font-semibold">
                <tr>
                  <th className="p-3">Factura ID</th>
                  <th className="p-3">Fecha</th>
                  <th className="p-3">Concepto</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/30">
                    <td className="p-3 font-semibold text-white">{inv.id}</td>
                    <td className="p-3 text-slate-400">{inv.date}</td>
                    <td className="p-3 text-xs max-w-[160px] truncate">{inv.planOrItem}</td>
                    <td className="p-3 text-emerald-400 font-bold">${inv.amount.toFixed(2)}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-md text-[11px] font-semibold">
                        {inv.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Usage Audit Logs */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs uppercase tracking-wider text-white font-bold">
                Desglose de Consumo en Tiempo Real
              </h4>
            </div>
            <span className="text-xs font-semibold text-emerald-400">En vivo</span>
          </div>

          <div className="overflow-y-auto max-h-72 space-y-2.5 pr-1 text-xs">
            {usageMetrics.map((metric) => (
              <div
                key={metric.id}
                className="p-3 bg-[#0B0F17] border border-slate-800 rounded-xl flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-white text-xs font-medium">{metric.description}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {metric.timestamp} {metric.company ? `• ${metric.company}` : ''}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold text-emerald-400">
                    {metric.cost > 0 ? `-$${metric.cost.toFixed(2)}` : 'GRATIS ($0)'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
