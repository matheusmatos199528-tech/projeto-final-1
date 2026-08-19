const busca = document.getElementById('buscaAdmin');
const filtroStatus = document.getElementById('statusAdmin');
const mensagem = document.getElementById('mensagemAdmin');
const semResultados = document.getElementById('semResultados');
const token = document.querySelector('meta[name="csrf-token"]').content;

function normalizar(texto) {
  return String(texto).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function filtrarSolicitacoes() {
  const termo = normalizar(busca.value.trim());
  const status = filtroStatus.value;
  let visiveis = 0;

  document.querySelectorAll('.solicitacao').forEach(card => {
    const correspondeBusca = normalizar(card.dataset.busca).includes(termo);
    const correspondeStatus = status === 'todos' || card.dataset.status === status
      || (status === 'outros' && !['pendente', 'aprovado'].includes(card.dataset.status));
    card.hidden = !(correspondeBusca && correspondeStatus);
    if (!card.hidden) visiveis++;
  });
  semResultados.hidden = visiveis !== 0;
}

busca.addEventListener('input', filtrarSolicitacoes);
filtroStatus.addEventListener('change', filtrarSolicitacoes);

function exibirMensagem(texto, erro = false) {
  mensagem.textContent = texto;
  mensagem.className = erro ? 'mensagem erro' : 'mensagem ativa';
}

document.getElementById('listaAdmin').addEventListener('click', async evento => {
  const botao = evento.target.closest('[data-acao]');
  if (!botao) return;
  const card = botao.closest('.solicitacao');
  const acao = botao.dataset.acao;
  const nome = card.querySelector('h2').textContent;
  const pergunta = acao === 'excluir'
    ? `Excluir permanentemente a solicitação “${nome}”?`
    : `Aprovar “${nome}” e publicar no mapa?`;
  if (!window.confirm(pergunta)) return;

  card.querySelectorAll('button').forEach(item => item.disabled = true);
  try {
    const resposta = await fetch('../api/admin_locais.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': token },
      body: JSON.stringify({ id: Number(card.dataset.id), acao })
    });
    const resultado = await resposta.json();
    if (!resposta.ok) throw new Error(resultado.erro || 'Não foi possível concluir a ação.');
    exibirMensagem(resultado.mensagem);
    if (acao === 'excluir') card.remove();
    else {
      card.dataset.status = 'aprovado';
      const status = card.querySelector('.status');
      status.className = 'status status-aprovado'; status.textContent = 'aprovado';
      botao.remove();
      card.querySelectorAll('button').forEach(item => item.disabled = false);
    }
    filtrarSolicitacoes();
  } catch (erro) {
    exibirMensagem(erro.message, true);
    card.querySelectorAll('button').forEach(item => item.disabled = false);
  }
});

filtrarSolicitacoes();
