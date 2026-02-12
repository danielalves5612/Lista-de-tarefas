const formTarefa = document.querySelector('#form-tarefa')
const inputTitulo = document.querySelector('#input-titulo')
const inputDescricao = document.querySelector('#input-descricao')
const inputStatus = document.querySelector('#input-status')
let tarefaEmEdicao
const overlay = document.querySelector('.overlay')
const modal = document.querySelector('.modal')
const btnCancelar = document.querySelector('.btn-cancelar')
const btnSalvar = document.querySelector('.btn-salvar')
const editTitulo = document.querySelector('#edit-titulo')
const editDescricao = document.querySelector('#edit-descricao')
const editStatus = document.querySelector('#edit-status')
const formEditar = document.querySelector('#form-editar')
const listaTarefas = document.querySelector('#lista-tarefas')
const contTotal = document.querySelector('#cont-total')
const contPendentes = document.querySelector('#cont-pendentes')
const contCompletas = document.querySelector('#cont-completas')

function criaTarefa(tituloValor, descricaoValor, statusValor, createdAt = Date.now(), inserirNoTopo = true){
    const section = document.createElement('section')
    section.classList.add('tarefa')
    aplicarClasseStatus(section, statusValor)
    section.dataset.createdAt = createdAt
    if(inserirNoTopo)
        listaTarefas.prepend(section)
    else listaTarefas.append(section)
    const meta = document.createElement('p')
    meta.classList.add('tarefa-data')
    meta.textContent = `Data de Criação: ${formatarDataHora(createdAt)}`
    section.appendChild(meta)
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
    h2.textContent = titulo
    const p = document.createElement('p')
    if(tipo === 'status'){
        p.classList.add('status')
        p.classList.add(`status--${valor.toLowerCase()}`)
    }
    p.textContent = valor
    div.appendChild(p)
}

function criaAcoes(section, titulo){
    const divAcao = document.createElement('div')
    divAcao.setAttribute('class', 'campo')
    section.appendChild(divAcao)
    const h2Acao = document.createElement('h2')
    h2Acao.setAttribute('class', 'campo-titulo')
    divAcao.appendChild(h2Acao)
    h2Acao.textContent = 'Ações'
    const pAcao = document.createElement('p')
    divAcao.appendChild(pAcao)
    const botaoEditar = document.createElement('button')
    botaoEditar.type = 'button'
    botaoEditar.setAttribute('class', 'button-editar')
    botaoEditar.textContent = 'Editar'
    pAcao.appendChild(botaoEditar)
    const botaoApagar = document.createElement('button')
    botaoApagar.type = 'button'
    botaoApagar.setAttribute('class', 'button-excluir')
    botaoApagar.textContent = 'Excluir'
    pAcao.appendChild(botaoApagar)
    const botaoToggle = document.createElement('button')
    botaoToggle.type = 'button'
    botaoToggle.classList.add('button-toggle')
    const isCompleto = section.classList.contains('tarefa--completo')
    botaoToggle.textContent = isCompleto ? 'Voltar' :  'Concluir'
    pAcao.appendChild(botaoToggle)
}

function atualizarContador(){
  const tarefas = document.querySelectorAll('section.tarefa')

  let pendentes = 0
  let completas = 0

  for (const t of tarefas){
    const status = (t.querySelector('.campo--status p')?.innerText || '').toLowerCase()

    if (status.includes('pendente')){
      pendentes++
    } else if (status.includes('completo')){
      completas++
    }
  }

  contTotal.textContent = `Total: ${tarefas.length}`
  contPendentes.textContent = `Pendentes: ${pendentes}`
  contCompletas.textContent = `Completas: ${completas}`
}


function formatarDataHora(createdAt){
    const d = new Date(Number(createdAt))
    const data = d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
    })
    const hora = d.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    })
    return `${data} ${hora}`
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

function aplicarClasseStatus(section, statusValor){
    const status = String(statusValor).toLowerCase()
    section.classList.remove('tarefa--pendente', 'tarefa--completo')
    section.classList.add(`tarefa--${status}`)
}

