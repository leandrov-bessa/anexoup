const voltar = document.getElementById("voltar")
voltar.addEventListener("click", ()=>{
    window.location.href = "../menu.html"
})

let usuario = localStorage.getItem("usuario")
usuario = JSON.parse(usuario)

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || []

const formCriar = document.getElementById("formCriar")
formCriar.hidden = true

const criar = document.getElementById("criar")
criar.addEventListener("click", ()=>{
    formCriar.hidden = false
})

const titulo = document.getElementById("titulo")
const descricao = document.getElementById("descricao")

const adicionar = document.getElementById("adicionar")

adicionar.addEventListener("click", (event)=>{
    event.preventDefault()

    if (!titulo.value.trim()){
        alert("Adicione um título")
        return
    }

    tarefas.push({
        usuario: usuario.nome,
        titulo: titulo.value,
        descricao: descricao.value
    })

    localStorage.setItem("tarefas", JSON.stringify(tarefas))

    formCriar.hidden = true
    titulo.value = ""
    descricao.value = ""
    resultado()
})

function resultado(){
    const resultados = document.getElementById("resultados")
    resultados.innerHTML = ""

    let tarefasUsuario = tarefas.filter(tarefa => tarefa.usuario === usuario.nome)

    tarefasUsuario.forEach((tarefa) => {
        const novaTarefa = document.createElement("div")
        resultados.appendChild(novaTarefa)
        const resultadoTitulo = document.createElement("h2")
        const resultadoDescricao = document.createElement("p")

        resultadoTitulo.textContent = tarefa.titulo
        resultadoDescricao.textContent = tarefa.descricao

        novaTarefa.appendChild(resultadoTitulo)
        novaTarefa.appendChild(resultadoDescricao)

        const excluir = document.createElement("button")
        excluir.textContent = "Excluir"
        novaTarefa.appendChild(excluir)

        excluir.addEventListener("click", ()=>{
            tarefas.splice(tarefas.indexOf(tarefa), 1)
            localStorage.setItem("tarefas", JSON.stringify(tarefas))
            resultado()
        })

        const botaoEditar = document.createElement("button")
        botaoEditar.textContent = "Editar"
        novaTarefa.appendChild(botaoEditar)

        botaoEditar.addEventListener("click", () => {
            const inputTitulo = document.createElement("input")
            const inputDescricao = document.createElement("textarea")

            inputTitulo.value = tarefa.titulo
            inputDescricao.value = tarefa.descricao

            resultadoTitulo.replaceWith(inputTitulo)

            resultadoDescricao.replaceWith(inputDescricao)

            const enviarEdicao = document.createElement("button")
            enviarEdicao.textContent = "Enviar"
            botaoEditar.replaceWith(enviarEdicao)

            enviarEdicao.addEventListener("click", ()=>{
                if (!inputTitulo.value.trim()){
                    alert("Adicione um título")
                    return
                }

                resultadoTitulo.textContent = inputTitulo.value

                tarefa.titulo = inputTitulo.value

                resultadoDescricao.textContent = inputDescricao.value

                tarefa.descricao = inputDescricao.value

                inputTitulo.replaceWith(resultadoTitulo)
                inputDescricao.replaceWith(resultadoDescricao)
                enviarEdicao.replaceWith(botaoEditar)

                localStorage.setItem("tarefas", JSON.stringify(tarefas))
            })
        })
    })
}

resultado()