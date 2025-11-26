<script lang="ts">
	import Sidebar from '$lib/components/manager/Sidebar.svelte';
	import Header from '$lib/components/manager/Header.svelte';

	let isSidebarOpen = false;

	function toggleSidebar() {
		isSidebarOpen = !isSidebarOpen;
	}
</script>

<div class="min-h-screen bg-gray-100 font-sans">
	<Header {isSidebarOpen} on:toggleSidebar={toggleSidebar} />

	<div class="flex h-screen overflow-hidden">
		<Sidebar {isSidebarOpen} />

		<!-- Main Content -->
		<main class="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8 w-full">
			<slot />
		</main>

		<!-- Overlay for mobile sidebar -->
		{#if isSidebarOpen}
			<div
				class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
				on:click={toggleSidebar}
				role="button"
				tabindex="0"
				on:keydown={(e) => e.key === 'Enter' && toggleSidebar()}
			></div>
		{/if}
	</div>
</div>
