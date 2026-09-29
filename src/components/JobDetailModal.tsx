import React from 'react';
import {
  X,
  ExternalLink,
  CheckCircle2,
  Building,
  MapPin,
  Calendar,
  FileText,
  ShieldCheck,
  Zap,
  Check,
  Briefcase,
  Star,
  Linkedin,
  Info
} from 'lucide-react';
import { OfertaDB, PostulacionDB } from '../types';

interface JobDetailModalProps {
  job: OfertaDB | null;
  postulaciones: PostulacionDB[];
  onClose: () => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  postulaciones,
  onClose,
}) => {
  if (!job) return null;

  const postulacion = postulaciones.find((p) => p.oferta_id === job.id);
  const estaPostulado = postulacion && postulacion.estado === 'postulado';

  // Construct a guaranteed working LinkedIn search URL
  const workingLinkedInUrl =
    job.linkedin_direct_url && !job.linkedin_direct_url.includes('/jobs/view/')
      ? job.linkedin_direct_url
      : `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
          `${job.titulo} ${job.empresa || ''}`
        )}&location=${encodeURIComponent(
          (job.ubicacion || '').includes('Bogot') ? 'Bogotá, Colombia' : 'Colombia'
        )}&f_AL=true&f_TPR=r86400`;

  // Determine if there is a verified official external URL (e.g. from Jobicy, Remotive, or employer portal)
  const hasRealExternalUrl =
    Boolean(job.job_url) &&
    !job.job_url.includes('/jobs/view/') &&
    !job.job_url.includes('linkedin.com/jobs/search');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#111827] border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-[#0B0F17] gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md font-semibold text-xs">
                {job.keyword_busqueda || 'Vacante recomendada'}
              </span>

              {job.is_live_external && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border rounded-md font-bold text-xs bg-emerald-500/20 border-emerald-400/40 text-emerald-300 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  🌐 Oferta Real en Vivo ({job.fuente || 'Verificada'})
                </span>
              )}

              {estaPostulado ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border rounded-md font-semibold text-xs bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Postulado con Éxito
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border rounded-md font-semibold text-xs bg-sky-500/10 border-sky-500/30 text-sky-400">
                  <Star className="w-3.5 h-3.5" />
                  Disponible para Postular
                </span>
              )}

              {job.match_score && (
                <span className="px-2.5 py-0.5 bg-[#161F30] border border-emerald-500/40 text-emerald-300 rounded-md font-bold text-xs">
                  {job.match_score}% de Afinidad con tu CV
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight pt-1">
              {job.titulo}
            </h3>

            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-medium text-slate-200">
                <Building className="w-4 h-4 text-emerald-400" />
                {job.empresa}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400" />
                {job.ubicacion}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-xs text-slate-300">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-[#0B0F17] border border-slate-800 rounded-xl">
              <span className="text-slate-400 text-[11px] block mb-0.5 font-medium">Publicación:</span>
              <span className="text-white font-semibold text-xs">{job.fecha_publicacion || 'Reciente'}</span>
            </div>
            <div className="p-3 bg-[#0B0F17] border border-slate-800 rounded-xl">
              <span className="text-slate-400 text-[11px] block mb-0.5 font-medium">Modalidad de Envío:</span>
              <span className="text-emerald-400 font-bold text-xs">
                {job.es_easy_apply ? 'Easy Apply (Postulación en 1 Clic) ✓' : 'Directa'}
              </span>
            </div>
            <div className="p-3 bg-[#0B0F17] border border-slate-800 rounded-xl col-span-2 sm:col-span-1">
              <span className="text-slate-400 text-[11px] block mb-0.5 font-medium">Compatibilidad:</span>
              <span className="text-sky-400 font-bold text-xs">
                {job.match_score ? `${job.match_score}% compatible` : 'Alta afinidad'}
              </span>
            </div>
          </div>

          {/* Job Description */}
          {job.descripcion && (
            <div className="space-y-1.5">
              <h4 className="text-xs uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                Descripción del Empleo:
              </h4>
              <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl text-slate-300 leading-relaxed text-xs whitespace-pre-line">
                {job.descripcion}
              </div>
            </div>
          )}

          {/* Submission Info */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Datos que se presentan al reclutador:
            </h4>

            <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block mb-0.5">Nombre del Postulado:</span>
                  <span className="text-white font-semibold">Juan Carlos Soza Calderón</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block mb-0.5">Contacto Registrado:</span>
                  <span className="text-slate-200">monjsoza@gmail.com</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block mb-0.5">Hoja de Vida Adjunta:</span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Hoja de vida ATS JCSC.pdf
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block mb-0.5">Experiencia Acreditada:</span>
                  <span className="text-sky-400 font-semibold">15+ Años en Liderazgo TI y Datos</span>
                </div>
              </div>

              {postulacion?.datos_formulario?.respuestas_clave && Object.keys(postulacion.datos_formulario.respuestas_clave).length > 0 && (
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] text-slate-400 font-semibold block">Preguntas del reclutador respondidas con tu CV:</span>
                  <div className="space-y-1.5">
                    {Object.entries(postulacion.datos_formulario.respuestas_clave).map(([pregunta, respuesta], idx) => (
                      <div key={idx} className="p-2.5 bg-[#111827] border border-slate-800 rounded-lg text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-slate-300 font-medium">{pregunta}:</span>
                        <span className="text-emerald-300 font-medium">{String(respuesta)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Real-time LinkedIn Navigation Tip */}
          <div className="p-3 bg-sky-500/10 border border-sky-500/25 rounded-xl flex items-start gap-2.5 text-xs text-slate-300">
            <Linkedin className="w-4 h-4 text-[#0A66C2] flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-sky-300 block">Navegación directa en LinkedIn:</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                LinkedIn requiere autenticación en tu navegador para ver ofertas específicas. Al presionar <strong>"Ver en LinkedIn (Easy Apply)"</strong>, se abrirá la búsqueda en vivo con los filtros de <strong>{job.titulo}</strong> en <strong>{job.empresa}</strong> y <strong>Colombia</strong> listos para postularte de inmediato.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0B0F17] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Datos 100% seguros y respaldados en tu perfil</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end w-full sm:w-auto">
            {hasRealExternalUrl && (
              <a
                href={job.job_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-slate-700 cursor-pointer"
                title="Abrir portal oficial de la vacante"
              >
                <span>Portal Oficial</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <a
              href={workingLinkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#0A66C2] hover:bg-[#004182] text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md shadow-sky-600/25 cursor-pointer"
              title="Abre la búsqueda oficial de esta vacante en LinkedIn con Solicitud Sencilla activa"
            >
              <Linkedin className="w-3.5 h-3.5 text-white" />
              <span>Ver en LinkedIn (Easy Apply)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
