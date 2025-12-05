import { writable, get } from 'svelte/store';
import { getWebSocketService, wsLastMessage } from './websocket.store';
import type {
    AuthState,
    User,
    LoginCredentials,
    RegisterCredentials,
    AuthResponse
} from '$lib/types/auth.types';

// Estado inicial
const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
};

// Store principal de autenticación
export const authState = writable<AuthState>(initialState);

// Stores derivados para facilitar el acceso
export const user = writable<User | null>(null);
export const isAuthenticated = writable<boolean>(false);
export const authLoading = writable<boolean>(false);
export const authError = writable<string | null>(null);

/**
 * Inicializar autenticación desde localStorage
 */
export function initAuth(): void {
    if (typeof window === 'undefined') return;

    const savedUser = localStorage.getItem('manager_user');
    const savedToken = localStorage.getItem('manager_token');

    if (savedUser && savedToken) {
        const userData: User = JSON.parse(savedUser);
        userData.token = savedToken;

        authState.set({
            user: userData,
            isAuthenticated: true,
            loading: false,
            error: null
        });
        user.set(userData);
        isAuthenticated.set(true);
    }
}

/**
 * Login de manager/admin
 */
/**
 * Login de manager/admin
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
    authLoading.set(true);
    authError.set(null);

    try {
        const ws = getWebSocketService();

        // Enviar evento de login vía WebSocket
        const loginEvent = {
            action: 'Auth.LoginManager',
            data: {
                email: credentials.email,
                password: credentials.password
            }
        };

        console.log('🔐 Enviando evento de login...', loginEvent);
        ws.send(loginEvent);

        // Esperar respuesta (timeout de 10s)
        return new Promise((resolve) => {
            const timeout = setTimeout(() => {
                unsubscribe();
                authLoading.set(false);
                authError.set('Tiempo de espera agotado. Intenta nuevamente.');
                resolve({
                    success: false,
                    message: 'Tiempo de espera agotado',
                    error: 'Timeout'
                });
            }, 10000);

            const unsubscribe = wsLastMessage.subscribe((message) => {
                if (!message) return;

                // El backend envía la respuesta de login como una notificación HYDRATE
                if (message.ui?.action === 'HYDRATE' && message.ui?.target === 'session_store') {
                    unsubscribe();
                    clearTimeout(timeout);
                    authLoading.set(false);

                    if (message.data?.error) {
                        if (message.data.error.includes('UserNotConfirmedException')) {
                            authError.set('Usuario no confirmado. Redirigiendo a verificación...');
                            if (typeof window !== 'undefined') {
                                window.location.href = `/auth/verify?email=${encodeURIComponent(credentials.email)}`;
                            }
                        } else {
                            authError.set(message.data.error);
                        }

                        resolve({
                            success: false,
                            message: message.data.error,
                            error: message.data.error
                        });
                    } else {
                        // Login exitoso - extraer tokens del response
                        const userData: User = {
                            email: credentials.email,
                            userId: message.data?.userId || 'unknown',
                            role: message.data?.role?.toLowerCase() || 'manager',
                            token: message.data?.accessToken
                        };

                        if (typeof window !== 'undefined') {
                            localStorage.setItem('manager_user', JSON.stringify(userData));
                            if (message.data?.accessToken) {
                                localStorage.setItem('manager_token', message.data.accessToken);
                            }
                            if (message.data?.idToken) {
                                localStorage.setItem('manager_id_token', message.data.idToken);
                            }
                        }

                        authState.set({
                            user: userData,
                            isAuthenticated: true,
                            loading: false,
                            error: null
                        });
                        user.set(userData);
                        isAuthenticated.set(true);

                        resolve({
                            success: true,
                            message: message.ui?.message || 'Login exitoso',
                            user: userData,
                            token: userData.token
                        });
                    }
                }
            });
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        authError.set(errorMessage);
        authLoading.set(false);

        return {
            success: false,
            message: 'Error al iniciar sesión',
            error: errorMessage
        };
    }
}

/**
 * Registro de nuevo manager
 */
export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
    authLoading.set(true);
    authError.set(null);

    try {
        const ws = getWebSocketService();

        // Enviar evento de registro vía WebSocket
        const registerEvent = {
            action: 'Auth.RegisterManager',
            data: {
                email: credentials.email,
                password: credentials.password,
                name: credentials.name
            }
        };

        console.log('📝 Enviando evento de registro...', registerEvent);
        ws.send(registerEvent);

        // Esperar respuesta (timeout de 10s)
        return new Promise((resolve) => {
            const timeout = setTimeout(() => {
                unsubscribe();
                authLoading.set(false);
                authError.set('Tiempo de espera agotado. Intenta nuevamente.');
                resolve({
                    success: false,
                    message: 'Tiempo de espera agotado',
                    error: 'Timeout'
                });
            }, 10000);

            const unsubscribe = wsLastMessage.subscribe((message) => {
                if (!message) return;

                if (message.action === 'Auth.RegisterManager' || message.action === 'Auth.RegisterManagerResponse') {
                    unsubscribe();
                    clearTimeout(timeout);
                    authLoading.set(false);

                    if (message.data?.error) {
                        authError.set(message.data.error);
                        resolve({
                            success: false,
                            message: message.data.error,
                            error: message.data.error
                        });
                    } else {
                        resolve({
                            success: true,
                            message: 'Registro exitoso. Por favor verifica tu correo.'
                        });
                    }
                }
            });
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        authError.set(errorMessage);
        authLoading.set(false);

        return {
            success: false,
            message: 'Error al registrar usuario',
            error: errorMessage
        };
    }
}

/**
 * Verificar correo electrónico
 */
export async function verifyEmail(email: string, code: string): Promise<AuthResponse> {
    authLoading.set(true);
    authError.set(null);

    try {
        const ws = getWebSocketService();

        const verifyEvent = {
            action: 'Auth.ConfirmRegisterManager',
            data: {
                email,
                code
            }
        };

        console.log('✅ Enviando código de verificación...', verifyEvent);
        ws.send(verifyEvent);

        return new Promise((resolve) => {
            const timeout = setTimeout(() => {
                unsubscribe();
                authLoading.set(false);
                authError.set('Tiempo de espera agotado.');
                resolve({
                    success: false,
                    message: 'Tiempo de espera agotado',
                    error: 'Timeout'
                });
            }, 10000);

            const unsubscribe = wsLastMessage.subscribe((message) => {
                if (!message) return;

                if (message.action === 'Auth.ConfirmRegisterManager' || message.action === 'Auth.ConfirmRegisterManagerResponse') {
                    unsubscribe();
                    clearTimeout(timeout);
                    authLoading.set(false);

                    if (message.data?.error) {
                        authError.set(message.data.error);
                        resolve({
                            success: false,
                            message: message.data.error,
                            error: message.data.error
                        });
                    } else {
                        resolve({
                            success: true,
                            message: 'Verificación exitosa. Ya puedes iniciar sesión.'
                        });
                    }
                }
            });
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        authError.set(errorMessage);
        authLoading.set(false);

        return {
            success: false,
            message: 'Error al verificar correo',
            error: errorMessage
        };
    }
}

/**
 * Logout
 */
export function logout(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('manager_user');
        localStorage.removeItem('manager_token');
    }

    authState.set(initialState);
    user.set(null);
    isAuthenticated.set(false);
    authError.set(null);

    console.log('👋 Sesión cerrada');
}

/**
 * Verificar autenticación
 */
export function checkAuth(): boolean {
    const state = get(authState);
    return state.isAuthenticated;
}
