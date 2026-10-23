/**
 * Preenche e envia o formulário de login.
 */
Cypress.Commands.add('preencherLogin', (email, senha) => {
  cy.getByTestId('email').type(email)
  cy.getByTestId('senha').type(senha, { log: false })
  cy.getByTestId('entrar').click()
})

/**
 * Login pela interface com cache de sessão (cy.session): o fluxo só é executado
 * uma vez por usuário e a sessão é restaurada nos testes seguintes.
 */
Cypress.Commands.add('login', ({ email, password }) => {
  cy.session(
    ['login', email],
    () => {
      cy.visit('/login')
      cy.preencherLogin(email, password)
      cy.location('pathname').should('eq', '/admin/home')
    },
    {
      validate: () => {
        cy.window().its('localStorage').invoke('getItem', 'serverest/userToken').should('exist')
      },
    },
  )
})

/**
 * Preenche e envia o formulário de cadastro de usuário (/cadastrarusuarios).
 */
Cypress.Commands.add('cadastrarUsuarioUi', ({ nome, email, password, administrador }) => {
  cy.getByTestId('nome').type(nome)
  cy.getByTestId('email').type(email)
  cy.getByTestId('password').type(password, { log: false })
  if (administrador === 'true') cy.getByTestId('checkbox').check()
  cy.getByTestId('cadastrar').click()
})

/**
 * Preenche e envia o formulário de cadastro de produto (/admin/cadastrarprodutos).
 */
Cypress.Commands.add('cadastrarProdutoUi', ({ nome, preco, descricao, quantidade }) => {
  cy.getByTestId('nome').type(nome)
  cy.getByTestId('preco').type(String(preco))
  cy.getByTestId('descricao').type(descricao)
  cy.getByTestId('quantity').type(String(quantidade))
  // o data-testid "cadastarProdutos" tem um erro de digitação na própria aplicação
  cy.getByTestId('cadastarProdutos').click()
})
