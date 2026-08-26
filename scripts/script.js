let usuarios = JSON.parse(localStorage.getItem("usuarios")) || []

const login = document.getElementById("login")
const cadastro = document.getElementById("cadastro")
const telaEntrada = document.getElementById("telaEntrada")
const formulario = document.createElement("form")
telaEntrada.appendChild(formulario)
const mensagem = document.createElement("p")
formulario.appendChild(mensagem)
mensagem.classList.add("mensagem")
formulario.hidden = true

function criarFormulario(texto, tipo, id){
    const paragrafo = document.createElement("p")
    const label = document.createElement("label")
    const input = document.createElement("input")

    label.textContent = `${texto}: `
    label.htmlFor = id

    input.type = tipo
    input.id = id
    input.name = id
    input.required = true

    paragrafo.appendChild(label)
    paragrafo.appendChild(input)

    return paragrafo
}

cadastro.addEventListener("click", ()=>{
    formulario.innerHTML = ""
    formulario.hidden = false
    login.disabled = false
    cadastro.disabled = true

    formulario.appendChild(criarFormulario("Apelido", "text", "criarApelido"))
    formulario.appendChild(criarFormulario("Nome de usuário", "text", "criarUsuario"))
    formulario.appendChild(criarFormulario("Email", "email", "adicionarEmail"))
    formulario.appendChild(criarFormulario("Senha", "password", "criarSenha"))
    formulario.appendChild(criarFormulario("Confirmar senha", "password", "confirmarSenha"))

    const botaoEnviar = document.createElement("button")
    botaoEnviar.textContent = "Criar"
    botaoEnviar.type = "submit"
    formulario.appendChild(botaoEnviar)
    mensagem.textContent = ""
    formulario.appendChild(mensagem)

    document.getElementById("criarApelido").focus()

    formulario.onsubmit = (event) => {
        event.preventDefault()

        const criarApelido = document.getElementById("criarApelido").value.trim()
        const criarUsuario = document.getElementById("criarUsuario").value.trim()
        const adicionarEmail = document.getElementById("adicionarEmail").value.trim()
        const criarSenha = document.getElementById("criarSenha").value
        const confirmarSenha = document.getElementById("confirmarSenha").value

        if (usuarios.find(usuario => usuario.nome === criarUsuario)){
            mensagem.textContent = "Nome de usuário já existente"
            return
        }

        if (criarSenha !== confirmarSenha){
            mensagem.textContent = "As senhas não correspondem."
            return
        }

        usuarios.push({
            apelido: criarApelido,
            nome: criarUsuario,
            email: adicionarEmail,
            senha: criarSenha
        })

        localStorage.setItem("usuarios", JSON.stringify(usuarios))

        fazerLogin()
    }
})

login.addEventListener("click", fazerLogin)

function fazerLogin(){
    formulario.innerHTML = ""
    formulario.hidden = false
    login.disabled = true
    cadastro.disabled = false

    formulario.appendChild(criarFormulario("Usuário", "text", "tentativaUsuario"))
    formulario.appendChild(criarFormulario("Senha", "password", "tentativaSenha"))

    const botaoEnviar = document.createElement("button")
    botaoEnviar.textContent = "Entrar"
    botaoEnviar.type = "submit"
    formulario.appendChild(botaoEnviar)
    mensagem.textContent = ""
    formulario.appendChild(mensagem)

    document.getElementById("tentativaUsuario").focus()

    formulario.onsubmit = (event)=>{
        event.preventDefault()

    const tentativaUsuario = document.getElementById("tentativaUsuario").value.trim()
    const tentativaSenha = document.getElementById("tentativaSenha").value

        let usuario = usuarios.find(usuario => usuario.nome === tentativaUsuario)

        if (!usuario){
            mensagem.textContent = "Usuário não encontrado"
            return
        }

        if (usuario.senha !== tentativaSenha){
            mensagem.textContent = "Senha incorreta"
            return
        }

        localStorage.setItem("usuario", JSON.stringify(usuario))

        window.location.href = "menu.html"
    }
}