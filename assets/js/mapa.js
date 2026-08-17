const map = L.map('map').setView([-23.2237, -45.9009], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

setTimeout(() => map.invalidateSize(), 300);
window.addEventListener('resize', () => map.invalidateSize());

let locais = [];
let marcadores = [];

function escaparHtml(valor) {
  const elemento = document.createElement('div');
  elemento.textContent = String(valor ?? '');
  return elemento.innerHTML;
}

function conteudoLocal(local) {
  const recursos = Array.isArray(local.recursos) && local.recursos.length
    ? local.recursos.join(', ')
    : 'Recursos não informados';
  const comentario = local.comentario ? `<br>${escaparHtml(local.comentario)}` : '';
  return `<strong>${escaparHtml(local.nome)}</strong><br>${Number(local.avaliacao)} ⭐<br>${escaparHtml(recursos)}${comentario}`;
}

function adicionarItem(container, local, marker) {
  const item = document.createElement('button');
  item.type = 'button';
  item.className = 'local';

  const titulo = document.createElement('strong');
  titulo.textContent = local.nome;
  const detalhes = document.createElement('span');
  detalhes.textContent = ` — ${Number(local.avaliacao)} ⭐`;
  item.append(titulo, detalhes);
  item.addEventListener('click', () => {
    map.setView([local.lat, local.lng], 16);
    marker.openPopup();
  });
  container.appendChild(item);
}

function renderizar(listaLocais = locais) {
  const lista = document.getElementById('listaLocais');
  lista.replaceChildren();
  marcadores.forEach(marker => map.removeLayer(marker));
  marcadores = [];

  listaLocais.forEach(local => {
    const marker = L.marker([local.lat, local.lng]).addTo(map).bindPopup(conteudoLocal(local));
    marcadores.push(marker);
    adicionarItem(lista, local, marker);
  });
}

async function carregarLocais() {
  try {
    const resposta = await fetch('locais.php', { headers: { Accept: 'application/json' } });
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const dados = await resposta.json();
    locais = Array.isArray(dados.locais) ? dados.locais : [];
    renderizar();
  } catch (erro) {
    console.error('Erro ao carregar locais:', erro);
    document.getElementById('listaLocais').textContent = 'Não foi possível carregar os locais.';
  }
}

function filtrar() {
  const tipo = document.getElementById('filtroDeficiencia').value;
  const avaliacao = document.getElementById('filtroAvaliacao').value;
  renderizar(locais.filter(local =>
    (tipo === 'todos' || local.deficiencia === tipo) &&
    (avaliacao === 'todos' || Number(local.avaliacao) >= Number(avaliacao))
  ));
}

window.filtrar = filtrar;

const modal = document.getElementById('formAdicionarLocal');
document.getElementById('btnAdicionarLocal').addEventListener('click', () => { modal.style.display = 'flex'; });
document.getElementById('btnCancelar').addEventListener('click', () => { modal.style.display = 'none'; });
document.getElementById('btnFechar').addEventListener('click', () => { modal.style.display = 'none'; });
modal.addEventListener('click', evento => {
  if (evento.target === modal) modal.style.display = 'none';
});

document.getElementById('formLocal').addEventListener('submit', async function (evento) {
  evento.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const recursos = [...document.querySelectorAll('input[name="recursos"]:checked')].map(campo => campo.value);

  try {
    const resposta = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(endereco)}`);
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const dados = await resposta.json();
    if (!dados.length) {
      alert('Endereço não encontrado. Informe um endereço mais completo.');
      return;
    }

    const novoLocal = {
      nome,
      tipo: document.getElementById('tipoLocal').value,
      endereco,
      lat: Number(dados[0].lat),
      lng: Number(dados[0].lon),
      deficiencia: document.getElementById('deficiencia').value,
      avaliacao: Number(document.getElementById('avaliacao').value),
      comentario: document.getElementById('comentario').value.trim(),
      recursos,
      status: 'pendente'
    };

    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
    const salvamento = await fetch('locais.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify(novoLocal)
    });
    const resultado = await salvamento.json();
    if (salvamento.status === 401) {
      alert(resultado.erro);
      window.location.href = 'login.php';
      return;
    }
    if (!salvamento.ok) throw new Error(resultado.erro || 'Falha ao salvar o local.');

    await carregarLocais();
    alert('Local adicionado ao banco de dados!');
    modal.style.display = 'none';
    this.reset();
  } catch (erro) {
    console.error('Erro ao localizar endereço:', erro);
    alert(erro.message || 'Não foi possível concluir a operação. Tente novamente.');
  }
});

carregarLocais();
