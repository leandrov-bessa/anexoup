let usuario = localStorage.getItem("usuario")
usuario = JSON.parse(usuario)
let boletins = JSON.parse(localStorage.getItem("boletins")) || {}
const firstLog = document.getElementById("firstLog")
firstLog.hidden = true
const criadorBoletim = document.getElementById("criadorBoletim")
criadorBoletim.hidden = true
const resultadoBoletim = document.getElementById("resultadoBoletim")
resultadoBoletim.hidden = true

const voltar = document.getElementById("voltar")
voltar.addEventListener("click", ()=>{
    window.location.href = "../menu.html"
})


if (!boletins[usuario.nome]){
    firstLog.hidden = false
    const bemvindo = document.getElementById("bemvindo")
    bemvindo.textContent = `Olá, ${usuario.apelido}. Sua primeira vez explorando essa página, por favor preencha o formulário!`
    const formulario = document.getElementById("formulario")
    const mensagem = document.createElement("p")
    mensagem.textContent = ""

    formulario.addEventListener("submit", (event)=>{
        event.preventDefault()
        const media = document.getElementById("media")

        if (!media.value || media.value <= 0){
            mensagem.textContent = "Digite uma média válida!"
            firstLog.appendChild(mensagem)
            return
        }

        boletins[usuario.nome] = {
            media: media.value,
            notas: {}
        }

        localStorage.setItem("boletins", JSON.stringify(boletins))

        firstLog.hidden = true
        criadorBoletim.hidden = false
    })
}

if (boletins[usuario.nome]){
    criadorBoletim.hidden = false
}

const adicionarNota = document.getElementById("adicionarNota");

adicionarNota.addEventListener("click", (event)=>{
    event.preventDefault()
    adicionarNota.disabled = true

    const anFormulario = document.createElement("form")
    criadorBoletim.appendChild(anFormulario)

    const inputMateria = document.createElement("input")
    const b1 = document.createElement("input")
    const b2 = document.createElement("input")
    const b3 = document.createElement("input")
    const b4 = document.createElement("input")

    inputMateria.placeholder = "Matéria"
    b1.placeholder = "1º Bimestre"
    b1.type = "number"
    b1.step = 0.1
    b2.placeholder = "2º Bimestre"
    b2.type = "number"
    b2.step = 0.1
    b3.placeholder = "3º Bimestre"
    b3.type = "number"
    b3.step = 0.1
    b4.placeholder = "4º Bimestre"
    b4.type = "number"
    b4.step = 0.1
    const botaoAdicionar = document.createElement("button")
    anFormulario.appendChild(inputMateria)
    anFormulario.appendChild(b1)
    anFormulario.appendChild(b2)
    anFormulario.appendChild(b3)
    anFormulario.appendChild(b4)

    botaoAdicionar.textContent = "Adicionar"
    anFormulario.appendChild(botaoAdicionar)

    anFormulario.addEventListener("submit", (event)=>{
        event.preventDefault()

        if (!inputMateria.value.trim()){
            alert("Digite a matéria.")
            return
        }

        if (boletins[usuario.nome].notas[inputMateria.value.trim()]){
            alert("Matéria já existente!")
            return
        }

        adicionarNota.disabled = false
        anFormulario.innerHTML = ""

        boletins[usuario.nome].notas[inputMateria.value.trim()] = {
            bimestre1: Number(b1.value),
            bimestre2: Number(b2.value),
            bimestre3: Number(b3.value),
            bimestre4: Number(b4.value)
        }

        localStorage.setItem("boletins", JSON.stringify(boletins))

        atualizarPlanilha()
    })
})

