// backend/routes/imageRoutes.js
const express = require('express');
const multer = require('multer'); // Middleware para upload de arquivos
const path = require('path');
const Image = require('../models/Image'); // Importa o modelo de Imagem

const router = express.Router();

// Configuração do multer para salvar arquivos na pasta 'public/images'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/'); // Pasta onde as imagens serão salvas
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nome único para evitar conflitos
  },
});

const upload = multer({ storage });

const fs = require('fs'); // Módulo para manipular arquivos no sistema


// Rota para upload de imagens
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhuma imagem foi enviada.' });
    }

    // Salvar os metadados da imagem no banco de dados
    const newImage = new Image({
      name: req.body.name || 'Sem título',
      description: req.body.description || 'Sem descrição',
      url: `/images/${req.file.filename}`, // Caminho relativo da imagem
    });

    await newImage.save();
    res.status(201).json({ message: 'Imagem enviada com sucesso!', image: newImage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para listar todas as imagens
router.get('/', async (req, res) => {
    try {
      const images = await Image.find(); // Busca todas as imagens no banco de dados
      res.status(200).json(images);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

// Rota para apagar uma imagem pelo ID
router.delete('/:id', async (req, res) => {
    try {
      const imageId = req.params.id;
  
      // Buscar a imagem no banco de dados
      const image = await Image.findById(imageId);
      if (!image) {
        return res.status(404).json({ message: 'Imagem não encontrada.' });
      }
  
      // Remover o arquivo físico da imagem
      const filePath = path.join(__dirname, '..', 'public', image.url); // Caminho completo do arquivo
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Exclui o arquivo do sistema
      }
  
      // Remover os metadados da imagem do banco de dados
      await Image.findByIdAndDelete(imageId);
  
      res.status(200).json({ message: 'Imagem excluída com sucesso.' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

module.exports = router;