import { writable } from 'svelte/store';
import { WebSocketService, type WebSocketStatus, type WebSocketMessage } from '$lib/websocket';

// Estado del WebSocket
export const wsStatus = writable<WebSocketStatus>('disconnected');

// Mensajes recibidos
export const wsMessages = writable<WebSocketMessage[]>([]);

// Último mensaje recibido
export const wsLastMessage = writable<WebSocketMessage | null>(null);

// Contador de mensajes
export const wsMessageCount = writable<number>(0);

// Instancia del servicio WebSocket (singleton)
let wsService: WebSocketService | null = null;

/**
 * Obtener o crear la instancia del servicio WebSocket
 */
import { goto } from '$app/navigation';
import { toasts } from './toast.store';
import type { ClientPayload } from '$lib/types/notification';

// ... (imports remain the same)

export function getWebSocketService(): WebSocketService {
    if (!wsService) {
        wsService = new WebSocketService();

        // Configurar callbacks
        wsService.onStatusChange((status) => {
            wsStatus.set(status);
        });

        wsService.onMessage((message) => {
            wsLastMessage.set(message);
            wsMessages.update((messages) => [...messages, message]);
            wsMessageCount.update((count) => count + 1);

            // Manejar notificaciones del backend
            if (message.type === 'NOTIFICATION' && message.data) {
                const payload = message.data as ClientPayload;

                // 1. Manejar Acciones de UI
                if (payload.ui) {
                    switch (payload.ui.action) {
                        case 'SHOW_TOAST':
                            toasts.add(
                                payload.ui.message,
                                payload.ui.variant || 'INFO'
                            );
                            break;

                        case 'REDIRECT':
                            if (payload.data?.redirectUrl) {
                                goto(payload.data.redirectUrl);
                            }
                            break;
                    }
                }
            }
        });

        wsService.onError((error) => {
            console.error('WebSocket Store - Error:', error);
        });
    }

    return wsService;
}

/**
 * Limpiar todos los mensajes
 */
export function clearMessages(): void {
    wsMessages.set([]);
    wsLastMessage.set(null);
    wsMessageCount.set(0);
}
