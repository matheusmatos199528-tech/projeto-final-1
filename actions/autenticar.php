<?php

require_once dirname(__DIR__) . '/config/session.php';
require_once dirname(__DIR__) . '/config/conn.php';


/*
|--------------------------------------------------------------------------
| Verificar se o formulário foi enviado
|--------------------------------------------------------------------------
*/

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    header("Location: ../pages/login.php");
    exit;
}

exigirCsrf();

$tentativasLogin = array_values(array_filter(
    $_SESSION['tentativas_login'] ?? [],
    static fn (int $instante): bool => $instante > time() - 900
));

if (count($tentativasLogin) >= 5) {
    http_response_code(429);
    exit('Muitas tentativas de login. Aguarde 15 minutos e tente novamente.');
}


/*
|--------------------------------------------------------------------------
| Receber dados
|--------------------------------------------------------------------------
*/

$login = trim((string) ($_POST["login"] ?? ""));
$senha = $_POST["senha"] ?? "";
$cpfSemMascara = preg_replace('/\D/', '', $login) ?? '';


/*
|--------------------------------------------------------------------------
| Verificar campos
|--------------------------------------------------------------------------
*/

if ($login === "" || $senha === "") {

    echo "<script>
        alert('Preencha o usuário e a senha.');
        window.location.href = '../pages/login.php';
    </script>";

    exit;
}


/*
|--------------------------------------------------------------------------
| Procurar usuário por e-mail ou CPF
|--------------------------------------------------------------------------
*/

$sql = "SELECT id, nome, email, celular, cpf, senha
        FROM usuarios
        WHERE email = ? OR REPLACE(REPLACE(cpf, '.', ''), '-', '') = ?
        LIMIT 1";

$stmt = $con->prepare($sql);

$stmt->bind_param("ss", $login, $cpfSemMascara);

$stmt->execute();

$resultado = $stmt->get_result();


/*
|--------------------------------------------------------------------------
| Verificar se usuário existe
|--------------------------------------------------------------------------
*/

if ($resultado->num_rows === 0) {

    $tentativasLogin[] = time();
    $_SESSION['tentativas_login'] = $tentativasLogin;

    echo "<script>
        alert('E-mail, CPF ou senha incorretos.');
        window.location.href = '../pages/login.php';
    </script>";

    $stmt->close();
    $con->close();

    exit;
}


/*
|--------------------------------------------------------------------------
| Pegar dados do usuário
|--------------------------------------------------------------------------
*/

$usuario = $resultado->fetch_assoc();


/*
|--------------------------------------------------------------------------
| Verificar senha
|--------------------------------------------------------------------------
*/

if (!password_verify($senha, $usuario["senha"])) {

    $tentativasLogin[] = time();
    $_SESSION['tentativas_login'] = $tentativasLogin;

    echo "<script>
        alert('E-mail, CPF ou senha incorretos.');
        window.location.href = '../pages/login.php';
    </script>";

    $stmt->close();
    $con->close();

    exit;
}


/*
|--------------------------------------------------------------------------
| Criar sessão
|--------------------------------------------------------------------------
*/

$_SESSION["usuario_id"] = $usuario["id"];
$_SESSION["usuario_nome"] = $usuario["nome"];
$_SESSION["usuario_email"] = $usuario["email"];
$_SESSION["usuario_celular"] = $usuario["celular"];
$_SESSION["usuario_cpf"] = $usuario["cpf"];
unset($_SESSION['tentativas_login']);
session_regenerate_id(true);


/*
|--------------------------------------------------------------------------
| Login realizado
|--------------------------------------------------------------------------
*/

$stmt->close();
$con->close();

header("Location: ../pages/TelaUsuario.php");
exit;

?>
