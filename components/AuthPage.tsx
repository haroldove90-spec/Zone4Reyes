
import React, { useState } from 'react';

interface AuthPageProps {
  onLogin: (name: string, password: string, rememberMe: boolean) => Promise<void>;
  onRegister: (name: string, password: string) => Promise<void>;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLoginView) {
        await onLogin(name, password, rememberMe);
      } else {
        await onRegister(name, password);
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError('');
    setName('');
    setPassword('');
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
                    <h2 className="text-2xl font-bold text-text-primary text-center mb-6">
                        {isLoginView ? 'Inicia Sesión' : 'Crea una Cuenta'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="name">
                                Nombre de Usuario
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full bg-background p-3 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Ej. Carlos Mendoza"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="password">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-background p-3 pr-10 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="************"
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    aria-label={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                >
                                    {isPasswordVisible ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7C3.732 7.943 7.522 5 12 5c1.478 0 2.885.32 4.125.875m0 0a3 3 0 11-5.25 5.25m5.25-5.25l-5.25 5.25" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {isLoginView && (
                            <div className="mb-6">
                                <label htmlFor="rememberMe" className="flex items-center cursor-pointer">
                                    <input
                                        id="rememberMe"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="h-4 w-4 rounded border-divider text-primary focus:ring-primary"
                                    />
                                    <span className="ml-2 text-sm text-text-secondary">Recordarme</span>
                                </label>
                            </div>
                        )}

                        {error && (
                            <p className="bg-red-500/10 text-red-500 text-sm p-3 rounded-lg mb-4">{error}</p>
                        )}

                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-auth-button text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Procesando...' : (isLoginView ? 'Iniciar Sesión' : 'Registrarse')}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-text-secondary text-sm mt-6">
                        {isLoginView ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                        <button onClick={toggleView} className="font-bold text-primary hover:underline ml-1">
                            {isLoginView ? 'Regístrate' : 'Inicia Sesión'}
                        </button>
                    </p>
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
