
const robots = { 
    input: require('./robots/input.js'),
    text: require('./robots/text.js'), // IMPORTANDO DA CLASSE TEXT.JS o robô de texto ( por isso o nome text )
    state: require('./robots/state.js'),
    image: require('./robots/image.js')
}
 
// ASYNC É O COMANDO QUE FAZ COM QUE ELE PRIMEIRO BUSQUE NO WIKIPEDIA E DEPOIS CONTINUE O PROCESSO QUE FOI CHAMDO PRIMEIRO
// DEVIDO AO RETORNO SER UMA PROMISSE

async function start(){
    
robots.input()
await robots.text();
await robots.image();

const content = robots.state.load();

console.dir(content, {depth: null}) // ELE MANTEM O CONSOLE.LOG MAS APRESENTA TUDO FORMATADO

}

start();