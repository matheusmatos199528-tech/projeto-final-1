
function verSenha(id){
  const campo = document.getElementById(id);

  if(campo.type === "password"){
    campo.type = "text";
  } else {
    campo.type = "password";
  }
}
 

    function mostrarModal(mensagem) {
      document.getElementById("mensagemModal").innerText = mensagem;
      document.getElementById("modalErro").style.display = "block";
    }

    function fecharModal() {
      document.getElementById("modalErro").style.display = "none";
    }

    window.onclick = function(event) {
      const modal = document.getElementById("modalErro");
      if (event.target === modal) {
        fecharModal();
      }
    }

    function validarFormulario() {
      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email").value.trim();
      const celular = document.getElementById("celular").value.trim();
      const cpf = document.getElementById("cpf").value.replace(/\D/g, "");
      const senha = document.getElementById("senha").value;
      const confirmarSenha = document.getElementById("confirmarSenha").value;

      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const numerosCelular = celular.replace(/\D/g, "");
      const regexSenhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{8,}$/;

      if (nome.length < 3) {
        mostrarModal("Digite um nome completo válido.");
        return false;
      }

      if (!regexEmail.test(email)) {
        mostrarModal("Digite um e-mail válido.");
        return false;
      }

      if (numerosCelular.length < 10 || numerosCelular.length > 11) {
        mostrarModal("Digite um celular válido com DDD.");
        return false;
      }

      if (!cpfValido(cpf)) {
        mostrarModal("Digite um CPF válido.");
        return false;
      }

      if (!regexSenhaForte.test(senha)) {
        mostrarModal("A senha deve ter no mínimo 8 caracteres, incluindo maiúscula, minúscula, número e símbolo.");
        return false;
      }

      if (senha !== confirmarSenha) {
        mostrarModal("As senhas não coincidem.");
        return false;
      }

      return true;
    }

    // Máscara de celular
    function cpfValido(cpf) {
      if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

      for (let tamanho = 9; tamanho < 11; tamanho++) {
        let soma = 0;

        for (let indice = 0; indice < tamanho; indice++) {
          soma += Number(cpf[indice]) * ((tamanho + 1) - indice);
        }

        const digito = ((10 * soma) % 11) % 10;
        if (Number(cpf[tamanho]) !== digito) return false;
      }

      return true;
    }

    document.getElementById("celular").addEventListener("input", function(e) {
      let valor = e.target.value.replace(/\D/g, "");

      if (valor.length > 11) valor = valor.slice(0, 11);

      if (valor.length > 10) {
        valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
      } else if (valor.length > 6) {
        valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
      } else if (valor.length > 2) {
        valor = valor.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
      } else {
        valor = valor.replace(/^(\d*)/, "($1");
      }

      e.target.value = valor;
    });

    document.getElementById("cpf").addEventListener("input", function(e) {
      let valor = e.target.value.replace(/\D/g, "").slice(0, 11);
      valor = valor.replace(/^(\d{3})(\d)/, "$1.$2");
      valor = valor.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
      valor = valor.replace(/\.(\d{3})(\d)/, ".$1-$2");
      e.target.value = valor;
    });
