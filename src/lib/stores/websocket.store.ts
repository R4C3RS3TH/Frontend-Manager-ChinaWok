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
