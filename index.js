const readlinne = require('readline-sync')
const robots = { 
    text: require('./robots/text.js') // IMPORTANDO DA CLASSE TEXT.JS o robô de texto ( por isso o nome text )
}

// ASYNC É O COMANDO QUE FAZ COM QUE ELE PRIMEIRO BUSQUE NO WIKIPEDIA E DEPOIS CONTINUE O PROCESSO QUE FOI CHAMDO PRIMEIRO
// DEVIDO AO RETORNO SER UMA PROMISSE

async function start(){
    
    const content = {
        maximumSentences: 7
    } // APESAR DE SER "CONST" O JS DEIXA A GENTE ALTERAR ESSA CONST

    content.searchTerm = askAndReturnSearchTerm(); // quando executar essa função "askAndReturnSearchTerm"
                                                   // ele colocar o "TERM EXAMPLE" como valor dentro da searchTerm

    content.prefix     = askAndReturnPrefix();
    content.lang       = 'pt';

    
    await robots.text( content );

    function askAndReturnSearchTerm(){
        // return "TERM EXAMPLE" // testar no terminal como node index.js
        return readlinne.question('Type a Wikipedia search term: ')
    }

    function askAndReturnPrefix(){
        
         const prefixes = ['Who is', 'What is', 'The history of'];// ARRAY DE DADOS

         const selectedPrefixIndex = readlinne.keyInSelect(prefixes , 'Choose a option: '); // USA ESSA OPÇÃO PARA DAR UMA LISTA DE OPÇÃO PARA OS USUÁRIOS
         const selectedPrefixText = prefixes[selectedPrefixIndex]; // TRAZ O TEXTO DE ACORDO COM O ÍNDICE
         
        // return texto ao console.log( content )
        return selectedPrefixText


    }

    


    //console.log( content );

}

start();