# Desafio de automação com Cypress: ServeRest

Testes automatizados com [Cypress](https://www.cypress.io/) para a aplicação **ServeRest**:

- **Frontend:** https://front.serverest.dev/
- **API (Swagger):** https://serverest.dev/

## Cenários

### Frontend (E2E)

| Spec | Cenário | O que é validado |
|---|---|---|
| `frontend/cadastroUsuario.cy.js` | Cadastrar um usuário administrador | Resposta 201 da API, alerta de sucesso, redirecionamento para `/admin/home`, saudação com o nome e menu de administrador |
| `frontend/login.cy.js` | Login com senha inválida | Resposta 401, mensagem "Email e/ou senha inválidos", permanência em `/login` e nenhum token salvo |
| `frontend/cadastroProduto.cy.js` | Administrador cadastra um produto | Resposta 201, redirecionamento para a listagem e nome, preço, descrição e quantidade corretos na tabela |

### API

| Spec | Cenário | O que é validado |
|---|---|---|
| `api/usuarios.cy.js` | Cadastrar usuário e consultar por ID | Status 201 e 200, mensagem, contrato (JSON Schema) e igualdade dos dados retornados |
| `api/usuarios.cy.js` | Cadastrar usuário com e-mail já utilizado | Status 400 e corpo `{ message: "Este email já está sendo usado" }` |
| `api/produtos.cy.js` | Administrador cadastra produto e o consulta por ID | Status 201 e 200, mensagem, contrato e dados persistidos |

## Arquitetura e boas práticas

```
cypress/
├── e2e/
│   ├── api/              # specs de API
│   └── frontend/         # specs E2E
├── fixtures/
│   ├── mensagens.json    # textos esperados da aplicação
│   └── schemas/          # JSON Schemas para validação de contrato
└── support/
    ├── commands/
    │   ├── api.js        # cy.apiCadastrarUsuario, cy.apiLogin, cy.criarUsuarioViaApi...
    │   ├── frontend.js   # cy.login, cy.preencherLogin, cy.cadastrarUsuarioUi...
    │   └── utils.js      # cy.getByTestId, cy.validarContrato
    ├── factories/        # massa de dados dinâmica com Faker
    └── e2e.js
```

- **Comandos customizados** (`Cypress.Commands.add`) encapsulam as ações reutilizáveis, seguindo a recomendação da documentação do Cypress no lugar de Page Objects.
- **Seletores estáveis:** `data-testid`, acessados por `cy.getByTestId`.
- **Testes independentes:** cada spec cria a própria massa pela API (`before`) e a remove ao final (`after`), sem depender de dados fixos nem da ordem de execução.
- **Pré-condições pela API** (criar usuário, obter token) para que o teste de interface exercite apenas o fluxo sob teste.
- **`cy.session`** guarda a sessão de login e evita repetir o fluxo.
- **`cy.intercept` + `cy.wait`** sincronizam com as requisições reais, sem `cy.wait(ms)` fixo.
- **Factory pattern** com `@faker-js/faker` gera dados únicos a cada execução.
- **Validação de contrato** com `ajv` e JSON Schemas.
- **Retry** em `runMode` para reduzir falhas intermitentes de rede.

## Bibliotecas adicionais

| Biblioteca | Uso |
|---|---|
| `@faker-js/faker` | Geração de massa de dados |
| `ajv` | Validação de contrato via JSON Schema |
| `cypress-mochawesome-reporter` | Relatório HTML com gráficos e screenshots das falhas |
| `eslint` + `eslint-plugin-cypress` | Padronização e regras de boas práticas do Cypress |

## Como executar

Pré-requisito: Node.js 18 ou superior.

```bash
npm install

npm run cy:open        # modo interativo
npm test               # todos os testes (headless)
npm run test:api       # só API
npm run test:frontend  # só frontend
npm run lint           # ESLint
```

O relatório HTML é gerado em `cypress/reports/index.html`.

## Integração contínua

O workflow `.github/workflows/cypress.yml` roda a cada push e pull request na `main`: primeiro o lint, depois as suítes de API e frontend em paralelo (matriz). Os relatórios ficam disponíveis como artefatos da execução.
