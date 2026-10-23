const tarefas = document.getElementById("tarefas")
const eventos = document.getElementById("eventos")
const quizCreator = document.getElementById("quizCreator")
const flashcards = document.getElementById("flashcards")
const calculadora = document.getElementById("calculadora")
const boletim = document.getElementById("boletim")
const cronometro = document.getElementById("cronometro")
const configuracao = document.getElementById("configuracao")

tarefas.addEventListener("click", ()=>{
    window.location.href = "pages/tarefas.html"
})

eventos.addEventListener("click", ()=>{
    window.location.href = "pages/eventos.html"
})

quizCreator.addEventListener("click", ()=>{
    window.location.href = "pages/quizCreator.html"
})

flashcards.addEventListener("click", ()=>{
    window.location.href = "pages/flashcards.html"
})

calculadora.addEventListener("click", ()=>{
    window.location.href = "pages/calculadora.html"
})

boletim.addEventListener("click", ()=>{
    window.location.href = "pages/boletim.html"
})

cronometro.addEventListener("click", ()=>{
    window.location.href = "pages/cronometro.html"
})

configuracao.addEventListener("click", ()=>{
    window.location.href = "pages/configuracao.html"
})

let usuario = localStorage.getItem("usuario")
usuario = JSON.parse(usuario)

const entrada = document.getElementById("entrada")
entrada.textContent = `Bem-vindo, ${usuario.apelido}`

//BOTÃO DE SAIR (DESLOGAR)