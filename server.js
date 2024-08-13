

const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

const clients = new Set();
var variaveis = {}

server.on('connection', (ws) => {
  console.log('Cliente conectado');
  clients.add(ws);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
        const uniqueId = 'id-' + Date.now();
        variaveis[ws] = uniqueId
        var info = {
            info: "addPlayer",
            player: 1,
            id: uniqueId,
            rep: clients.size,
            rep2: variaveis,
            ws: ws,
        }
        client.send(JSON.stringify(info));
    }
  }
  
  ws.on('message', (message) => {
    const data = message.toString('utf8');
    console.log('Mensagem recebida:', data);
    // Envie a mensagem para todos os clientes
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    }
  });
  ws.on('close', () => {
    console.log('Cliente desconectado');
    for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
            var info = {
                info: "removePlayer",
                id: variaveis[ws]
            }
            client.send(JSON.stringify(info))
            delete variaveis[ws]
        }
    }
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('Erro WebSocket:', error);
  });
});
