<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		getWebSocketService,
		wsStatus,
		wsMessages,
		wsMessageCount,
		clearMessages,
		type WebSocketMessage
	} from '$lib';

	// Obtener el servicio WebSocket
	const wsService = getWebSocketService();

	// Variables reactivas para el estado
	let messageToSend = '';
	let showWebSocketPanel = false;

	const stats = [
		{
			title: 'Ventas del Día',
			value: 'S/ 1,245.00',
			change: '+12%',
			icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
			color: 'bg-green-100 text-green-600'
		},
		{
			title: 'Ordenes Activas',
			value: '12',
			change: '-2',
			icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
			color: 'bg-blue-100 text-blue-600'
		},
		{
			title: 'Clientes Nuevos',
			value: '45',
			change: '+5',
			icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
			color: 'bg-purple-100 text-purple-600'
		}
	];

	const recentOrders = [
		{
			id: '#CW-2023',
			customer: 'Juan Perez',
			items: '2x Aeropuerto, 1x Wantan',
			total: 'S/ 45.00',
			status: 'Preparando',
			time: 'Hace 5 min'
		},
		{
			id: '#CW-2022',
			customer: 'Maria Garcia',
			items: '1x Chi Jau Kay, 1x Inka Kola',
			total: 'S/ 28.00',
			status: 'Listo',
			time: 'Hace 12 min'
		},
		{
			id: '#CW-2021',
			customer: 'Carlos Lopez',
			items: '3x Chaufa de Pollo',
			total: 'S/ 54.00',
			status: 'Entregado',
			time: 'Hace 25 min'
		},
		{
			id: '#CW-2020',
			customer: 'Ana Martinez',
			items: '1x Tallarin Saltado',
			total: 'S/ 22.00',
			status: 'Cancelado',
			time: 'Hace 40 min'
		}
	];

	function getStatusColor(status: string) {
		switch (status) {
			case 'Preparando':
				return 'bg-yellow-100 text-yellow-800';
			case 'Listo':
				return 'bg-green-100 text-green-800';
			case 'Entregado':
				return 'bg-blue-100 text-blue-800';
			case 'Cancelado':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	// Funciones de WebSocket
	function getStatusBadgeColor(status: string) {
		switch (status) {
			case 'connected':
				return 'bg-green-500';
			case 'connecting':
				return 'bg-yellow-500 animate-pulse';
			case 'disconnected':
				return 'bg-gray-400';
			case 'error':
				return 'bg-red-500';
			default:
				return 'bg-gray-400';
		}
	}

	function getStatusText(status: string) {
		switch (status) {
			case 'connected':
				return 'Conectado';
			case 'connecting':
				return 'Conectando...';
			case 'disconnected':
				return 'Desconectado';
			case 'error':
				return 'Error';
			default:
				return status;
		}
	}

	function handleSendMessage() {
		if (!messageToSend.trim()) return;

		const message: WebSocketMessage = {
			type: 'message',
			data: messageToSend,
			timestamp: new Date().toISOString()
		};

		const success = wsService.send(message);
		if (success) {
			messageToSend = '';
		}
	}

	function handleConnect() {
		wsService.connect();
	}

	function handleDisconnect() {
		wsService.disconnect();
	}

	function handleClearMessages() {
		clearMessages();
	}

	// Lifecycle hooks
	onMount(() => {
		// Conectar automáticamente al montar el componente
		console.log('🎯 Componente montado - Conectando WebSocket...');
		wsService.connect();
	});

	onDestroy(() => {
		// Desconectar al desmontar el componente
		console.log('🎯 Componente desmontado - Desconectando WebSocket...');
		wsService.disconnect();
	});
</script>

<div class="space-y-6">
	<header class="flex justify-between items-center mb-8">
		<div>
			<h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
			<p class="text-gray-500">Bienvenido de nuevo, Manager.</p>
		</div>

		<!-- WebSocket Status Indicator - Enhanced & Always Visible -->
		<div class="flex items-center gap-3">
			<button
				on:click={() => (showWebSocketPanel = !showWebSocketPanel)}
				class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700 flex items-center gap-2"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 10V3L4 14h7v7l9-11h-7z"
					/>
				</svg>
				{showWebSocketPanel ? 'Ocultar' : 'Mostrar'} Panel WS
			</button>

			<!-- Enhanced Status Badge with Gradient & Animations -->
			<div
				class="flex items-center gap-3 px-4 py-2.5 rounded-lg shadow-md border-2 transition-all duration-300"
				class:border-green-400={$wsStatus === 'connected'}
				class:bg-gradient-to-r={$wsStatus === 'connected'}
				class:from-green-50={$wsStatus === 'connected'}
				class:to-emerald-50={$wsStatus === 'connected'}
				class:border-yellow-400={$wsStatus === 'connecting'}
				class:bg-yellow-50={$wsStatus === 'connecting'}
				class:border-gray-300={$wsStatus === 'disconnected'}
				class:bg-gray-50={$wsStatus === 'disconnected'}
				class:border-red-400={$wsStatus === 'error'}
				class:bg-red-50={$wsStatus === 'error'}
			>
				<!-- Status Icon with Pulse Animation -->
				<div class="relative flex items-center justify-center">
					<span class="w-3 h-3 rounded-full {getStatusBadgeColor($wsStatus)}"></span>
					{#if $wsStatus === 'connected'}
						<span class="absolute w-3 h-3 rounded-full bg-green-400 animate-ping opacity-75"></span>
					{/if}
				</div>

				<!-- Status Text with Details -->
				<div class="flex flex-col">
					<span class="text-sm font-bold text-gray-800">{getStatusText($wsStatus)}</span>
					{#if $wsStatus === 'connected'}
						<span class="text-xs text-green-600 font-medium">⚡ En tiempo real</span>
					{:else if $wsStatus === 'connecting'}
						<span class="text-xs text-yellow-600">Estableciendo conexión...</span>
					{:else if $wsStatus === 'error'}
						<span class="text-xs text-red-600">Error de conexión</span>
					{:else}
						<span class="text-xs text-gray-500">Sin conexión activa</span>
					{/if}
				</div>

				<!-- Message Counter with Icon -->
				{#if $wsMessageCount > 0}
					<div class="ml-2 flex items-center gap-1">
						<svg
							class="w-4 h-4 text-blue-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
							/>
						</svg>
						<span class="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
							{$wsMessageCount}
						</span>
					</div>
				{/if}
			</div>
		</div>
	</header>

	<!-- WebSocket Control Panel (Collapsible) -->
	{#if showWebSocketPanel}
		<div
			class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6 shadow-md"
		>
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-lg font-bold text-gray-800 flex items-center gap-2">
					<svg
						class="w-5 h-5 text-indigo-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 10V3L4 14h7v7l9-11h-7z"
						/>
					</svg>
					Panel de WebSocket
				</h2>
				<div class="flex gap-2">
					{#if $wsStatus === 'disconnected' || $wsStatus === 'error'}
						<button
							on:click={handleConnect}
							class="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
						>
							Conectar
						</button>
					{:else}
						<button
							on:click={handleDisconnect}
							class="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
						>
							Desconectar
						</button>
					{/if}
					<button
						on:click={handleClearMessages}
						class="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
					>
						Limpiar
					</button>
				</div>
			</div>

			<!-- Send Message Section -->
			<div class="bg-white rounded-lg p-4 mb-4 border border-gray-200">
				<h3 class="text-sm font-semibold text-gray-700 mb-2">Enviar Mensaje</h3>
				<div class="flex gap-2">
					<input
						type="text"
						bind:value={messageToSend}
						on:keypress={(e) => e.key === 'Enter' && handleSendMessage()}
						placeholder="Escribe un mensaje..."
						class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
						disabled={$wsStatus !== 'connected'}
					/>
					<button
						on:click={handleSendMessage}
						disabled={$wsStatus !== 'connected' || !messageToSend.trim()}
						class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
					>
						Enviar
					</button>
				</div>
			</div>

			<!-- Messages Display -->
			<div class="bg-white rounded-lg p-4 border border-gray-200">
				<h3 class="text-sm font-semibold text-gray-700 mb-2">
					Mensajes Recibidos ({$wsMessageCount})
				</h3>
				<div class="max-h-64 overflow-y-auto space-y-2">
					{#if $wsMessages.length === 0}
						<p class="text-sm text-gray-400 italic text-center py-4">
							No hay mensajes aún. Conecta y envía un mensaje de prueba.
						</p>
					{:else}
						{#each $wsMessages as message, i}
							<div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
								<div class="flex justify-between items-start mb-1">
									<span class="text-xs font-semibold text-indigo-600">
										Mensaje #{i + 1}
									</span>
									{#if message.timestamp}
										<span class="text-xs text-gray-400">
											{new Date(message.timestamp).toLocaleTimeString()}
										</span>
									{/if}
								</div>
								<p class="text-sm text-gray-700 break-words">
									{typeof message.data === 'string' ? message.data : JSON.stringify(message.data)}
								</p>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each stats as stat}
			<div
				class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
			>
				<div class="flex justify-between items-start">
					<div>
						<p class="text-sm font-medium text-gray-500">{stat.title}</p>
						<h3 class="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
					</div>
					<div class="p-2 rounded-lg {stat.color}">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={stat.icon} />
						</svg>
					</div>
				</div>
				<div class="mt-4 flex items-center text-sm">
					<span
						class="{stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'} font-medium"
					>
						{stat.change}
					</span>
					<span class="text-gray-400 ml-2">vs ayer</span>
				</div>
			</div>
		{/each}
	</div>

	<!-- Recent Orders -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
		<div class="p-6 border-b border-gray-100 flex justify-between items-center">
			<h2 class="text-lg font-bold text-gray-800">Ordenes Recientes</h2>
			<a href="/manager/orders" class="text-red-600 hover:text-red-700 text-sm font-medium"
				>Ver todas</a
			>
		</div>
		<div class="overflow-x-auto">
			<table class="w-full text-left">
				<thead>
					<tr class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
						<th class="px-6 py-4 font-medium">ID Orden</th>
						<th class="px-6 py-4 font-medium">Cliente</th>
						<th class="px-6 py-4 font-medium">Items</th>
						<th class="px-6 py-4 font-medium">Total</th>
						<th class="px-6 py-4 font-medium">Estado</th>
						<th class="px-6 py-4 font-medium">Tiempo</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					{#each recentOrders as order}
						<tr class="hover:bg-gray-50 transition-colors">
							<td class="px-6 py-4 font-medium text-gray-900">{order.id}</td>
							<td class="px-6 py-4 text-gray-600">{order.customer}</td>
							<td class="px-6 py-4 text-gray-500 text-sm max-w-xs truncate">{order.items}</td>
							<td class="px-6 py-4 font-medium text-gray-900">{order.total}</td>
							<td class="px-6 py-4">
								<span
									class="px-3 py-1 rounded-full text-xs font-medium {getStatusColor(order.status)}"
								>
									{order.status}
								</span>
							</td>
							<td class="px-6 py-4 text-gray-400 text-sm">{order.time}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
