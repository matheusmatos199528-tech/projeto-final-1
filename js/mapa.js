 var map = L.map('map').setView([-23.2237, -45.9009], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);
        

        /* LOCAIS */

        var locais = [

            {
                nome: "Shopping Center Vale",
                lat: -23.2237,
                lng: -45.9009,
                deficiencia: "fisica",
                avaliacao: 4,
                descricao: "Rampas de acesso ♿"
            },

            {
                nome: "Parque Vicentina Aranha",
                lat: -23.2300,
                lng: -45.8900,
                deficiencia: "fisica",
                avaliacao: 5,
                descricao: "Banheiro acessível ♿"
            },

            {
                nome: "Biblioteca Pública",
                lat: -23.2200,
                lng: -45.9100,
                deficiencia: "visual",
                avaliacao: 4,
                descricao: "Piso tátil 👁"
            }

        ];

        var marcadores = [];

        function carregarLocais() {

            document.getElementById("listaLocais").innerHTML = "";

            marcadores.forEach(m => map.removeLayer(m));

            marcadores = [];

            locais.forEach((local) => {

                var marker = L.marker([local.lat, local.lng]).addTo(map);

                marker.bindPopup(
                    "<b>" + local.nome + "</b><br>" + local.descricao + "<br>Avaliação: " + local.avaliacao + "⭐"
                );

                marcadores.push(marker);

                var div = document.createElement("div");

                div.className = "local";

                div.innerHTML =
                    "<b>" + local.nome + "</b><br>" + local.descricao + "<br>" + local.avaliacao + "⭐";

                div.onclick = function () {

                    map.setView([local.lat, local.lng], 16);
                    marker.openPopup();

                }

                document.getElementById("listaLocais").appendChild(div);

            });

        }

        function filtrar() {

            var tipo = document.getElementById("filtroDeficiencia").value;
            var avaliacao = document.getElementById("filtroAvaliacao").value;

            document.getElementById("listaLocais").innerHTML = "";

            marcadores.forEach(m => map.removeLayer(m));
            marcadores = [];

            locais.forEach((local) => {

                if ((tipo == "todos" || local.deficiencia == tipo) &&
                    (avaliacao == "todos" || local.avaliacao >= avaliacao)) {

                    var marker = L.marker([local.lat, local.lng]).addTo(map);

                    marker.bindPopup(
                        "<b>" + local.nome + "</b><br>" + local.descricao + "<br>" + local.avaliacao + "⭐"
                    );

                    marcadores.push(marker);

                    var div = document.createElement("div");

                    div.className = "local";

                    div.innerHTML =
                        "<b>" + local.nome + "</b><br>" + local.descricao + "<br>" + local.avaliacao + "⭐";

                    div.onclick = function () {

                        map.setView([local.lat, local.lng], 16);
                        marker.openPopup();

                    }

                    document.getElementById("listaLocais").appendChild(div);

                }

            });

        }

        /* ADICIONAR LOCAL */

        function adicionarLocal() {

            var nome = prompt("Nome do local:");

            var tipo = prompt("Tipo de deficiência (fisica / visual / auditiva)");

            var lat = prompt("Latitude:");

            var lng = prompt("Longitude:");

            var avaliacao = prompt("Avaliação (1 a 5)");

            locais.push({

                nome: nome,
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                deficiencia: tipo,
                avaliacao: parseInt(avaliacao),
                descricao: "Local adicionado"

            });

            carregarLocais();

        }

        carregarLocais();

        /* CORRIGE TAMANHO DO MAPA */

        setTimeout(function () {
            map.invalidateSize();
        }, 300);
