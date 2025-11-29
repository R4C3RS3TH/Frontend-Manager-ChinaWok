import { writable, get } from 'svelte/store';
import { getWebSocketService } from './websocket.store';
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
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
    authLoading.set(true);
    authError.set(null);

    try {
        const ws = getWebSocketService();

        // Enviar evento de login vía WebSocket
        const loginEvent = {
            type: 'LoginManagerAdmin',
            data: {
                action: 'message',
                'detail-type': 'LoginManagerAdmin',
                client: {
                    gmail: credentials.email,
                    password: credentials.password
                }
            }
        };

        console.log('🔐 Enviando evento de login...', loginEvent);
        ws.send(loginEvent);

        // Por ahora simulamos una respuesta exitosa
        // TODO: Implementar listener real para respuesta del backend via WebSocket
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockUser: User = {
                    email: credentials.email,
                    userId: 'mock-user-id',
                    role: 'manager'
                };

                // Guardar en localStorage
                if (typeof window !== 'undefined') {
                    localStorage.setItem('manager_user', JSON.stringify(mockUser));
                    localStorage.setItem('manager_token', 'mock-token-' + Date.now());
                }

                authState.set({
                    user: mockUser,
                    isAuthenticated: true,
                    loading: false,
                    error: null
                });

                user.set(mockUser);
                isAuthenticated.set(true);
                authLoading.set(false);

                resolve({
                    success: true,
                    message: 'Login exitoso',
                    user: mockUser
                });
            }, 1000);
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
            type: 'RegisterManager',
            data: {
                action: 'message',
                'detail-type': 'RegisterManager',
                client: {
                    gmail: credentials.email,
                    password: credentials.password
                }
            }
        };

        console.log('📝 Enviando evento de registro...', registerEvent);
        ws.send(registerEvent);

        // Simulamos respuesta exitosa
        // TODO: Implementar listener real para respuesta del backend via WebSocket
        return new Promise((resolve) => {
            setTimeout(() => {
                authLoading.set(false);

                resolve({
                    success: true,
                    message: 'Registro exitoso. Por favor inicia sesión.'
                });
            }, 1000);
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
