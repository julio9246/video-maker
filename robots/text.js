const algorithmia = require('algorithmia') // usei o comando "npm i algorithmia"
const algorithmiaApiKey = require("../credentials/algorithmia.json").apiKey // pois aqui eu acesso diretamente a propriedade dentro do arquivo
const sentenceBoundaryDetection = require('sbd') //ISSO É MUITO IMPORTANTE....
                                                 // POIS SEPARA AS SENTENÇAS QUE É CRUCIAL PARA O FUNCIONAMENTO DO ROBÔ. UTILIZEI "npm i sbd" uma biblioteca do proprio node

async function robot( content ){ // CONTENT É UM INPUT DE ENTRADA QUE RECEBERÁ

   await fetchContentFromWikipedia(content) // Baixa o conteúdo do Wikipedia
         snaitizeContent(content)           // Limpa do conteúdo
         breakContentIntoSentences(content) // Quebra o contaúdo em sentenças

    //console.log(`Recebi com sucesso o content: ${content.searchTerm} `) 

 //   console.log('Logando se a função fetchContentFromWikipedia retorna ');
 //   console.log( fetchContentFromWikipedia() );

    // USEI ASYNC pois o .PIPE utiliza o return em uma Promisse \o/ ???
    async function fetchContentFromWikipedia(content){
         
        const algorithmiaAuthenticated = algorithmia( algorithmiaApiKey ) // autenticação dentro da api algorthmia
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2') // Link que chama o robo que pega do wikipedia o conteúdo
        const wikipediaResponde = await wikipediaAlgorithm.pipe(content.searchTerm) // é no pipe que eu passo o conteúdo para buscar dentro do wikipedia. No meu caso usei o SearchTerm criado no index.js
                                  // await para poder interpretar a resposta do pipe quando promisse
        const wikipediaContent = wikipediaResponde.get(); // get é a resposta qu eele dá
        
        content.sourceContentOriginal = wikipediaContent.content;

    }

function snaitizeContent(content){
    // ESSA FUNÇÃO SERVE PARA REMOVER OS CONTEÚDOS QUE NÃO NOS INTERESSA

    const withoutBlankLinesAndMarkDown = removeBlankLinesAndMarkDown(content.sourceContentOriginal);
    const withoutDatesInParentheses = removeDatesInParetheses( withoutBlankLinesAndMarkDown )
   
    content.sourceContentSanitized = withoutDatesInParentheses; // colocando o resultado final em um content já limpo 

    function removeBlankLinesAndMarkDown(text){
        const allLines = text.split('\n')  

        // Tirando as linhas em branco e as que começam com '=' ( apesar que eu acho que o proprio Algorithimia já faz isso )
        
        const withoutBlankLinesAndMarkDown = allLines.filter((line) => { // FILTRANDO TODAS AS LINHAS
            if ( line.trim().length === 0 || line.trim().startsWith('=') ){ // VERIFICANDO SE O CONTEÚDO É ZERO
                return false // se for zerado a gente filtra
            }
            return true; // se não for zeraado a gente mantém a linha
        })

        return withoutBlankLinesAndMarkDown.join(' ') // POIS ELE JUNTA TUDO EM UMA COISA SÓ E RETORNA UM ESPAÇO NO FINAL
        
    } 

    function removeDatesInParetheses( text ){
        return text.replace(/(\s\(.*?\))|<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
    }

} // fim da função de síntese



function breakContentIntoSentences(content){
    content.sentences = [];

    const sentences =  sentenceBoundaryDetection.sentences(content.sourceContentSanitized) // traz um array de sentenças separados por virgula
    
    sentences.forEach((sentence) => {
        content.sentences.push({ // injeta no array de sentenças
            text: sentence,
            keywords: [],
            images: []
        })
    })
    

}


}

module.exports = robot // ???