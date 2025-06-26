// backend/models/PuzzleDetails.js
const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  question: { type: String, required: true }, // Pergunta do desafio
  options: [{ type: String, required: true }], // Opções de resposta
  correctAnswer: { type: String, required: true }, // Resposta correta
});

const characterSchema = new mongoose.Schema({
  image: {
    type: mongoose.Schema.Types.ObjectId, // Referência ao modelo Image
    ref: 'Image',
    required: true,
  },
  label: { type: String, required: false }, // Legenda (opcional)
  position: { type: String, enum: ['left', 'right'], required: true }, // Posição
  order: { type: Number, required: true }, // Ordem de exibição
});

const stepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true }, // Número do passo
  charactersRef: { type: Number, required: false }, // Passo onde os personagens foram alterados
  characters: [characterSchema], // Personagens no passo
  body: { type: String, required: true }, // Texto principal do passo
  challenge: {
    type: challengeSchema,
    required: false, // Opcional: apenas alguns passos terão desafios
  },
});

const puzzleDetailsSchema = new mongoose.Schema({
  puzzle: {
    type: mongoose.Schema.Types.ObjectId, // Referência ao puzzle
    ref: 'Puzzle',
    required: true,
  },
  steps: [stepSchema], // Todos os passos do puzzle
});

module.exports = mongoose.model('PuzzleDetails', puzzleDetailsSchema);