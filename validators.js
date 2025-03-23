const { body, validationResult } = require('express-validator');

const validarFaltas = [
  body('aluno_id').isInt().withMessage('O ID do aluno deve ser um número inteiro.'),
  body('turma_id').isInt().withMessage('O ID da turma deve ser um número inteiro.'),
  body('data').isISO8601().withMessage('Data inválida.'),
  body('justificativa').optional().isString().withMessage('A justificativa deve ser um texto.'),
];

const validarNotas = [
  body('aluno_id').isInt().withMessage('O ID do aluno deve ser um número inteiro.'),
  body('materia_id').isInt().withMessage('O ID da matéria deve ser um número inteiro.'),
  body('nota').isFloat({ min: 0, max: 10 }).withMessage('A nota deve estar entre 0 e 10.'),
  body('tipo_atividade').isIn(['trabalho', 'prova', 'teste']).withMessage('Tipo de atividade inválido.'),
  body('data').isISO8601().withMessage('Data inválida.')
];

function validarRequisicao(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = { validarFaltas, validarNotas, validarRequisicao };
