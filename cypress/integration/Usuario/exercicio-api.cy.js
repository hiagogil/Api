/// <reference types="cypress" />

import contrato from '../../contracts/produtos.contract';
import '../../support/commands';

describe('Testes da Funcionalidade Usuários', () => {
    let token;

    before(() => {
        cy.token('fulano@qa.com', 'teste').then((tkn) => {
            token = tkn;
        });
    });

    it('Deve validar contrato de usuários', () => {
        cy.request('usuarios').then((response) => {
            return contrato.validateAsync(response.body)
         });

    });

    it('Deve listar usuários cadastrados', () => {
        cy.request({
            method: 'GET',
            url: 'usuarios'
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('usuarios')
            expect(response.duration).to.be.lessThan(20)
        })

    });

        it('Deve cadastrar um usuário com sucesso', () => {
            let email = `ciclano${Math.floor(Math.random() * 1000000)}@qa.com.br`;
            cy.request({
                method: 'POST'  ,
                url: 'usuarios',
                body: {
                "nome": "Fulano da Silva",
                "email": email,
                "password": "teste",
                "administrador": 'true'},
            headers: { authorization: token }
            }).then((response) =>{
                expect(response.status).to.equal(201),
                expect(response.body.message).to.equal('Cadastro realizado com sucesso')
            })
        });

    it('Deve validar um usuário com email inválido', () => {
        cy.request({
            method: 'POST'  ,
            url: 'usuarios',
            body: {
            "nome": "Fulano da Silva",
            "email": "email@hotmail.com",
            "password": "teste",
            "administrador": 'true'},
        headers: { authorization: token },
        failOnStatusCode: false
        }).then((response) =>{
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Este email já está sendo usado')
            
        })
    });


    it('Deve editar um produto já cadastrado', () => {
        cy.request('GET', '/usuarios').then(response => {
            const firstUsuarioId = response.body.usuarios[0]._id;
    
            cy.log(firstUsuarioId);
    
            cy.request({
                method: 'PUT',
                url: `/usuarios/${firstUsuarioId}`, 
                body: {
                    administrador: 'true',
                    email: "ciclano11176A@qa.com.br",
                    nome:  "FFFulano da Silva",
                    password: "teste" },
                headers: { authorization: token }
            }).then(response => {
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        });
    });
    
    
    

    it('Deve deletar um usuário previamente cadastrado', () => {
        
        let email = `ciclano${Math.floor(Math.random() * 1000000)}@qa.com.br`;
    
        
        cy.request({
            method: 'POST',
            url: 'usuarios',
            body: {
                "nome": "Pedro Testing",
                "email": email,
                "password": "testing",
                "administrador": "false"
            },
            headers: { authorization: token }
        }).then(response => {
            
            expect(response.status).to.equal(201);
    
            
            const userId = response.body._id;
    
            
            cy.request({
                method: 'DELETE',
                url: `usuarios/${userId}`,
                headers: { authorization: token }
            }).then(deletionResponse => {
                expect(deletionResponse.status).to.equal(200);
                expect(deletionResponse.body.message).to.equal('Registro excluído com sucesso');
            });
        });
    });
    
});
