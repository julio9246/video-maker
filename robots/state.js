const fs = require('fs')
const contentFilePath = "./content.json"
const scriptFilePath = "./after-effects-script.js"



// METODO PARA SALVAR
function save(content){ 
    const contentString = JSON.stringify(content)// TRANSFORMAR O JSON EM STRING
    return fs.writeFileSync(contentFilePath, contentString )
    
}

function saveScript(content){

    const contentString = JSON.stringify(content)
    const scriptString = `var content = ${contentString}`
    return fs.writeFileSync(scriptFilePath , scriptString)

}

// METODO PARA CARREGAR
function load() {
    const fileBuffer = fs.readFileSync( contentFilePath, 'utf-8' ) // E AQUI ELE CARREGA O ARQUIVO
    const contentJson = JSON.parse(fileBuffer) // PARA TRANSFORMAR O ARQUIVO EM OBJETO JAVASCRIPT
    return contentJson
}

// ESSE PRA GENTE NÃO FUNCIONA POIS ELE CARREGA SÓ UMA VEZ DEPOIS O NODE GRAVA NO CACHE E NÃO ATUALIZA MAIS O ARQUIVO
// E NO NOSSO CASO NÃO ADIANTA...POIS O ARQUIVO VAI SER MODIFICADO

// function load2() {
//     return require('./content.json')
// }

module.exports = {
    save,
    saveScript,
    load
}