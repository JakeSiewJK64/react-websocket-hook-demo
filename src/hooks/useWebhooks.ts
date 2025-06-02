/// reference: https://stackoverflow.com/a/60161181
import React from "react";

export function useWebsocket<T>(url: string) {
  const websocketClientRef = React.useRef<WebSocket | null>(null);

  const [messages, setMessages] = React.useState<T[]>([]);
  const [readyState, setReadyState] = React.useState<number>();

  const send = React.useCallback((data: string) => {
    try {
      if (websocketClientRef.current) {
        websocketClientRef.current.send(data);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        return;
      }

      throw error;
    }
  }, []);

  // set websocket ref
  React.useEffect(() => {
    websocketClientRef.current = new WebSocket(url);

    websocketClientRef.current.onopen = () => {
      setReadyState(WebSocket.OPEN);
    };

    websocketClientRef.current.onclose = () => {
      setReadyState(WebSocket.CLOSED);
    };

    const wsCurrent = websocketClientRef.current;

    return () => {
      wsCurrent.close();
    };
  }, [url]);

  // on message received
  React.useEffect(() => {
    if (!websocketClientRef.current) {
      return;
    }

    websocketClientRef.current.onmessage = (e: MessageEvent<string>) => {
      const message = JSON.parse(e.data);

      setMessages((prev) => [...prev, message]);
    };
  }, []);

  return {
    messages,
    send,
    isOpen: readyState === WebSocket.OPEN,
    isClosed: readyState === WebSocket.CLOSED,
    isConnecting: readyState === WebSocket.CONNECTING,
  };
}
