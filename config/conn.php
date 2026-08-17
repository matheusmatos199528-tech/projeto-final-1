<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/vendor/autoload.php';

use Dotenv\Dotenv;

/*
 * Conexão centralizada com o banco de dados.
 * Em produção, defina estas credenciais no ambiente do servidor.
 */
$dotenv = Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();

$servidor = $_ENV['DB_HOST'];
$porta = (int) $_ENV['DB_PORT'];
$banco = $_ENV['DB_NAME'];
$usuario = $_ENV['DB_USER'];
$senha = $_ENV['DB_PASSWORD'];

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $con = new mysqli($servidor, $usuario, $senha, $banco, $porta);
    $con->set_charset('utf8mb4');
} catch (mysqli_sql_exception $erro) {
    error_log('Erro na conexão com o banco: ' . $erro->getMessage());
    http_response_code(500);
    exit('Não foi possível conectar ao banco de dados.');
}
