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

function criaTarefa(tituloValor, descricaoValor, statusValor){
    const section = document.createElement('section')
    section.setAttribute('class', 'tarefa')
    container.appendChild(section)
    criaCampo(section, 'Tarefa', tituloValor)
    criaCampo(section, 'Descrição', descricaoValor)
    criaCampo(section, 'Status', statusValor)
    criaAcoes(section)
}

function criaCampo(section, titulo, valor){
    const div = document.createElement('div')
    div.setAttribute('class', 'campo')
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
    botaoEditar.setAttribute('class', 'button-editar')
    botaoEditar.innerHTML = 'Editar'
    pAcao.appendChild(botaoEditar)
    const botaoApagar = document.createElement('button')
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

document.addEventListener('click', function(e){
    const el = e.target
    if(el.classList.contains('button-excluir')){
        el.closest('.tarefa').remove()
    }

    if(el.classList.contains('button-editar')){
        e.preventDefault()
        tarefaEmEdicao = el.closest('.tarefa')
        abrirModal()
    }

    if(el.classList.contains('btn-cancelar')){
        e.preventDefault()
        fecharModal()
    }

    if(el.classList.contains('btn-salvar')){
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
