// backend/routes/puzzleRoutes.js
const express = require('express');
const Puzzle = require('../models/Puzzle');
const Island = require('../models/Island'); // Para verificar a existência da ilha

const router = express.Router();

// Rota para listar todos os puzzles
router.get('/', async (req, res) => {
  try {
    const puzzles = await Puzzle.find().populate('island'); // Popula os dados da ilha
    res.json(puzzles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/by-island', async (req, res) => {
  try {
    const { island } = req.query;

    if (!island) {
      return res.status(400).json({ message: 'O ID da ilha é obrigatório.' });
    }

    // Verifica se a ilha existe
    const existingIsland = await Island.findById(island);
    if (!existingIsland) {
      return res.status(404).json({ message: 'Ilha não encontrada.' });
    }

    // Busca os puzzles associados à ilha
    const puzzles = await Puzzle.find({ island }).populate('island');
    res.json(puzzles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para obter um puzzle específico pelo ID
router.get('/:id', async (req, res) => {
  try {
    const puzzle = await Puzzle.findById(req.params.id)
      .populate('icon') // Popula o ícone do puzzle
      .populate({
        path: 'details', // Popula os detalhes do puzzle
        populate: { path: 'steps.characters.image', model: 'Image' }, // Popula as imagens dos personagens nos passos
      });

    if (!puzzle) {
      return res.status(404).json({ message: 'Puzzle não encontrado.' });
    }

    res.json(puzzle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para criar um novo puzzle
router.post('/', async (req, res) => {
  try {
    // Verificar se a ilha existe
    const island = await Island.findById(req.body.island);
    if (!island) {
      return res.status(404).json({ message: 'Island not found.' });
    }

    // Criar o puzzle
    const puzzle = new Puzzle(req.body);
    await puzzle.save();

    // Adicionar o puzzle à lista de puzzles da ilha
    island.puzzles.push(puzzle._id);
    await island.save();

    res.status(201).json({ message: 'Puzzle created successfully!', puzzle });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para atualizar um puzzle existente
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body; // Recebe todos os campos enviados no corpo da requisição

    // Atualiza o puzzle com os novos dados
    const updatedPuzzle = await Puzzle.findByIdAndUpdate(
      req.params.id,
      updates, // Usa o objeto completo do corpo da requisição
      { new: true } // Retorna o puzzle atualizado
    );

    if (!updatedPuzzle) {
      return res.status(404).json({ message: 'Puzzle não encontrado.' });
    }

    res.json(updatedPuzzle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o puzzle existe
    const puzzle = await Puzzle.findByIdAndDelete(id);
    if (!puzzle) {
      return res.status(404).json({ message: 'Puzzle não encontrado.' });
    }

    res.status(200).json({ message: 'Puzzle removido com sucesso.' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao remover puzzle.' });
  }
});

module.exports = router;