const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/db');
const { checkExistence } = require('../models/utils');

// Endpoint para registrar faltas
router.post('/faltas', [
  body('aluno_id').isInt().withMessage('O ID do aluno deve ser um número inteiro.'),
  body('turma_id').isInt().withMessage('O ID da turma deve ser um número inteiro.'),
  body('data').isISO8601().withMessage('Data inválida.'),
  body('justificativa').optional().isString().withMessage('A justificativa deve ser um texto.')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { aluno_id, turma_id, data, justificativa } = req.body;

  try {
    if (!(await checkExistence('alunos', 'aluno_id', aluno_id))) {
      return res.status(400).json({ message: 'Aluno não encontrado.' });
    }
    if (!(await checkExistence('turmas', 'turma_id', turma_id))) {
      return res.status(400).json({ message: 'Turma não encontrada.' });
    }

    const [result] = await db.query(
      'INSERT INTO Faltas (aluno_id, turma_id, data, justificativa) VALUES (?, ?, ?, ?)',
      [aluno_id, turma_id, data, justificativa || null]
    );

    res.status(201).json({ message: 'Falta registrada com sucesso!', falta_id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao registrar falta' });
  }
});

// Endpoint para consultar faltas de um aluno
router.get('/faltas/:aluno_id', async (req, res) => {
  const { aluno_id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM Faltas WHERE aluno_id = ?', [aluno_id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Faltas não encontradas para este aluno.' });
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao consultar faltas' });
  }
});

module.exports = router;
