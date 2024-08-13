var player = undefined
var game = document.getElementById("game")

var p = false

const socket = new WebSocket('ws://127.0.0.1:8080');

function verificacaoTela(fun){
    if(fun == "direita"){
        let currentLeft = parseInt(player.style.left) || 0;
        if(player.style.left = (currentLeft + 50) < 800){
            return true
        }else{
            return false
        }
    }else if(fun == "esquerda"){
        let currentLeft = parseInt(player.style.left) || 0;
        if(player.style.left = (currentLeft + -50) > -50){
            return true
        }else{
            return false
        }
    }
    else if(fun == "cima"){
        let currentLeft = parseInt(player.style.top) || 0;
        if(player.style.top = (currentLeft + -50) > -50){
            return true
        }else{
            return false
        }
    }else if(fun == "baixo"){
        let currentLeft = parseInt(player.style.top) || 0;
        if(player.style.top = (currentLeft + 50) < 600){
            return true
        }else{
            return false
        }
    }
}

function move(direcao) {
    var move = 0
    var verificacao = verificacaoTela(direcao)
    if(direcao == "direita"){
        move = 50
    }else if(direcao == "esquerda"){
        move = -50
    }else if(direcao == "cima"){
        move = -50
    }else if(direcao == "baixo"){
        move = 50
    }
    if(verificacao){
        if(direcao != "cima" && direcao != "baixo"){
            let currentLeft = parseInt(player.style.left) || 0;
            player.style.left = (currentLeft + move) + "px";
        }else{
            let currentLeft = parseInt(player.style.top) || 0;
            player.style.top = (currentLeft + move) + "px";
        }
    }
}


document.body.addEventListener("keydown", ({key}) => {
    if(key === "d"){
        move("direita")
        var info = {
            info: "move",
            move: "direita",
            lugarPlayer: player.style.left
        }
        socket.send(JSON.stringify(info))
    }else if(key == "a"){
        move("esquerda")
    }else if(key == "w"){
        move("cima")
    }else if(key == "s"){
        move("baixo")
    }
});


socket.onmessage = async function(event) {
    var data = JSON.parse(event.data)

    if(data.info == "addPlayer"){
        console.log(data.player)
        console.log(data.id)
        console.log(data.rep2)
        if(p == false){
            var div = document.createElement("div")
            div.id = `player-${data.id}`
            div.className = "player"

            game.appendChild(div)

            player = document.getElementById(`player-${data.id}`)
            p = true
        }
        
            for(var i =0; i < data.rep - 1; i++){
                var div = document.createElement("div")
                div.id = `player-${data.rep2[data.ws]}`
                div.className = "player"

                game.appendChild(div)
            }
    }else if(data.info == "removePlayer"){
        console.log(data.id)
        var div = document.getElementById(`player-${data.id -1}`)

        div.remove()
    }

}
