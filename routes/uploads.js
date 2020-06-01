const fs = require('fs')

module.exports = app => {

    app.post('/upload/imagem', (req, res) => {
        console.log('Recebendo imagem.')

        const filename = req.header.filename;
        req.pipe(fs.createWriteStream(`files/${filename}`)).on('finish', () => console.log('arquivo Escrito.'));

        res.status(201).send('Ok');
    });

}