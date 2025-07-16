document.addEventListener("DOMContentLoaded", () => {
    const cadastroForm = document.getElementById("cadastroForm");
    if (cadastroForm) {
        cadastroForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nome = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const senha = document.getElementById("password").value;

            try {
                const resposta = await fetch("https://trocalivros.duckdns.org/cadastro", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ nome, email, senha })
                });

                if (resposta.ok) {
                    alert("Cadastro realizado com sucesso!");
                    window.location.href = "../index.html";
                } else {
                    const erro = await resposta.json();
                    alert(erro.erro || "Erro ao cadastrar");
                }
            } catch (err) {
                alert("Erro de conexão com o servidor");
            }
        });
    }

    const loginForm = document.querySelector("form");
    if (loginForm && !cadastroForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const senha = document.getElementById("password").value;

            try {
                const resposta = await fetch("https://trocalivros.duckdns.org/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, senha })
                });

                if (resposta.ok) {
                    alert("Login realizado com sucesso!");
                    window.location.href = "./livros.html";
                } else {
                    const erro = await resposta.json();
                    alert(erro.erro || "Erro ao fazer login");
                }
            } catch (err) {
                alert("Erro de conexão com o servidor");
            }
        });
    }

    const livrosContainer = document.getElementById("livros-container");
    if (livrosContainer) {
        fetch("https://trocalivros.duckdns.org/livros")
            .then(res => res.json())
            .then(livros => {
                livros.forEach((livro) => {
                    const livroElement = document.createElement("div");
                    livroElement.classList.add("livro");
                    livroElement.innerHTML = `
                        <h3>${livro.titulo}</h3>
                        <p>Autor: ${livro.autor}</p>
                        <p>Disponível: Sim</p>
                    `;
                    livrosContainer.appendChild(livroElement);
                });
            })
            .catch(() => {
                livrosContainer.innerHTML = "<p>Erro ao carregar livros.</p>";
            });
    }
});
