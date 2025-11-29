<script lang="ts">
	import { toasts } from '$lib/stores/toast.store';
	import Toast from './Toast.svelte';
</script>

<div class="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-none p-4">
	{#each $toasts as toast (toast.id)}
		<Toast {toast} />
	{/each}
</div>
