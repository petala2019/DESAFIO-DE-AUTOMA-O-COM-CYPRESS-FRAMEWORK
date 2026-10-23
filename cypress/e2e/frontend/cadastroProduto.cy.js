import { criarProduto } from '../../support/factories/produtoFactory'

describe('Frontend | Cadastro de produto', () => {
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

  beforeEach(() => {
    cy.login(admin)
  })

  after(() => {
    if (produtoId) cy.apiExcluirProduto(produtoId, token)
    cy.apiExcluirUsuario(admin._id)
  })

  it('deve cadastrar um produto como administrador e exibi-lo na listagem', () => {
    const produto = criarProduto()
    cy.intercept('POST', '**/produtos').as('cadastrarProduto')

    cy.visit('/admin/home')
    cy.getByTestId('cadastrar-produtos').click()
    cy.cadastrarProdutoUi(produto)

    cy.wait('@cadastrarProduto').then(({ response }) => {
      expect(response.statusCode).to.eq(201)
      produtoId = response.body._id
    })
    cy.location('pathname').should('eq', '/admin/listarprodutos')
    // colunas: Nome, Preço, Descrição, Quantidade, Imagem, Ações
    cy.contains('table tbody tr', produto.nome)
      .find('td')
      .then(($td) => {
        expect($td.eq(0)).to.have.text(produto.nome)
        expect($td.eq(1)).to.have.text(String(produto.preco))
        expect($td.eq(2)).to.have.text(produto.descricao)
        expect($td.eq(3)).to.have.text(String(produto.quantidade))
      })
  })
})
