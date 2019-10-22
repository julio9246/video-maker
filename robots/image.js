const google = require('googleapis').google
const customSearch = google.customsearch('v1') // essa é a instância responsável pelo CustomSearch
const state = require('./state.js')

const googleSearchCredentials = require('../credentials/google-search.json')


async function robot() {

    const content = state.load();
    await fetchImagesOfAllSentences(content)
    state.save(content)

    async function fetchImagesOfAllSentences(content) {
        // content.sentences.map((item)=>{
        //     console.log("item -> ", item );
        // });

        for (const sentence of content.sentences) { // AQUI ESTOU DANDO UM LOOP DENTRO DE TODAS AS SENTENÇAS
            const query = `${content.searchTerm} ${sentence.keywords[0]}` // AQUI EU CRIO UMA STRING QUE CONCATENA O MEU SEARCH TERM COM A PRIMEIRA KEYWORD
            sentence.images = await fetchGoogleAndReturnImageLinks(query) // PEGA O RESULTADO DA FUNÇÃO E COLOCA DENTRO DO ARRAY IMAGE
            sentence.googleSearchQuery = query; // AQUI EU COLOCO A QUERY DENTRO DA PROPRIEDADE DA SENTENÇA
        }
    }

    async function fetchGoogleAndReturnImageLinks(query) {

        const response = await customSearch.cse.list({
            auth: googleSearchCredentials.apiKey, // api para logar
            cx: googleSearchCredentials.searchEngineId, // cx ( provavelmente context ) para definir ao CSE qual pesquisa utilizar
            q: query,// aqui eu passo o "query" para procurar a imagem
            num: 2, // o numero de imagens que irá retornar
            searchType: 'image'

        })

        const imagesUrl = response.data.items.map((item) => {
            return item.link
        })


        return imagesUrl;

    }
 
}

module.exports = robot;