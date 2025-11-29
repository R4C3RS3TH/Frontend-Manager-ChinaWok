import { PUBLIC_WEBSOCKET_URL } from '$env/static/public';

export type WebSocketStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

export interface WebSocketMessage {
    type: string;
    data: any;
    timestamp?: string;
}

export class WebSocketService {
    private ws: WebSocket | null = null;
    private reconnectTimeout: NodeJS.Timeout | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 3000; // 3 segundos

    // Callbacks
    private onMessageCallback: ((message: WebSocketMessage) => void) | null = null;
    private onStatusChangeCallback: ((status: WebSocketStatus) => void) | null = null;
    private onErrorCallback: ((error: Event | Error) => void) | null = null;

    constructor() {
        // Se iniciará la conexión cuando se llame a connect()
    }

    /**
     * Conectar al WebSocket
     */
    connect(): void {
        if (this.ws?.readyState === WebSocket.OPEN) {
            console.log('⚡ WebSocket ya está conectado');
            return;
        }

        try {
            this.updateStatus('connecting');
            console.log(`🔌 Conectando a WebSocket: ${PUBLIC_WEBSOCKET_URL}`);

            this.ws = new WebSocket(PUBLIC_WEBSOCKET_URL);

            // Evento: Conexión exitosa
            this.ws.onopen = () => {
                console.log('✅ WebSocket conectado exitosamente');
                this.reconnectAttempts = 0;
                this.updateStatus('connected');
            };

            // Evento: Mensaje recibido
            this.ws.onmessage = (event) => {
                try {
                    const message: WebSocketMessage = JSON.parse(event.data);
                    console.log('📨 Mensaje recibido:', message);
                    this.onMessageCallback?.(message);
                } catch (error) {
                    // Si no es JSON, manejar como texto plano
                    const message: WebSocketMessage = {
                        type: 'text',
                        data: event.data,
                        timestamp: new Date().toISOString()
                    };
                    console.log('📨 Mensaje recibido (texto):', event.data);
                    this.onMessageCallback?.(message);
                }
            };

            // Evento: Error
            this.ws.onerror = (error) => {
                console.error('❌ Error en WebSocket:', error);
                this.updateStatus('error');
                this.onErrorCallback?.(error);
            };

            // Evento: Conexión cerrada
            this.ws.onclose = (event) => {
                console.log('🔌 WebSocket desconectado:', {
                    code: event.code,
                    reason: event.reason || 'Sin razón especificada',
                    wasClean: event.wasClean
                });
                this.updateStatus('disconnected');
                this.handleReconnect();
            };
        } catch (error) {
            console.error('❌ Error al crear WebSocket:', error);
            this.updateStatus('error');
            if (error instanceof Error) {
                this.onErrorCallback?.(error);
            }
        }
    }

    /**
     * Enviar mensaje al servidor
     */
    send(message: WebSocketMessage | string): boolean {
        if (this.ws?.readyState !== WebSocket.OPEN) {
            console.error('❌ No se puede enviar mensaje: WebSocket no está conectado');
            return false;
        }

        try {
            const payload = typeof message === 'string' ? message : JSON.stringify(message);
            this.ws.send(payload);
            console.log('📤 Mensaje enviado:', message);
            return true;
        } catch (error) {
            console.error('❌ Error al enviar mensaje:', error);
            return false;
        }
    }

    /**
     * Desconectar WebSocket
     */
    disconnect(): void {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        if (this.ws) {
            console.log('🔌 Desconectando WebSocket...');
            this.ws.close(1000, 'Desconexión intencional del cliente');
            this.ws = null;
        }

        this.reconnectAttempts = 0;
    }

    /**
     * Intentar reconectar automáticamente
     */
    private handleReconnect(): void {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error(
                `❌ Máximo de intentos de reconexión alcanzado (${this.maxReconnectAttempts})`
            );
            return;
        }

        this.reconnectAttempts++;
        const delay = this.reconnectDelay * this.reconnectAttempts;

        console.log(
            `🔄 Reintentando conexión en ${delay / 1000}s (intento ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
        );

        this.reconnectTimeout = setTimeout(() => {
            this.connect();
        }, delay);
    }

    /**
     * Registrar callback para mensajes recibidos
     */
    onMessage(callback: (message: WebSocketMessage) => void): void {
        this.onMessageCallback = callback;
    }

    /**
     * Registrar callback para cambios de estado
     */
    onStatusChange(callback: (status: WebSocketStatus) => void): void {
        this.onStatusChangeCallback = callback;
    }

    /**
     * Registrar callback para errores
     */
    onError(callback: (error: Event | Error) => void): void {
        this.onErrorCallback = callback;
    }

    /**
     * Actualizar estado y notificar callbacks
     */
    private updateStatus(status: WebSocketStatus): void {
        this.onStatusChangeCallback?.(status);
    }

    /**
     * Obtener estado actual de la conexión
     */
    getStatus(): WebSocketStatus {
        if (!this.ws) return 'disconnected';

        switch (this.ws.readyState) {
            case WebSocket.CONNECTING:
                return 'connecting';
            case WebSocket.OPEN:
                return 'connected';
            case WebSocket.CLOSING:
            case WebSocket.CLOSED:
                return 'disconnected';
            default:
                return 'disconnected';
        }
    }
}
