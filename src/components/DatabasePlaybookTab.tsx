import React, { useState } from 'react';
import {
  Terminal,
  Database,
  BookOpen,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Table,
  Copy,
  Check,
} from 'lucide-react';

interface DatabasePlaybookTabProps {
  onResetDb: () => void;
}

export const DatabasePlaybookTab: React.FC<DatabasePlaybookTabProps> = ({ onResetDb }) => {
  const [sqlQuery, setSqlQuery] = useState(
    'SELECT o.linkedin_job_id, o.titulo, o.empresa, p.estado, o.fecha_publicacion\nFROM ofertas o\nLEFT JOIN postulaciones p ON o.id = p.oferta_id\nLIMIT 10;'
  );
  const [queryResult, setQueryResult] = useState<{
    status: string;
    rowCount?: number;
    rows?: any[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'console' | 'schema' | 'playbook'>('console');
  const [copied, setCopied] = useState(false);

  const sampleQueries = [
    {
      label: '1. Deduplicación (Ver IDs ya vistos)',
      sql: 'SELECT o.linkedin_job_id, o.job_url, p.estado\nFROM ofertas o\nLEFT JOIN postulaciones p ON o.id = p.oferta_id;',
    },
    {
      label: '2. Resumen de Postulaciones por Estado',
      sql: 'SELECT estado, COUNT(*) as total\nFROM postulaciones\nGROUP BY estado;',
    },
    {
      label: '3. Últimas Ofertas con Easy Apply',
      sql: 'SELECT id, linkedin_job_id, titulo, empresa, ubicacion\nFROM ofertas\nWHERE es_easy_apply = true\nORDER BY id DESC\nLIMIT 5;',
    },
    {
      label: '4. Historial de Ejecuciones 05:00 AM',
      sql: 'SELECT id, fecha_ejecucion, total_ofertas_encontradas, total_postulaciones_exitosas, estado_sesion\nFROM ejecuciones\nORDER BY id DESC;',
    },
  ];

  const handleRunQuery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/database/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sqlQuery }),
      });
      const data = await res.json();
      setQueryResult(data);
    } catch (err) {
      console.error(err);
      setQueryResult({
        status: 'Error ejecutando query',
        rowCount: 0,
        rows: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>Relational Storage & CLI Utilities</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Consola PostgreSQL & Playbook Operativo
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Helper bash: <code className="text-sky-400 bg-[#0B0F17] px-2 py-0.5 rounded-md border border-slate-800 font-mono">source /home/ubuntu/shared/db/db.sh → run_sql "..."</code>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetDb}
              className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET_DATABASE</span>
            </button>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('console')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'console'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'bg-[#0B0F17] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>SQL_CONSOLE (run_sql)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('schema')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'schema'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'bg-[#0B0F17] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>DDL_SCHEMA</span>
          </button>
          <button
            onClick={() => setActiveSubTab('playbook')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'playbook'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'bg-[#0B0F17] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>PLAYBOOK (task_138dc42bf4.md)</span>
          </button>
        </div>
      </div>

      {/* 1. SQL Console SubTab */}
      {activeSubTab === 'console' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Query Editor & Presets (6 cols) */}
          <div className="lg:col-span-6 bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs uppercase tracking-wider text-slate-300 font-bold">
              Consultas SQL Predefinidas
            </h3>

            <div className="space-y-2">
              {sampleQueries.map((sq, idx) => (
                <button
                  key={idx}
                  onClick={() => setSqlQuery(sq.sql)}
                  className="w-full p-3 bg-[#0B0F17] border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left text-xs text-slate-300 transition-colors cursor-pointer flex items-center justify-between font-mono"
                >
                  <span className="font-medium text-xs text-slate-200">{sq.label}</span>
                  <Code2 className="w-3.5 h-3.5 text-slate-500" />
                </button>
              ))}
            </div>

            <form onSubmit={handleRunQuery} className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] uppercase tracking-wider font-semibold text-slate-300">
                  Editor de Query SQL:
                </label>
                <span className="text-xs font-mono text-slate-500">PostgreSQL 16 Engine</span>
              </div>

              <textarea
                rows={6}
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                className="w-full p-3 bg-[#0B0F17] border border-slate-700 rounded-xl text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-400 leading-relaxed"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>{loading ? 'EXECUTING_QUERY...' : 'EXECUTE_QUERY (run_sql)'}</span>
              </button>
            </form>
          </div>

          {/* Query Results Table (6 cols) */}
          <div className="lg:col-span-6 bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-xs uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
                  <Table className="w-4 h-4 text-emerald-400" />
                  Resultado de la Ejecución
                </h3>
                {queryResult?.rowCount !== undefined && (
                  <span className="text-xs font-semibold text-emerald-400">
                    {queryResult.rowCount} ROWS RETURNED
                  </span>
                )}
              </div>

              <div className="max-h-[360px] overflow-auto border border-slate-800 rounded-xl bg-[#0B0F17]">
                {queryResult?.rows && queryResult.rows.length > 0 ? (
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#111827] text-slate-400 uppercase text-[11px] font-semibold sticky top-0 border-b border-slate-800">
                      <tr>
                        {Object.keys(queryResult.rows[0]).map((key) => (
                          <th key={key} className="py-2.5 px-3">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {queryResult.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-800/30">
                          {Object.values(row).map((val: any, vIdx) => (
                            <td key={vIdx} className="py-2.5 px-3 font-mono text-xs truncate max-w-[200px]">
                              {val === null || val === undefined ? (
                                <span className="text-slate-500 italic">null</span>
                              ) : typeof val === 'object' ? (
                                JSON.stringify(val)
                              ) : (
                                String(val)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500 font-mono">
                    {queryResult ? 'Query ejecutada (0 filas retornadas)' : 'Ejecuta una consulta para visualizar los datos de la base de datos.'}
                  </div>
                )}
              </div>
            </div>

            <div className="text-xs text-slate-400 p-3 bg-[#0B0F17] border border-slate-800 rounded-xl">
              <strong className="text-slate-300 font-semibold">Nota de Rendimiento:</strong> Tabla <code className="text-sky-400 font-mono">ofertas</code> indexada por <code className="text-amber-400 font-mono">linkedin_job_id</code> para deduplicación O(1).
            </div>
          </div>
        </div>
      )}

      {/* 2. SQL Schema SubTab */}
      {activeSubTab === 'schema' && (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Esquema Relacional PostgreSQL</h3>
              <p className="text-xs text-slate-400">Definición de tablas: ofertas, postulaciones y ejecuciones</p>
            </div>
            <button
              onClick={() => handleCopyText(POSTGRESQL_SCHEMA_CODE)}
              className="px-3.5 py-1.5 bg-[#0B0F17] hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED' : 'COPY_DDL'}</span>
            </button>
          </div>

          <pre className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl text-xs text-emerald-400 font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
            {POSTGRESQL_SCHEMA_CODE}
          </pre>
        </div>
      )}

      {/* 3. Playbook SubTab */}
      {activeSubTab === 'playbook' && (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Playbook Oficial (task_138dc42bf4.md)</h3>
              <p className="text-xs text-slate-400">Directrices operativas y protocolo de seguridad para Juan Carlos Soza</p>
            </div>
            <button
              onClick={() => handleCopyText(PLAYBOOK_TEXT)}
              className="px-3.5 py-1.5 bg-[#0B0F17] hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED' : 'COPY_PLAYBOOK'}</span>
            </button>
          </div>

          <div className="p-5 bg-[#0B0F17] border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed space-y-4">
            <h4 className="text-sm font-bold text-white">1. Protocolo de Sesión de LinkedIn (Regla Crítica 1.3)</h4>
            <p>
              - La sesión de LinkedIn se verifica abriendo <code className="text-sky-400">https://www.linkedin.com/feed/</code>.<br />
              - Si redirige a <code>/login</code>: <strong className="text-rose-400">NUNCA intentar login automático</strong>. Registrar error <code className="text-rose-400">sesion_cerrada</code>, generar reporte diario y notificar al usuario para inicio de sesión manual.<br />
              - Si hay CAPTCHA o desafío de seguridad: detener inmediatamente y no forzar.
            </p>

            <h4 className="text-sm font-bold text-white">2. Limpieza de Procesos Zombie de Chrome</h4>
            <p className="font-mono text-xs bg-[#111827] p-3 border border-slate-800 rounded-xl text-slate-300">
              pkill -9 chrome 2&gt;/dev/null || true<br />
              rm -f ~/.config/google-chrome/SingletonLock ~/.config/google-chrome/SingletonSocket ~/.config/google-chrome/SingletonCookie 2&gt;/dev/null || true
            </p>

            <h4 className="text-sm font-bold text-white">3. Reglas de Formularios (Veracidad Total)</h4>
            <p>
              - Nombre: <strong className="text-white">Juan Carlos Soza Calderon</strong><br />
              - Email: <code className="text-sky-400">monjsoza@gmail.com</code> | Teléfono: <code className="text-sky-400">+57 310 810 2533</code><br />
              - Experiencia: 15+ años | Educación: Ingeniero en Informática (UAH, 2013)<br />
              - Salario: 8.000.000 – 15.000.000 COP (solo si obligatorio)<br />
              - CV: <code className="text-emerald-400">Hoja de vida ATS JCSC.pdf</code>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const POSTGRESQL_SCHEMA_CODE = `-- Esquema SQL de Referencia - LinkedIn Job Automation Agent
CREATE TABLE public.ejecuciones (
    id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    fecha_ejecucion timestamp without time zone DEFAULT now(),
    total_ofertas_encontradas integer DEFAULT 0,
    total_postulaciones_exitosas integer DEFAULT 0,
    total_errores integer DEFAULT 0,
    notas text
);

CREATE TABLE public.ofertas (
    id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    linkedin_job_id text UNIQUE,
    job_url text,
    titulo text,
    empresa text,
    ubicacion text,
    keyword_busqueda text,
    fecha_deteccion timestamp without time zone DEFAULT now(),
    fecha_publicacion text
);

CREATE TABLE public.postulaciones (
    id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    oferta_id integer REFERENCES public.ofertas(id),
    linkedin_job_id text,
    estado text NOT NULL
      CHECK (estado = ANY (ARRAY[
        'postulado'::text,
        'no_postulado'::text,
        'omitido_duplicado'::text,
        'error'::text
      ])),
    motivo_error text,
    fecha_postulacion timestamp without time zone DEFAULT now()
);

-- Inserción idempotente con control de duplicados:
-- INSERT INTO ofertas (linkedin_job_id, job_url, titulo, empresa, ubicacion, keyword_busqueda)
-- VALUES (...) ON CONFLICT (linkedin_job_id) DO NOTHING;
`;

const PLAYBOOK_TEXT = `# Playbook: Postulación Automática LinkedIn - Juan Carlos Soza

## Entorno
- Chrome headless disponible en /usr/bin/google-chrome
- Limpiar zombies Chrome + SingletonLock antes de iniciar

## Sesión LinkedIn
- Si expira → /login
- NO login automático
- Error "sesion_cerrada" + reporte + notificar al usuario

## Base de Datos
- DATABASE_URL en shared/.env
- source db/db.sh → run_sql "..."
- UNIQUE(linkedin_job_id) → ON CONFLICT DO NOTHING

## Flujo de 8 Pasos
1. Leer perfil_usuario.md
2. Consultar IDs ya vistos en DB
3. Verificar sesión en feed
4. Búsqueda por 7 keywords (Colombia, 24h, Easy Apply)
5. Clasificar ofertas y filtrar duplicadas
6. Postulación con Easy Apply + CV ATS
7. Persistir en PostgreSQL + resultados_linkedin.json
8. Generar reporte markdown diario
`;
