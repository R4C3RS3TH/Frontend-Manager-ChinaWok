<script lang="ts">
	import { page } from '$app/stores';
	import { verifyEmail, authLoading, authError } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { getWebSocketService } from '$lib/stores';

	let email = $state('');
	let code = $state('');
	let validationError = $state('');
	let successMessage = $state('');

	onMount(() => {
		const ws = getWebSocketService();
		ws.connect();

		// Obtener email de la URL
		const emailParam = $page.url.searchParams.get('email');
		if (emailParam) {
			email = emailParam;
		} else {
			// Si no hay email, redirigir a login
			goto('/auth/login');
		}
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		validationError = '';
		successMessage = '';

		if (!code || code.length < 6) {
			validationError = 'Por favor ingresa un código válido';
			return;
		}

		const result = await verifyEmail(email, code);

		if (result.success) {
			successMessage = 'Verificación exitosa. Redirigiendo a login...';
			setTimeout(() => {
				goto('/auth/login');
			}, 2000);
		}
	}
</script>

<svelte:head>
	<title>Verificar Email - Manager ChinaWok</title>
</svelte:head>

<div class="auth-container">
	<div class="auth-card">
		<div class="auth-header">
			<div class="logo-container">
				<div class="logo-circle">
					<img src="/chinawok.png" alt="ChinaWok Logo" class="logo-img" />
				</div>
			</div>
			<h1 class="auth-title">Verificar Email</h1>
			<p class="auth-subtitle">Ingresa el código enviado a {email}</p>
		</div>

		<form onsubmit={handleSubmit} class="auth-form">
			{#if successMessage}
				<div class="success-banner">
					<span class="success-icon">✓</span>
					<span>{successMessage}</span>
				</div>
			{/if}

			{#if validationError || $authError}
				<div class="error-banner">
					<span class="error-icon">⚠️</span>
					<span>{validationError || $authError}</span>
				</div>
			{/if}

			<div class="form-group">
				<label for="code" class="form-label"> Código de Verificación </label>
				<input
					id="code"
					type="text"
					bind:value={code}
					placeholder="123456"
					class="form-input code-input"
					disabled={$authLoading}
					required
					maxlength="6"
				/>
			</div>

			<button type="submit" class="submit-btn" disabled={$authLoading}>
				{#if $authLoading}
					<span class="loading-spinner"></span>
					<span>Verificando...</span>
				{:else}
					<span>Verificar</span>
					<span class="btn-arrow">→</span>
				{/if}
			</button>
		</form>

		<div class="auth-footer">
			<p class="footer-text">
				¿No recibiste el código?
				<button class="resend-btn" disabled>Reenviar (Próximamente)</button>
			</p>
		</div>
	</div>
</div>

<style>
	/* Reutilizamos estilos de login/register */
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
			transform: translate(50px, 50px) scale(1.2);
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
		backdrop-filter: blur(50px);
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

	.success-banner {
		background: linear-gradient(135deg, #d4fce3 0%, #c3f7d8 100%);
		border: 1px solid #00904a;
		border-radius: 12px;
		padding: 1rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: #22543d;
		font-size: 0.9rem;
		animation: slideDown 0.5s ease-out;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.success-icon {
		font-size: 1.25rem;
		font-weight: bold;
		color: #22543d;
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
		font-weight: bold;
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

	.code-input {
		font-family: monospace;
		font-size: 1.5rem;
		letter-spacing: 0.5rem;
		text-align: center;
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

	.resend-btn {
		background: none;
		border: none;
		color: #00904a;
		font-weight: 600;
		cursor: pointer;
		padding: 0;
		font-size: 0.9rem;
	}

	.resend-btn:disabled {
		color: #cbd5e0;
		cursor: not-allowed;
	}
</style>
