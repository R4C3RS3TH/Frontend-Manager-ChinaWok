<script lang="ts">
	import { login, authLoading, authError } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { getWebSocketService } from '$lib/stores';

	let email = $state('');
	let password = $state('');
	let validationError = $state('');

	// Conectar WebSocket al montar
	onMount(() => {
		const ws = getWebSocketService();
		ws.connect();
	});

	function validateForm(): boolean {
		validationError = '';

		if (!email || !password) {
			validationError = 'Por favor completa todos los campos';
			return false;
		}

		if (!email.includes('@')) {
			validationError = 'Por favor ingresa un correo válido';
			return false;
		}

		if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)) {
			validationError =
				'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial';
			return false;
		}

		return true;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validateForm()) return;

		const result = await login({ email, password });

		if (result.success) {
			goto('/manager');
		}
	}
</script>

<svelte:head>
	<title>Login - Manager ChinaWok</title>
</svelte:head>

<div class="auth-container">
	<div class="auth-card">
		<div class="auth-header">
			<div class="logo-container">
				<div class="logo-circle">
					<img src="/chinawok.png" alt="ChinaWok Logo" class="logo-img" />
				</div>
			</div>
			<h1 class="auth-title">Manager Login</h1>
			<p class="auth-subtitle">Accede al panel de gestión</p>
		</div>

		<form onsubmit={handleSubmit} class="auth-form">
			{#if validationError || $authError}
				<div class="error-banner">
					<span class="error-icon">⚠️</span>
					<span>{validationError || $authError}</span>
				</div>
			{/if}

			<div class="form-group">
				<label for="email" class="form-label"> Correo Electrónico </label>
				<input
					id="email"
					type="email"
					bind:value={email}
					placeholder="manager@chinawok.com"
					class="form-input"
					disabled={$authLoading}
					required
				/>
			</div>

			<div class="form-group">
				<label for="password" class="form-label"> Contraseña </label>
				<input
					id="password"
					type="password"
					bind:value={password}
					placeholder="••••••••"
					class="form-input"
					disabled={$authLoading}
					required
				/>
			</div>

			<button type="submit" class="submit-btn" disabled={$authLoading}>
				{#if $authLoading}
					<span class="loading-spinner"></span>
					<span>Iniciando sesión...</span>
				{:else}
					<span>Iniciar Sesión</span>
					<span class="btn-arrow">→</span>
				{/if}
			</button>
		</form>

		<div class="auth-footer">
			<p class="footer-text">
				¿No tienes cuenta?
				<a href="/auth/register" class="footer-link">Regístrate aquí</a>
			</p>
		</div>
	</div>
</div>

<style>
	.auth-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		background: #f8fafc;
		position: relative;
		overflow: hidden;
		z-index: 0;
	}

	.auth-container::before {
		content: '';
		position: absolute;
		top: -10%;
		left: -10%;
		width: 600px;
		height: 600px;
		background: radial-gradient(circle, rgba(227, 30, 36, 0.15) 0%, transparent 70%);
		filter: blur(60px);
		border-radius: 50%;
		animation: floatRed 20s ease-in-out infinite alternate;
		z-index: -1;
	}

	.auth-container::after {
		content: '';
		position: absolute;
		bottom: -10%;
		right: -10%;
		width: 500px;
		height: 500px;
		background: radial-gradient(circle, rgba(0, 144, 74, 0.15) 0%, transparent 70%);
		filter: blur(60px);
		border-radius: 50%;
		animation: floatGreen 15s ease-in-out infinite alternate;
		z-index: -1;
	}

	@keyframes floatRed {
		0% {
			transform: translate(0, 0) scale(1);
		}
		100% {
			transform: translate(50px, 50px) scale(1.1);
		}
	}

	@keyframes floatGreen {
		0% {
			transform: translate(0, 0) scale(1);
		}
		100% {
			transform: translate(-50px, -50px) scale(1.2);
		}
	}

	.auth-card {
		background: rgba(255, 255, 255, 0.98);
		backdrop-filter: blur(20px);
		border-radius: 24px;
		box-shadow:
			0 20px 60px rgba(0, 0, 0, 0.3),
			0 0 0 1px rgba(255, 255, 255, 0.1);
		padding: 3rem;
		width: 100%;
		max-width: 440px;
		position: relative;
		z-index: 1;
		animation: slideUp 0.5s ease-out;
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.auth-header {
		text-align: center;
		margin-bottom: 2.5rem;
	}

	.logo-container {
		display: flex;
		justify-content: center;
		margin-bottom: 1.5rem;
	}

	.logo-circle {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background: white;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 10px 30px rgba(227, 30, 36, 0.2);
		animation: pulse 2s ease-in-out infinite;
		padding: 10px;
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
			box-shadow: 0 10px 30px rgba(227, 30, 36, 0.2);
		}
		50% {
			transform: scale(1.05);
			box-shadow: 0 15px 40px rgba(227, 30, 36, 0.4);
		}
	}

	.logo-img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.auth-title {
		font-size: 2rem;
		font-weight: 700;
		color: #1a202c;
		margin: 0 0 0.5rem 0;
		background: linear-gradient(135deg, #e31e24 0%, #b9191e 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.auth-subtitle {
		font-size: 1rem;
		color: #718096;
		margin: 0;
	}

	.auth-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.error-banner {
		background: linear-gradient(135deg, #fee 0%, #fdd 100%);
		border: 1px solid #fcc;
		border-radius: 12px;
		padding: 1rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: #c53030;
		font-size: 0.9rem;
		animation: shake 0.5s ease-in-out;
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-10px);
		}
		75% {
			transform: translateX(10px);
		}
	}

	.error-icon {
		font-size: 1.25rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-label {
		font-size: 0.9rem;
		font-weight: 600;
		color: #2d3748;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.form-input {
		padding: 0.875rem 1.25rem;
		border: 2px solid #e2e8f0;
		border-radius: 12px;
		font-size: 1rem;
		color: #2d3748;
		background: white;
		transition: all 0.3s ease;
		outline: none;
	}

	.form-input:focus {
		border-color: #00904a;
		box-shadow: 0 0 0 3px rgba(0, 144, 74, 0.1);
		transform: translateY(-2px);
	}

	.form-input:disabled {
		background: #f7fafc;
		cursor: not-allowed;
		opacity: 0.6;
	}

	.form-input::placeholder {
		color: #cbd5e0;
	}

	.submit-btn {
		margin-top: 1rem;
		padding: 1rem 2rem;
		background: linear-gradient(135deg, #e31e24 0%, #b9191e 100%);
		color: white;
		border: none;
		border-radius: 12px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		box-shadow: 0 10px 20px rgba(227, 30, 36, 0.3);
		position: relative;
		overflow: hidden;
	}

	.submit-btn::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		transition: left 0.5s ease;
	}

	.submit-btn:hover::before {
		left: 100%;
	}

	.submit-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 15px 30px rgba(227, 30, 36, 0.4);
	}

	.submit-btn:active:not(:disabled) {
		transform: translateY(0);
	}

	.submit-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
		transform: none;
	}

	.btn-arrow {
		font-size: 1.25rem;
		transition: transform 0.3s ease;
	}

	.submit-btn:hover .btn-arrow {
		transform: translateX(4px);
	}

	.loading-spinner {
		width: 20px;
		height: 20px;
		border: 3px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.auth-footer {
		margin-top: 2rem;
		text-align: center;
		padding-top: 2rem;
		border-top: 1px solid #e2e8f0;
	}

	.footer-text {
		color: #718096;
		font-size: 0.9rem;
		margin: 0;
	}

	.footer-link {
		color: #00904a;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s ease;
		position: relative;
	}

	.footer-link::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		width: 0;
		height: 2px;
		background: #00904a;
		transition: width 0.3s ease;
	}

	.footer-link:hover::after {
		width: 100%;
	}

	.footer-link:hover {
		color: #00703a;
	}

	@media (max-width: 640px) {
		.auth-container {
			padding: 1rem;
		}

		.auth-card {
			padding: 2rem 1.5rem;
		}

		.auth-title {
			font-size: 1.75rem;
		}

		.logo-circle {
			width: 70px;
			height: 70px;
		}
	}
</style>
