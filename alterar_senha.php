<?php
session_start();
require_once "conexao.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: nova.senha.php");
    exit;
}

$recuperacaoAutorizada = !empty($_SESSION["recuperacao_verificada"])
    && isset($_SESSION["email_recuperacao"]);
$usuarioAutenticado = isset($_SESSION["usuario_id"], $_SESSION["usuario_email"]);

if (!$recuperacaoAutorizada && !$usuarioAutenticado) {
    header("Location: esqueceu.senha.php");
    exit;
}

$email = $recuperacaoAutorizada
    ? $_SESSION["email_recuperacao"]
    : $_SESSION["usuario_email"];
$novaSenha = $_POST["novaSenha"] ?? "";
$confirmarNovaSenha = $_POST["confirmarNovaSenha"] ?? "";

if (strlen($novaSenha) < 8) {
    echo "<script>alert('A senha deve conter pelo menos 8 caracteres.'); history.back();</script>";
    exit;
}

if (!hash_equals($novaSenha, $confirmarNovaSenha)) {
    echo "<script>alert('As senhas não são iguais.'); history.back();</script>";
    exit;
}

$senhaHash = password_hash($novaSenha, PASSWORD_DEFAULT);
$sql = "UPDATE usuarios SET senha = ? WHERE email = ?";
$stmt = $con->prepare($sql);
$stmt->bind_param("ss", $senhaHash, $email);

if (!$stmt->execute()) {
    echo "<script>alert('Erro ao alterar senha.'); history.back();</script>";
    exit;
}

if ($stmt->affected_rows !== 1) {
    echo "<script>alert('Usuário não encontrado ou senha não alterada.'); history.back();</script>";
    exit;
}

$stmt->close();
$con->close();

unset(
    $_SESSION["email_recuperacao"],
    $_SESSION["codigo_recuperacao_hash"],
    $_SESSION["codigo_recuperacao_expira"],
    $_SESSION["recuperacao_verificada"]
);

echo "<script>alert('Senha alterada com sucesso!'); window.location.href = 'login.php';</script>";
exit;
?>
