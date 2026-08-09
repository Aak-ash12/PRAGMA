export class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;

  constructor(endpoint: string) {
    this.url = `ws://localhost:8000/ws${endpoint}`;
  }

  connect(onMessage: (data: any) => void) {
    const token = localStorage.getItem('pragma_token');
    // Using query parameter for auth since standard WebSockets don't easily support custom headers in browser API
    this.ws = new WebSocket(`${this.url}?token=${token}`);

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (err) {
        console.error("WebSocket message parse error", err);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      setTimeout(() => this.connect(onMessage), 5000); // Reconnect attempt
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
