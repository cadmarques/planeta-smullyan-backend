// backend/routes/puzzleRoutes.js
const mongoose = require('mongoose');
const express = require('express');
const Puzzle = require('../models/Puzzle');
const PuzzleDetails = require('../models/PuzzleDetails'); // Importa o modelo puzzleDetails
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
    const puzzleId = req.params.id;

    // Buscar o puzzle básico
    const puzzle = await Puzzle.findById(puzzleId).populate('island'); // Popula os dados da ilha

    if (!puzzle) {
      return res.status(404).json({ message: 'Puzzle não encontrado.' });
    }

    // Buscar os detalhes do puzzle
    const details = await PuzzleDetails.findOne({ puzzle: puzzleId }).populate({
      path: 'steps.characters.image', // Popula as imagens dos personagens nos passos
      model: 'Image',
    });

    // Retornar os dados combinados
    res.json({
      _id: puzzle._id,
      title: puzzle.title,
      description: puzzle.description,
      banner: puzzle.banner,
      icon: puzzle.icon,
      island: puzzle.island,
      details: details || null, // Detalhes do puzzle (se existirem)
    });
  } catch (err) {
    console.error('Erro ao buscar puzzle:', err);
    res.status(500).json({ message: 'Erro ao buscar dados do puzzle.' });
  }
});

// Rota específica para o backoffice
router.get('/admin/:id', async (req, res) => {
  try {
    const puzzleId = req.params.id;

    // Buscar o puzzle básico
    const puzzle = await Puzzle.findById(puzzleId).populate('island');
    if (!puzzle) {
      return res.status(404).json({ message: 'Puzzle not found.' });
    }

    // Buscar os detalhes do puzzle
    const details = await PuzzleDetails.findOne({ puzzle: puzzleId });

    // Transformar os dados para o formato do backoffice
    const formattedDetails = details?.steps.map(step => ({
      stepNumber: step.stepNumber,
      body: step.body,
      charactersRef: step.charactersRef,
      characters: step.characters.map(character => ({
        image: character.image._id, // Retorna apenas o ID da imagem
        label: character.label,
        position: character.position,
        order: character.order,
      })),
      challenge: step.challenge,
    }));

    // Retornar os dados formatados
    res.json({
      _id: puzzle._id,
      title: puzzle.title,
      description: puzzle.description,
      banner: puzzle.banner,
      icon: puzzle.icon,
      island: puzzle.island,
      details: formattedDetails || null,
    });
  } catch (err) {
    console.error('Erro ao buscar puzzle:', err);
    res.status(500).json({ message: 'Erro ao buscar dados do puzzle.' });
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

// Nova rota PUT para atualização via admin
router.put('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params; // ID do puzzle a ser atualizado
    const updates = req.body; // Campos enviados no corpo da requisição

    // Busca o puzzle existente para obter o ID da ilha
    const existingPuzzle = await Puzzle.findById(id);
    if (!existingPuzzle) {
      return res.status(404).json({ message: 'Puzzle não encontrado.' });
    }
    console.log("encontrado puzzle com island id: ", existingPuzzle.island._id)

    // Adiciona o ID da ilha ao objeto de atualização
    updates.island = existingPuzzle.island._id;

    // Atualiza o puzzle com os novos dados
    const updatedPuzzle = await Puzzle.findByIdAndUpdate(
      id,
      updates, // Usa o objeto completo do corpo da requisição, incluindo o ID da ilha
      { new: true } // Retorna o puzzle atualizado
    );

    res.json(updatedPuzzle);
  } catch (err) {
    console.error('Erro ao atualizar puzzle:', err);
    res.status(500).json({ message: 'Erro ao atualizar puzzle.' });
  }
});

module.exports = router;