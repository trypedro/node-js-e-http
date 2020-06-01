module.exports = app => {


    app.post('/correios/calculo-prazo', (req, res) => {
        let dadosDaEntrega = req.body

        let correioSOAPClient = new app.services.correiosSOAPClient()
        correioSOAPClient.calculaPrazo(dadosDaEntrega, (erro, resultado) => {

            if(erro){
                res.status(500).send(erro);
                return;
            }

            console.log('Prazo Calculado.')
            res.json(resultado);
        });

    })
}