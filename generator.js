const ejs = require('ejs')
const fse = require('fs-extra')
const watch = require('node-watch')
const sass = require('node-sass')
const chalk = require('chalk')

const dist = './public'
const src = './src'

function renderFile(filename){
    const shortFile = filename.slice(0, -4)
    ejs.renderFile(`${src}/views/pages/${filename}`, { filename: shortFile }).then(file => {
        fse.writeFileSync(`${dist}/${shortFile}.html`, file)
    })
}

function reload(){
    fse.emptyDirSync(dist)

    fse.copy(`${src}/assets`, `${dist}/assets`)

    sass.render({
        file: `${src}/styles/application.sass`
    }, (err, result) => {
        fse.writeFile(`${dist}/application.css`, result.css)
        console.log(chalk.green('- Sass compiled'))
    })

    fse.readdir(`${src}/views/pages`, (err, filenames) => filenames.map(renderFile))
    console.log(chalk.green('- EJS Templates Compiled'))
}

// init
reload()
watch(src, {recursive: true}, reload)