const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
    },
    precoAtual: {
      type: Number,
      required: true,
      min: 0,
    },
    precoPromocao: {
      type: Number,
      default: null,
      min: 0,
    },
    tipo: {
      type: String,
      required: true,
    },
    descricao: {
      type: String,
      required: true,
    },
    dataValidade: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
