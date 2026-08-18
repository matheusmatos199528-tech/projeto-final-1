<<<<<<< HEAD
const map = L.map('map').setView([-23.2237, -45.9009], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
setTimeout(() => map.invalidateSize(), 300);
window.addEventListener('resize', () => map.invalidateSize());

let locais = [];
let marcadores = [];
let marcadorSelecao = null;
let selecionandoNoMapa = false;

const modal = document.getElementById('formAdicionarLocal');
const formulario = document.getElementById('formLocal');
const menu = document.getElementById('menuMapa');
const erroFormulario = document.getElementById('erroFormulario');
=======

// ---------------------------
// MAPA
// ---------------------------
var map = L.map('map').setView([-23.2237, -45.9009], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
  .addTo(map);

// 🔥 CORREÇÃO PRINCIPAL (Leaflet)
setTimeout(() => {
  map.invalidateSize();
}, 1000);

setTimeout(() => {
  map.invalidateSize();
}, 2000);

// 🔥 EXTRA (quando redimensionar tela)
window.addEventListener("resize", () => {
  map.invalidateSize();
});

// ---------------------------
// DADOS
// ---------------------------
var locais = [];
var marcadores = [];
>>>>>>> 744790effe840190bc9ac42abe3877c2f9ac0bd9

function escaparHtml(valor) {
  return String(valor).replace(/[&<>'"]/g, caractere => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  })[caractere]);
}

<<<<<<< HEAD
function conteudoLocal(local) {
  return `<strong>${escaparHtml(local.nome)}</strong><br>${escaparHtml(local.endereco)}, ${escaparHtml(local.numero)}<br>${local.recursos.map(escaparHtml).join(', ')}`;
}

function renderizar(lista = locais) {
  const container = document.getElementById('listaLocais');
  container.replaceChildren();
  marcadores.forEach(marcador => map.removeLayer(marcador));
  marcadores = [];
  lista.forEach(local => {
    const marcador = L.marker([local.lat, local.lng]).addTo(map).bindPopup(conteudoLocal(local));
    marcadores.push(marcador);
    const item = document.createElement('button');
    item.type = 'button'; item.className = 'local';
    item.textContent = `${local.nome} — ${local.categorias.join(', ')}`;
    item.addEventListener('click', () => { map.setView([local.lat, local.lng], 16); marcador.openPopup(); });
    container.appendChild(item);
=======
// ---------------------------
// LOCAIS DEMO (OFFCANVAS)
// ---------------------------
var locaisDemo = [
  {nome: "Parque Industrial", lat: -23.2220, lng: -45.9000, avaliacao: 5, deficiencia: "fisica", foto: "img/demo1.jpg"},
  {nome: "Jardim Satélite", lat: -23.2240, lng: -45.9050, avaliacao: 4, deficiencia: "visual", foto: "img/demo2.jpg"},
  {nome: "Centro", lat: -23.2230, lng: -45.9070, avaliacao: 3, deficiencia: "auditiva", foto: "img/demo3.jpg"},
  {nome: "Shopping Cidade", lat: -23.2250, lng: -45.9020, avaliacao: 5, deficiencia: "fisica", foto: "img/demo4.jpg"},
  {nome: "Biblioteca Municipal", lat: -23.2260, lng: -45.9040, avaliacao: 4, deficiencia: "visual", foto: "img/demo5.jpg"},
];

// Adiciona os demo markers no mapa
locaisDemo.forEach(local => {
  var marker = L.marker([local.lat, local.lng]).addTo(map);
  marker.bindPopup(`
    <b>${local.nome}</b><br>
    ${local.avaliacao}⭐<br>
    <img src="${local.foto}" style="width:150px;border-radius:5px;">
  `);
});

// Preenche o offcanvas/demo container
const demoContainer = document.getElementById("demoLocais");
locaisDemo.forEach(local => {
  const div = document.createElement("div");
  div.className = "local mb-2";
  div.innerHTML = `
    <b>${local.nome}</b><br>
    ${local.avaliacao}⭐<br>
    <img src="${local.foto}" style="width:100%;border-radius:5px;margin-top:5px;">
  `;
  div.onclick = () => map.setView([local.lat, local.lng], 16);
  demoContainer.appendChild(div);
});

// ---------------------------
// ELEMENTOS MODAL
// ---------------------------
const modal = document.getElementById("formAdicionarLocal");
const btnAdicionar = document.getElementById("btnAdicionarLocal");
const btnCancelar = document.getElementById("btnCancelar");
const btnFechar = document.getElementById("btnFechar");

// ---------------------------
// ABRIR MODAL
// ---------------------------
btnAdicionar.addEventListener("click", () => modal.style.display = "flex");

// ---------------------------
// FECHAR MODAL
// ---------------------------
btnCancelar.addEventListener("click", () => modal.style.display = "none");
btnFechar.addEventListener("click", () => modal.style.display = "none");
modal.addEventListener("click", e => {
  if (e.target === modal) modal.style.display = "none";
});

// ---------------------------
// CARREGAR LOCAIS (LISTA + MAPA)
// ---------------------------
function carregarLocais() {
  const lista = document.getElementById("listaLocais");
  lista.innerHTML = "";

  // Remove marcadores antigos do mapa
  marcadores.forEach(m => map.removeLayer(m));
  marcadores = [];

  locais.forEach(local => {
    // Cria marcador no mapa
    var marker = L.marker([local.lat, local.lng]).addTo(map);
    marker.bindPopup(`
      <b>${escaparHtml(local.nome)}</b><br>
      ${escaparHtml(local.avaliacao)}⭐<br>
      <img src="${escaparHtml(local.foto)}" alt="Foto do local" style="width:150px;border-radius:5px;">
    `);
    marcadores.push(marker);

    // Cria item na lista lateral
    var div = document.createElement("div");
    div.className = "local";
    div.innerHTML = `
      <b>${escaparHtml(local.nome)}</b><br>
      ${escaparHtml(local.avaliacao)}⭐<br>
      <img src="${escaparHtml(local.foto)}" alt="Foto do local" style="width:100%;border-radius:5px;margin-top:5px;">
    `;
    div.onclick = () => {
      map.setView([local.lat, local.lng], 16);
      marker.openPopup();
    };

    lista.appendChild(div);
>>>>>>> 744790effe840190bc9ac42abe3877c2f9ac0bd9
  });
  if (!lista.length) container.textContent = 'Nenhum local aprovado encontrado.';
}

<<<<<<< HEAD
async function carregarLocais() {
  try {
    const resposta = await fetch('../api/locais.php', { headers: { Accept: 'application/json' } });
    if (!resposta.ok) throw new Error('Não foi possível carregar os locais.');
    locais = (await resposta.json()).locais || [];
    renderizar();
  } catch (erro) {
    document.getElementById('listaLocais').textContent = erro.message;
  }
}

function filtrar() {
  const categoria = document.getElementById('filtroCategoria').value;
  const recurso = document.getElementById('filtroRecurso').value;
  renderizar(locais.filter(local => (categoria === 'todos' || local.categorias.includes(categoria)) && (recurso === 'todos' || local.recursos.includes(recurso))));
}
window.filtrar = filtrar;

function alternarMenu(aberto) {
  menu.classList.toggle('aberto', aberto); menu.setAttribute('aria-hidden', String(!aberto));
  document.getElementById('btnMenuMapa').setAttribute('aria-expanded', String(aberto));
}
document.getElementById('btnMenuMapa').addEventListener('click', () => alternarMenu(true));
document.getElementById('btnFecharMenu').addEventListener('click', () => alternarMenu(false));
document.getElementById('btnAdicionarLocal').addEventListener('click', () => { alternarMenu(false); modal.style.display = 'flex'; document.getElementById('nome').focus(); });

function fecharFormulario() { modal.style.display = 'none'; selecionandoNoMapa = false; document.body.classList.remove('selecao-mapa'); }
document.getElementById('btnFechar').addEventListener('click', fecharFormulario);
document.getElementById('btnCancelar').addEventListener('click', fecharFormulario);
modal.addEventListener('click', evento => { if (evento.target === modal) fecharFormulario(); });

function controlarOutro(nome, campoId, inputId) {
  document.querySelectorAll(`input[name="${nome}[]"]`).forEach(input => input.addEventListener('change', () => {
    const ativo = [...document.querySelectorAll(`input[name="${nome}[]"]:checked`)].some(item => item.value === 'Outro');
    document.getElementById(campoId).classList.toggle('visivel', ativo);
    document.getElementById(inputId).required = ativo;
  }));
}
controlarOutro('categorias', 'campoOutraCategoria', 'outraCategoria');
controlarOutro('recursos', 'campoOutroRecurso', 'outroRecurso');

document.getElementById('btnSelecionarMapa').addEventListener('click', () => {
  selecionandoNoMapa = true; modal.style.display = 'none'; document.body.classList.add('selecao-mapa');
  document.getElementById('localizacaoStatus').textContent = 'Clique no ponto exato do mapa.';
});
map.on('click', evento => {
  if (!selecionandoNoMapa) return;
  selecionandoNoMapa = false; document.body.classList.remove('selecao-mapa');
  if (marcadorSelecao) map.removeLayer(marcadorSelecao);
  marcadorSelecao = L.marker(evento.latlng).addTo(map).bindPopup('Local selecionado').openPopup();
  document.getElementById('latitude').value = evento.latlng.lat.toFixed(7);
  document.getElementById('longitude').value = evento.latlng.lng.toFixed(7);
  const status = document.getElementById('localizacaoStatus'); status.textContent = 'Localização selecionada no mapa.'; status.classList.add('ok');
  modal.style.display = 'flex';
});

document.getElementById('fotos').addEventListener('change', evento => {
  const preview = document.getElementById('previewFotos'); preview.replaceChildren();
  const arquivos = [...evento.target.files];
  if (arquivos.length > 8) { erroFormulario.textContent = 'Selecione no máximo 8 fotos.'; evento.target.value = ''; return; }
  erroFormulario.textContent = '';
  arquivos.forEach((arquivo, indice) => {
    if (arquivo.size > 5 * 1024 * 1024) { erroFormulario.textContent = 'Cada foto deve ter no máximo 5 MB.'; return; }
    const figura = document.createElement('figure'); const imagem = document.createElement('img');
    imagem.src = URL.createObjectURL(arquivo); imagem.alt = `Prévia da foto ${indice + 1}`;
    imagem.addEventListener('load', () => URL.revokeObjectURL(imagem.src), { once: true }); figura.appendChild(imagem); preview.appendChild(figura);
  });
});

async function geocodificarEndereco() {
  const partes = ['endereco', 'numero', 'bairro', 'cidade', 'estado', 'cep'].map(id => document.getElementById(id).value.trim()).filter(Boolean);
  const resposta = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${encodeURIComponent(partes.join(', '))}`);
  if (!resposta.ok) throw new Error('Não foi possível consultar o endereço.');
  const dados = await resposta.json();
  if (!dados.length) throw new Error('Endereço não encontrado. Selecione o ponto diretamente no mapa.');
  return { latitude: dados[0].lat, longitude: dados[0].lon };
}

formulario.addEventListener('submit', async evento => {
  evento.preventDefault(); erroFormulario.textContent = '';
  const categorias = formulario.querySelectorAll('input[name="categorias[]"]:checked');
  const recursos = formulario.querySelectorAll('input[name="recursos[]"]:checked');
  if (!categorias.length || !recursos.length) { erroFormulario.textContent = 'Selecione ao menos uma categoria e um recurso de acessibilidade.'; return; }
  const botao = formulario.querySelector('.btn-enviar'); botao.disabled = true; botao.textContent = 'Enviando…';
  try {
    if (!document.getElementById('latitude').value) {
      const coordenadas = await geocodificarEndereco(); document.getElementById('latitude').value = coordenadas.latitude; document.getElementById('longitude').value = coordenadas.longitude;
    }
    const dados = new FormData(formulario);
    const resposta = await fetch('../api/locais.php', { method: 'POST', headers: { 'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content }, body: dados });
    const resultado = await resposta.json(); if (!resposta.ok) throw new Error(resultado.erro || 'Falha ao enviar solicitação.');
    fecharFormulario(); formulario.reset(); document.getElementById('previewFotos').replaceChildren(); document.getElementById('confirmacaoSolicitacao').classList.add('ativa');
    document.getElementById('localizacaoStatus').textContent = 'Localização ainda não selecionada.';
    if (marcadorSelecao) { map.removeLayer(marcadorSelecao); marcadorSelecao = null; }
  } catch (erro) { erroFormulario.textContent = erro.message; }
  finally { botao.disabled = false; botao.textContent = 'Enviar solicitação'; }
});

document.getElementById('btnFecharConfirmacao').addEventListener('click', () => document.getElementById('confirmacaoSolicitacao').classList.remove('ativa'));
carregarLocais();
=======
// ---------------------------
// FILTROS
// ---------------------------
function filtrar() {
  const tipo = document.getElementById("filtroDeficiencia").value;
  const avaliacao = document.getElementById("filtroAvaliacao").value;

  const lista = document.getElementById("listaLocais");
  lista.innerHTML = "";

  marcadores.forEach(m => map.removeLayer(m));
  marcadores = [];

  locais.forEach(local => {
    if ((tipo === "todos" || local.deficiencia === tipo) &&
        (avaliacao === "todos" || local.avaliacao >= avaliacao)) {

      var marker = L.marker([local.lat, local.lng]).addTo(map);
      marker.bindPopup(`
        <b>${escaparHtml(local.nome)}</b><br>
        ${escaparHtml(local.avaliacao)}⭐<br>
        <img src="${escaparHtml(local.foto)}" alt="Foto do local" style="width:150px;border-radius:5px;">
      `);
      marcadores.push(marker);

      var div = document.createElement("div");
      div.className = "local";
      div.innerHTML = `
        <b>${escaparHtml(local.nome)}</b><br>
        ${escaparHtml(local.avaliacao)}⭐<br>
        <img src="${escaparHtml(local.foto)}" alt="Foto do local" style="width:100%;border-radius:5px;margin-top:5px;">
      `;
      div.onclick = () => {
        map.setView([local.lat, local.lng], 16);
        marker.openPopup();
      };
      lista.appendChild(div);
    }
  });
}

// ---------------------------
// FORMULÁRIO ADICIONAR LOCAL
// ---------------------------
document.getElementById("formLocal").addEventListener("submit", function(e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const endereco = document.getElementById("endereco").value;
  const deficiencia = document.getElementById("deficiencia").value;
  const avaliacao = document.getElementById("avaliacao").value;
  const fotoInput = document.getElementById("foto");
  const fotoArquivo = fotoInput.files[0];

  if(!fotoArquivo){
    alert("É obrigatório anexar uma foto!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event){
    const fotoURL = event.target.result;

    // Geocodificação do endereço
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`)
    .then(res => res.json())
    .then(data => {
      if(data.length > 0){
        const novoLocal = {
          nome,
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          deficiencia,
          avaliacao,
          foto: fotoURL,
          status: "pendente" // 🔥 para o ADM aprovar ou recusar
        };

        // Adiciona no mapa
        locais.push(novoLocal);
        carregarLocais();

        // Salva no localStorage para o ADM
        let admLocais = JSON.parse(localStorage.getItem("admLocais")) || [];
        admLocais.push(novoLocal);
        localStorage.setItem("admLocais", JSON.stringify(admLocais));

        alert("Local adicionado!");
        modal.style.display = "none";
        document.getElementById("formLocal").reset();
      } else {
        alert("Endereço não encontrado");
      }
    });
  };

  reader.readAsDataURL(fotoArquivo);
});
>>>>>>> 744790effe840190bc9ac42abe3877c2f9ac0bd9
