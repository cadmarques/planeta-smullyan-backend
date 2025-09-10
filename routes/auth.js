// backend/routes.auth
const express = require('express');
const User = require('../models/User'); // Importa o modelo de usuário
const router = express.Router();

// Rota para registrar um novo usuário
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verifica se o email já está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já registrado.' });
    }

    // Cria o novo usuário
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: 'Usuário registrado com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar usuário.', error });
  }
});

// Rota para login
router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;

    // Verifica se o usuário existe
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(400).json({ message: 'Utilizador ou senha inválidos.' });
    }

    // Verifica a senha (sem encriptação por enquanto)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Utilizador ou senha inválidos.' });
    }

    res.status(200).json({ message: 'Login bem-sucedido.', user });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao realizar login.', error });
  }
});

module.exports = router;