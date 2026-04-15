
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
      <b>${local.nome}</b><br>
      ${local.avaliacao}⭐<br>
      <img src="${local.foto}" style="width:150px;border-radius:5px;">
    `);
    marcadores.push(marker);

    // Cria item na lista lateral
    var div = document.createElement("div");
    div.className = "local";
    div.innerHTML = `
      <b>${local.nome}</b><br>
      ${local.avaliacao}⭐<br>
      <img src="${local.foto}" style="width:100%;border-radius:5px;margin-top:5px;">
    `;
    div.onclick = () => {
      map.setView([local.lat, local.lng], 16);
      marker.openPopup();
    };

    lista.appendChild(div);
  });
}

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
        <b>${local.nome}</b><br>
        ${local.avaliacao}⭐<br>
        <img src="${local.foto}" style="width:150px;border-radius:5px;">
      `);
      marcadores.push(marker);

      var div = document.createElement("div");
      div.className = "local";
      div.innerHTML = `
        <b>${local.nome}</b><br>
        ${local.avaliacao}⭐<br>
        <img src="${local.foto}" style="width:100%;border-radius:5px;margin-top:5px;">
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