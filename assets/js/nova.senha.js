function verSenha(id) {
    const campo = document.getElementById(id);

    if (campo.type === "password") {
        campo.type = "text";
    } else {
        campo.type = "password";
    }
}


function validarNovaSenha() {

    const novaSenha = document.getElementById("novaSenha").value;
    const confirmarNovaSenha = document.getElementById("confirmarNovaSenha").value;

    // Verifica se possui pelo menos 8 caracteres
    if (novaSenha.length < 8) {
        alert("A senha deve conter pelo menos 8 caracteres.");
        return false;
    }

    // Verifica se as duas senhas são iguais
    if (novaSenha !== confirmarNovaSenha) {
        alert("As senhas não são iguais.");
        return false;
    }

    return true;
}