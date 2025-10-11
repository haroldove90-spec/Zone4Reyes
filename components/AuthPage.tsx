
import React, { useState } from 'react';
import { User } from '../types';
import { useData } from '../context/DataContext';

type AuthMode = 'login' | 'register' | 'forgotPassword' | 'emailSent' | 'verifyEmail' | 'resetPassword';

export const AuthPage: React.FC = () => {
  const { handleLogin, handleRegister, handleVerifyEmail, users } = useData();

  const [mode, setMode] = useState<AuthMode>('login');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [targetUser, setTargetUser] = useState<User | null>(null);
  
  // Mock functions for password reset
  const onForgotPasswordRequest = async (email: string): Promise<User | null> => users.find(u => u.settings.account.email === email) || null
  const onResetPassword = async (userId: string, newPassword: string): Promise<void> => {
      // This should be an API call
      // setUsers(users.map(u => u.id === userId ? { ...u, password: newPassword } : u));
      alert("Contraseña restablecida. Ahora puedes iniciar sesión.");
      switchMode('login');
  }

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await handleLogin(email, password, rememberMe);
      } else if (mode === 'register') {
        if (password !== confirmPassword) {
          throw new Error('Las contraseñas no coinciden.');
        }
        const newUser = await handleRegister(name, email, password);
        setTargetUser(newUser);
        setMode('verifyEmail');
      } else if (mode === 'forgotPassword') {
        const user = await onForgotPasswordRequest(email);
        setTargetUser(user);
        setMode('emailSent');
      } else if (mode === 'resetPassword' && targetUser) {
         if (password !== confirmPassword) {
          throw new Error('Las contraseñas no coinciden.');
        }
        await onResetPassword(targetUser.id, password);
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateVerify = async () => {
    if (!targetUser) return;
    setIsLoading(true);
    try {
      await handleVerifyEmail(targetUser.id);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  }

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setIsLoading(false);
    setTargetUser(null);
  };
  
  const switchMode = (newMode: AuthMode) => {
      resetForm();
      setMode(newMode);
  };

  const renderContent = () => {
    switch (mode) {
        case 'verifyEmail':
            return (
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-text-primary mb-4">¡Registro Exitoso!</h2>
                    <p className="text-text-secondary mb-4">
                        Hemos enviado un correo de confirmación a <strong>{targetUser?.settings.account.email}</strong>. Por favor, revisa tu bandeja de entrada para activar tu cuenta.
                    </p>
                    <div className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 text-sm p-3 rounded-lg mb-6">
                        <p><strong>Esto es una simulación.</strong> No se ha enviado ningún correo. Haz clic en el botón de abajo para simular la confirmación de tu cuenta.</p>
                    </div>
                     <button
                        onClick={handleSimulateVerify}
                        disabled={isLoading}
                        className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
                    >
                        {isLoading ? 'Verificando...' : 'Simular Confirmación y Entrar'}
                    </button>
                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                </div>
            );
        case 'emailSent':
            return (
                 <div className="text-center">
                    <h2 className="text-2xl font-bold text-text-primary mb-4">Revisa tu correo</h2>
                    <p className="text-text-secondary mb-4">
                       Si existe una cuenta asociada a <strong>{email}</strong>, hemos enviado un enlace para restablecer tu contraseña.
                    </p>
                     <div className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 text-sm p-3 rounded-lg mb-6">
                        <p><strong>Esto es una simulación.</strong> No se ha enviado ningún correo. Haz clic abajo para continuar con el restablecimiento.</p>
                    </div>
                    {targetUser ? (
                        <button onClick={() => setMode('resetPassword')} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                           Simular Clic en Enlace
                        </button>
                    ) : (
                         <button onClick={() => switchMode('login')} className="w-full bg-gray-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                           Volver al Inicio de Sesión
                        </button>
                    )}
                </div>
            )
        case 'forgotPassword':
        case 'resetPassword':
        case 'login':
        case 'register':
            const isLogin = mode === 'login';
            const isRegister = mode === 'register';
            const isForgot = mode === 'forgotPassword';
            const isReset = mode === 'resetPassword';

            let title = 'Inicia Sesión';
            if (isRegister) title = 'Crea una Cuenta';
            if (isForgot) title = 'Recuperar Contraseña';
            if (isReset) title = 'Restablecer Contraseña';

            return (
                 <>
                    <h2 className="text-2xl font-bold text-text-primary text-center mb-6">{title}</h2>
                    {isForgot && <p className="text-center text-text-secondary text-sm mb-4">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>}
                    <form onSubmit={handleAuthSubmit}>
                        {isRegister && (
                             <div className="mb-4">
                                <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="name">Nombre de Usuario</label>
                                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-background p-3 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Ej. Carlos Mendoza" />
                            </div>
                        )}
                        {!isReset && (
                             <div className="mb-4">
                                <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="email">Correo Electrónico</label>
                                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-background p-3 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="tu@correo.com" />
                            </div>
                        )}
                        {(isLogin || isRegister || isReset) && (
                             <div className="mb-4">
                                <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="password">{isReset ? 'Nueva Contraseña' : 'Contraseña'}</label>
                                <div className="relative">
                                    <input id="password" type={isPasswordVisible ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-background p-3 pr-10 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="************" />
                                    <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="absolute inset-y-0 right-0 pr-3 flex items-center" aria-label={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                                        {isPasswordVisible ? (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7C3.732 7.943 7.522 5 12 5c1.478 0 2.885.32 4.125.875m0 0a3 3 0 11-5.25 5.25m5.25-5.25l-5.25 5.25" /></svg>) : (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>)}
                                    </button>
                                </div>
                            </div>
                        )}
                         {(isRegister || isReset) && (
                             <div className="mb-4">
                                <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="confirmPassword">Confirmar Contraseña</label>
                                <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full bg-background p-3 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="************" />
                            </div>
                        )}
                        {isLogin && (
                            <div className="flex items-center justify-between mb-6">
                                <label htmlFor="rememberMe" className="flex items-center cursor-pointer">
                                    <input id="rememberMe" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-divider text-primary focus:ring-primary" />
                                    <span className="ml-2 text-sm text-text-secondary">Recordarme</span>
                                </label>
                                <button type="button" onClick={() => switchMode('forgotPassword')} className="text-sm text-primary hover:underline font-semibold">¿Olvidaste tu contraseña?</button>
                            </div>
                        )}

                        {error && <div className="border-l-4 border-red-500 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-200 p-4 rounded-md mb-4 text-sm whitespace-pre-wrap" role="alert">{error}</div>}

                        <div className="flex items-center justify-between">
                            <button type="submit" disabled={isLoading} className="w-full bg-auth-button text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                                {isLoading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : isRegister ? 'Registrarse' : isForgot ? 'Enviar Enlace' : 'Restablecer')}
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-text-secondary text-sm mt-6">
                        {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                        <button onClick={() => switchMode(isLogin ? 'register' : 'login')} className="font-bold text-primary hover:underline ml-1">
                            {isLogin ? 'Regístrate' : 'Inicia Sesión'}
                        </button>
                    </p>
                </>
            );
    }
  };


  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4 pt-24">
        <div className="flex-grow flex flex-col justify-center items-center w-full">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <img src="https://appdesignmex.com/netbandera/wp-content/uploads/2025/10/Zone4Reyes-01-1.png" alt="Zone4Reyes Logo" className="w-56 mx-auto mb-4" />
                    <h1 className="text-xl font-semibold text-text-secondary">Conectando digitalmente a Los Reyes Iztacala, Tlalnepantla</h1>
                    <p className="text-text-secondary mt-2">Comparte, denuncia, publica tu negocio en la red oficial de Los Reyes Iztacala.</p>
                </div>

                <div className="bg-content-bg shadow-lg rounded-lg p-8">
                   {renderContent()}
                </div>
            </div>
        </div>
        <footer className="w-full text-center py-4">
            <p className="text-xs text-text-secondary">
                Copyright © 2025 Zone4Reyes - Desarrollada por Harold Anguiano para App Design
            </p>
        </footer>
    </div>
  );
};
