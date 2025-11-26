<script lang="ts">
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
</script>

<div class="space-y-6">
	<header class="flex justify-between items-center mb-8">
		<div>
			<h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
			<p class="text-gray-500">Bienvenido de nuevo, Manager.</p>
		</div>
	</header>

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
