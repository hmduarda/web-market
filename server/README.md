# Web Market

## Sobre o Projeto

A aplicação simula o backend de uma loja virtual, onde usuários podem se cadastrar, navegar por produtos, montar um carrinho de compras e finalizar pedidos. Administradores têm acesso a funcionalidades exclusivas de gerenciamento.

Todo o projeto foi desenvolvido em **TypeScript** sobre **Node.js**, garantindo tipagem estática, maior segurança no desenvolvimento e código mais robusto. O banco de dados utilizado é o **MongoDB Atlas** — solução em nuvem que permite demonstrar o funcionamento real da aplicação sem depender de ambiente local.

---

## Decisões Técnicas

### Arquitetura em Camadas

O código é organizado em quatro camadas bem definidas:

- **Routes** — define os endpoints e aplica os middlewares corretos
- **Controllers** — recebe a requisição HTTP, valida o básico e delega para o service
- **Services** — contém toda a regra de negócio (cálculos, validações, operações no banco)
- **Models** — define a estrutura dos dados com Mongoose

Essa separação garante que cada parte do código tenha uma única responsabilidade, facilitando manutenção e testes.

### Segurança com JWT

A autenticação é feita com **JSON Web Token**. Ao fazer login, o usuário recebe um token assinado que deve ser enviado no header `Authorization: Bearer <token>` em todas as rotas protegidas. O middleware `authenticate` valida o token e injeta os dados do usuário na requisição. Rotas administrativas têm uma camada adicional com o middleware `authorizeAdmin`, que verifica o campo `role`.

### Senhas com bcrypt

As senhas nunca são armazenadas em texto puro. Antes de salvar no banco, o Mongoose aplica automaticamente o hash via `bcrypt` com 10 salt rounds no hook `pre('save')`.

### Fluxo de Checkout

O endpoint `POST /api/orders/checkout` executa três operações atômicas em sequência:

1. Cria o pedido com um **snapshot** dos itens (preservando preços do momento da compra)
2. Decrementa o estoque de cada produto pelo `$inc` do MongoDB
3. Limpa o carrinho do usuário

---

## Stack

| Categoria      | Tecnologia            |
| -------------- | --------------------- |
| Runtime        | Node.js + TypeScript  |
| Framework      | Express               |
| Banco de dados | MongoDB Atlas (nuvem) |
| ODM            | Mongoose              |
| Autenticação   | JWT (jsonwebtoken)    |
| Hash de senha  | bcrypt                |

---

## Entidades e Relacionamentos

```text
User  ──────┬────── Cart ──── CartItem ──── Product
             │
             └────── Order ── OrderItem ─── Product
```

| Entidade | Descrição                                                          |
| -------- | ------------------------------------------------------------------ |
| User     | Usuário com perfil `customer` (padrão) ou `admin`                  |
| Product  | Produto com nome, descrição, preço, estoque e imagem               |
| Cart     | Carrinho único por usuário, com lista de itens e total calculado   |
| Order    | Pedido gerado a partir do carrinho, com snapshot de itens e status |

**Status do pedido:** `pending` → `paid` → `shipped` → `delivered` (ou `cancelled`)

---

## Endpoints

### Autenticação

| Método | Rota               | Auth | Descrição                |
| ------ | ------------------ | ---- | ------------------------ |
| POST   | /api/auth/register | —    | Cadastro de novo usuário |
| POST   | /api/auth/login    | —    | Login e geração do JWT   |

### Usuários

| Método | Rota           | Auth     | Descrição               |
| ------ | -------------- | -------- | ----------------------- |
| GET    | /api/users/:id | ✅       | Perfil do usuário       |
| GET    | /api/users     | ✅ admin | Lista todos os usuários |
| PUT    | /api/users/:id | ✅ admin | Atualiza usuário        |
| DELETE | /api/users/:id | ✅ admin | Remove usuário          |

### Produtos

| Método | Rota              | Auth     | Descrição          |
| ------ | ----------------- | -------- | ------------------ |
| GET    | /api/products     | —        | Lista produtos     |
| GET    | /api/products/:id | —        | Detalhe do produto |
| POST   | /api/products     | ✅ admin | Cria produto       |
| PUT    | /api/products/:id | ✅ admin | Atualiza produto   |
| DELETE | /api/products/:id | ✅ admin | Remove produto     |

### Carrinho

| Método | Rota                       | Auth | Descrição            |
| ------ | -------------------------- | ---- | -------------------- |
| GET    | /api/cart                  | ✅   | Ver carrinho         |
| POST   | /api/cart/items            | ✅   | Adicionar item       |
| PUT    | /api/cart/items/:productId | ✅   | Atualizar quantidade |
| DELETE | /api/cart/items/:productId | ✅   | Remover item         |
| DELETE | /api/cart                  | ✅   | Limpar carrinho      |

### Pedidos

| Método | Rota                   | Auth     | Descrição                                            |
| ------ | ---------------------- | -------- | ---------------------------------------------------- |
| POST   | /api/orders/checkout   | ✅       | Finaliza pedido, desconta estoque e limpa o carrinho |
| GET    | /api/orders            | ✅       | Lista pedidos do usuário logado                      |
| GET    | /api/orders/:id        | ✅       | Detalhe de um pedido                                 |
| PATCH  | /api/orders/:id/status | ✅ admin | Atualiza status do pedido                            |

---

## Como Executar

### Pré-requisitos

- Node.js 18+
- Conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratuito)

### 1. Instalar dependências

```bash
cd server
npm install
```

### 2. Configurar variáveis de ambiente

Crie o arquivo `.env` na pasta `server/` seguindo o `.env.example`:

```env
PORT=5000
DB_URL=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/supermercado?retryWrites=true&w=majority
JWT_SECRET=sua_chave_secreta_aqui
```

### 3. Iniciar o servidor

```bash
npm run dev
```

Saída esperada:

```bash
Connected to MongoDB successfully!
Server running on port 5000
http://localhost:5000
```

---

## Critérios Atendidos

| Critério                       | Como foi atendido                                                                |
| ------------------------------ | -------------------------------------------------------------------------------- |
| API RESTful com CRUD completo  | 4 entidades com operações Create, Read, Update e Delete                          |
| Relacionamento entre entidades | User → Cart/Order → Product, com referências via ObjectId e populate             |
| Validação de dados             | Schemas Mongoose com `required`, `enum`, `min`, `unique` e validações no service |
| Autenticação JWT               | Middleware `authenticate` em todas as rotas protegidas                           |
| Autorização por perfil         | Middleware `authorizeAdmin` nas rotas exclusivas de administrador                |
| Segurança de senhas            | Hash bcrypt aplicado automaticamente antes de salvar no banco                    |
