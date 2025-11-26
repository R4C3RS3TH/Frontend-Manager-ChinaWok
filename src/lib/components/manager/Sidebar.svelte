<script lang="ts">
	import { page } from '$app/stores';

	export let isSidebarOpen = false;

	const menuItems = [
		{
			name: 'Dashboard',
			href: '/manager',
			icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
		},
		{
			name: 'Ordenes',
			href: '/manager/orders',
			icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
		},
		{
			name: 'Menú',
			href: '/manager/menu',
			icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
		}
	];
</script>

<aside
	class="{isSidebarOpen
		? 'translate-x-0'
		: '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col"
>
	<div class="flex items-center justify-center h-20 border-b border-gray-200">
		<div class="flex items-center gap-2 px-6">
			<img src="/logo.svg" alt="China Wok Logo" class="h-10 w-auto" />
		</div>
	</div>

	<nav class="flex-1 overflow-y-auto py-4">
		<ul class="space-y-1 px-2">
			{#each menuItems as item}
				<li>
					<a
						href={item.href}
						class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors group {$page
							.url.pathname === item.href
							? 'bg-red-50 text-red-600 font-medium'
							: ''}"
					>
						<svg
							class="w-5 h-5 mr-3 group-hover:text-red-600 {$page.url.pathname === item.href
								? 'text-red-600'
								: 'text-gray-400'}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
						</svg>
						{item.name}
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<div class="p-4 border-t border-gray-200">
		<button
			class="flex items-center w-full px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
		>
			<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
				/>
			</svg>
			Cerrar Sesión
		</button>
	</div>
</aside>
