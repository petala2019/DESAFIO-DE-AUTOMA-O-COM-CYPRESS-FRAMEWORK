import { faker } from '@faker-js/faker'

/**
 * Gera um usuário válido e único para a ServeRest.
 * @param {Partial<{nome: string, email: string, password: string, administrador: string}>} overrides
 */
export const criarUsuario = (overrides = {}) => ({
  nome: faker.person.fullName(),
  email: `qa.${faker.string.alphanumeric(10).toLowerCase()}@serverest.dev`,
  password: faker.internet.password({ length: 12 }),
  administrador: 'true',
  ...overrides,
})
