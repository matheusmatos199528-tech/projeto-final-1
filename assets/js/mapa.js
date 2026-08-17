const map = L.map('map').setView([-23.2237, -45.9009], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

setTimeout(() => map.invalidateSize(), 300);
window.addEventListener('resize', () => map.invalidateSize());

const locaisDemo = [
  { nome: 'Parque Industrial', lat: -23.2220, lng: -45.9000, avaliacao: 5, deficiencia: 'fisica', recursos: ['Rampa de acesso'] },
  { nome: 'Jardim Satélite', lat: -23.2240, lng: -45.9050, avaliacao: 4, deficiencia: 'visual', recursos: ['Piso tátil'] },
  { nome: 'Centro', lat: -23.2230, lng: -45.9070, avaliacao: 3, deficiencia: 'auditiva', recursos: ['Atendimento em Libras'] }
];

function carregarArmazenados() {
  try {
    const dados = JSON.parse(localStorage.getItem('locaisInclucity') || '[]');
    return Array.isArray(dados) ? dados : [];
  } catch (erro) {
    console.warn('Não foi possível ler os locais armazenados.', erro);
    return [];
  }
}

let locais = carregarArmazenados();
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

const demoContainer = document.getElementById('demoLocais');
locaisDemo.forEach(local => {
  const marker = L.marker([local.lat, local.lng]).addTo(map).bindPopup(conteudoLocal(local));
  adicionarItem(demoContainer, local, marker);
});

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
      lat: Number(dados[0].lat),
      lng: Number(dados[0].lon),
      deficiencia: document.getElementById('deficiencia').value,
      avaliacao: Number(document.getElementById('avaliacao').value),
      comentario: document.getElementById('comentario').value.trim(),
      recursos,
      status: 'pendente'
    };

    locais.push(novoLocal);
    localStorage.setItem('locaisInclucity', JSON.stringify(locais));
    renderizar();
    alert('Local adicionado e salvo neste navegador!');
    modal.style.display = 'none';
    this.reset();
  } catch (erro) {
    console.error('Erro ao localizar endereço:', erro);
    alert('Não foi possível consultar o endereço agora. Tente novamente.');
  }
});

renderizar();
