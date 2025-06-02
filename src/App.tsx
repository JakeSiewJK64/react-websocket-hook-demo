import { useWebsocket } from "./hooks/useWebhooks";

type BlockchainMessage = {
  op: string;
  x: {
    hash: string;
    out: {
      addr: string;
      spent: boolean;
      value: number;
    };
  };
};

const subscribe = {
  op: "unconfirmed_sub",
};

const unsubscribe = {
  op: "unconfirmed_unsub",
};

const WEBSOCKET_URL = "wss://ws.blockchain.info/inv";

function App() {
  const { messages, send, isClosed, isConnecting, isOpen } =
    useWebsocket<BlockchainMessage>(WEBSOCKET_URL);

  return (
    <div className="max-w-[50%]">
      <button
        className="border rounded m-1 p-1 cursor-pointer"
        onClick={() => {
          send(JSON.stringify(subscribe));
        }}
      >
        Click to subscribe
      </button>
      <button
        className="border rounded m-1 p-1 cursor-pointer"
        onClick={() => {
          send(JSON.stringify(unsubscribe));
        }}
      >
        Click to unsubscribe
      </button>
      <div className="font-bold m-1">
        {isOpen && <p className="text-green-600">OPEN</p>}
        {isClosed && <p className="text-red-600">CLOSED</p>}
        {isConnecting && <p className="text-orange-600">CONNECTING...</p>}
      </div>
      <div className="m-1 flex flex-col gap-1 h-[30vh] overflow-y-auto">
        {messages.map((message) => (
          <div
            className="border rounded p-1 hover:bg-slate-300 pointer-cursor"
            key={message.x.hash}
          >
            <p>Hash: {message.x.hash}</p>
            <p>OP: {message.op}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
