<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { PUBLIC_WEBSOCKET_URL } from '$env/static/public';

	let ws: WebSocket | null = null;
	let status: 'disconnected' | 'connecting' | 'connected' | 'error' = 'disconnected';
	let messages: string[] = [];
	let websocketUrl = PUBLIC_WEBSOCKET_URL;
	let messageToSend = '';
	let logs: string[] = [];

	function addLog(message: string) {
		const timestamp = new Date().toLocaleTimeString();
		logs = [`[${timestamp}] ${message}`, ...logs].slice(0, 20);
		console.log(message);
	}

	function connect() {
		if (!browser) {
			addLog('❌ No estamos en el navegador');
			return;
		}

		if (ws?.readyState === WebSocket.OPEN) {
			addLog('⚠️ Ya hay una conexión activa');
			return;
		}

		try {
			status = 'connecting';
			addLog(`🔌 Conectando a: ${websocketUrl}`);

			ws = new WebSocket(websocketUrl);

			ws.onopen = () => {
				status = 'connected';
				addLog('✅ Conectado exitosamente');
			};

			ws.onmessage = (event) => {
				addLog(`📨 Mensaje recibido: ${event.data}`);
				messages = [event.data, ...messages].slice(0, 10);
			};

			ws.onerror = (error) => {
				status = 'error';
				addLog(`❌ Error: ${JSON.stringify(error)}`);
			};

			ws.onclose = (event) => {
				status = 'disconnected';
				addLog(
					`🔌 Desconectado - Code: ${event.code}, Reason: ${event.reason || 'No reason'}, Clean: ${event.wasClean}`
				);
			};
		} catch (error) {
			status = 'error';
			addLog(`❌ Error al crear WebSocket: ${error}`);
		}
	}

	function disconnect() {
		if (ws) {
			addLog('🔌 Desconectando...');
			ws.close(1000, 'Usuario desconectó');
			ws = null;
		}
	}

	function sendMessage() {
		if (!messageToSend.trim()) return;

		if (ws?.readyState === WebSocket.OPEN) {
			const message = { type: 'message', data: messageToSend };
			ws.send(JSON.stringify(message));
			addLog(`📤 Mensaje enviado: ${messageToSend}`);
			messageToSend = '';
		} else {
			addLog('❌ No se puede enviar: WebSocket no conectado');
		}
	}

	onMount(() => {
		addLog('🎯 Componente montado');
		// NO conectar automáticamente para permitir cambiar la URL primero
	});

	onDestroy(() => {
		addLog('🎯 Componente desmontado');
		disconnect();
	});
</script>

<div class="min-h-screen bg-gray-50 p-8">
	<div class="max-w-4xl mx-auto space-y-6">
		<!-- Header -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<h1 class="text-2xl font-bold text-gray-800 mb-2">🧪 WebSocket Test Tool</h1>
			<p class="text-gray-600">Herramienta de diagnóstico para probar conexiones WebSocket</p>
		</div>

		<!-- Connection Settings -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<h2 class="text-lg font-bold text-gray-800 mb-4">⚙️ Configuración de Conexión</h2>

			<div class="space-y-4">
				<div>
					<label for="websocket-url" class="block text-sm font-medium text-gray-700 mb-2"
						>URL del WebSocket</label
					>
					<input
						id="websocket-url"
						type="text"
						bind:value={websocketUrl}
						placeholder="wss://your-api-id.execute-api.region.amazonaws.com/stage"
						class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						disabled={status === 'connected' || status === 'connecting'}
					/>
					<p class="text-xs text-gray-500 mt-1">
						Ejemplo: wss://abc123.execute-api.us-east-1.amazonaws.com/production
					</p>
				</div>

				<div class="flex gap-3">
					{#if status === 'connected'}
						<button
							on:click={disconnect}
							class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
						>
							🔌 Desconectar
						</button>
					{:else if status === 'connecting'}
						<button
							disabled
							class="px-6 py-2 bg-yellow-500 text-white font-medium rounded-lg cursor-not-allowed"
						>
							⏳ Conectando...
						</button>
					{:else}
						<button
							on:click={connect}
							class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
						>
							✅ Conectar
						</button>
					{/if}

					<div
						class="flex items-center gap-2 px-4 py-2 rounded-lg border-2"
						class:border-green-500={status === 'connected'}
						class:bg-green-50={status === 'connected'}
						class:border-yellow-500={status === 'connecting'}
						class:bg-yellow-50={status === 'connecting'}
						class:border-gray-300={status === 'disconnected'}
						class:bg-gray-50={status === 'disconnected'}
						class:border-red-500={status === 'error'}
						class:bg-red-50={status === 'error'}
					>
						<span
							class="w-3 h-3 rounded-full"
							class:bg-green-500={status === 'connected'}
							class:bg-yellow-500={status === 'connecting'}
							class:animate-pulse={status === 'connecting'}
							class:bg-gray-400={status === 'disconnected'}
							class:bg-red-500={status === 'error'}
						></span>
						<span class="font-medium text-sm capitalize">{status}</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Send Message -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<h2 class="text-lg font-bold text-gray-800 mb-4">📤 Enviar Mensaje</h2>

			<div class="flex gap-2">
				<input
					type="text"
					bind:value={messageToSend}
					on:keypress={(e) => e.key === 'Enter' && sendMessage()}
					placeholder="Escribe un mensaje de prueba..."
					class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					disabled={status !== 'connected'}
				/>
				<button
					on:click={sendMessage}
					disabled={status !== 'connected' || !messageToSend.trim()}
					class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
				>
					Enviar
				</button>
			</div>
		</div>

		<!-- Logs -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-lg font-bold text-gray-800">📋 Logs de Conexión</h2>
				<button
					on:click={() => (logs = [])}
					class="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
				>
					Limpiar
				</button>
			</div>

			<div class="bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
				{#if logs.length === 0}
					<p class="text-gray-500 italic">No hay logs todavía...</p>
				{:else}
					{#each logs as log}
						<p class="text-green-400 mb-1">{log}</p>
					{/each}
				{/if}
			</div>
		</div>

		<!-- Messages Received -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-lg font-bold text-gray-800">📨 Mensajes Recibidos</h2>
				<button
					on:click={() => (messages = [])}
					class="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
				>
					Limpiar
				</button>
			</div>

			<div class="space-y-2 max-h-64 overflow-y-auto">
				{#if messages.length === 0}
					<p class="text-gray-400 italic text-center py-8">No se han recibido mensajes todavía</p>
				{:else}
					{#each messages as message, i}
						<div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
							<div class="flex justify-between items-start mb-1">
								<span class="text-xs font-semibold text-blue-600">Mensaje #{i + 1}</span>
							</div>
							<p class="text-sm text-gray-700 break-words font-mono">{message}</p>
						</div>
					{/each}
				{/if}
			</div>
		</div>

		<!-- Instructions -->
		<div class="bg-blue-50 rounded-xl border border-blue-200 p-6">
			<h3 class="font-bold text-blue-900 mb-2">📖 Instrucciones</h3>
			<ol class="text-sm text-blue-800 space-y-1 list-decimal list-inside">
				<li>Ingresa la URL de tu WebSocket API Gateway de AWS</li>
				<li>Haz clic en "Conectar" para establecer la conexión</li>
				<li>Observa los logs para ver los eventos de conexión</li>
				<li>Si se conecta, envía un mensaje de prueba</li>
				<li>
					El mensaje debe aparecer de vuelta (eco) si tu lambda onMessage está configurada
					correctamente
				</li>
			</ol>
		</div>
	</div>
</div>
