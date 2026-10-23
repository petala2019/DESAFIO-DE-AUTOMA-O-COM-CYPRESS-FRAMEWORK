import { criarUsuario } from '../factories/usuarioFactory'

const apiUrl = (path) => `${Cypress.env('apiUrl')}${path}`

const authHeader = (token) => (token ? { Authorization: token } : {})

// ---------- /usuarios ----------

Cypress.Commands.add('apiCadastrarUsuario', (usuario) =>
  cy.request({ method: 'POST', url: apiUrl('/usuarios'), body: usuario, failOnStatusCode: false }),
)

Cypress.Commands.add('apiBuscarUsuario', (id) =>
  cy.request({ method: 'GET', url: apiUrl(`/usuarios/${id}`), failOnStatusCode: false }),
)

Cypress.Commands.add('apiExcluirUsuario', (id) =>
  cy.request({ method: 'DELETE', url: apiUrl(`/usuarios/${id}`), failOnStatusCode: false }),
)

// ---------- /login ----------

Cypress.Commands.add('apiLogin', ({ email, password }) =>
  cy.request({ method: 'POST', url: apiUrl('/login'), body: { email, password }, failOnStatusCode: false }),
)

// ---------- /produtos ----------

Cypress.Commands.add('apiCadastrarProduto', (produto, token) =>
  cy.request({
    method: 'POST',
    url: apiUrl('/produtos'),
    body: produto,
    headers: authHeader(token),
    failOnStatusCode: false,
  }),
)

Cypress.Commands.add('apiBuscarProduto', (id) =>
  cy.request({ method: 'GET', url: apiUrl(`/produtos/${id}`), failOnStatusCode: false }),
)

Cypress.Commands.add('apiExcluirProduto', (id, token) =>
  cy.request({
    method: 'DELETE',
    url: apiUrl(`/produtos/${id}`),
    headers: authHeader(token),
    failOnStatusCode: false,
  }),
)

// ---------- Pré-condições ----------

/**
 * Cria um usuário (administrador por padrão) via API e devolve os dados com o _id.
 */
Cypress.Commands.add('criarUsuarioViaApi', (overrides = {}) => {
  const usuario = criarUsuario(overrides)
  return cy.apiCadastrarUsuario(usuario).then((response) => {
    expect(response.status, 'pré-condição: usuário criado').to.eq(201)
    return { ...usuario, _id: response.body._id }
  })
})

/**
 * Autentica via API e devolve o token Bearer.
 */
Cypress.Commands.add('obterToken', (usuario) =>
  cy.apiLogin(usuario).then((response) => {
    expect(response.status, 'pré-condição: login via API').to.eq(200)
    return response.body.authorization
  }),
)
