const algorithmia = require('algorithmia') // usei o comando "npm i algorithmia"
const algorithmiaApiKey = require("../credentials/algorithmia.json").apiKey // pois aqui eu acesso diretamente a propriedade dentro do arquivo
const sentenceBoundaryDetection = require('sbd') //ISSO É MUITO IMPORTANTE....
                                                 // POIS SEPARA AS SENTENÇAS QUE É CRUCIAL PARA O FUNCIONAMENTO DO ROBÔ. UTILIZEI "npm i sbd" uma biblioteca do proprio node
const Promise = require('es6-promise').Promise 
const WatsonApiKey = require("../credentials/watson-nlu.json").apikey // usei o npm i watson-developer-cloud 

 
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js') // esse é um submodulo do watson
 
var nlu = new NaturalLanguageUnderstandingV1({ // bloco que aplica o bloco de codigo da API
  iam_apikey: WatsonApiKey, 
  version: '2018-04-05',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
}) 


async function robot( content ){ // CONTENT É UM INPUT DE ENTRADA QUE RECEBERÁ

   await fetchContentFromWikipedia(content) // Baixa o conteúdo do Wikipedia
         snaitizeContent(content)           // Limpa do conteúdo
         breakContentIntoSentences(content) // Quebra o contaúdo em sentenças
         limitMaximumSentences( content ) // limita as sentenças em até 7 de acordo com o programado no index.js
   await fetchKeywordsOfAllSentences( content )
    //console.log(`Recebi com sucesso o content: ${content.searchTerm} `) 

 //   console.log('Logando se a função fetchContentFromWikipedia retorna ');
 //   console.log( fetchContentFromWikipedia() );

    // USEI ASYNC pois o .PIPE utiliza o return em uma Promisse \o/ ???
    async function fetchContentFromWikipedia(content){
         
        const algorithmiaAuthenticated = algorithmia( algorithmiaApiKey ) // autenticação dentro da api algorthmia
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2') // Link que chama o robo que pega do wikipedia o conteúdo
        const wikipediaResponse = await wikipediaAlgorithm.pipe( { "lang" : content.lang,
                                                                   "articleName": content.searchTerm } ) // é no pipe que eu passo o conteúdo para buscar dentro do wikipedia. No meu caso usei o SearchTerm criado no index.js
                                  // await para poder interpretar a resposta do pipe quando promisse
        const wikipediaContent = wikipediaResponse.get(); // get é a resposta qu eele dá
        
        content.sourceContentOriginal = wikipediaContent.content;

    }

// LIMPARA O CODIGO TIRANDO ESPAÇOS E TAMBÉM CARACTERES INDESEJÁVEIS 
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
        return text.replace(/(\s\(.*?\))|<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, ''); // ISSO É UMA RegX ( Expressão Regular) pra remover caracteres especiais
    }

} // fim da função de síntese


// QUEBRAR O TEXTO EM SENTENÇAS
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

function limitMaximumSentences(content){
    content.sentences = content.sentences.slice(0,content.maximumSentences)// SLICE é o responsável por ele pegar um número de registros específicos entre dois intervalos
}                              // sentences é o nome do titulo do array no json  


async function fetchKeywordsOfAllSentences( content ){

    for ( const sentence of content.sentences ){
        sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text) // aqui ele pega SENTENÇA a SENTENÇA e insere no dentro do array de KeyWords
    }

}

// essa função irá enviar ao WATSON um texto, e ele irá quebrar as palavras chaves desse texto
async function fetchWatsonAndReturnKeywords(sentence){
    
    return new Promise( (resolve, reject) => { // aqui pra funcionar o Promise eu tive que colocar a uses lá em cima

        nlu.analyze({ 
            text: sentence,
            features: {
                keywords: {} // AQUI UTILIZAREMOS KEYWORDS....MAS DA PRA TRAZER MTO MAIS COISA: https://www.npmjs.com/package/watson-developer-cloud
            } 
            // ISSO É A MSM COISA DISSO: function(error: any, response: NaturalLanguageUnderstandingV1.AnalysisResults): void
        } , (error, response) => { 
            if (error) {
                throw error // SE TEM ERRO ELE JOGA PRA ESSA CLÁUSULA
            }

            const keywords = response.keywords.map((keyword) => { // fiz isso para pegar só a 
                return keyword.text                              // keyword do JSON pois lá vem mais coisas
            })

             resolve(keywords)


            console.log(sentence)
            console.log( JSON.stringify( response, null, 4) ) // se der certo ele joga pra essa 
                                                                // JSON.stringify() é uma função do 
                                                                // objeto JSON que criará uma string do objeto
                                                                // dentro do padrão adotado pelo JSON
                                                                // ou seja...joga pra dentro da RESPONSE
        
            // process.exit(0)
        
        } )
    })
}





}

module.exports = robot // ???