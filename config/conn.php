<?php

declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';
use Dotenv\Dotenv;
$dotenv =
Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

/*
 * Conexão centralizada com o banco de dados.
 * Em produção, defina estas credenciais no ambiente do servidor.
 */
$servidor = $_ENV['DB_HOST'] ?? '';
$porta = (int) $_ENV['DB_PORT']?? 3306;
$usuario = $_ENV['DB_USER']?? '';
$senha = $_ENV['DB_PASSWORD']?? '';
$banco = $_ENV['DB_NAME']?? '';

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $con = new mysqli($servidor, $usuario, $senha, $banco, $porta);
    $con->set_charset('utf8mb4');
} catch (mysqli_sql_exception $erro) {
    exit('ERRO MYSQL:' . $erro->getMessage());
}
