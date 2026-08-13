<?php

<<<<<<< HEAD
require_once __DIR__ . '/vendor/autoload.php';
use Dotenv\Dotenv;
$dotenv = 
Dotenv::createImmutable(__DIR__);
$dotenv->load();


$servidor = $_ENV['DB_HOST']; 
$porta = $_ENV['DB_PORT'];
$banco = $_ENV['DB_NAME'];
$usuario = $_ENV['DB_USER'];
$senha = $_ENV['DB_PASSWORD'];

$con = new mysqli($servidor, $usuario, $senha, $banco, $porta);

if ($con->connect_error) {
    die("Erro na conexão com o banco de dados.");
}

$con->set_charset("utf8mb4");

?>


=======
// Mantido para compatibilidade com arquivos antigos.
require_once __DIR__ . '/config/conn.php';
>>>>>>> 55fd9d83b33705d47ce3b9f494b0767d8f9d7a98
