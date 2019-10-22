   const readlinne = require('readline-sync') // PEDE UM TERMO AO USUÁRIO
   const state = require('./state.js') // importando o robo de state pra salvar

   function robot() {

    const content = {
        maximumSentences: 7
    } // APESAR DE SER "CONST" O JS DEIXA A GENTE ALTERAR ESSA CONST
 
    content.searchTerm = askAndReturnSearchTerm(); // quando executar essa função "askAndReturnSearchTerm"
                                                   // ele colocar o "TERM EXAMPLE" como valor dentro da searchTerm

    content.prefix     = askAndReturnPrefix();
    content.lang       = 'pt';

    state.save(content);

    
    // await robots.text( content );

    function askAndReturnSearchTerm(){
        // return "TERM EXAMPLE" // testar no terminal como node index.js
        return readlinne.question('Sobre o que voce gostaria de pequisar: ')
    }

    function askAndReturnPrefix(){
        
         const prefixes = ['Quem eh', 'O que eh', 'A historia do(a)']// ARRAY DE DADOS

         const selectedPrefixIndex = readlinne.keyInSelect(prefixes , 'Escolha uma opcao: ')  // USA ESSA OPÇÃO PARA DAR UMA LISTA DE OPÇÃO PARA OS USUÁRIOS    

         const selectedPrefixText = prefixes[selectedPrefixIndex]  // TRAZ O TEXTO DE ACORDO COM O ÍNDICE
         
        // return texto ao 
        //console.log( content )
        return selectedPrefixText
    }


    
   }

   module.exports = robot;
   
   