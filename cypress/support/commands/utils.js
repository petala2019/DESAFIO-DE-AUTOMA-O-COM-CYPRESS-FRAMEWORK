import Ajv from 'ajv'

const ajv = new Ajv({ allErrors: true, formats: { email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ } })

/**
 * Seleciona elementos pelo atributo data-testid (seletor estável, recomendado pela documentação do Cypress).
 * Uso: cy.getByTestId('email')
 */
Cypress.Commands.add('getByTestId', (testId, options) => cy.get(`[data-testid="${testId}"]`, options))

/**
 * Valida o corpo de uma resposta contra um JSON Schema em cypress/fixtures/schemas.
 * Uso: cy.wrap(response.body).validarContrato('usuario')
 */
Cypress.Commands.add('validarContrato', { prevSubject: true }, (body, schemaName) => {
  cy.fixture(`schemas/${schemaName}.schema.json`).then((schema) => {
    const validar = ajv.compile(schema)
    const valido = validar(body)
    expect(valido, `contrato "${schemaName}": ${ajv.errorsText(validar.errors)}`).to.be.true
  })
})
