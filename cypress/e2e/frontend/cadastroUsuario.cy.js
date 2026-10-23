import { criarUsuario } from '../../support/factories/usuarioFactory'

describe('Frontend | Cadastro de usuário', () => {
  let usuarioId

  beforeEach(function () {
    cy.fixture('mensagens').as('mensagens')
  })

  afterEach(() => {
    if (usuarioId) cy.apiExcluirUsuario(usuarioId)
  })

  it('deve cadastrar um usuário administrador e direcioná-lo para a home de admin', function () {
    const usuario = criarUsuario({ administrador: 'true' })
    cy.intercept('POST', '**/usuarios').as('cadastrarUsuario')

    cy.visit('/cadastrarusuarios')
    cy.cadastrarUsuarioUi(usuario)

    cy.wait('@cadastrarUsuario').then(({ response }) => {
      expect(response.statusCode).to.eq(201)
      usuarioId = response.body._id
    })
    cy.get('.alert').should('contain.text', this.mensagens.cadastroSucesso)
    cy.location('pathname').should('eq', '/admin/home')
    // a aplicação renderiza espaços extras no título, por isso o texto é normalizado
    cy.get('h1')
      .invoke('text')
      .then((texto) => texto.replace(/\s+/g, ' ').trim())
      .should('eq', `Bem Vindo ${usuario.nome}`)
    cy.getByTestId('cadastrar-produtos').should('be.visible')
  })
})
