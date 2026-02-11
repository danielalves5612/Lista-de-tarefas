const formTarefa = document.querySelector('#form-tarefa')
const inputTitulo = document.querySelector('#input-titulo')
const inputDescricao = document.querySelector('#input-descricao')
const inputStatus = document.querySelector('#input-status')
const buttonTarefa = document.querySelector('#button-tarefa')
const container = document.querySelector('div#container')
let tarefaEmEdicao
const overlay = document.querySelector('.overlay')
const modal = document.querySelector('.modal')
const btnCancelar = document.querySelector('.btn-cancelar')
const btnSalvar = document.querySelector('.btn-salvar')
const editTitulo = document.querySelector('#edit-titulo')
const editDescricao = document.querySelector('#edit-descricao')
const editStatus = document.querySelector('#edit-status')
const formEditar = document.querySelector('#form-editar')

function criaTarefa(tituloValor, descricaoValor, statusValor){
    const section = document.createElement('section')
    section.setAttribute('class', 'tarefa')
    container.appendChild(section)
    criaCampo(section, 'Tarefa', tituloValor, 'titulo')
    criaCampo(section, 'Descrição', descricaoValor, 'descricao')
    criaCampo(section, 'Status', primeiraMaiuscula(statusValor), 'status')
    criaAcoes(section)
}

function criaCampo(section, titulo, valor, tipo){
    const div = document.createElement('div')
    div.setAttribute('class', `campo campo--${tipo}`)
    section.appendChild(div)
    const h2 = document.createElement('h2')
    h2.setAttribute('class', 'campo-titulo')
    div.appendChild(h2)
    h2.innerHTML = titulo
    const p = document.createElement('p')
    div.appendChild(p)
    p.innerHTML = valor
}

function criaAcoes(section, titulo){
    const divAcao = document.createElement('div')
    divAcao.setAttribute('class', 'campo')
    section.appendChild(divAcao)
    const h2Acao = document.createElement('h2')
    h2Acao.setAttribute('class', 'campo-titulo')
    divAcao.appendChild(h2Acao)
    h2Acao.innerHTML = 'Ações'
    const pAcao = document.createElement('p')
    divAcao.appendChild(pAcao)
    const botaoEditar = document.createElement('button')
    botaoEditar.type = 'button'
    botaoEditar.setAttribute('class', 'button-editar')
    botaoEditar.innerHTML = 'Editar'
    pAcao.appendChild(botaoEditar)
    const botaoApagar = document.createElement('button')
    botaoApagar.type = 'button'
    botaoApagar.setAttribute('class', 'button-excluir')
    botaoApagar.innerHTML = 'Excluir'
    pAcao.appendChild(botaoApagar)
}

function abrirModal(){
    overlay.classList.remove('hidden')
}

function fecharModal(){
    overlay.classList.add('hidden')
}

function primeiraMaiuscula(texto){
    return texto[0].toUpperCase() +
    texto.slice(1)
}

document.addEventListener('click', function(e){
    const el = e.target
    if(el.classList.contains('button-excluir')){
        el.closest('.tarefa').remove()
    }

    if(el.classList.contains('button-editar')){
        e.preventDefault()
        tarefaEmEdicao = el.closest('.tarefa')
        const tituloAtual = tarefaEmEdicao.querySelector('.campo--titulo p').innerText
        const descricaoAtual = tarefaEmEdicao.querySelector('.campo--descricao p').innerText
        const statusAtual = tarefaEmEdicao.querySelector('.campo--status p').innerText
        editTitulo.value = tituloAtual
        editDescricao.value = descricaoAtual
        editStatus.value = statusAtual.toLowerCase()
        abrirModal()
    }

    if(el.classList.contains('btn-cancelar')){
        e.preventDefault()
        fecharModal()
    }

    if(el.classList.contains('overlay')){
        fecharModal()
    }
})

formTarefa.addEventListener('submit', function(e){
    e.preventDefault()
    criaTarefa(inputTitulo.value, inputDescricao.value, inputStatus.value)
})

formEditar.addEventListener('submit', function(e){
    e.preventDefault()
    const tituloEditado = tarefaEmEdicao.querySelector('.campo--titulo p')
    const descricaoEditado = tarefaEmEdicao.querySelector('.campo--descricao p')
    const statusEditado = tarefaEmEdicao.querySelector('.campo--status p')
    tituloEditado.innerText = editTitulo.value
    descricaoEditado.innerText = editDescricao.value
    statusEditado.innerText = primeiraMaiuscula(editStatus.value)
    fecharModal()
})
