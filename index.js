function start(){
    // 
    const content = {} // APESAR DE SER "CONST" O JS DEIXA A GENTE ALTERAR ESSA CONST

    content.searchTerm = askAndReturnSearchTerm(); // quando executar essa função "askAndReturnSearchTerm"
                                                   // ele colocar o "TERM EXAMPLE" como valor dentro da searchTerm

    function askAndReturnSearchTerm(){
        return "TERM EXAMPLE" // testar no terminal como node index.js
    }

    console.log( content );

}

start();