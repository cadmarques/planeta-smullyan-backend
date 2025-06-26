// backend/routes/islandRoutes.js
const express = require('express');
const Island = require('../models/Island'); // Importa o modelo de Ilha
const router = express.Router();

// Função Ray Casting
function isPointInPolygon(point, polygon) {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

// Rota para listar todas as ilhas
router.get('/', async (req, res) => {
  try {
    const islands = await Island.find();
    res.json(islands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para verificar se um clique está dentro de uma ilha
router.get('/find-by-click', async (req, res) => {
  try {
    const { x, y } = req.query; // Coordenadas do clique

    if (!x || !y) {
      return res.status(400).json({ message: 'Coordenadas (x, y) são obrigatórias.' });
    }

    // Buscar todas as ilhas
    const islands = await Island.find();

    // Verificar qual ilha contém o ponto
    const clickedIsland = islands.find((island) => {
      const polygon = island.boundaries;
      return isPointInPolygon([parseInt(x), parseInt(y)], polygon);
    });

    if (!clickedIsland) {
      return res.status(200).json({ message: 'Nenhuma ilha encontrada nas coordenadas fornecidas.' });
    }

    // Populando os puzzles associados à ilha
    await clickedIsland.populate('puzzles');

    res.json(clickedIsland);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para obter uma ilha específica pelo ID
router.get('/:id', async (req, res) => {
  console.log('Rota /api/islands/:id chamada com ID:', req.params.id);
  try {
    const island = await Island.findById(req.params.id)
      .populate({
        path: 'banner',
        model: 'Image', // Especifica o modelo Image para o campo banner
      })
      .populate({
        path: 'puzzles',
        populate: { path: 'icon', model: 'Image' }, // Popula o ícone de cada puzzle
      });

    if (!island) {
      console.log('...Ilha não encontrada para o ID:', req.params.id);
      return res.status(404).json({ message: 'Ilha não encontrada.' });
    }

    console.log('Ilha encontrada após o populate:', island);

    res.json(island);
  } catch (err) {
    console.error('Erro ao buscar ilha:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Rota para criar uma nova ilha
router.post('/', async (req, res) => {
  const { name, description, boundaries } = req.body;

  if (!name || !description || !boundaries || boundaries.length < 3) {
    return res.status(400).json({
      message:
        'Nome, descrição e limites (com pelo menos 3 pontos) são obrigatórios.',
    });
  }

  const newIsland = new Island({
    name,
    description,
    boundaries,
  });

  try {
    const savedIsland = await newIsland.save();
    res.status(201).json(savedIsland);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para atualizar uma ilha existente
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body; // Recebe todos os campos enviados no corpo da requisição

    // Atualiza a ilha com os novos dados
    const updatedIsland = await Island.findByIdAndUpdate(
      req.params.id,
      updates, // Usa o objeto completo do corpo da requisição
      { new: true } // Retorna a ilha atualizada
    );

    if (!updatedIsland) {
      return res.status(404).json({ message: 'Ilha não encontrada.' });
    }

    res.json(updatedIsland);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para excluir uma ilha
router.delete('/:id', async (req, res) => {
  try {
    const deletedIsland = await Island.findByIdAndDelete(req.params.id);
    if (!deletedIsland) {
      return res.status(404).json({ message: 'Ilha não encontrada.' });
    }
    res.json({ message: 'Ilha excluída com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;