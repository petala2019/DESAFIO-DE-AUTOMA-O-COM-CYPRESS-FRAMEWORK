import { criarProduto } from '../../support/factories/produtoFactory'

describe('API | /produtos', () => {
  let admin
  let token
  let produtoId

  before(() => {
    cy.criarUsuarioViaApi({ administrador: 'true' }).then((criado) => {
      admin = criado
      cy.obterToken(admin).then((t) => {
        token = t
      })
    })
  })

  after(() => {
    if (produtoId) cy.apiExcluirProduto(produtoId, token)
    cy.apiExcluirUsuario(admin._id)
  })

  it('deve cadastrar um produto autenticado como administrador e consultá-lo por ID', () => {
    const produto = criarProduto()

    cy.fixture('mensagens').then(({ cadastroSucesso }) => {
      cy.apiCadastrarProduto(produto, token).then((cadastro) => {
        expect(cadastro.status).to.eq(201)
        expect(cadastro.body.message).to.eq(cadastroSucesso)
        produtoId = cadastro.body._id

        cy.apiBuscarProduto(produtoId).then((consulta) => {
          expect(consulta.status).to.eq(200)
          cy.wrap(consulta.body).validarContrato('produto')
          expect(consulta.body).to.include({ ...produto, _id: produtoId })
        })
      })
    })
  })
})
