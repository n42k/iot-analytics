const parse = require('csv-parse')
const parseSync = require('csv-parse/lib/sync');
const fs = require('fs')
const generatePassword = require('password-generator')
const bcrypt = require('bcrypt')
const PDFDocument = require('pdfkit')
const { convertArrayToCSV } = require('convert-array-to-csv');

const saltRounds = 10

module.exports = {
    initialSpeakersParse: function(fileName) {
        let parser = parse({delimiter: ';'}, function(err, output) {

            let doc = new PDFDocument
            doc.pipe(fs.createWriteStream('./resources/speaker_logins.pdf'), {encoding: 'utf8'})
            doc.font('Helvetica').fontSize(36).text('Speaker login information', {align: 'center'})

            for(let i = 0; i < output.length; i++) {

                let email = output[i][1]
                output[i][1] = bcrypt.hashSync(email, saltRounds)

                let password = generatePassword(12, false)
                output[i][2] = bcrypt.hashSync(password, saltRounds)

                let username = output[i][0].replace(/ /g, '.').toLowerCase()

                // Escape " chars from description
                output[i][5] = output[i][5].replace(/"/g, "\"\"");

                output[i].push(username)

                doc.addPage().fontSize(16).text('Name: ' + output[i][0] + '\nEmail: ' + email + '\nUsername: ' + username +   '\nPassword: ' + password)
            }

            const csvFromArrayOfArrays = convertArrayToCSV(output, {separator: ';'})

            fs.writeFile('./resources/speakersv2.csv', csvFromArrayOfArrays, function(err) {
                if(err) {
                    return console.log(err)
                }
            })

            doc.end()
        })

        fs.createReadStream('./resources/' + fileName, {encoding: 'utf8'}).pipe(parser)
    },

    parseInformation: function(fileName) {

        let CSVInformation = fs.readFileSync('./resources/' + fileName, {encoding: 'utf8'})

        return parseSync(CSVInformation, {delimiter: ';'})
    }
}
