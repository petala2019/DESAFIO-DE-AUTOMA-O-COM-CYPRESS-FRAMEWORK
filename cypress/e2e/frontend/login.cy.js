describe('Frontend | Login', () => {
  let usuario

  before(() => {
    cy.criarUsuarioViaApi().then((criado) => {
      usuario = criado
    })
  })

  after(() => {
    cy.apiExcluirUsuario(usuario._id)
  })

  it('não deve autenticar com senha inválida e deve exibir mensagem de erro', () => {
    cy.fixture('mensagens').then(({ loginInvalido }) => {
      cy.intercept('POST', '**/login').as('login')

      cy.visit('/login')
      cy.preencherLogin(usuario.email, 'senha-incorreta')

      cy.wait('@login').its('response.statusCode').should('eq', 401)
      cy.get('.alert').should('be.visible').and('contain.text', loginInvalido)
      cy.location('pathname').should('eq', '/login')
      cy.window().its('localStorage').invoke('getItem', 'serverest/userToken').should('be.null')
    })
  })
})
