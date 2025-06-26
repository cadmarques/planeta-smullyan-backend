// backend/routes/testDocRoutes.js
const express = require('express');
const TestDoc = require('../models/TestDoc');

const router = express.Router();

// Rota para inserir um TestDoc
router.post('/testdocs', async (req, res) => {
  try {
    const testDoc = new TestDoc(req.body);
    await testDoc.save();
    res.status(201).json({ message: 'TestDoc created successfully!', testDoc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rota para buscar todos os TestDocs
router.get('/testdocs', async (req, res) => {
  try {
    const testDocs = await TestDoc.find();
    res.json(testDocs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;