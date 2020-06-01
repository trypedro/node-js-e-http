
module.exports = app => {

    app.get("/pagamentos", (req, res) => {
        console.log('Recebida requisicao de teste, na porta 3000/teste')

        res.send("OK.")
    });

    app.get("/pagamentos/pagamento/:id", (req, res) => {

        const id = req.params.id;

        console.log(`Consultando pagamando: ${id}`)

        
        let connection = app.persistence.connectionFactory()
        let pagamentoDao = new app.persistence.PagamentoDao(connection)

        pagamentoDao.buscaPorId(id, (error, resultado) => {

            if(error){ 
                console.log(`Erro ao consultar no banco: ${error}`)
                res.status(500).send(error);
                return;
            }

            console.log('Pagamento encontrado: ' + JSON.stringify(resultado))
            res.json(resultado);

        })
    });

    app.delete('/pagamentos/pagamento/:id', (req, res) => {

        let pagamento = {}
        let id = req.params.id

        pagamento.id = id;
        pagamento.status = 'CANCELADO'

        let connection = app.persistence.connectionFactory()
        let pagamentoDao = new app.persistence.PagamentoDao(connection)

        pagamentoDao.atualiza(pagamento, (error, result) => {

            if (error) {
                res.status(500).send(erro)
                return;
            }

            console.log('Pagamento cancelado.')
            res.status(204).send(pagamento);
        });

    });

    app.put('/pagamentos/pagamento/:id', (req, res) => {

        let pagamento = {}
        let id = req.params.id

        pagamento.id = id;
        pagamento.status = 'CONFIRMADO'

        let connection = app.persistence.connectionFactory()
        let pagamentoDao = new app.persistence.PagamentoDao(connection)

        pagamentoDao.atualiza(pagamento, (error, result) => {

            if (error) {
                res.status(500).send(erro)
                return;
            }

            console.log('Pagamento confirmado.')
            res.send(pagamento);
        });


    });

    app.post('/pagamentos/pagamento', (req, res) => {

        req.assert("pagamento.forma_de_pagamento", "Forma de Pagamento eh obrigatorio.").notEmpty();
        req.assert("pagamento.valor", "Valor obrigatorio e deve ser um decimal.").notEmpty().isFloat();
        req.assert("pagamento.moeda", "Moeda nao pode ser vazio.").notEmpty();

        let erros = req.validationErrors();

        if (erros) {
            console.log('Erros de validacao encontrados.')
            res.status(400).send(erros) //400 = Bad Request
            return;
        }

        let pagamento = req.body['pagamento']
        console.log('Processando uma requisicao de um novo pagamento...');

        pagamento.status = 'CRIADO'
        pagamento.data = new Date

        let connection = app.persistence.connectionFactory()
        let pagamentoDao = new app.persistence.PagamentoDao(connection)

        pagamentoDao.salva(pagamento, (error, result) => {

            if (error) {
                console.log('Erro ao inserir no banco: ' + error)
                res.status(500).send(error); //500 = erro no servidor

            } else {

                pagamento.id = result.insertId

                console.log('Pagamento criado' + result)

                if (pagamento.forma_de_pagamento == 'cartao') {

                    let cartao = req.body['cartao']
                    console.log('cartao', cartao);

                    const clienteCartoes = new app.services.clienteCartoes();
                    clienteCartoes.autoriza( cartao, (exception, request, resp, retorno) => {

                        if(exception){

                            console.log('exception', exception)
                            res.status(400).send(exception);
                            return;
                        }

                        console.log('retorno', retorno);

                        res.location('/pagamentos/pagamento/' + pagamento.id)

                        let response = {
                            dados_do_pagamento: pagamento,
                            cartao: retorno,
                            links: [
    
                                {
                                    href: `http://localhost:3000/pagamentos/pagamento/${pagamento.id}`,
                                    rel: 'confirmar',
                                    method: 'PUT'
                                },
                                {
                                    href: `http://localhost:3000/pagamentos/pagamento/${pagamento.id}`,
                                    rel: 'cancelar',
                                    method: 'DELETE'
                                }
                            ]
    
                        };
    
                        res.status(201).json(response);
                        return;
                    });

                } else {


                    res.location('/pagamentos/pagamento/' + pagamento.id)

                    let response = {
                        dados_do_pagamento: pagamento,
                        links: [

                            {
                                href: `http://localhost:3000/pagamentos/pagamento/${pagamento.id}`,
                                rel: 'confirmar',
                                method: 'PUT'
                            },
                            {
                                href: `http://localhost:3000/pagamentos/pagamento/${pagamento.id}`,
                                rel: 'cancelar',
                                method: 'DELETE'
                            }
                        ]

                    };


                    res.status(201).json(response); // 201 = Created

                }
            }
        });
    });

}

