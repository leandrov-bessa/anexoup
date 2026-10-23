let usuario = JSON.parse(localStorage.getItem("usuario"))
let boletins = JSON.parse(localStorage.getItem("boletins")) || {}

const firstLog = document.getElementById("firstLog")
firstLog.hidden = true

const criadorBoletim = document.getElementById("criadorBoletim")
criadorBoletim.hidden = true

const resultadoBoletim = document.getElementById("resultadoBoletim")
resultadoBoletim.hidden = true

const voltar = document.getElementById("voltar")

voltar.addEventListener("click", () => {
    window.location.href = "../menu.html"
})

if (!boletins[usuario.nome]) {
    firstLog.hidden = false

    const bemvindo = document.getElementById("bemvindo")
    bemvindo.textContent =
        `Olá, ${usuario.apelido}. Sua primeira vez explorando essa página, por favor preencha o formulário!`

    const formulario = document.getElementById("formulario")
    const mensagem = document.createElement("p")
    mensagem.textContent = ""

    formulario.addEventListener("submit", (event) => {
        event.preventDefault()

        const media = document.getElementById("media")

        if (!media.value || media.value <= 0) {
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

if (boletins[usuario.nome]) {
    criadorBoletim.hidden = false
}

const adicionarNota = document.getElementById("adicionarNota")

adicionarNota.addEventListener("click", (event) => {
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
    b1.type = "text"

    b2.placeholder = "2º Bimestre"
    b2.type = "text"

    b3.placeholder = "3º Bimestre"
    b3.type = "text"

    b4.placeholder = "4º Bimestre"
    b4.type = "text"

    const botaoAdicionar = document.createElement("button")
    botaoAdicionar.textContent = "Adicionar"

    anFormulario.appendChild(inputMateria)
    anFormulario.appendChild(b1)
    anFormulario.appendChild(b2)
    anFormulario.appendChild(b3)
    anFormulario.appendChild(b4)
    anFormulario.appendChild(botaoAdicionar)

    anFormulario.addEventListener("submit", (event) => {
        event.preventDefault()

        const materia = inputMateria.value.trim()

        if (!materia) {
            alert("Digite a matéria.")
            return
        }

        if (boletins[usuario.nome].notas[materia]) {
            alert("Matéria já existente!")
            return
        }

        const campos = [b1, b2, b3, b4]
        const valores = campos.map(campo => campo.value.trim())

        if (valores.some(valor => valor === "")) {
            alert("Preencha as quatro notas.")
            return
        }

        const notas = valores.map(valor =>
            Number(valor.replace(",", "."))
        )

        if (notas.some(nota => !Number.isFinite(nota))) {
            alert("Digite notas válidas usando vírgula ou ponto.")
            return
        }

        boletins[usuario.nome].notas[materia] = {
            bimestre1: notas[0],
            bimestre2: notas[1],
            bimestre3: notas[2],
            bimestre4: notas[3]
        }

        localStorage.setItem("boletins", JSON.stringify(boletins))

        anFormulario.remove()
        adicionarNota.disabled = false

        atualizarPlanilha()
    })
})

function atualizarPlanilha() {
    const materias = Object.entries(boletins[usuario.nome].notas)
    resultadoBoletim.hidden = materias.length === 0

    const planilhaNota = document.getElementById("planilhaNota")
    planilhaNota.innerHTML = ""

    materias
        .sort(([materiaA], [materiaB]) =>
            materiaA.localeCompare(materiaB, "pt-BR", {
                sensitivity: "base"
            })
        )
        .forEach(([materia, nota]) => {
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
            const somaNotas =
                Number(nota.bimestre1) +
                Number(nota.bimestre2) +
                Number(nota.bimestre3) +
                Number(nota.bimestre4)

            celulaMedia.textContent = (somaNotas / 4).toFixed(1)
            novaLinha.appendChild(celulaMedia)

            const celulaPontos = document.createElement("td")
            const pontosNecessarios =
                Number(boletins[usuario.nome].media) * 4 - somaNotas

            celulaPontos.textContent = pontosNecessarios.toFixed(1)

            if (pontosNecessarios <= 0) {
                celulaPontos.textContent = "Aprovado"
            }

            novaLinha.appendChild(celulaPontos)

            const celulaEditar = document.createElement("td")
            const botaoEditar = document.createElement("button")

            botaoEditar.textContent = "✏️"
            botaoEditar.dataset.materia = materia
            celulaEditar.appendChild(botaoEditar)
            novaLinha.appendChild(celulaEditar)

            const celulaExcluir = document.createElement("td")
            const botaoExcluir = document.createElement("button")

            botaoExcluir.textContent = "🗑️"
            botaoExcluir.dataset.materia = materia
            celulaExcluir.appendChild(botaoExcluir)
            novaLinha.appendChild(celulaExcluir)

            botaoEditar.addEventListener("click", () => {
                editarMateria(
                    botaoEditar.dataset.materia,
                    novaLinha,
                    botaoEditar,
                    botaoExcluir
                )
            })

            botaoExcluir.addEventListener("click", () => {
                excluirMateria(botaoExcluir.dataset.materia)
            })
        })
}

atualizarPlanilha()

function excluirMateria(materia) {
    delete boletins[usuario.nome].notas[materia]

    localStorage.setItem("boletins", JSON.stringify(boletins))

    atualizarPlanilha()
}

function editarMateria(materia, linha, botaoEditar, botaoExcluir) {
    botaoEditar.hidden = true
    botaoExcluir.hidden = true

    const botaoConfirmar = document.createElement("button")
    const celulaConfirmar = document.createElement("td")

    botaoConfirmar.textContent = "✔️"
    celulaConfirmar.appendChild(botaoConfirmar)
    linha.appendChild(celulaConfirmar)

    const inputs = []

    for (let i = 1; i <= 4; i++) {
        const input = document.createElement("input")
        input.type = "text"
        input.value = boletins[usuario.nome].notas[materia][`bimestre${i}`]

        linha.children[i].innerHTML = ""
        linha.children[i].appendChild(input)
        inputs.push(input)
    }

    botaoConfirmar.addEventListener("click", () => {
        const valores = inputs.map(input => input.value.trim())

        if (valores.some(valor => valor === "")) {
            alert("Preencha as quatro notas.")
            return
        }

        const notas = valores.map(valor =>
            Number(valor.replace(",", "."))
        )

        if (notas.some(nota => !Number.isFinite(nota))) {
            alert("Digite notas válidas usando vírgula ou ponto.")
            return
        }

        boletins[usuario.nome].notas[materia] = {
            bimestre1: notas[0],
            bimestre2: notas[1],
            bimestre3: notas[2],
            bimestre4: notas[3]
        }

        localStorage.setItem("boletins", JSON.stringify(boletins))

        atualizarPlanilha()
    })
}