const gm = require('gm').subClass({imageMagick: true})
const state = require('./state.js')
const spawn = require('child_process').spawn // MODULO PADRÃO DO NODEJS ....Arvore de processos do Node mesmo
const path = require('path')
const rootPath = path.resolve(__dirname, '..')


async function robot() {

    const content = state.load();

    await convertAllImages(content)
    await createAfterEffectsScript(content)
    await createAllSentenceImages(content)
    await createYouTubeThumbnail()
    await createAfterEffectsScript(content)
    await renderVideoWithAfterEffects() 

    state.save(content)

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


async function createAfterEffectsScript( content ){

   await state.saveScript(content) 

}

async function renderVideoWithAfterEffects(){ 
    return new Promise((resolve, reject) => {
        const aerenderFilePath = '/Program Files/Adobe/Adobe After Effects CC 2019/Support Files/aerender' // aqui define aonde fica a pasta aerender
        const templateFilePath = `${rootPath}/templateAEP/template.aep` // aqui o template ta fixo....de acordo com o aftereffects
        const destinationFilePath = `${rootPath}/videopronto/output.mov` // aqui é a saída de onde o vídeo vai

        console.log('> Starting After Effects')

        const aerender = spawn( aerenderFilePath, [ // aqui é o binário onde será executado ( como na busca do google )
            '-comp', 'main',
            '-project', templateFilePath,
            '-output', destinationFilePath
        ])

        aerender.stdout.on('data' , (data) => { // standard output - ou seja...vai falando o que ta sendo feito
            process.stdout.write(data)
        })

        aerender.on('close', () => {
            console.log('> After Effects closed') // aqui ele fala que fechou
            resolve()
        })
    })
}

async function createAllSentenceImages(content) {
    for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
      await createSentenceImage(sentenceIndex, content.sentences[sentenceIndex].text)
    }
  }

  async function createSentenceImage(sentenceIndex, sentenceText) {
    return new Promise((resolve, reject) => {
      const outputFile = `./images_downloaded/${sentenceIndex}-sentence.png`

      const templateSettings = {
        0: {
          size: '1920x400',
          gravity: 'center'
        },
        1: {
          size: '1920x1080',
          gravity: 'center'
        },
        2: {
          size: '800x1080',
          gravity: 'west'
        },
        3: {
          size: '1920x400',
          gravity: 'center'
        },
        4: {
          size: '1920x1080',
          gravity: 'center'
        },
        5: {
          size: '800x1080',
          gravity: 'west'
        },
        6: {
          size: '1920x400',
          gravity: 'center'
        }

      }

      gm()
        .out('-size', templateSettings[sentenceIndex].size)
        .out('-gravity', templateSettings[sentenceIndex].gravity)
        .out('-background', 'transparent')
        .out('-fill', 'white')
        .out('-kerning', '-1')
        .out(`caption:${sentenceText}`)
        .write(outputFile, (error) => {
          if (error) {
            return reject(error)
          }

          console.log(`> [video-robot] Sentence created: ${outputFile}`)
          resolve()
        })
    })
  }

  async function createYouTubeThumbnail() {
    return new Promise((resolve, reject) => {
      gm()
        .in('./images_downloaded/0-converted.png')
        .write('./images_downloaded/youtube-thumbnail.jpg', (error) => {
          if (error) {
            return reject(error)
          }

          console.log('> [video-robot] YouTube thumbnail created')
          resolve()
        })
    })
  }

 
}

module.exports = robot;