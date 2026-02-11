const formTarefa = document.querySelector('#form-tarefa')
const inputTitulo = document.querySelector('#input-titulo')
const inputDescricao = document.querySelector('#input-descricao')
const inputStatus = document.querySelector('#input-status')
const buttonTarefa = document.querySelector('#button-tarefa')
const container = document.querySelector('div#container')

function criaTarefa(inputTitulo, inputDescricao, inputStatus){
    const section = document.createElement('section')
    section.setAttribute('class', 'tarefa')
    container.appendChild(section)
    const div = document.createElement('div')
    div.setAttribute('class', 'campo')
    section.appendChild(div)
    const h2 = document.createElement('h2')
    h2.setAttribute('class', 'campo-titulo')
    div.appendChild(h2)
    h2.innerHTML = 'Tarefa'
    const p = document.createElement('p')
    div.appendChild(p)
    p.innerHTML = inputTitulo

    const divCampo = document.createElement('div')
    divCampo.setAttribute('class', 'campo')
    section.appendChild(divCampo)
    const h2Campo = document.createElement('h2')
    h2Campo.setAttribute('class', 'campo-titulo')
    divCampo.appendChild(h2Campo)
    h2Campo.innerHTML = 'Descrição'
    const pCampo = document.createElement('p')
    divCampo.appendChild(pCampo)
    pCampo.innerHTML = inputDescricao

    const divCampoS = document.createElement('div')
    divCampoS.setAttribute('class', 'campo')
    section.appendChild(divCampoS)
    const h2CampoS = document.createElement('h2')
    h2CampoS.setAttribute('class', 'campo-titulo')
    h2CampoS.innerHTML = 'Status'
    divCampoS.appendChild(h2CampoS)
    const pCampoS = document.createElement('p')
    divCampoS.appendChild(pCampoS)
    pCampoS.innerHTML = inputStatus

    const divCampoA = document.createElement('div')
    divCampoA.setAttribute('class', 'campo')
    section.appendChild(divCampoA)
    const h2CampoA = document.createElement('h2')
    h2CampoA.setAttribute('class', 'campo-titulo')
    divCampoA.appendChild(h2CampoA)
    h2CampoA.innerHTML = 'Ações'
    const pCampoA = document.createElement('p')
    divCampoA.appendChild(pCampoA)
    const divButtonA = document.createElement('button')
    divButtonA.setAttribute('class', 'button-editar')
    divButtonA.innerHTML = 'Editar'
    pCampoA.appendChild(divButtonA)
    const divButtonB = document.createElement('button')
    divButtonB.setAttribute('class', 'button-excluir')
    divButtonB.innerHTML = 'Excluir'
    pCampoA.appendChild(divButtonB)
}
formTarefa.addEventListener('submit', function(e){
    e.preventDefault()
    criaTarefa(inputTitulo.value, inputDescricao.value, inputStatus.value)
})