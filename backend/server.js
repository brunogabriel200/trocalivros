const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connection = require('./db');

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.post('/cadastro', (req, res) => {
  const { nome, email, senha } = req.body;
  const query = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
  connection.query(query, [nome, email, senha], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ erro: 'Email já cadastrado' });
      }
      return res.status(500).json({ erro: 'Erro no servidor' });
    }
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso' });
  });
});

app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const query = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
  connection.query(query, [email, senha], (err, results) => {
    if (err) return res.status(500).json({ erro: 'Erro no servidor' });
    if (results.length === 0) {
      return res.status(401).json({ erro: 'Email ou senha incorretos' });
    }
    res.json({ mensagem: 'Login bem-sucedido' });
  });
});

app.post('/livros', (req, res) => {
  const { titulo, autor, genero, descricao, imagens, nomePessoa, numeroPessoa } = req.body;

  if (!Array.isArray(imagens) || imagens.length === 0) {
    return res.status(400).json({ erro: 'Pelo menos uma imagem é obrigatória' });
  }

  const imagensJson = JSON.stringify(imagens);

  const query = `
    INSERT INTO livros (titulo, autor, genero, descricao, imagens, nomePessoa, numeroPessoa)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [titulo, autor, genero, descricao, imagensJson, nomePessoa, numeroPessoa],
    (err, result) => {
      if (err) {
        console.error('Erro ao salvar livro:', err);
        return res.status(500).json({ erro: 'Erro ao salvar livro no banco' });
      }
      res.status(201).json({ sucesso: true, mensagem: 'Livro cadastrado com sucesso' });
    }
  );
});

app.get('/livros', (req, res) => {
  const query = 'SELECT * FROM livros';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar livros:', err);
      return res.status(500).json({ erro: 'Erro ao buscar livros' });
    }
    res.json(results);
  });
});

app.delete('/livros/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM livros WHERE id = ?';
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Erro ao excluir livro:', err);
      return res.status(500).json({ erro: 'Erro ao excluir livro' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Livro não encontrado' });
    }
    res.json({ sucesso: true, mensagem: 'Livro excluído com sucesso' });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
