<?php

include "conexao.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: cadastro.php");
    exit;
}

$nome = trim($_POST["nome"] ?? "");
$email = trim($_POST["email"] ?? "");
$celular = trim($_POST["celular"] ?? "");
$cpf = trim($_POST["cpf"] ?? "");
$senha = $_POST["senha"] ?? "";

if ($nome === "" || $email === "" || $celular === "" || $cpf === "" || $senha === "") {
    die("Todos os campos são obrigatórios.");
}

$senhaCriptografada = password_hash($senha, PASSWORD_DEFAULT);

$sql = "INSERT INTO usuarios (nome, email, celular, cpf, senha)
        VALUES (?, ?, ?, ?, ?)";

$stmt = $con->prepare($sql);

$stmt->bind_param(
    "sssss",
    $nome,
    $email,
    $celular,
    $cpf,
    $senhaCriptografada
);

if ($stmt->execute()) {

    echo "Cadastro realizado com sucesso!";

} else {

    echo "Erro ao realizar cadastro: " . $stmt->error;

}

$stmt->close();
$con->close();

?>