import ReconnectingWebSocket from 'reconnecting-websocket';

const websocket = ({ channel_name, token }) => {
  const host = '104.155.218.110:8000';
  const ws_scheme = window.location.protocol === "https:" ? "wss" : "ws";
  const ws_path = `${ws_scheme}://${host}/ws/${channel_name}/?token=${token}`;
  const websocketInstance = new ReconnectingWebSocket(ws_path);

  return websocketInstance
}

export default websocket
