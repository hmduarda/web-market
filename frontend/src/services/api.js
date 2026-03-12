const API_URL = "http://localhost:5000/api";

const getToken = () => {
  return localStorage.getItem("token");
};

const fetchComToken = async (url, opcoes = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...opcoes.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const resposta = await fetch(url, {
    ...opcoes,
    headers,
  });

  if (resposta.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/login";
  }

  return resposta;
};

export const login = async (email, senha) => {
  try {
    const resposta = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    if (!resposta.ok) {
      throw new Error("Email ou senha incorretos");
    }

    const dados = await resposta.json();
    localStorage.setItem("token", dados.token);
    localStorage.setItem("usuario", JSON.stringify(dados.usuario));

    return dados;
  } catch (erro) {
    console.error("Erro no login:", erro);
    throw erro;
  }
};

export const listarProdutos = async () => {
  try {
    const resposta = await fetchComToken(`${API_URL}/products`);
    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error("Erro ao listar produtos:", erro);
    return [];
  }
};

export const buscarProduto = async (id) => {
  try {
    const resposta = await fetchComToken(`${API_URL}/products/${id}`);
    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error("Erro ao buscar produto:", erro);
    return null;
  }
};

export const adicionarProduto = async (produto) => {
  try {
    const resposta = await fetchComToken(`${API_URL}/products`, {
      method: "POST",
      body: JSON.stringify(produto),
    });

    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro.mensagem || "Erro ao adicionar produto");
    }

    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error("Erro ao adicionar produto:", erro);
    throw erro;
  }
};

export const atualizarProduto = async (id, produto) => {
  try {
    const resposta = await fetchComToken(`${API_URL}/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(produto),
    });

    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro.mensagem || "Erro ao atualizar produto");
    }

    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error("Erro ao atualizar produto:", erro);
    throw erro;
  }
};

export const removerProduto = async (id) => {
  try {
    const resposta = await fetchComToken(`${API_URL}/products/${id}`, {
      method: "DELETE",
    });

    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro.mensagem || "Erro ao remover produto");
    }

    return true;
  } catch (erro) {
    console.error("Erro ao remover produto:", erro);
    throw erro;
  }
};

export const aplicarPromocao = async (id, precoPromocao) => {
  try {
    const resposta = await fetchComToken(`${API_URL}/products/${id}/promocao`, {
      method: "POST",
      body: JSON.stringify({ precoPromocao }),
    });
    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error("Erro ao aplicar promoção:", erro);
    throw erro;
  }
};

export const removerPromocao = async (id) => {
  try {
    const resposta = await fetchComToken(`${API_URL}/products/${id}/promocao`, {
      method: "DELETE",
    });
    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error("Erro ao remover promoção:", erro);
    throw erro;
  }
};

export const listarUsuarios = async () => {
  try {
    const resposta = await fetchComToken(`${API_URL}/users`);
    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error("Erro ao listar usuários:", erro);
    return [];
  }
};

export const buscarUsuario = async (id) => {
  try {
    const resposta = await fetchComToken(`${API_URL}/users/${id}`);
    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error("Erro ao buscar usuário:", erro);
    return null;
  }
};

export const adicionarUsuario = async (usuario) => {
  try {
    const resposta = await fetchComToken(`${API_URL}/users`, {
      method: "POST",
      body: JSON.stringify(usuario),
    });
    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error("Erro ao adicionar usuário:", erro);
    throw erro;
  }
};

export const atualizarUsuario = async (id, usuario) => {
  try {
    const resposta = await fetchComToken(`${API_URL}/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(usuario),
    });
    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error("Erro ao atualizar usuário:", erro);
    throw erro;
  }
};

export const removerUsuario = async (id) => {
  try {
    await fetchComToken(`${API_URL}/users/${id}`, {
      method: "DELETE",
    });
    return true;
  } catch (erro) {
    console.error("Erro ao remover usuário:", erro);
    throw erro;
  }
};
