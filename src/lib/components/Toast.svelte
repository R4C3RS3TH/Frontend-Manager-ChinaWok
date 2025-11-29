<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import type { Toast } from '$lib/stores/toast.store';
	import { toasts } from '$lib/stores/toast.store';

	let { toast } = $props<{ toast: Toast }>();

	function close() {
		toasts.remove(toast.id);
	}

	const variantStyles: Record<string, string> = {
		SUCCESS: 'bg-green-100 border-green-500 text-green-800',
		ERROR: 'bg-red-100 border-red-500 text-red-800',
		INFO: 'bg-blue-100 border-blue-500 text-blue-800',
		WARNING: 'bg-yellow-100 border-yellow-500 text-yellow-800'
	};

	const icons: Record<string, string> = {
		SUCCESS: '✓',
		ERROR: '✕',
		INFO: 'ℹ',
		WARNING: '⚠'
	};
</script>

<div
	class="toast {variantStyles[
		toast.variant
	]} border-l-4 p-4 rounded shadow-md flex items-start gap-3 min-w-[300px] max-w-md pointer-events-auto"
	in:fly={{ y: 20, duration: 300 }}
	out:fade
	role="alert"
>
	<span class="text-xl font-bold">{icons[toast.variant]}</span>
	<div class="flex-1">
		<p class="font-medium">{toast.message}</p>
	</div>
	<button onclick={close} class="text-gray-500 hover:text-gray-700 transition-colors"> ✕ </button>
</div>

<style>
	.toast {
		margin-bottom: 0.5rem;
	}
</style>
