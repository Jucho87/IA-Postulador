import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Send,
  Bell,
  Code2,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Download,
  Terminal,
  BarChart3,
  Sliders,
  Sparkles,
  Info,
  HelpCircle,
} from 'lucide-react';
import { OfertaDB, PostulacionDB, EjecucionDB, CandidateProfile } from '../types';

interface ZeroCostIntegrationsTabProps {
  ofertas: OfertaDB[];
  postulaciones: PostulacionDB[];
  ejecuciones: EjecucionDB[];
  profile: CandidateProfile;
  onShowToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const ZeroCostIntegrationsTab: React.FC<ZeroCostIntegrationsTabProps> = ({
  ofertas,
  postulaciones,
  ejecuciones,
  profile,
  onShowToast,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'sheets' | 'telegram' | 'github' | 'looker'>('sheets');

  // Google Sheets state
  const [sheetsWebhookUrl, setSheetsWebhookUrl] = useState('');
  const [sheetsUrl, setSheetsUrl] = useState('https://docs.google.com/spreadsheets/d/1_LINKEDIN_AGENT_SAMPLE_DB/edit');
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [appsScriptCode, setAppsScriptCode] = useState<string>('');
  const [showAppsScriptModal, setShowAppsScriptModal] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [previewSheetTab, setPreviewSheetTab] = useState<'ofertas' | 'postulaciones' | 'candidatos' | 'logs'>('ofertas');

  // Telegram state
  const [telegramToken, setTelegramToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [notifyOnHighMatch, setNotifyOnHighMatch] = useState(true);
  const [notifyOnDailySummary, setNotifyOnDailySummary] = useState(true);
  const [notifyOnSessionError, setNotifyOnSessionError] = useState(true);
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [telegramTestResult, setTelegramTestResult] = useState<string | null>(null);

  // Discord state
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState('');
  const [isTestingDiscord, setIsTestingDiscord] = useState(false);

  // GitHub Actions state
  const [workflowYaml, setWorkflowYaml] = useState<string>('');
  const [copiedYaml, setCopiedYaml] = useState(false);

  // Load configs & templates
  useEffect(() => {
    fetch('/api/integrations/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.sheets?.webhookUrl) setSheetsWebhookUrl(data.sheets.webhookUrl);
        if (data.sheets?.lastSync) setLastSyncTime(data.sheets.lastSync);
        if (data.telegram?.botToken) setTelegramToken(data.telegram.botToken);
        if (data.telegram?.chatId) setTelegramChatId(data.telegram.chatId);
        if (data.discord?.webhookUrl) setDiscordWebhookUrl(data.discord.webhookUrl);
      })
      .catch(() => {});

    fetch('/api/sheets/apps-script-code')
      .then((res) => res.json())
      .then((data) => setAppsScriptCode(data.scriptCode))
      .catch(() => {});

    fetch('/api/github-actions/workflow-yaml')
      .then((res) => res.json())
      .then((data) => setWorkflowYaml(data.yamlCode))
      .catch(() => {});
  }, []);

  // Sync to Google Sheets
  const handleSyncToSheets = async () => {
    setIsSyncingSheets(true);
    try {
      const res = await fetch('/api/sheets/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl: sheetsWebhookUrl, profile }),
      });
      const data = await res.json();
      if (res.ok) {
        setLastSyncTime(new Date().toLocaleTimeString('es-CO'));
        onShowToast(`✓ Sincronizado a Google Sheets ($0): ${data.rowsSynced?.ofertas || 0} ofertas, ${data.rowsSynced?.postulaciones || 0} postulaciones`, 'success');
      } else {
        onShowToast('Error al sincronizar con Google Sheets', 'error');
      }
    } catch (err) {
      onShowToast('Error en la conexión con el conector de Google Sheets', 'error');
    } finally {
      setIsSyncingSheets(false);
    }
  };

  // Save Settings
  const handleSaveConfigs = async () => {
    try {
      await fetch('/api/integrations/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheets: { webhookUrl: sheetsWebhookUrl, autoSync: true },
          telegram: {
            botToken: telegramToken,
            chatId: telegramChatId,
            enabled: Boolean(telegramToken && telegramChatId),
            notifyOnHighMatch,
            notifyOnDailySummary,
            notifyOnSessionError,
          },
          discord: { webhookUrl: discordWebhookUrl, enabled: Boolean(discordWebhookUrl) },
        }),
      });
      onShowToast('Configuración de integraciones guardada con éxito', 'success');
    } catch (err) {
      onShowToast('Error guardando configuración', 'error');
    }
  };

  // Test Telegram
  const handleTestTelegram = async () => {
    setIsTestingTelegram(true);
    setTelegramTestResult(null);
    try {
      const res = await fetch('/api/notifications/test-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken: telegramToken, chatId: telegramChatId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTelegramTestResult(data.message);
        onShowToast(data.message, 'success');
      } else {
        setTelegramTestResult(`Error: ${data.message}`);
        onShowToast(data.message, 'error');
      }
    } catch (err) {
      setTelegramTestResult('Error conectando con la API de Telegram');
      onShowToast('Error al enviar mensaje de Telegram', 'error');
    } finally {
      setIsTestingTelegram(false);
    }
  };

  // Download CSV
  const handleDownloadCsv = (type: 'ofertas' | 'postulaciones') => {
    let headers: string[] = [];
    let rows: string[][] = [];

    if (type === 'ofertas') {
      headers = ['ID', 'LinkedIn_ID', 'Titulo', 'Empresa', 'Ubicacion', 'Keyword', 'Match_Score', 'Easy_Apply', 'Estado_Revision', 'Enlace'];
      rows = ofertas.map((o) => [
        String(o.id),
        o.linkedin_job_id,
        `"${o.titulo.replace(/"/g, '""')}"`,
        `"${o.empresa.replace(/"/g, '""')}"`,
        `"${o.ubicacion.replace(/"/g, '""')}"`,
        `"${o.keyword_busqueda}"`,
        String(o.match_score || 85),
        o.es_easy_apply ? 'SI' : 'NO',
        o.estado_revision || 'pendiente',
        o.job_url || '',
      ]);
    } else {
      headers = ['ID_Postulacion', 'ID_Oferta', 'LinkedIn_Job_ID', 'Estado', 'Fecha_Postulacion', 'CV_Adjunto', 'Anios_Experiencia'];
      rows = postulaciones.map((p) => [
        String(p.id),
        String(p.oferta_id),
        p.linkedin_job_id,
        p.estado,
        p.fecha_postulacion,
        p.datos_formulario?.cv_adjunto || 'Hoja_de_vida_ATS.pdf',
        String(p.datos_formulario?.anios_experiencia || 15),
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `linkedin_${type}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast(`Archivo CSV de ${type} descargado`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Banner Superior de Costo Cero */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>Arquitectura Serverless • Operación $0 USD / Mes</span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Integraciones Gratuitas (Google Sheets, Telegram & GitHub Actions)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Almacena datos, recibe alertas al celular y programa ejecuciones automáticas sin pagar bases de datos ni servidores.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="sync-sheets-btn-top"
              onClick={handleSyncToSheets}
              disabled={isSyncingSheets}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-500/20"
            >
              {isSyncingSheets ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Sincronizando...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Sincronizar Google Sheets ($0)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex items-center gap-2 pt-4 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveSubTab('sheets')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'sheets'
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                : 'bg-[#0B0F17] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>1. Google Sheets (Base de Datos $0)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('telegram')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'telegram'
                ? 'bg-sky-500/20 border-sky-500/50 text-sky-300 shadow-sm'
                : 'bg-[#0B0F17] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <Bell className="w-4 h-4 text-sky-400" />
            <span>2. Telegram & Discord (Alertas al Celular)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('github')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'github'
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-sm'
                : 'bg-[#0B0F17] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>3. GitHub Actions (Cron 05:00 AM $0)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('looker')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'looker'
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm'
                : 'bg-[#0B0F17] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>4. Looker Studio (Dashboard Gráfico $0)</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: GOOGLE SHEETS AS DATABASE */}
      {activeSubTab === 'sheets' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Webhook Config & Guide */}
            <div className="lg:col-span-1 bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs uppercase tracking-wider text-slate-300 font-bold">
                  Conexión con Google Sheets
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 text-[11px] uppercase tracking-wider mb-1.5 font-semibold">
                    Google Apps Script Webhook URL:
                  </label>
                  <input
                    type="url"
                    value={sheetsWebhookUrl}
                    onChange={(e) => setSheetsWebhookUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    className="w-full px-3.5 py-2.5 bg-[#0B0F17] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400"
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Copia y pega la URL de la aplicación web que creaste con Google Apps Script.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setShowAppsScriptModal(true)}
                    className="w-full py-2.5 px-3 bg-[#0B0F17] hover:bg-slate-800 border border-slate-700 hover:border-emerald-400 text-white text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors font-medium"
                  >
                    <Code2 className="w-4 h-4 text-emerald-400" />
                    <span>Ver Código Google Apps Script ($0)</span>
                  </button>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={handleSyncToSheets}
                    disabled={isSyncingSheets}
                    className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSheets ? 'animate-spin' : ''}`} />
                    <span>Sincronizar Ahora</span>
                  </button>
                  <button
                    onClick={handleSaveConfigs}
                    className="px-4 py-2.5 bg-[#0B0F17] border border-slate-700 hover:border-slate-600 rounded-xl text-white text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Guardar
                  </button>
                </div>

                {lastSyncTime && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                    <span>Última sincronización: {lastSyncTime}</span>
                  </div>
                )}

                {/* Export Direct CSV */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
                    Descargar Copia Local en Excel / CSV:
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownloadCsv('ofertas')}
                      className="flex-1 py-2 bg-[#0B0F17] hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      <span>CSV Ofertas</span>
                    </button>
                    <button
                      onClick={() => handleDownloadCsv('postulaciones')}
                      className="flex-1 py-2 bg-[#0B0F17] hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-sky-400" />
                      <span>CSV Postulaciones</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Spreadsheet Visual Simulator */}
            <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs uppercase tracking-wider text-slate-300 font-bold">
                    Visor de la Hoja de Cálculo: Google Sheets DB
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span className="text-xs font-semibold text-emerald-400">4 Hojas Auto-estructuradas</span>
                </div>
              </div>

              {/* Sheet Tabs Selector */}
              <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2.5 overflow-x-auto">
                <button
                  onClick={() => setPreviewSheetTab('ofertas')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    previewSheetTab === 'ofertas'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📄 Ofertas_Descubiertas ({ofertas.length})
                </button>
                <button
                  onClick={() => setPreviewSheetTab('postulaciones')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    previewSheetTab === 'postulaciones'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🎯 Postulaciones_Realizadas ({postulaciones.length})
                </button>
                <button
                  onClick={() => setPreviewSheetTab('candidatos')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    previewSheetTab === 'candidatos'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  👤 Perfil_Candidato (1)
                </button>
                <button
                  onClick={() => setPreviewSheetTab('logs')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    previewSheetTab === 'logs'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📊 Log_Ejecuciones ({ejecuciones.length})
                </button>
              </div>

              {/* Table Data Preview */}
              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-[#0B0F17] max-h-80 overflow-y-auto">
                {previewSheetTab === 'ofertas' && (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#111827] text-slate-400 border-b border-slate-800 sticky top-0 font-semibold">
                      <tr>
                        <th className="p-3 border-r border-slate-800">ID</th>
                        <th className="p-3 border-r border-slate-800">LinkedIn ID</th>
                        <th className="p-3 border-r border-slate-800">Título Vacante</th>
                        <th className="p-3 border-r border-slate-800">Empresa</th>
                        <th className="p-3 border-r border-slate-800">Match</th>
                        <th className="p-3 border-r border-slate-800">Estado Revisión</th>
                        <th className="p-3">Easy Apply</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {ofertas.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-800/30">
                          <td className="p-3 border-r border-slate-800 text-slate-500 font-mono">{o.id}</td>
                          <td className="p-3 border-r border-slate-800 text-sky-400 font-mono">{o.linkedin_job_id}</td>
                          <td className="p-3 border-r border-slate-800 text-white font-medium">{o.titulo}</td>
                          <td className="p-3 border-r border-slate-800">{o.empresa}</td>
                          <td className="p-3 border-r border-slate-800 text-emerald-400 font-bold">{o.match_score || 85}%</td>
                          <td className="p-3 border-r border-slate-800">
                            <span
                              className={`px-2 py-0.5 text-[11px] font-semibold rounded-md border ${
                                o.estado_revision === 'aprobada'
                                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                  : o.estado_revision === 'descartada'
                                  ? 'bg-rose-950/40 text-rose-300 border-rose-600/30'
                                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                              }`}
                            >
                              {o.estado_revision || 'pendiente'}
                            </span>
                          </td>
                          <td className="p-3 text-emerald-400 font-semibold">SI</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {previewSheetTab === 'postulaciones' && (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#111827] text-slate-400 border-b border-slate-800 sticky top-0 font-semibold">
                      <tr>
                        <th className="p-3 border-r border-slate-800">ID Postulación</th>
                        <th className="p-3 border-r border-slate-800">Oferta ID</th>
                        <th className="p-3 border-r border-slate-800">Estado Envío</th>
                        <th className="p-3 border-r border-slate-800">Fecha / Hora</th>
                        <th className="p-3">CV Adjunto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {postulaciones.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-800/30">
                          <td className="p-3 border-r border-slate-800 text-sky-400 font-mono">#{p.id}</td>
                          <td className="p-3 border-r border-slate-800 text-slate-400">{p.oferta_id}</td>
                          <td className="p-3 border-r border-slate-800 text-emerald-400 font-semibold">{p.estado}</td>
                          <td className="p-3 border-r border-slate-800 text-slate-400">{p.fecha_postulacion}</td>
                          <td className="p-3 text-white">{p.datos_formulario?.cv_adjunto || 'Hoja_de_vida_ATS.pdf'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {previewSheetTab === 'candidatos' && (
                  <div className="p-5 space-y-2 text-xs text-slate-300">
                    <div><strong className="text-white font-semibold">Nombre:</strong> {profile.nombre}</div>
                    <div><strong className="text-white font-semibold">Email:</strong> {profile.email}</div>
                    <div><strong className="text-white font-semibold">Teléfono:</strong> {profile.telefono}</div>
                    <div><strong className="text-white font-semibold">Ubicación:</strong> {profile.ubicacion}</div>
                    <div><strong className="text-white font-semibold">Keywords Principales:</strong> {profile.keywordsPrincipales?.join(', ')}</div>
                    <div><strong className="text-white font-semibold">Aspiración Salarial:</strong> ${profile.preferencias?.salarioMin?.toLocaleString()} - ${profile.preferencias?.salarioMax?.toLocaleString()} {profile.preferencias?.salarioMoneda}</div>
                  </div>
                )}

                {previewSheetTab === 'logs' && (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#111827] text-slate-400 border-b border-slate-800 sticky top-0 font-semibold">
                      <tr>
                        <th className="p-3 border-r border-slate-800">Timestamp</th>
                        <th className="p-3 border-r border-slate-800">Encontradas</th>
                        <th className="p-3 border-r border-slate-800">Postuladas</th>
                        <th className="p-3 border-r border-slate-800">Sesión</th>
                        <th className="p-3">Duración</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {ejecuciones.map((e) => (
                        <tr key={e.id} className="hover:bg-slate-800/30">
                          <td className="p-3 border-r border-slate-800 text-slate-400">{e.fecha_ejecucion}</td>
                          <td className="p-3 border-r border-slate-800 text-white font-semibold">{e.total_ofertas_encontradas}</td>
                          <td className="p-3 border-r border-slate-800 text-emerald-400 font-bold">{e.total_postulaciones_exitosas}</td>
                          <td className="p-3 border-r border-slate-800 text-sky-400 font-semibold">{e.estado_sesion}</td>
                          <td className="p-3 text-slate-400">{e.duracion_segundos}s</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: TELEGRAM & DISCORD NOTIFICATIONS */}
      {activeSubTab === 'telegram' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Telegram Setup Card */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs uppercase tracking-wider text-slate-300 font-bold">
                  Telegram Bot API ($0 Costo - Alertas al Celular)
                </h3>
              </div>
              <span className="px-2.5 py-0.5 text-[11px] font-semibold text-sky-300 bg-sky-500/10 border border-sky-500/30 rounded-full">
                100% GRATIS
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Recibe notificaciones instantáneas en tu smartphone cada vez que el bot ejecute la rutina de las 05:00 AM, cuando encuentre ofertas con match superior al 85%, o si LinkedIn solicita verificación.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 text-[11px] uppercase tracking-wider mb-1.5 font-semibold">
                  Telegram Bot Token (de @BotFather):
                </label>
                <input
                  type="text"
                  value={telegramToken}
                  onChange={(e) => setTelegramToken(e.target.value)}
                  placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ..."
                  className="w-full px-3.5 py-2.5 bg-[#0B0F17] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-[11px] uppercase tracking-wider mb-1.5 font-semibold">
                  Tu Chat ID (de @userinfobot):
                </label>
                <input
                  type="text"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  placeholder="987654321"
                  className="w-full px-3.5 py-2.5 bg-[#0B0F17] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Event Triggers */}
              <div className="pt-2 space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
                  Disparadores de Notificación:
                </span>
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={notifyOnDailySummary}
                    onChange={(e) => setNotifyOnDailySummary(e.target.checked)}
                    className="rounded border-slate-700 text-sky-400 focus:ring-sky-400"
                  />
                  <span>⏰ Resumen diario a las 05:00 AM (Postulaciones enviadas)</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={notifyOnHighMatch}
                    onChange={(e) => setNotifyOnHighMatch(e.target.checked)}
                    className="rounded border-slate-700 text-sky-400 focus:ring-sky-400"
                  />
                  <span>⭐ Ofertas de Alta Afinidad encontradas (Match ≥ 85%)</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={notifyOnSessionError}
                    onChange={(e) => setNotifyOnSessionError(e.target.checked)}
                    className="rounded border-slate-700 text-sky-400 focus:ring-sky-400"
                  />
                  <span>⚠️ Alerta si la sesión de LinkedIn expira o pide /login</span>
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  id="test-telegram-btn"
                  onClick={handleTestTelegram}
                  disabled={isTestingTelegram}
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                >
                  <Send className={`w-3.5 h-3.5 ${isTestingTelegram ? 'animate-spin' : ''}`} />
                  <span>Enviar Alerta de Prueba a Telegram</span>
                </button>
                <button
                  onClick={handleSaveConfigs}
                  className="px-4 py-2.5 bg-[#0B0F17] border border-slate-700 hover:border-slate-600 rounded-xl text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  Guardar
                </button>
              </div>

              {telegramTestResult && (
                <div className="p-3 bg-[#0B0F17] border border-slate-800 rounded-xl text-xs text-slate-300">
                  {telegramTestResult}
                </div>
              )}
            </div>
          </div>

          {/* Discord Webhook Option */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#5865F2]" />
                <h3 className="text-xs uppercase tracking-wider text-slate-300 font-bold">
                  Discord Webhook ($0 Alternativa)
                </h3>
              </div>
              <span className="px-2.5 py-0.5 text-[11px] font-semibold text-[#5865F2] bg-[#5865F2]/10 border border-[#5865F2]/30 rounded-full">
                CANAL PRIVADO
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Si utilizas Discord, puedes crear un canal privado (ej: <code>#postulaciones-linkedin</code>) y pegar el webhook aquí para recibir el log detallado con formato embed.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 text-[11px] uppercase tracking-wider mb-1.5 font-semibold">
                  Discord Webhook URL:
                </label>
                <input
                  type="url"
                  value={discordWebhookUrl}
                  onChange={(e) => setDiscordWebhookUrl(e.target.value)}
                  placeholder="https://discord.com/api/webhooks/..."
                  className="w-full px-3.5 py-2.5 bg-[#0B0F17] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-[#5865F2]"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={async () => {
                    setIsTestingDiscord(true);
                    try {
                      const res = await fetch('/api/notifications/test-discord', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ webhookUrl: discordWebhookUrl }),
                      });
                      const data = await res.json();
                      onShowToast(data.message, res.ok ? 'success' : 'error');
                    } finally {
                      setIsTestingDiscord(false);
                    }
                  }}
                  disabled={isTestingDiscord}
                  className="w-full py-2.5 bg-[#5865F2] hover:bg-[#6875f5] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Probar Notificación en Discord</span>
                </button>
              </div>

              {/* Guía Rápida */}
              <div className="p-3.5 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-1.5 text-xs text-slate-400">
                <strong className="text-white block">¿Cómo crear el webhook en Discord en 30 segundos?</strong>
                <ol className="list-decimal list-inside space-y-1 text-slate-300">
                  <li>En tu servidor de Discord, haz clic en la tuerca de ajustes de un canal de texto.</li>
                  <li>Ve a <strong>Integraciones</strong> &gt; <strong>Webhooks</strong> &gt; <strong>Nuevo Webhook</strong>.</li>
                  <li>Copia la URL del Webhook y pégala arriba.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: GITHUB ACTIONS SERVERLESS CRON */}
      {activeSubTab === 'github' && (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  GitHub Actions Scheduled Cron ($0 Servidor Cloud)
                </h3>
                <p className="text-xs text-slate-400">
                  Ejecuta el bot headless a las 05:00 AM (Bogotá) de Lunes a Viernes usando los 2,000 minutos gratis mensuales de GitHub.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(workflowYaml);
                setCopiedYaml(true);
                setTimeout(() => setCopiedYaml(false), 2000);
                onShowToast('Workflow YAML copiado al portapapeles', 'success');
              }}
              className="px-3.5 py-2 bg-purple-900/30 hover:bg-purple-900/50 border border-purple-500/50 text-purple-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {copiedYaml ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedYaml ? '¡Copiado!' : 'Copiar .github/workflows/linkedin_agent.yml'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto max-h-96">
                <pre className="text-emerald-400">{workflowYaml}</pre>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-3 text-xs">
              <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-2">
                <h4 className="font-bold text-white uppercase text-xs tracking-wider">
                  Configuración de Secrets en GitHub:
                </h4>
                <p className="text-slate-400 leading-relaxed text-xs">
                  En tu repositorio de GitHub, ve a <strong>Settings &gt; Secrets and variables &gt; Actions</strong> y añade estos secrets:
                </p>
                <ul className="space-y-1.5 font-mono text-xs text-slate-300">
                  <li>• <strong className="text-sky-400">GEMINI_API_KEY</strong>: Clave de Google AI Studio</li>
                  <li>• <strong className="text-emerald-400">GOOGLE_SHEET_WEBHOOK</strong>: URL del Apps Script</li>
                  <li>• <strong className="text-sky-400">TELEGRAM_BOT_TOKEN</strong>: Token de alertas</li>
                  <li>• <strong className="text-sky-400">TELEGRAM_CHAT_ID</strong>: ID de tu chat</li>
                </ul>
              </div>

              <div className="p-3.5 bg-purple-950/20 border border-purple-500/30 rounded-xl text-purple-300 text-xs">
                💡 <strong>Costo Total: $0 USD</strong>. Cada corrida dura ~3 minutos (60 minutos al mes de los 2,000 gratuitos que te da GitHub).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: LOOKER STUDIO DASHBOARD */}
      {activeSubTab === 'looker' && (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Google Looker Studio (Data Studio) • Dashboard Ejecutivo ($0)
                </h3>
                <p className="text-xs text-slate-400">
                  Crea gráficos visuales de embudo, efectividad de keywords y empresas postuladas conectando tu Google Sheet con 1 clic.
                </p>
              </div>
            </div>

            <a
              href="https://lookerstudio.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20 transition-all"
            >
              <span>Abrir Google Looker Studio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-2">
              <div className="text-amber-400 font-bold text-sm">1. Conecta la Fuente</div>
              <p className="text-slate-400 leading-relaxed text-xs">
                En Looker Studio, selecciona "Crear informe" y elige el conector nativo de <strong>Google Sheets</strong> apuntando a tu hoja <code>Ofertas_Descubiertas</code>.
              </p>
            </div>

            <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-2">
              <div className="text-amber-400 font-bold text-sm">2. Gráficos de Embudo</div>
              <p className="text-slate-400 leading-relaxed text-xs">
                Visualiza el embudo: <strong>Ofertas Detectadas → Aprobadas por Usuario → Postulaciones Enviadas → Entrevistas</strong>.
              </p>
            </div>

            <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-2">
              <div className="text-amber-400 font-bold text-sm">3. Reporte en tu Celular</div>
              <p className="text-slate-400 leading-relaxed text-xs">
                Looker Studio genera enlaces web responsivos y programados por correo electrónico semanal sin ningún costo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Google Apps Script Code */}
      {showAppsScriptModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#0B0F17]">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm text-white font-bold">
                  Google Apps Script Base de Datos ($0 Costo)
                </h3>
              </div>
              <button
                onClick={() => setShowAppsScriptModal(false)}
                className="text-slate-400 hover:text-white rounded-lg p-1 hover:bg-slate-800 text-sm cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs text-slate-300 bg-[#0B0F17]">
              <div className="mb-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-sans">
                📌 Pega este script en tu Google Sheet (Extensiones &gt; Apps Script) y haz clic en "Implementar como Aplicación Web".
              </div>
              <pre className="text-emerald-400 whitespace-pre-wrap">{appsScriptCode}</pre>
            </div>

            <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-[#0B0F17]">
              <span className="text-xs text-slate-400">Crea 4 pestañas automáticas con encabezados</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(appsScriptCode);
                  setCopiedScript(true);
                  setTimeout(() => setCopiedScript(false), 2000);
                  onShowToast('Código de Apps Script copiado al portapapeles', 'success');
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                {copiedScript ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedScript ? '¡Copiado!' : 'Copiar Código'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
