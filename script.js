
var player = undefined
var game = document.getElementById("game")

var p = false
var partida = false

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

function verficarPegarFruit(){
    if(document.getElementById("fruit")){
        if(player.style.left == document.getElementById("fruit").style.left){
            if(player.style.top == document.getElementById("fruit").style.top){
                var info = {
                    info: "frutaPega",
                    id: player.id,
                }
                socket.send(JSON.stringify(info))
            }
        }else{
            console.log("Nao")
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

    var info = {
        info: "atualizarLocalJogadores",
        left: player.style.left,
        top: player.style.top,
        id: player.id
    }
    verficarPegarFruit()
    socket.send(JSON.stringify(info))
}

function spawnFruit(left,top){
    var fruit = document.createElement("div")

    fruit.id = "fruit"
    fruit.classList = "fruit"

    fruit.style.left = left
    fruit.style.top = top

    game.appendChild(fruit)
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

var buttonPronto = document.getElementById("button-pronto")

buttonPronto.addEventListener("click", () => {
    if(buttonPronto.className == "nao"){
        buttonPronto.className = "pronto"
        var info = {
            info: "atualizarStatsPronto",
            acont: 1,
        }
        socket.send(JSON.stringify(info))
    }else{
        buttonPronto.className = "nao"
        var info = {
            info: "atualizarStatsPronto",
            acont: -1,
        }
        socket.send(JSON.stringify(info))
    }
})

function addPlayerList(id){
    var trB = document.getElementById("tr-tbody")

    var tr = document.createElement("tr")
    tr.id = `tr-${id}`
                
    var th = document.createElement("th")
    th.innerHTML = id

    var thP = document.createElement("th")
    thP.innerHTML = 0
    thP.id = `table-${id}`

    tr.appendChild(th)
    tr.appendChild(thP)

    trB.appendChild(tr)
}


socket.onmessage = async function(event) {
    var data = JSON.parse(event.data)

    if(data.info == "addPlayer"){
        for(var i = 0; i < data.variaveis.length; i++){
            if(i % 2 == 0){
                var div = document.createElement("div")
                if(i === 0){
                    div.id = data.variaveis[data.ind]
                    player = div
                    div.className = "player controlado"
                }else{
                    div.id = data.variaveis[i - 1]
                    div.className = "player"
                }
                game.appendChild(div)
                addPlayerList(div.id)
                if(i === 0){
                    
                }
            }
        }
     }else if(data.info == "removePlayer"){
        var div = document.getElementById(`${data.id}`)
        var tr = document.getElementById(`tr-${data.id}`)

        div.remove()
        tr.remove()
    }

    if(data.info == "addPlayerExist"){
        var div = document.createElement("div")
        div.className = "player"

        div.id = `${data.id}`

        game.appendChild(div)
        addPlayerList(div.id)
    }

    if(data.info == "atualizarPlayers"){
        var number = document.getElementById("number-prontos")
        var numberS = number.innerHTML.split("/")

        numberS[1] = data.size


        number.innerHTML = numberS[0] + "/" + numberS[1]
    }
    if(data.info == "atualizarStatsPronto"){
        var number = document.getElementById("number-prontos")
        var numberS = number.innerHTML.split("/")

        var n = Number(numberS[0]) + data.acont
        numberS[0] = n

        number.innerHTML = numberS[0] + "/" + numberS[1]
        if(numberS[0] == numberS[1]){
            var nT = 50 * Math.floor(Math.random() * 12) + "px"
            var nL = 50 * Math.floor(Math.random() * 16) + "px"
            var info = {
                info: "IniciarJogo",
                top: nT,
                left: nL,
            }
            socket.send(JSON.stringify(info))
        }
    }

    if(data.info == "atualizarLocalJogadores"){
        var div = document.getElementById(data.id)

        div.style.top = data.top
        div.style.left = data.left
    }

    if(data.info == "attPlayerNewPronto"){
        var n = 0
        var number = document.getElementById("number-prontos")
        var numberS = number.innerHTML.split("/")

        n = Number(numberS[0]) + data.pro
        if(data.pro == 0){
            n = 0
        }

        number.innerHTML = n + "/" + numberS[1]
    }
    if(data.info == "spawnFruit"){
        if(!document.getElementById("fruit")){
            spawnFruit(data.left, data.top)
        }
    }

    if(data.info == "frutaPega"){
        var table = document.getElementById(`table-${data.id}`)
        var n = Number(table.innerHTML) + 1
        table.innerHTML = n
        document.getElementById("fruit").remove()
    }
}
