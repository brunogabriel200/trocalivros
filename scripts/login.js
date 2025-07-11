document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.querySelector('#email').value;
  const senha = document.querySelector('#senha').value;

  try {
    const resposta = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      alert('Login bem-sucedido!');
      window.location.href = 'livros.html';
    } else {
      alert(dados.erro);
    }
  } catch (erro) {
    alert('Erro ao fazer login');
    console.error(erro);
  }
});
