const google = require('googleapis').google
const imageDownloader = require('image-downloader')
const customSearch = google.customsearch('v1') // essa é a instância responsável pelo CustomSearch
const state = require('./state.js')
const gm = require('gm').subClass({imageMagick: true})

const googleSearchCredentials = require('../credentials/google-search.json')


async function robot() {

    const content = state.load();
    
    await fetchImagesOfAllSentences(content)
    await downloadAllImages(content)

    await convertAllImages(content)

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

    async function downloadAllImages(content) {
        content.downloadedImages = [] // array das minhas imagens baixadas
 
        for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
            const images = content.sentences[sentenceIndex].images

            for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
                const imageUrl = images[imageIndex]

                try { 
                    if (content.downloadedImages.includes(imageUrl)){ // aqui eu pergunto se dentro do array já contem uma imagem baixada
                        throw new Error('Imagem já foi baixada')
                    }
                    await downloadAndSave( imageUrl, sentenceIndex + '-original.png') // aqui a gente quer salvar como para cada imagem tem um index
                    content.downloadedImages.push(imageUrl)
                    console.log (`[${sentenceIndex}][${imageIndex}] > Baixou imagem com sucesso: ${imageUrl}` )
                    break 
                }
                catch (error) {
                    console.log ( `[${sentenceIndex}][${imageIndex}] > Erro ao baixar imagem: (${imageUrl}) : ${error}` )
                }
            }

        }


    } 

    async function downloadAndSave( url, fileName ){ // função da biblioteca image-downloader que baixa a image
        return imageDownloader.image({
            url,url,
            dest: `./images_downloaded/${fileName}` 
        })
    }

    async function convertAllImages( content ){
        for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++){
            
            await convertImage( sentenceIndex )
        }

    }

    async function convertImage( sentenceIndex ){

        return new Promise(( resolve, reject) => {
            const inputFile = `./images_downloaded/${sentenceIndex}-original.png[0]`
            const outputFile = `./images_downloaded/${sentenceIndex}-converted.png`
            const width = 1920
            const height = 1080

            gm()
            .in(inputFile)  
            .out("(")
              .out("-clone")
              .out("0")
              .out("-background", "white")
              .out("-blur", "0x9")
              .out("-resize", `${width}x${height}^`)
            .out(")")
            .out("(")
              .out("-clone")
              .out("0")
              .out("-background", "white")
              .out("-resize", `${width}x${height}`)
            .out(")")
            .out("-delete", "0")
            .out("-gravity", "center")
            .out("-compose", "over")
            .out("-composite")
            .out("-extent", `${width}x${height}`)
            .write(outputFile, (error) => {
              if (error) {
                return reject(error)
              }
    
              console.log(`> [video-robot] Image converted: ${outputFile}`)
              resolve()
            })
    
        })
    }
 
}

module.exports = robot;