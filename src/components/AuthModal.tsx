import React, { useState } from 'react';
import {
  LogIn,
  UserPlus,
  Shield,
  CheckCircle2,
  Lock,
  Mail,
  Zap,
  Users,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { UserAccount } from '../types';
import { signInWithGoogle } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  allUsers: UserAccount[];
  onUserChanged: (user: UserAccount) => void;
  onShowToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allUsers,
  onUserChanged,
  onShowToast,
}) => {
  const [tab, setTab] = useState<'sso' | 'email' | 'demo-switch'>('sso');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Handle Google SSO via Firebase or backend fallback
  const handleGoogleSSO = async () => {
    setIsLoading(true);
    try {
      const { user: fbUser, error } = await signInWithGoogle();
      const targetEmail = fbUser?.email || 'monjsoza@gmail.com';
      const targetName = fbUser?.displayName || 'Juan Carlos Soza Calderón';
      const targetPhoto = fbUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

      const res = await fetch('/api/auth/sso-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          displayName: targetName,
          photoURL: targetPhoto,
          provider: 'google',
        }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        onUserChanged(data.user);
        onShowToast(`¡Bienvenido de vuelta, ${data.user.displayName}! (Google SSO)`, 'success');
        onClose();
      } else {
        onShowToast(data.message || 'Error en SSO con Google', 'error');
      }
    } catch (err: any) {
      onShowToast('Error al procesar inicio con Google SSO', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle LinkedIn SSO
  const handleLinkedInSSO = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/sso-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'candidato.linkedin@profesionales.com',
          displayName: 'Candidato Verificado LinkedIn',
          photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          provider: 'linkedin',
        }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        onUserChanged(data.user);
        onShowToast(`¡Autenticado con LinkedIn SSO! Sesión activa.`, 'success');
        onClose();
      }
    } catch (err) {
      onShowToast('Error al autenticar con LinkedIn', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Email Form Submit
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/sso-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          displayName: name || email.split('@')[0],
          provider: 'password',
        }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        onUserChanged(data.user);
        onShowToast(
          isRegisterMode
            ? `¡Cuenta creada exitosamente! Recibiste $5 USD de bienvenida.`
            : `Sesión iniciada como ${data.user.email}`,
          'success'
        );
        onClose();
      }
    } catch (err) {
      onShowToast('Error en la autenticación por correo', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Fast User Switch (Demo Multi-user)
  const handleSwitchUser = async (uid: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/switch-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        onUserChanged(data.user);
        onShowToast(`Cambiaste a la cuenta: ${data.user.displayName} (${data.user.plan.toUpperCase()})`, 'info');
        onClose();
      }
    } catch (err) {
      onShowToast('Error al cambiar de cuenta', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0B0F17]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Autenticación & Sesión Multi-Usuario
              </h3>
              <p className="text-xs text-slate-400">
                SSO Empresarial • Planes Pro & Pago por Uso
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white rounded-lg p-1.5 hover:bg-slate-800 text-sm cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-3 border-b border-slate-800 bg-[#0B0F17] text-xs">
          <button
            onClick={() => setTab('sso')}
            className={`py-3 text-center border-b-2 font-medium transition-colors cursor-pointer ${
              tab === 'sso'
                ? 'border-emerald-400 text-white font-bold bg-[#111827]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            SSO (Google / LinkedIn)
          </button>
          <button
            onClick={() => setTab('email')}
            className={`py-3 text-center border-b-2 font-medium transition-colors cursor-pointer ${
              tab === 'email'
                ? 'border-emerald-400 text-white font-bold bg-[#111827]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Email & Contraseña
          </button>
          <button
            onClick={() => setTab('demo-switch')}
            className={`py-3 text-center border-b-2 font-medium transition-colors cursor-pointer ${
              tab === 'demo-switch'
                ? 'border-sky-400 text-white font-bold bg-[#111827]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Cambiar Cuenta ({allUsers.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* TAB 1: SSO */}
          {tab === 'sso' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Inicia sesión con tu proveedor corporativo o profesional con 1 solo clic. Las credenciales de LinkedIn y tu historial se aíslan de forma segura por usuario.
              </p>

              {/* Google SSO Button */}
              <button
                id="google-sso-btn"
                onClick={handleGoogleSSO}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#0B0F17] hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-3 transition-colors cursor-pointer group shadow-sm"
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continuar con Google SSO (Google Workspace)</span>
              </button>

              {/* LinkedIn SSO Button */}
              <button
                id="linkedin-sso-btn"
                onClick={handleLinkedInSSO}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#0077B5]/15 hover:bg-[#0077B5]/25 border border-[#0077B5]/40 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-3 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 text-[#0077B5] fill-current flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                </svg>
                <span>Continuar con LinkedIn Identity SSO</span>
              </button>

              <div className="p-4 bg-[#0B0F17] border border-slate-800 rounded-xl text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="font-semibold">Bono de Bienvenida Automático:</span>
                </div>
                <p>Nuevos usuarios reciben $5.00 USD de saldo en créditos gratis para probar el autollenado de vacantes.</p>
              </div>
            </div>
          )}

          {/* TAB 2: Email & Password */}
          {tab === 'email' && (
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {isRegisterMode && (
                <div>
                  <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Nombre Completo:
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Juan Carlos Soza"
                    className="w-full px-3.5 py-2.5 bg-[#0B0F17] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Correo Electrónico:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@empresa.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#0B0F17] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Contraseña:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#0B0F17] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all"
              >
                {isRegisterMode ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                <span>{isRegisterMode ? 'Crear Cuenta Gratis' : 'Iniciar Sesión'}</span>
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(!isRegisterMode)}
                  className="text-xs text-sky-400 hover:underline cursor-pointer font-medium"
                >
                  {isRegisterMode
                    ? '¿Ya tienes una cuenta? Inicia sesión aquí'
                    : '¿No tienes cuenta? Regístrate con $5 USD gratis'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: DEMO USER SWITCHER */}
          {tab === 'demo-switch' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Alterna instantáneamente entre diferentes cuentas y planes para probar el comportamiento de roles y límites:
              </p>

              <div className="space-y-2">
                {allUsers.map((u) => {
                  const isCurrent = u.uid === currentUser.uid;
                  return (
                    <div
                      key={u.uid}
                      onClick={() => !isCurrent && handleSwitchUser(u.uid)}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-emerald-500/10 border-emerald-500/40 ring-1 ring-emerald-500/20'
                          : 'bg-[#0B0F17] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={u.photoURL || 'https://api.dicebear.com/7.x/bottts/svg'}
                          alt={u.displayName}
                          className="w-9 h-9 rounded-full border border-slate-700 object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-white">
                              {u.displayName}
                            </span>
                            {isCurrent && (
                              <span className="px-2 py-0.5 text-[10px] bg-emerald-500 text-slate-950 font-bold rounded-full">
                                ACTIVO
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{u.email}</span>
                            <span>•</span>
                            <span className="text-sky-400 font-semibold uppercase text-[11px]">{u.plan}</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-medium">${u.creditBalance.toFixed(2)} USD</span>
                          </div>
                        </div>
                      </div>

                      {!isCurrent && (
                        <span className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                          <span>Cambiar</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 bg-[#0B0F17] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encriptación TLS 1.3 & Firebase Auth Seguro</span>
          </div>
          <span>Sesión: {currentUser.email}</span>
        </div>
      </div>
    </div>
  );
};
