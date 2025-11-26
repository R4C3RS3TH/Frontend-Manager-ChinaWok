<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let isSidebarOpen = false;
	const dispatch = createEventDispatcher();

	function toggleSidebar() {
		dispatch('toggleSidebar');
	}
</script>

<div class="bg-white shadow-sm md:hidden flex items-center justify-between p-4">
	<div class="flex items-center">
		<img src="/logo.svg" alt="China Wok Logo" class="h-8 w-auto" />
	</div>
	<button on:click={toggleSidebar} class="text-gray-600 hover:text-red-600 focus:outline-none">
		<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			{#if isSidebarOpen}
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			{:else}
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"
				/>
			{/if}
		</svg>
	</button>
</div>
