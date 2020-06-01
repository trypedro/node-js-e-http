const fs = require('fs')

fs.createReadStream('imagem.jpg')
    .pipe(fs.createReadStream('imagem-com-stream.jpg'))
    .on('finish', () => console.log('arquivo lido com Stream.'));