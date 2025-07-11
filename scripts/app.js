document.addEventListener("DOMContentLoaded", () => {
    
    const cadastroForm = document.getElementById("cadastroForm");
    if (cadastroForm) {
        cadastroForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const nome = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const senha = document.getElementById("password").value;

           
            let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

            
            const usuarioExistente = usuarios.find(user => user.email === email);

            if (usuarioExistente) {
                alert("Este e-mail já está cadastrado.");
                return;
            }

            
            usuarios.push({ nome, email, senha });

           
            localStorage.setItem("usuarios", JSON.stringify(usuarios));

            alert("Cadastro realizado com sucesso!");
            window.location.href = "../index.html"; 
        });
    }

   
    const loginForm = document.querySelector("form");
    if (loginForm && !cadastroForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const senha = document.getElementById("password").value;

            const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

            const usuario = usuarios.find(user => user.email === email && user.senha === senha);

            if (usuario) {
                alert("Login realizado com sucesso!");
                window.location.href = "./livros.html";
            } else {
                alert("Credenciais inválidas.");
            }
        });
    }

    
    const livrosContainer = document.getElementById("livros-container");
    if (livrosContainer) {
        const livros = [
            { titulo: "Java para Iniciantes", autor: "Autor X", disponivel: true },
            { titulo: "Aprendendo HTML e CSS", autor: "Autor Y", disponivel: false },
        ];

        livros.forEach((livro) => {
            const livroElement = document.createElement("div");
            livroElement.classList.add("livro");
            livroElement.innerHTML = `
                <h3>${livro.titulo}</h3>
                <p>Autor: ${livro.autor}</p>
                <p>Disponível: ${livro.disponivel ? "Sim" : "Não"}</p>
            `;
            livrosContainer.appendChild(livroElement);
        });
    }
});
