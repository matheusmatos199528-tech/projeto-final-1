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


/* Verificar campos */

if ($nome === "" || $email === "" || $celular === "" || $cpf === "" || $senha === "") {

    echo "<script>
        alert('Preencha todos os campos.');
        window.location.href = 'cadastro.php';
    </script>";

    exit;
}


/* Verificar se o e-mail já existe */

$sql = "SELECT id FROM usuarios WHERE email = ?";

$stmt = $con->prepare($sql);

$stmt->bind_param("s", $email);

$stmt->execute();

$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {

    echo "<script>
        alert('Este e-mail já está cadastrado.');
        window.location.href = 'cadastro.php';
    </script>";

    $stmt->close();
    $con->close();

    exit;
}

$stmt->close();


/* Verificar se o CPF já existe */

$sql = "SELECT id FROM usuarios WHERE cpf = ?";

$stmt = $con->prepare($sql);

$stmt->bind_param("s", $cpf);

$stmt->execute();

$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {

    echo "<script>
        alert('Este CPF já está cadastrado.');
        window.location.href = 'cadastro.php';
    </script>";

    $stmt->close();
    $con->close();

    exit;
}

$stmt->close();


/* Criptografar senha */

$senhaCriptografada = password_hash($senha, PASSWORD_DEFAULT);


/* Cadastrar usuário */

$sql = "INSERT INTO usuarios 
        (nome, email, celular, cpf, senha)
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

    echo "<script>
        alert('Cadastro realizado com sucesso!');
        window.location.href = 'login.php';
    </script>";

} else {

    echo "<script>
        alert('Erro ao realizar cadastro.');
        window.location.href = 'cadastro.php';
    </script>";
}


$stmt->close();
$con->close();

?>