document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.querySelector('#name').value;
  const email = document.querySelector('#email').value;
  const senha = document.querySelector('#password').value;

  try {
    const resposta = await fetch('https://trocalivros.duckdns.org/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha })
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      alert('Cadastro realizado com sucesso!');
      window.location.href = 'login.html';
    } else {
      alert(dados.erro);
    }
  } catch (erro) {
    alert('Erro ao cadastrar');
    console.error(erro);
  }
});
