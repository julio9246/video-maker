const readlinne = require('readline-sync')

function start(){
    // 
    const content = {} // APESAR DE SER "CONST" O JS DEIXA A GENTE ALTERAR ESSA CONST

    content.searchTerm = askAndReturnSearchTerm(); // quando executar essa função "askAndReturnSearchTerm"
                                                   // ele colocar o "TERM EXAMPLE" como valor dentro da searchTerm

    content.prefix     = askAndReturnPrefix();

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

    console.log( content );

}

start();