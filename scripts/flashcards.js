let usuario = JSON.parse(localStorage.getItem("usuario"))

let flashcards = JSON.parse(localStorage.getItem("flashcards")) || []

let flashcardsUsuario = flashcards.filter((flashcard) => flashcard.usuario === usuario.nome)

const botaovoltar = document.getElementById("voltar");
botaovoltar.addEventListener("click", () => {
    window.location.href = "../menu.html";
});

const formulario = document.getElementById("formulario")

document.getElementById("novoFlashcard").addEventListener("click", ()=>{
    if (formulario.hidden === true){
        formulario.hidden = false
    } else {
        formulario.hidden = true
    }
})

adicionar.addEventListener("click", () => {
    const pergunta = document.getElementById("pergunta")
    const resposta = document.getElementById("resposta")

    pergunta.setCustomValidity("")
    resposta.setCustomValidity("")

    if (pergunta.value.trim() === "") {
        pergunta.setCustomValidity("Preencha este campo.")
        pergunta.reportValidity()
        return
    }

    if (resposta.value.trim() === "") {
        resposta.setCustomValidity("Preencha este campo.")
        resposta.reportValidity()
        return
    }

    flashcards.push({
        usuario: usuario.nome,
        pergunta: pergunta.value,
        resposta: resposta.value
    })

    localStorage.setItem("flashcards", JSON.stringify(flashcards))
})

let paginaNavegada = 0

const propriedades = document.getElementById("propriedades")

if (flashcardsUsuario.length >= 1){
    paginaNavegada = 1
    propriedades.hidden = false
}

function atualizarFlashcards(){
    const exibicao = document.getElementById("exibicao")

    exibicao.innerHTML = ""

    // Navegador de páginas.
    
    const anterior = document.createElement("button")
    if (paginaNavegada <= 1){
            anterior.disabled = true
    }
    anterior.addEventListener("click", ()=>{

        paginaNavegada = paginaNavegada - 1
        atualizarFlashcards()
    })
    anterior.textContent = "Anterior"

    const proximo = document.createElement("button")
    if (paginaNavegada >= flashcardsUsuario.length){
            proximo.disabled = true
    }
    proximo.addEventListener("click", ()=>{
        paginaNavegada = paginaNavegada + 1
        atualizarFlashcards()
    })
    proximo.textContent = "Próximo"

    const paginas = document.createElement("label")
    paginas.textContent = `${paginaNavegada}/${flashcardsUsuario.length}`

    exibicao.appendChild(anterior)
    exibicao.appendChild(paginas)
    exibicao.appendChild(proximo)

    // Flashcards

    const flashcard = document.createElement("button")
    flashcard.className = "flashcard"
    let alter
    flashcard.classList.add("pergunta");
    flashcard.textContent = flashcardsUsuario[paginaNavegada - 1].pergunta
    flashcard.addEventListener("click", () =>{
        if (!alter){
            flashcard.textContent = flashcardsUsuario[paginaNavegada - 1].resposta
            flashcard.classList.remove("pergunta");
            flashcard.classList.add("resposta");
            alter = resposta
        } else {
            flashcard.textContent = flashcardsUsuario[paginaNavegada - 1].pergunta
            flashcard.classList.remove("resposta");
            flashcard.classList.add("pergunta");
            alter = ""
        }
    })

    if (flashcardsUsuario.length >= 1){
        propriedades.hidden = false
    }

    exibicao.appendChild(flashcard)
}
atualizarFlashcards()

function calcularIndice(){
    let indice = flashcardsUsuario[paginaNavegada - 1]
    indice = flashcards.indexOf(indice)
    return indice
}

excluir.addEventListener("click", ()=>{
    const indice = calcularIndice()
    flashcards.splice(indice, 1)
    localStorage.setItem("flashcards", JSON.stringify(flashcards));

    flashcardsUsuario = flashcards.filter(
        flashcard => flashcard.usuario === usuario.nome
    );

    paginaNavegada = Math.min(paginaNavegada, flashcardsUsuario.length)

    if (flashcardsUsuario.length === 0){
        paginaNavegada = 0
        propriedades.hidden = true
    }

    atualizarFlashcards()
})

editar.addEventListener("click", ()=>{
    edicao.hidden = false
})

const edicao = document.getElementById("edicao");
edicao.addEventListener("submit", (event)=>{
    event.preventDefault()

    const indice = calcularIndice()
    const perguntaEdicao = document.getElementById("perguntaEdicao");
    const respostaEdicao = document.getElementById("respostaEdicao");

    if (perguntaEdicao.value.trim()){
        flashcards[indice].pergunta = perguntaEdicao.value.trim();
        localStorage.setItem("flashcards", JSON.stringify(flashcards))
    }

    if (respostaEdicao.value.trim()){
        flashcards[indice].resposta = respostaEdicao.value.trim();
        localStorage.setItem("flashcards", JSON.stringify(flashcards))
    }

    perguntaEdicao.value = ""
    respostaEdicao.value = ""

    edicao.hidden = true

    atualizarFlashcards()
})

//Separar flashcards por categorias
//Editar categorias