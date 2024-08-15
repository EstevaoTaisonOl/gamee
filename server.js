

const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

const clients = new Set();
var variaveis = []

var statsPartida = false
var fruitSpawn = false

var prontos = []

function pesquisa(fruit,name) {
  return fruit === name;
}

function spawnFruit(){

}

server.on('connection', (ws) => {
  const uniqueId = 'id-' + Date.now();

  console.log('Cliente conectado');
  clients.add(ws);
  var info = {
    info: "attPlayerNewPronto",
    pro: prontos,
  }
        
  ws.send(JSON.stringify(info))
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      var info = {
        info: "atualizarPlayers",
        size: clients.size,
        stats: "adicionado"
      }
      client.send(JSON.stringify(info));
    }
  }
  for(var i = 0; i< variaveis.length; i++){
    clients.forEach(value => {
      console.log(pesquisa(variaveis[i],value))
      if(pesquisa(variaveis[i], value)){
        var info = {
          info: "addPlayerExist",
          player: 1,
          id: uniqueId,
        }

        value.send(JSON.stringify(info))
      }
    });
  }
  variaveis.push(ws)
  variaveis.push(uniqueId)
  console.log(uniqueId)
  var ind = undefined

  for (var i = 0; i < variaveis.length; i++) {
    if (pesquisa(variaveis[i], ws)) {
        // Use findIndex with a condition function to find the index
        var ind = variaveis.findIndex(item => item === variaveis[i + 1]);
        console.log(ind);
    }
}


  var info = {
    info: "addPlayer",
    size: clients.size,
    variaveis: variaveis,
    ind: ind
  }

  ws.send(JSON.stringify(info))
  
  
  ws.on('message', (message) => {
    const data = message.toString('utf8');
    console.log('Mensagem recebida:', data);
    var play = JSON.parse(data)
        if(play.info == "IniciarJogo"){
          statsPartida = true
        }   
    var dd = JSON.parse(data)
    if(dd.info == "atualizarStatsPronto"){
      prontos.push(ws)
      prontos.push(dd.acont)
    }

    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        if(dd.info == "IniciarJogo"){
            var info = {
              info: "spawnFruit",
              left : dd.left,
              top: dd.top,
            }

            client.send(JSON.stringify(info))
        }
        client.send(data);
      }
    }
  });
  ws.on('close', () => {
    console.log('Cliente desconectado');
    clients.delete(ws);
    for(var i = 0; i< variaveis.length; i++){
      clients.forEach(value => {
        if(pesquisa(variaveis[i], ws)){
          var info = {
            info: "removePlayer",
            player: 1,
            id: variaveis[i + 1],
          }
          value.send(JSON.stringify(info))
        }
      });
    }
    console.log(prontos)
    variaveis.splice(variaveis.indexOf(ws), 2);
    prontos.splice(prontos.indexOf(ws), 2);
    for(var i = 0; i< prontos.length; i++){
      clients.forEach(value => {
        if(pesquisa(prontos[i], ws)){
          var info = {
            info: "attPlayerNewPronto",
            pro: prontos[i + 1],
          }
          value.send(JSON.stringify(info))
          var info = {
            info: "atualizarPlayers",
            size: clients.size,
            stats: "adicionado"
          }
          value.send(JSON.stringify(info));
        }
      });
    }

    if(prontos.length == 0){
      clients.forEach(value => {
          var info = {
            info: "attPlayerNewPronto",
            pro: 0,
          }
          value.send(JSON.stringify(info))
          var info = {
            info: "atualizarPlayers",
            size: clients.size,
            stats: "adicionado"
          }
          value.send(JSON.stringify(info));
      });
    }
  });

  ws.on('error', (error) => {
    console.error('Erro WebSocket:', error);
  });
});
