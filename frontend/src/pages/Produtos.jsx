import { useState, useEffect } from "react";

import {
  listarProdutos,
  adicionarProduto,
  atualizarProduto,
  removerProduto,
} from "../services/api";

import "./Produtos.css";

const Produtos = () => {
  const [produtos, setProdutos] = useState([]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [produtoEditando, setProdutoEditando] = useState(null);

  const [formulario, setFormulario] = useState({
    nome: "",
    precoAtual: "",
    tipo: "",
    descricao: "",
    dataValidade: "",
  });

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    const dados = await listarProdutos();
    setProdutos(dados);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormulario({ ...formulario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const produtoData = {
        ...formulario,
        precoAtual: parseFloat(formulario.precoAtual),
      };

      if (produtoEditando) {
        await atualizarProduto(produtoEditando._id, produtoData);
        alert("Produto atualizado com sucesso!");
      } else {
        await adicionarProduto(produtoData);
        alert("Produto adicionado com sucesso!");
      }

      limparFormulario();
      await carregarProdutos();
    } catch (erro) {
      alert(erro.message || "Erro ao salvar produto. Tente novamente.");
    }
  };

  const handleEditar = (produto) => {
    setProdutoEditando(produto);

    const dataFormatada = produto.dataValidade
      ? new Date(produto.dataValidade).toISOString().split("T")[0]
      : "";

    setFormulario({
      nome: produto.nome,
      precoAtual: produto.precoAtual,
      tipo: produto.tipo,
      descricao: produto.descricao,
      dataValidade: dataFormatada,
    });

    setMostrarFormulario(true);
  };

  const handleRemover = async (id) => {
    if (window.confirm("Tem certeza que deseja remover este produto?")) {
      try {
        await removerProduto(id);
        alert("Produto removido com sucesso!");
        await carregarProdutos();
      } catch (erro) {
        alert(erro.message || "Erro ao remover produto. Tente novamente.");
      }
    }
  };

  const limparFormulario = () => {
    setFormulario({
      nome: "",
      precoAtual: "",
      tipo: "",
      descricao: "",
      dataValidade: "",
    });
    setProdutoEditando(null);
    setMostrarFormulario(false);
  };

  return (
    <div className="containerPagina">
      {/* Cabeçalho da página com título e botão */}
      <div className="cabecalhoPagina">
        <h1>Gerenciamento de Produtos</h1>
        {/* Botão que alterna entre mostrar e esconder o formulário */}
        <button
          className="botaoPrimario"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {/* Texto do botão muda dependendo se o formulário tá aberto ou não */}
          {mostrarFormulario ? "Cancelar" : "Novo Produto"}
        </button>
      </div>

      {/* Só mostra o formulário se mostrarFormulario for true */}
      {mostrarFormulario && (
        <div className="cartaoFormulario">
          {/* Título muda dependendo se tá editando ou adicionando */}
          <h2>{produtoEditando ? "Editar Produto" : "Novo Produto"}</h2>
          <form onSubmit={handleSubmit}>
            {/* Primeira linha do formulário com 2 campos */}
            <div className="linhaFormulario">
              <div className="grupoFormulario">
                <label>Nome do Produto:</label>
                <input
                  type="text"
                  name="nome"
                  value={formulario.nome}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grupoFormulario">
                <label>Preço Atual (R$):</label>
                <input
                  type="number"
                  step="0.01"
                  name="precoAtual"
                  value={formulario.precoAtual}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Segunda linha do formulário */}
            <div className="linhaFormulario">
              <div className="grupoFormulario">
                <label>Tipo:</label>
                <input
                  type="text"
                  name="tipo"
                  value={formulario.tipo}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: Grãos, Massas, Bebidas"
                />
              </div>

              <div className="grupoFormulario">
                <label>Data de Validade:</label>
                <input
                  type="date"
                  name="dataValidade"
                  value={formulario.dataValidade}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Campo de descrição (textarea) */}
            <div className="grupoFormulario">
              <label>Descrição:</label>
              <textarea
                name="descricao"
                value={formulario.descricao}
                onChange={handleInputChange}
                required
                rows="3"
              />
            </div>

            {/* Botões de ação do formulário */}
            <div className="acoesFormulario">
              <button type="submit" className="botaoPrimario">
                {/* Texto muda dependendo se tá editando ou adicionando */}
                {produtoEditando ? "Atualizar" : "Adicionar"}
              </button>
              <button
                type="button"
                className="botaoSecundario"
                onClick={limparFormulario}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabela com a lista de produtos */}
      <div className="containerTabela">
        <table className="tabelaProdutos">
          {/* Cabeçalho da tabela */}
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Preço</th>
              <th>Promoção</th>
              <th>Validade</th>
              <th>Ações</th>
            </tr>
          </thead>
          {/* Corpo da tabela - mapeia cada produto pra uma linha */}
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto._id}>
                {/* key é obrigatório em listas no React */}
                <td>{produto._id}</td>
                <td>{produto.nome}</td>
                <td>{produto.tipo}</td>
                <td>R$ {produto.precoAtual.toFixed(2)}</td>
                {/* toFixed(2) mostra 2 casas decimais */}
                <td>
                  {/* Se tem promoção, mostra o preço, se não mostra - */}
                  {produto.precoPromocao ? (
                    <span className="promocaoAtiva">
                      R$ {produto.precoPromocao.toFixed(2)}
                    </span>
                  ) : (
                    <span className="semPromocao">-</span>
                  )}
                </td>
                <td>
                  {/* Formata a data pro formato brasileiro */}
                  {new Date(produto.dataValidade).toLocaleDateString("pt-BR")}
                </td>
                <td className="colunaBotoes">
                  {/* Botões de editar e remover */}
                  <button
                    className="botaoEditar"
                    onClick={() => handleEditar(produto)}
                  >
                    Editar
                  </button>
                  <button
                    className="botaoRemover"
                    onClick={() => handleRemover(produto._id)}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mensagem quando não tem produtos */}
        {produtos.length === 0 && (
          <p className="mensagemVazia">Nenhum produto cadastrado</p>
        )}
      </div>
    </div>
  );
};

export default Produtos;
