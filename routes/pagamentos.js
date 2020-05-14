
module.exports = app => {

    app.get("/pagamentos", (req, res) => {
        console.log('Recebida requisicao de teste, na porta 3000/teste')
    
        

        res.send("OK.")
    });
}

