<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	// Mock data for orders
	let orders = [
		{
			id: '#CW-2023',
			customer: 'Juan Perez',
			phone: '987654321',
			address: 'Av. Larco 123, Miraflores',
			items: [
				{ name: 'Chijaukay', quantity: 2, price: 24.9 },
				{ name: 'Arroz Chaufa de Pollo', quantity: 1, price: 19.9 }
			],
			total: 69.7,
			status: 'Preparando',
			time: 'Hace 5 min',
			paymentMethod: 'Yape'
		},
		{
			id: '#CW-2022',
			customer: 'Maria Garcia',
			phone: '912345678',
			address: 'Jr. Unión 456, Lima',
			items: [
				{ name: 'Alitas BBQ x12', quantity: 3, price: 24.9 },
				{ name: 'Tallarín Saltado con Pollo', quantity: 2, price: 21.9 }
			],
			total: 118.5,
			status: 'Preparando',
			time: 'Hace 8 min',
			paymentMethod: 'Efectivo'
		},
		{
			id: '#CW-2021',
			customer: 'Carlos Lopez',
			phone: '998877665',
			address: 'Calle Los Pinos 789, San Isidro',
			items: [
				{ name: 'Tipakay', quantity: 2, price: 24.9 },
				{ name: 'Tallarín Taypá', quantity: 2, price: 22.9 }
			],
			total: 95.6,
			status: 'Preparando',
			time: 'Hace 12 min',
			paymentMethod: 'Tarjeta'
		},
		{
			id: '#CW-2020',
			customer: 'Ana Martinez',
			phone: '955443322',
			address: 'Av. Arequipa 1020, Lince',
			items: [
				{ name: 'Arroz Chaufa de Pollo', quantity: 4, price: 19.9 },
				{ name: 'Alitas BBQ x6', quantity: 1, price: 26.9 }
			],
			total: 106.5,
			status: 'Listo',
			time: 'Hace 18 min',
			paymentMethod: 'Plin'
		},
		{
			id: '#CW-2019',
			customer: 'Roberto Silva',
			phone: '966778899',
			address: 'Av. Javier Prado 2020, San Borja',
			items: [
				{ name: 'Alitas BBQ x6', quantity: 3, price: 26.9 },
				{ name: 'Chijaukay', quantity: 2, price: 24.9 }
			],
			total: 130.5,
			status: 'Listo',
			time: 'Hace 25 min',
			paymentMethod: 'Yape'
		},
		{
			id: '#CW-2018',
			customer: 'Laura Gomez',
			phone: '944556677',
			address: 'Calle Las Flores 333, Surco',
			items: [
				{ name: 'Tallarín Saltado con Pollo', quantity: 2, price: 21.9 },
				{ name: 'Tipakay', quantity: 2, price: 24.9 }
			],
			total: 93.6,
			status: 'En camino',
			time: 'Hace 35 min',
			paymentMethod: 'Efectivo'
		},
		{
			id: '#CW-2017',
			customer: 'Diego Ramirez',
			phone: '933221100',
			address: 'Av. Benavides 555, Miraflores',
			items: [
				{ name: 'Arroz Chaufa de Pollo', quantity: 3, price: 19.9 },
				{ name: 'Alitas BBQ x12', quantity: 2, price: 24.9 }
			],
			total: 109.5,
			status: 'Entregado',
			time: 'Hace 42 min',
			paymentMethod: 'Tarjeta'
		},
		{
			id: '#CW-2016',
			customer: 'Sofia Torres',
			phone: '922334455',
			address: 'Jr. Cusco 888, Cercado',
			items: [
				{ name: 'Tallarín Taypá', quantity: 3, price: 22.9 },
				{ name: 'Chijaukay', quantity: 1, price: 24.9 }
			],
			total: 93.6,
			status: 'Entregado',
			time: 'Hace 55 min',
			paymentMethod: 'Yape'
		},
		{
			id: '#CW-2015',
			customer: 'Miguel Vargas',
			phone: '911223344',
			address: 'Av. Colonial 999, Callao',
			items: [
				{ name: 'Chijaukay', quantity: 2, price: 24.9 },
				{ name: 'Alitas BBQ x6', quantity: 3, price: 26.9 }
			],
			total: 130.5,
			status: 'Entregado',
			time: 'Hace 1 hora',
			paymentMethod: 'Plin'
		},
		{
			id: '#CW-2014',
			customer: 'Patricia Flores',
			phone: '900112233',
			address: 'Calle Roma 444, San Miguel',
			items: [
				{ name: 'Tipakay', quantity: 2, price: 24.9 },
				{ name: 'Arroz Chaufa de Pollo', quantity: 3, price: 19.9 }
			],
			total: 109.5,
			status: 'Entregado',
			time: 'Hace 1 hora',
			paymentMethod: 'Efectivo'
		},
		{
			id: '#CW-2013',
			customer: 'Fernando Castro',
			phone: '988776655',
			address: 'Av. La Marina 777, Pueblo Libre',
			items: [
				{ name: 'Tallarín Saltado con Pollo', quantity: 4, price: 21.9 },
				{ name: 'Alitas BBQ x12', quantity: 1, price: 24.9 }
			],
			total: 112.5,
			status: 'Entregado',
			time: 'Hace 1 hora',
			paymentMethod: 'Tarjeta'
		},
		{
			id: '#CW-2012',
			customer: 'Claudia Mendez',
			phone: '977665544',
			address: 'Jr. Ancash 222, Breña',
			items: [
				{ name: 'Alitas BBQ x12', quantity: 2, price: 24.9 },
				{ name: 'Tallarín Taypá', quantity: 1, price: 22.9 }
			],
			total: 72.7,
			status: 'Cancelado',
			time: 'Hace 1 hora',
			paymentMethod: 'Yape'
		}
	];

	let selectedOrder: any = null;
	let isDetailOpen = false;

	const statuses = ['Pendiente', 'Preparando', 'Listo', 'En camino', 'Entregado', 'Cancelado'];

	function getStatusColor(status: string) {
		switch (status) {
			case 'Pendiente':
				return 'bg-gray-100 text-gray-800 border-gray-200';
			case 'Preparando':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'Listo':
				return 'bg-orange-100 text-orange-800 border-orange-200';
			case 'En camino':
				return 'bg-blue-100 text-blue-800 border-blue-200';
			case 'Entregado':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'Cancelado':
				return 'bg-red-100 text-red-800 border-red-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	}

	function openOrderDetails(order: any) {
		selectedOrder = { ...order }; // Create a copy to avoid direct mutation until saved (though here we update directly for simplicity in "real-time" feel)
		isDetailOpen = true;
	}

	function closeOrderDetails() {
		isDetailOpen = false;
		selectedOrder = null;
	}

	function updateStatus(newStatus: string) {
		if (selectedOrder) {
			selectedOrder.status = newStatus;
			// Update the list
			orders = orders.map((o) => (o.id === selectedOrder.id ? { ...selectedOrder } : o));
		}
	}

	function formatCurrency(amount: number) {
		return `S/ ${amount.toFixed(2)}`;
	}
</script>

<div class="space-y-6 p-6">
	<header class="flex justify-between items-center mb-8">
		<div>
			<h1 class="text-2xl font-bold text-gray-800">Gestión de Ordenes</h1>
			<p class="text-gray-500">Administra y actualiza el estado de los pedidos.</p>
		</div>
	</header>

	<!-- Orders List -->
	<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
						<th class="px-6 py-4 font-medium text-right">Acciones</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					{#each orders as order}
						<tr class="hover:bg-gray-50 transition-colors">
							<td class="px-6 py-4 font-medium text-gray-900">{order.id}</td>
							<td class="px-6 py-4">
								<div class="flex flex-col">
									<span class="text-gray-900 font-medium">{order.customer}</span>
									<span class="text-gray-500 text-xs">{order.phone}</span>
								</div>
							</td>
							<td class="px-6 py-4 text-gray-500 text-sm max-w-xs truncate">
								{order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
							</td>
							<td class="px-6 py-4 font-medium text-gray-900">{formatCurrency(order.total)}</td>
							<td class="px-6 py-4">
								<span
									class="px-3 py-1 rounded-full text-xs font-medium border {getStatusColor(
										order.status
									)}"
								>
									{order.status}
								</span>
							</td>
							<td class="px-6 py-4 text-gray-400 text-sm">{order.time}</td>
							<td class="px-6 py-4 text-right">
								<button
									on:click={() => openOrderDetails(order)}
									class="text-indigo-600 hover:text-indigo-900 font-medium text-sm hover:underline"
								>
									Gestionar
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Order Detail Modal -->
	{#if isDetailOpen && selectedOrder}
		<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				class="absolute inset-0 bg-black/50 backdrop-blur-sm"
				transition:fade={{ duration: 200 }}
				on:click={closeOrderDetails}
				role="button"
				tabindex="0"
				on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && closeOrderDetails()}
			></div>
			<div
				class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10"
				transition:fly={{ y: 20, duration: 300 }}
			>
				<!-- Modal Header -->
				<div
					class="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center"
				>
					<div>
						<h2 class="text-xl font-bold text-gray-800">Orden {selectedOrder.id}</h2>
						<p class="text-sm text-gray-500">{selectedOrder.time}</p>
					</div>
					<button
						on:click={closeOrderDetails}
						class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200"
						aria-label="Cerrar detalles"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				<!-- Modal Body -->
				<div class="p-6 space-y-6">
					<!-- Customer Info -->
					<div class="flex flex-col md:flex-row gap-6">
						<div class="flex-1 space-y-1">
							<h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Cliente</h3>
							<p class="font-medium text-gray-900">{selectedOrder.customer}</p>
							<p class="text-sm text-gray-600">{selectedOrder.phone}</p>
						</div>
						<div class="flex-1 space-y-1">
							<h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
								Dirección
							</h3>
							<p class="text-sm text-gray-900">{selectedOrder.address}</p>
						</div>
						<div class="flex-1 space-y-1">
							<h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pago</h3>
							<p class="text-sm text-gray-900">{selectedOrder.paymentMethod}</p>
						</div>
					</div>

					<hr class="border-gray-100" />

					<!-- Order Items -->
					<div>
						<h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
							Detalle del Pedido
						</h3>
						<div class="bg-gray-50 rounded-lg p-4 space-y-3">
							{#each selectedOrder.items as item}
								<div class="flex justify-between items-center">
									<div class="flex items-center gap-3">
										<span
											class="w-6 h-6 flex items-center justify-center bg-white border border-gray-200 rounded text-xs font-bold text-gray-700"
										>
											{item.quantity}
										</span>
										<span class="text-gray-800 font-medium">{item.name}</span>
									</div>
									<span class="text-gray-900 font-medium"
										>{formatCurrency(item.price * item.quantity)}</span
									>
								</div>
							{/each}
							<div class="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center">
								<span class="font-bold text-gray-800">Total</span>
								<span class="font-bold text-xl text-indigo-600"
									>{formatCurrency(selectedOrder.total)}</span
								>
							</div>
						</div>
					</div>

					<!-- Status Management -->
					<div>
						<h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
							Actualizar Estado
						</h3>
						<div class="flex flex-wrap gap-2">
							{#each statuses as status}
								<button
									on:click={() => updateStatus(status)}
									class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border {selectedOrder.status ===
									status
										? `${getStatusColor(status)} ring-2 ring-offset-1 ring-indigo-500`
										: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'}"
								>
									{status}
								</button>
							{/each}
						</div>
					</div>
				</div>

				<!-- Modal Footer -->
				<div class="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end">
					<button
						on:click={closeOrderDetails}
						class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm"
					>
						Listo
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
