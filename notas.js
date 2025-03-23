const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/db');
const { checkExistence } = require('../models/utils');

// Endpoint para registrar notas
router.post('/notas', [
  body('aluno_id').isInt().withMessage('O ID do aluno deve ser um número inteiro.'),
  body('materia_id').isInt().withMessage('O ID da matéria deve ser um número inteiro.'),
  body('nota').isFloat({ min: 0, max: 10 }).withMessage('A nota deve estar entre 0 e 10.'),
  body('tipo_atividade').isIn(['trabalho', 'prova', 'teste']).withMessage('Tipo de atividade inválido.'),
  body('data').isISO8601().withMessage('Data inválida.')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { aluno_id, materia_id, nota, tipo_atividade, data } = req.body;

  try {
    if (!(await checkExistence('materias', 'materia_id', materia_id))) {
      return res.status(400).json({ message: 'Matéria não encontrada.' });
    }

    const [result] = await db.query(
      'INSERT INTO Notas (aluno_id, materia_id, nota, tipo_atividade, data) VALUES (?, ?, ?, ?, ?)',
      [aluno_id, materia_id, nota, tipo_atividade, data]
    );

    res.status(201).json({ message: 'Nota lançada com sucesso!', nota_id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao lançar nota' });
  }
});

// Endpoint para consultar notas de um aluno
router.get('/notas/:aluno_id', async (req, res) => {
  const { aluno_id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM Notas WHERE aluno_id = ?', [aluno_id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Notas não encontradas para este aluno.' });
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao consultar notas' });
  }
});

module.exports = router;
