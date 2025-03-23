const express = require('express');
const app = express();
const faltasRoutes = require('./routes/faltas');
const notasRoutes = require('./routes/notas');
const errorHandler = require('./middlewares/errorHandler');

app.use(express.json());
app.use('/api', faltasRoutes);
app.use('/api', notasRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