function atualizarPlanilha(){
    if (Object.entries(boletins[usuario.nome].notas).length >= 1){
        resultadoBoletim.hidden = false
    } else {
        resultadoBoletim.hidden = true
    }

    const planilhaNota = document.getElementById("planilhaNota")
    planilhaNota.innerHTML = ""
    if (Object.entries(boletins[usuario.nome].notas).length >= 1){
        resultadoBoletim.hidden = false
    }

    Object.entries(boletins[usuario.nome].notas).forEach(([materia, nota]) => {
        const novaLinha = document.createElement("tr")
        novaLinha.dataset.linha = materia
        const celulaMateria = document.createElement("td")
        const celulab1 = document.createElement("td")
        const celulab2 = document.createElement("td")
        const celulab3 = document.createElement("td")
        const celulab4 = document.createElement("td")

        celulaMateria.textContent = materia
        celulab1.textContent = nota.bimestre1
        celulab2.textContent = nota.bimestre2
        celulab3.textContent = nota.bimestre3
        celulab4.textContent = nota.bimestre4

        planilhaNota.appendChild(novaLinha)
        novaLinha.appendChild(celulaMateria)
        novaLinha.appendChild(celulab1)
        novaLinha.appendChild(celulab2)
        novaLinha.appendChild(celulab3)
        novaLinha.appendChild(celulab4)

        const celulaMedia = document.createElement("td")
        celulaMedia.textContent = ((Number(nota.bimestre1) + Number(nota.bimestre2) + Number(nota.bimestre3) + Number(nota.bimestre4)) / 4).toFixed(1)
        novaLinha.appendChild(celulaMedia)

        const celulaPontos = document.createElement("td")
        const pontosNecessarios = (Number(boletins[usuario.nome].media) * 4) - (Number(nota.bimestre1) + Number(nota.bimestre2) + Number(nota.bimestre3) + Number(nota.bimestre4))
        celulaPontos.textContent = pontosNecessarios.toFixed(1)

        if (pontosNecessarios <= 0){
            celulaPontos.textContent = "Aprovado"
        }

        novaLinha.appendChild(celulaPontos)

        //BOTAO EDITAR

        const celulaEditar = document.createElement("td")

        const botaoEditar = document.createElement("button")
        botaoEditar.textContent = "✏️"
        botaoEditar.dataset.materia = materia
        celulaEditar.appendChild(botaoEditar)
        novaLinha.appendChild(celulaEditar)

        botaoEditar.addEventListener("click", ()=>{
            editarMateria(botaoEditar.dataset.materia, novaLinha, botaoEditar, botaoExcluir)
        })

        //BOTÃO EXCLUIR

        const celulaExcluir = document.createElement("td")
        const botaoExcluir = document.createElement("button")
        botaoExcluir.textContent = "🗑️"
        botaoExcluir.dataset.materia = materia
        celulaExcluir.appendChild(botaoExcluir)
        novaLinha.appendChild(celulaExcluir)

        botaoExcluir.addEventListener("click", ()=>{
            excluirMateria(botaoExcluir.dataset.materia)
        })
    })
}

atualizarPlanilha()

function excluirMateria(materia){
    delete boletins[usuario.nome].notas[materia]

    localStorage.setItem("boletins", JSON.stringify(boletins))

    atualizarPlanilha()
}

function editarMateria(materia, linha, botaoEditar, botaoExcluir){
    botaoEditar.hidden = true
    botaoExcluir.hidden = true

    const botaoConfirmar = document.createElement("button")
    const celulaConfirmar = document.createElement("td")
    celulaConfirmar.appendChild(botaoConfirmar)
    botaoConfirmar.textContent = "✔️"
    const inputBimestre1 = document.createElement("input")
    linha.children[1].innerHTML = ""
    inputBimestre1.value = boletins[usuario.nome].notas[materia].bimestre1
    linha.children[1].appendChild(inputBimestre1)

    const inputBimestre2 = document.createElement("input")
    linha.children[2].innerHTML = ""
    inputBimestre2.value = boletins[usuario.nome].notas[materia].bimestre2
    linha.children[2].appendChild(inputBimestre2)

    const inputBimestre3 = document.createElement("input")
    linha.children[3].innerHTML = ""
    inputBimestre3.value = boletins[usuario.nome].notas[materia].bimestre3
    linha.children[3].appendChild(inputBimestre3)

    const inputBimestre4 = document.createElement("input")
    linha.children[4].innerHTML = ""
    inputBimestre4.value = boletins[usuario.nome].notas[materia].bimestre4
    linha.children[4].appendChild(inputBimestre4)

    linha.appendChild(celulaConfirmar)

    botaoConfirmar.addEventListener("click", ()=>{
        linha.children[1].innerHTML = inputBimestre1.value
        linha.children[2].innerHTML = inputBimestre2.value
        linha.children[3].innerHTML = inputBimestre3.value
        linha.children[4].innerHTML = inputBimestre4.value

        botaoConfirmar.hidden = true
        botaoEditar.hidden = false
        botaoExcluir.hidden = false
        
        boletins[usuario.nome].notas[materia] = {
            bimestre1: inputBimestre1.value,
            bimestre2: inputBimestre2.value,
            bimestre3: inputBimestre3.value,
            bimestre4: inputBimestre4.value
        }

        localStorage.setItem("boletins", JSON.stringify(boletins))

        atualizarPlanilha()
    })
}

//Organizar boletim por ordem alfabética
//PROBLEMA DE CSS = toda vez que é adicionado uma nova nota, a div fica maior