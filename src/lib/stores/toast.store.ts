import { writable } from 'svelte/store';
import type { UiVariant } from '$lib/types/notification';

export interface Toast {
    id: string;
    message: string;
    variant: UiVariant;
    duration?: number;
}

function createToastStore() {
    const { subscribe, update } = writable<Toast[]>([]);

    return {
        subscribe,
        add: (message: string, variant: UiVariant = 'INFO', duration = 3000) => {
            const id = crypto.randomUUID();
            const toast: Toast = { id, message, variant, duration };

            update((toasts) => [...toasts, toast]);

            if (duration > 0) {
                setTimeout(() => {
                    update((toasts) => toasts.filter((t) => t.id !== id));
                }, duration);
            }
        },
        remove: (id: string) => {
            update((toasts) => toasts.filter((t) => t.id !== id));
        }
    };
}

export const toasts = createToastStore();
