# API Routes Documentation

Base URL: `http://localhost:5000`

## 🔐 Autenticação

### Registrar Usuário
```http
POST /auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "...",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "customer"
  }
}
```

---

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "customer"
  }
}
```

---

## 👤 Usuários

### Meu Perfil
```http
GET /users/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "...",
  "name": "João Silva",
  "email": "joao@email.com",
  "role": "customer"
}
```

---

### Listar Todos os Usuários (Admin)
```http
GET /users
Authorization: Bearer <token_admin>
```

**Response:**
```json
[
  {
    "id": "...",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "customer"
  }
]
```

---

### Atualizar Usuário (Admin)
```http
PUT /users/:id
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "name": "João Silva Atualizado",
  "password": "novaSenha123"
}
```

---

### Deletar Usuário (Admin)
```http
DELETE /users/:id
Authorization: Bearer <token_admin>
```

---

## 🛍️ Produtos

### Listar Produtos
```http
GET /products
```

**Response:**
```json
[
  {
    "_id": "...",
    "name": "Produto 1",
    "description": "Descrição do produto",
    "price": 29.99,
    "stock": 100,
    "image": "url-da-imagem",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Buscar Produto por ID
```http
GET /products/:id
```

---

### Criar Produto (Admin)
```http
POST /products
Authorization: Bearer <token_admin>
Content-Type: multipart/form-data

name: "Produto Novo"
description: "Descrição detalhada"
price: 49.99
stock: 50
image: [arquivo.jpg]
```

**Response:**
```json
{
  "message": "Product created successfully",
  "product": {
    "_id": "...",
    "name": "Produto Novo",
    "description": "Descrição detalhada",
    "price": 49.99,
    "stock": 50,
    "image": "http://localhost:5000/uploads/123456-arquivo.jpg"
  }
}
```

---

### Atualizar Produto (Admin)
```http
PUT /products/:id
Authorization: Bearer <token_admin>
Content-Type: multipart/form-data

name: "Produto Atualizado"
description: "Nova descrição"
price: 59.99
stock: 30
image: [arquivo.jpg] (opcional)
```

---

### Deletar Produto (Admin)
```http
DELETE /products/:id
Authorization: Bearer <token_admin>
```

---

## 🛒 Carrinho

### Ver Carrinho
```http
GET /cart
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "...",
  "userId": "...",
  "items": [
    {
      "productId": {
        "_id": "...",
        "name": "Produto 1",
        "price": 29.99
      },
      "quantity": 2,
      "unitPrice": 29.99
    }
  ],
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Adicionar Item ao Carrinho
```http
POST /cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "...",
  "quantity": 2
}
```

---

### Atualizar Quantidade do Item
```http
PUT /cart/items/:productId
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 5
}
```

---

### Remover Item do Carrinho
```http
DELETE /cart/items/:productId
Authorization: Bearer <token>
```

---

### Limpar Carrinho
```http
DELETE /cart
Authorization: Bearer <token>
```

---

## 📦 Pedidos

### Finalizar Pedido (Checkout)
```http
POST /orders/checkout
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "...",
  "userId": "...",
  "items": [
    {
      "productId": "...",
      "quantity": 2,
      "unitPrice": 29.99
    }
  ],
  "total": 59.98,
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Listar Meus Pedidos
```http
GET /orders
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "...",
    "userId": "...",
    "items": [...],
    "total": 59.98,
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Buscar Pedido por ID
```http
GET /orders/:id
Authorization: Bearer <token>
```

---

### Atualizar Status do Pedido (Admin)
```http
PATCH /orders/:id/status
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "status": "paid"
}
```

**Status válidos:** `pending`, `paid`, `shipped`, `delivered`, `cancelled`

---

## 📁 Arquivos Estáticos

### Acessar Imagem
```http
GET /uploads/:filename
```

Exemplo: `http://localhost:5000/uploads/1234567890-produto.jpg`

---

## 🔑 Autenticação

Para rotas protegidas, inclua o token JWT no header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📝 Notas

- 🔒 = Requer autenticação
- 🔒 admin = Requer autenticação + role admin
- Imagens aceitas: jpeg, jpg, png, gif, webp (máx 5MB)
- Todos os usuários criados via `/auth/register` são `customer` por padrão
- Para criar admin, use o script: `npm run create-admin`
