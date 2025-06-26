// backend/routes/puzzleDetailsRoutes.js
const express = require('express');
const PuzzleDetails = require('../models/PuzzleDetails');
const Puzzle = require('../models/Puzzle'); // Para verificar a existência do puzzle

const router = express.Router();

// Rota para listar os detalhes de um puzzle específico
router.get('/:puzzleId', async (req, res) => {
  try {
    const { puzzleId } = req.params;

    // Verificar se o puzzle existe
    const puzzle = await Puzzle.findById(puzzleId);
    if (!puzzle) {
      return res.status(404).json({ message: 'Puzzle not found.' });
    }

    // Buscar os detalhes do puzzle e popular as imagens dos personagens
    const puzzleDetails = await PuzzleDetails.findOne({ puzzle: puzzleId })
      .populate({
        path: 'steps.characters.image', // Popula as imagens dos personagens nos passos
        model: 'Image',
      });

    if (!puzzleDetails) {
      return res.status(404).json({ message: 'Puzzle details not found.' });
    }

    res.json(puzzleDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para criar ou substituir os detalhes de um puzzle
router.post('/:puzzleId', async (req, res) => {
  try {
    const { puzzleId } = req.params;

    // Verificar se o puzzle existe
    const puzzle = await Puzzle.findById(puzzleId);
    if (!puzzle) {
      return res.status(404).json({ message: 'Puzzle not found.' });
    }

    // Verificar se já existem detalhes para o puzzle
    let puzzleDetails = await PuzzleDetails.findOne({ puzzle: puzzleId });

    if (puzzleDetails) {
      // Substituir os detalhes existentes
      puzzleDetails.steps = req.body.steps;
      await puzzleDetails.save();
    } else {
      // Criar novos detalhes
      puzzleDetails = new PuzzleDetails({
        puzzle: puzzleId,
        steps: req.body.steps,
      });
      await puzzleDetails.save();
    }

    res.status(201).json({ message: 'Puzzle details created/updated successfully!', puzzleDetails });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para atualizar um passo específico de um puzzle
router.put('/:puzzleId/steps/:stepNumber', async (req, res) => {
  try {
    const { puzzleId, stepNumber } = req.params;

    // Verificar se o puzzle existe
    const puzzle = await Puzzle.findById(puzzleId);
    if (!puzzle) {
      return res.status(404).json({ message: 'Puzzle not found.' });
    }

    // Buscar os detalhes do puzzle
    const puzzleDetails = await PuzzleDetails.findOne({ puzzle: puzzleId });
    if (!puzzleDetails) {
      return res.status(404).json({ message: 'Puzzle details not found.' });
    }

    // Encontrar o passo específico
    const step = puzzleDetails.steps.find((s) => s.stepNumber === parseInt(stepNumber));
    if (!step) {
      return res.status(404).json({ message: 'Step not found.' });
    }

    // Atualizar o passo
    Object.assign(step, req.body);

    // Salvar as alterações
    await puzzleDetails.save();

    res.json({ message: 'Step updated successfully!', step });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para excluir os detalhes de um puzzle
router.delete('/:puzzleId', async (req, res) => {
  try {
    const { puzzleId } = req.params;

    // Verificar se o puzzle existe
    const puzzle = await Puzzle.findById(puzzleId);
    if (!puzzle) {
      return res.status(404).json({ message: 'Puzzle not found.' });
    }

    // Excluir os detalhes do puzzle
    const result = await PuzzleDetails.deleteOne({ puzzle: puzzleId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Puzzle details not found.' });
    }

    res.json({ message: 'Puzzle details deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;