function salvarTarefas(){
    const section = listaTarefas.querySelectorAll('section.tarefa')
    const lista = []
    for(let tarefa of section){
        const pTitulo = tarefa.querySelector('.campo--titulo p').textContent
        const pDescricao = tarefa.querySelector('.campo--descricao p').textContent
        const pStatus = tarefa.querySelector('.campo--status p').textContent
        const dataCricao = tarefa.dataset.createdAt
        const objeto = {
            titulo: pTitulo,
            descricao: pDescricao,
            status: pStatus,
            createdAt: dataCricao
        }
        lista.push(objeto)
    }
    const json = JSON.stringify(lista)
    localStorage.setItem('tarefas', json)
}

function carregarTarefas(){
    const tarefasStr = localStorage.getItem('tarefas')
    if(!tarefasStr) return
    const tarefasJson = JSON.parse(tarefasStr)
    tarefasJson.sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    for(const item of tarefasJson){
        criaTarefa(item.titulo, item.descricao, item.status, item.createdAt, false)
    }
    atualizarContador()
}
carregarTarefas()

document.addEventListener('click', function(e){
    const el = e.target
    if(el.classList.contains('button-excluir')){
        el.closest('.tarefa').remove()
        salvarTarefas()
        atualizarContador()
    }

    if(el.classList.contains('button-editar')){
        e.preventDefault()
        tarefaEmEdicao = el.closest('.tarefa')
        const tituloAtual = tarefaEmEdicao.querySelector('.campo--titulo p').textContent
        const descricaoAtual = tarefaEmEdicao.querySelector('.campo--descricao p').textContent
        const statusAtual = tarefaEmEdicao.querySelector('.campo--status p').textContent
        editTitulo.value = tituloAtual
        editDescricao.value = descricaoAtual
        editStatus.value = statusAtual.toLowerCase()
        abrirModal()
    }

    if(el.classList.contains('button-toggle')){
        const tarefa = el.closest('.tarefa')
        const pStatus = tarefa.querySelector('.campo--status p')

        const estaPendente = tarefa.classList.contains('tarefa--pendente')
        const novoStatus = estaPendente ? 'completo' :  'pendente'

        pStatus.innerText = primeiraMaiuscula(novoStatus)

        aplicarClasseStatus(tarefa, novoStatus)

        pStatus.classList.remove('status--pendente', 'status--completo')
        pStatus.classList.add(`status--${novoStatus}`)

        el.textContent = novoStatus === 'completo' ? 'Voltar' : 'Concluir'

        salvarTarefas()
        atualizarContador()
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
    const titulo = inputTitulo.value.trim()
    const descricao = inputDescricao.value.trim()
    const status = inputStatus.value
    if(!titulo || !descricao) return
    const tarefas = listaTarefas.querySelectorAll('section.tarefa')
    for(const t of tarefas){
        const tituloExistente = t.querySelector('.campo--titulo p')?.textContent.trim().toLowerCase
        if(tituloExistente === titulo.toLowerCase()) return
    }


    criaTarefa(titulo, descricao, status)
    salvarTarefas()
    atualizarContador()
    inputTitulo.value = ''
    inputDescricao.value = ''
    inputStatus.value = 'pendente'
    inputTitulo.focus()
})

formEditar.addEventListener('submit', function(e){
  e.preventDefault()

  const tituloEditado = tarefaEmEdicao.querySelector('.campo--titulo p')
  const descricaoEditado = tarefaEmEdicao.querySelector('.campo--descricao p')
  const statusEditado = tarefaEmEdicao.querySelector('.campo--status p')

  tituloEditado.textContent = editTitulo.value
  descricaoEditado.textContent = editDescricao.value

  const novoStatus = editStatus.value 

  statusEditado.innerText = primeiraMaiuscula(novoStatus)

  aplicarClasseStatus(tarefaEmEdicao, novoStatus)

  statusEditado.classList.remove('status--pendente', 'status--completo')
  statusEditado.classList.add(`status--${novoStatus}`)

  const botaoToggle = tarefaEmEdicao.querySelector('.button.toggle')
  if(botaoToggle){
    botaoToggle.textContent = novoStatus === 'completo' ? 'Voltar' : 'Concluir'
  }

  fecharModal()
  salvarTarefas()
  atualizarContador()

  tarefaEmEdicao = null
  editTitulo.value = ''
  editDescricao.value = ''
  editStatus.value = 'pendente'
})

