document.addEventListener("DOMContentLoaded", () => {
    const formLivro = document.getElementById("formLivro");
    const previewContainer = document.getElementById("preview-container");
    const inputImagem = document.getElementById("imagem");
    const livrosContainer = document.getElementById("livros-container");

    let imagensSelecionadas = [];

    async function exibirLivros() {
        livrosContainer.innerHTML = "";

        try {
            const response = await fetch("http://localhost:3000/livros");
            const livros = await response.json();

            if (!Array.isArray(livros) || livros.length === 0) {
                livrosContainer.innerHTML = "<p>Nenhum livro disponível para troca.</p>";
                return;
            }

            livros.forEach((livro) => {
                let imagens = [];
                try {
                    imagens = Array.isArray(livro.imagens) ? livro.imagens : JSON.parse(livro.imagens);
                } catch {
                    imagens = [];
                }
                imagens = imagens.filter(img => typeof img === "string" && img.startsWith("data:image"));

                const livroDiv = document.createElement("div");
                livroDiv.classList.add("livro");

                livroDiv.innerHTML = `
                    <div class="livro-resumo">
                        <h3>${livro.titulo}</h3>
                        <p><strong>Autor:</strong> ${livro.autor}</p>
                        <img src="${imagens[0] || ''}" alt="Capa do livro">
                    </div>
                    <div class="livro-detalhes hidden">
                        <p><strong>Gênero:</strong> ${livro.genero}</p>
                        <p><strong>Descrição:</strong> ${livro.descricao || "Sem descrição"}</p>
                        <p><strong>Dono:</strong> ${livro.nomePessoa || "Nome não fornecido"}</p>
                        <p><strong>Número Para Contato:</strong> ${livro.numeroPessoa || "Número não fornecido"}</p>
                        <div class="carrossel-imagens" data-index="0">
                            <button class="btn-anterior">&#8592;</button>
                            <img src="${imagens[0] || ''}" alt="Imagem do livro">
                            <button class="btn-proximo">&#8594;</button>
                        </div>
                        <button class="btn-excluir" data-id="${livro.id}">Excluir</button>
                    </div>
                `;

                livroDiv.addEventListener("click", () => {
                    const detalhes = livroDiv.querySelector(".livro-detalhes");
                    detalhes.classList.toggle("hidden");
                });

                livrosContainer.appendChild(livroDiv);

                const carrossel = livroDiv.querySelector(".carrossel-imagens");
                const imgTag = carrossel.querySelector("img");
                const btnAnt = carrossel.querySelector(".btn-anterior");
                const btnProx = carrossel.querySelector(".btn-proximo");
                let imgIndex = 0;

                if (imagens.length > 1) {
                    btnAnt.addEventListener("click", (e) => {
                        e.stopPropagation();
                        imgIndex = (imgIndex - 1 + imagens.length) % imagens.length;
                        imgTag.src = imagens[imgIndex];
                    });

                    btnProx.addEventListener("click", (e) => {
                        e.stopPropagation();
                        imgIndex = (imgIndex + 1) % imagens.length;
                        imgTag.src = imagens[imgIndex];
                    });
                } else {
                    btnAnt.style.opacity = "0.3";
                    btnAnt.style.pointerEvents = "none";
                    btnProx.style.opacity = "0.3";
                    btnProx.style.pointerEvents = "none";
                }

                const botaoExcluir = livroDiv.querySelector(".btn-excluir");
                botaoExcluir.addEventListener("click", async (e) => {
                    e.stopPropagation();
                    const id = e.target.getAttribute("data-id");
                    const res = await fetch(`http://localhost:3000/livros/${id}`, { method: "DELETE" });
                    const result = await res.json();
                    if (res.ok) {
                        alert(result.mensagem);
                        exibirLivros();
                    } else {
                        alert(result.erro || "Erro ao excluir livro.");
                    }
                });
            });
        } catch (error) {
            console.error("Erro ao buscar livros:", error);
            livrosContainer.innerHTML = `<p>Erro ao carregar livros.</p>`;
        }
    }

    if (livrosContainer) {
        exibirLivros();
    }

    if (inputImagem) {
        inputImagem.addEventListener("change", (event) => {
            const maxImages = 5;
            const files = Array.from(event.target.files);

            files.forEach(file => {
                if (file.size > 2 * 1024 * 1024) {
                    alert(`A imagem "${file.name}" ultrapassa o limite de 2MB e será ignorada.`);
                    return;
                }

                if (imagensSelecionadas.length >= maxImages) {
                    alert("Limite de 5 imagens atingido.");
                    return;
                }

                imagensSelecionadas.push(file);

                const reader = new FileReader();
                reader.onload = function (e) {
                    const img = document.createElement("img");
                    img.src = e.target.result;
                    img.style.width = "80px";
                    img.style.marginRight = "8px";
                    previewContainer.appendChild(img);
                };
                reader.readAsDataURL(file);
            });

            
            const dataTransfer = new DataTransfer();
            imagensSelecionadas.forEach(img => dataTransfer.items.add(img));
            inputImagem.files = dataTransfer.files;
        });
    }

    if (formLivro) {
        formLivro.addEventListener("submit", (event) => {
            event.preventDefault();

            const titulo = document.getElementById("titulo").value.trim();
            const autor = document.getElementById("autor").value.trim();
            const genero = document.getElementById("genero").value.trim();
            const descricao = document.getElementById("descricao").value.trim();
            const nomePessoa = document.getElementById("nomePessoa").value.trim();
            const numeroPessoa = document.getElementById("numeroPessoa").value.trim();
            const arquivos = inputImagem.files;

            if (arquivos.length === 0) {
                alert("Por favor, selecione ao menos uma imagem.");
                return;
            }

            const imagensBase64 = [];
            let count = 0;

            Array.from(arquivos).forEach(file => {
                const reader = new FileReader();
                reader.onload = () => {
                    imagensBase64.push(reader.result);
                    count++;
                    if (count === arquivos.length) {
                        salvarLivro(titulo, autor, genero, descricao, imagensBase64, nomePessoa, numeroPessoa);
                    }
                };
                reader.readAsDataURL(file);
            });
        });
    }

    function salvarLivro(titulo, autor, genero, descricao, imagensBase64, nomePessoa, numeroPessoa) {
        const livro = {
            titulo,
            autor,
            genero,
            descricao,
            imagens: imagensBase64,
            nomePessoa,
            numeroPessoa
        };

        fetch("http://localhost:3000/livros", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(livro)
        })
        .then(response => response.json())
        .then(data => {
            if (data.sucesso) {
                alert("Livro cadastrado com sucesso!");
                formLivro.reset();
                previewContainer.innerHTML = "";
                imagensSelecionadas = [];
                window.location.href = "livros.html";
            } else {
                alert("Erro ao cadastrar: " + data.erro);
            }
        })
        .catch(err => {
            console.error("Erro ao enviar:", err);
            alert("Erro ao enviar os dados.");
        });
    }
});
