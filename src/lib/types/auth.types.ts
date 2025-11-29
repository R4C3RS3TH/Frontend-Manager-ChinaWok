export interface User {
	email: string;
	userId?: string;
	role?: 'manager' | 'admin';
	token?: string;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterCredentials {
	email: string;
	password: string;
	confirmPassword?: string;
}

export interface AuthResponse {
	success: boolean;
	message: string;
	user?: User;
	token?: string;
	error?: string;
}

export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	loading: boolean;
	error: string | null;
}
