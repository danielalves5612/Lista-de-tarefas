const formTarefa = document.querySelector('#form-tarefa')
const inputTitulo = document.querySelector('#input-titulo')
const inputDescricao = document.querySelector('#input-descricao')
const inputStatus = document.querySelector('#input-status')

const overlay = document.querySelector('#overlay')
const formEditar = document.querySelector('#form-editar')
const editTitulo = document.querySelector('#edit-titulo')
const editDescricao = document.querySelector('#edit-descricao')
const editStatus = document.querySelector('#edit-status')

const listaTarefas = document.querySelector('#lista-tarefas')
const tabelaHead = document.querySelector('#tabela-head')
const emptyState = document.querySelector('#empty-state')

const contTotal = document.querySelector('#cont-total')
const contPendentes = document.querySelector('#cont-pendentes')
const contCompletas = document.querySelector('#cont-completas')

let tarefaEmEdicao = null

function primeiraMaiuscula(texto){
  const s = String(texto || '')
  if(!s) return ''
  return s[0].toUpperCase() + s.slice(1)
}

function normalizarStatus(status){
  const s = String(status || '').toLowerCase()
  return (s === 'completo') ? 'completo' : 'pendente'
}

function formatarDataHora(createdAt){
  const d = new Date(Number(createdAt))
  const data = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${data} ${hora}`
}

function aplicarClasseStatus(section, statusValor){
  const status = normalizarStatus(statusValor)
  section.classList.remove('tarefa--pendente', 'tarefa--completo')
  section.classList.add(`tarefa--${status}`)
}

function abrirModal(){
  overlay.classList.remove('hidden')
}

function fecharModal(){
  overlay.classList.add('hidden')
}

function criarCampo(section, titulo, valor, tipo){
  const div = document.createElement('div')
  div.className = `campo campo--${tipo}`

  const h2 = document.createElement('h2')
  h2.className = 'campo-titulo'
  h2.textContent = titulo

  const p = document.createElement('p')
  p.textContent = valor

  if(tipo === 'status'){
    p.classList.add('status')
    p.classList.add(`status--${normalizarStatus(valor)}`)
  }

  div.appendChild(h2)
  div.appendChild(p)
  section.appendChild(div)
}

function criarAcoes(section){
  const div = document.createElement('div')
  div.className = 'campo'

  const h2 = document.createElement('h2')
  h2.className = 'campo-titulo'
  h2.textContent = 'Ações'

  const p = document.createElement('p')

  const btnEditar = document.createElement('button')
  btnEditar.type = 'button'
  btnEditar.className = 'button-editar'
  btnEditar.textContent = 'Editar'

  const btnExcluir = document.createElement('button')
  btnExcluir.type = 'button'
  btnExcluir.className = 'button-excluir'
  btnExcluir.textContent = 'Excluir'

  const btnToggle = document.createElement('button')
  btnToggle.type = 'button'
  btnToggle.className = 'button-toggle'
  const isCompleto = section.classList.contains('tarefa--completo')
  btnToggle.textContent = isCompleto ? 'Desfaz' : 'Feito'

  p.append(btnEditar, btnExcluir, btnToggle)
  div.append(h2, p)
  section.appendChild(div)
}

function criaTarefa(tituloValor, descricaoValor, statusValor, createdAt = Date.now(), inserirNoTopo = true){
  const status = normalizarStatus(statusValor)

  const section = document.createElement('section')
  section.classList.add('tarefa')
  aplicarClasseStatus(section, status)
  section.dataset.createdAt = String(createdAt)

  const meta = document.createElement('p')
  meta.className = 'tarefa-data'
  meta.textContent = `Data de Criação: ${formatarDataHora(createdAt)}`
  section.appendChild(meta)

  criarCampo(section, 'Tarefa', tituloValor, 'titulo')
  criarCampo(section, 'Descrição', descricaoValor, 'descricao')
  criarCampo(section, 'Status', primeiraMaiuscula(status), 'status')
  criarAcoes(section)

  if(inserirNoTopo) listaTarefas.prepend(section)
  else listaTarefas.appendChild(section)
}

function atualizarContador(){
  const tarefas = listaTarefas.querySelectorAll('section.tarefa')
  let pendentes = 0
  let completas = 0

  for(const t of tarefas){
    if(t.classList.contains('tarefa--pendente')) pendentes++
    if(t.classList.contains('tarefa--completo')) completas++
  }

  contTotal.textContent = `Total: ${tarefas.length}`
  contPendentes.textContent = `Pendentes: ${pendentes}`
  contCompletas.textContent = `Completas: ${completas}`
}

function atualizarEmptyState(){
  const temTarefas = listaTarefas.querySelector('section.tarefa') !== null

  emptyState.classList.toggle('hidden', temTarefas)

  tabelaHead.classList.toggle('hidden', !temTarefas)
}

function salvarTarefas(){
  const sections = listaTarefas.querySelectorAll('section.tarefa')
  const lista = []

  for(const tarefa of sections){
    const titulo = tarefa.querySelector('.campo--titulo p')?.textContent || ''
    const descricao = tarefa.querySelector('.campo--descricao p')?.textContent || ''
    const status = tarefa.classList.contains('tarefa--completo') ? 'completo' : 'pendente'
    const createdAt = tarefa.dataset.createdAt || String(Date.now())

    lista.push({ titulo, descricao, status, createdAt })
  }

  localStorage.setItem('tarefas', JSON.stringify(lista))
}

function carregarTarefas(){
  const tarefasStr = localStorage.getItem('tarefas')
  if(!tarefasStr){
    atualizarContador()
    atualizarEmptyState()
    return
  }

  const tarefas = JSON.parse(tarefasStr)
  tarefas.sort((a,b) => Number(b.createdAt) - Number(a.createdAt))

  listaTarefas.innerHTML = ''
  for(const item of tarefas){
    criaTarefa(item.titulo, item.descricao, item.status, item.createdAt, false)
  }

  atualizarContador()
  atualizarEmptyState()
}

carregarTarefas()

document.addEventListener('click', (e) => {
  const el = e.target

  if(el.classList.contains('button-excluir')){
    el.closest('.tarefa')?.remove()
    salvarTarefas()
    atualizarContador()
    atualizarEmptyState()
    return
  }

  if(el.classList.contains('button-editar')){
    tarefaEmEdicao = el.closest('.tarefa')
    if(!tarefaEmEdicao) return

    const tituloAtual = tarefaEmEdicao.querySelector('.campo--titulo p')?.textContent || ''
    const descricaoAtual = tarefaEmEdicao.querySelector('.campo--descricao p')?.textContent || ''
    const statusAtual = tarefaEmEdicao.classList.contains('tarefa--completo') ? 'completo' : 'pendente'

    editTitulo.value = tituloAtual
    editDescricao.value = descricaoAtual
    editStatus.value = statusAtual

    abrirModal()
    return
  }

  if(el.classList.contains('button-toggle')){
    const tarefa = el.closest('.tarefa')
    if(!tarefa) return

    const novoStatus = tarefa.classList.contains('tarefa--pendente') ? 'completo' : 'pendente'

    aplicarClasseStatus(tarefa, novoStatus)

    const pStatus = tarefa.querySelector('.campo--status p')
    if(pStatus){
      pStatus.textContent = primeiraMaiuscula(novoStatus)
      pStatus.classList.remove('status--pendente', 'status--completo')
      pStatus.classList.add(`status--${novoStatus}`)
    }

    el.textContent = (novoStatus === 'completo') ? 'Desfaz' : 'Feito'

    salvarTarefas()
    atualizarContador()
    atualizarEmptyState()
    return
  }

  if(el.classList.contains('btn-cancelar') || el.id === 'btn-cancelar'){
    fecharModal()
    return
  }

  if(el.id === 'overlay'){
    fecharModal()
  }
})

formTarefa.addEventListener('submit', (e) => {
  e.preventDefault()

  const titulo = inputTitulo.value.trim()
  const descricao = inputDescricao.value.trim()
  const status = normalizarStatus(inputStatus.value)

  if(!titulo || !descricao) return

  const existe = [...listaTarefas.querySelectorAll('.campo--titulo p')]
    .some(p => p.textContent.trim().toLowerCase() === titulo.toLowerCase())

  if(existe) return

  criaTarefa(titulo, descricao, status)
  salvarTarefas()
  atualizarContador()
  atualizarEmptyState()

  inputTitulo.value = ''
  inputDescricao.value = ''
  inputStatus.value = 'pendente'
  inputTitulo.focus()
})

formEditar.addEventListener('submit', (e) => {
  e.preventDefault()
  if(!tarefaEmEdicao) return

  const novoTitulo = editTitulo.value.trim()
  const novaDescricao = editDescricao.value.trim()
  const novoStatus = normalizarStatus(editStatus.value)

  if(!novoTitulo || !novaDescricao) return

  const tituloP = tarefaEmEdicao.querySelector('.campo--titulo p')
  const descP = tarefaEmEdicao.querySelector('.campo--descricao p')
  const statusP = tarefaEmEdicao.querySelector('.campo--status p')
  const toggleBtn = tarefaEmEdicao.querySelector('.button-toggle')

  if(tituloP) tituloP.textContent = novoTitulo
  if(descP) descP.textContent = novaDescricao

  aplicarClasseStatus(tarefaEmEdicao, novoStatus)

  if(statusP){
    statusP.textContent = primeiraMaiuscula(novoStatus)
    statusP.classList.remove('status--pendente', 'status--completo')
    statusP.classList.add(`status--${novoStatus}`)
  }

  if(toggleBtn){
    toggleBtn.textContent = (novoStatus === 'completo') ? 'Desfaz' : 'Feito'
  }

  fecharModal()
  salvarTarefas()
  atualizarContador()
  atualizarEmptyState()

  tarefaEmEdicao = null
  editTitulo.value = ''
  editDescricao.value = ''
  editStatus.value = 'pendente'
})