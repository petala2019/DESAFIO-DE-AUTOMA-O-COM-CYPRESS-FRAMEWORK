import { criarUsuario } from '../../support/factories/usuarioFactory'

describe('API | /usuarios', () => {
  const criados = []

  beforeEach(function () {
    cy.fixture('mensagens').as('mensagens')
  })

  after(() => {
    criados.forEach((id) => cy.apiExcluirUsuario(id))
  })

  it('deve cadastrar um usuário e retorná-lo na consulta por ID conforme o contrato', function () {
    const usuario = criarUsuario({ administrador: 'false' })

    cy.apiCadastrarUsuario(usuario).then((cadastro) => {
      expect(cadastro.status).to.eq(201)
      expect(cadastro.body.message).to.eq(this.mensagens.cadastroSucesso)
      expect(cadastro.body._id).to.be.a('string').and.not.be.empty
      criados.push(cadastro.body._id)

      cy.apiBuscarUsuario(cadastro.body._id).then((consulta) => {
        expect(consulta.status).to.eq(200)
        cy.wrap(consulta.body).validarContrato('usuario')
        expect(consulta.body).to.deep.equal({ ...usuario, _id: cadastro.body._id })
      })
    })
  })

  it('não deve cadastrar usuário com e-mail já utilizado', function () {
    cy.criarUsuarioViaApi().then((existente) => {
      criados.push(existente._id)
      const duplicado = criarUsuario({ email: existente.email })

      cy.apiCadastrarUsuario(duplicado).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body).to.deep.equal({ message: this.mensagens.emailEmUso })
      })
    })
  })
})
