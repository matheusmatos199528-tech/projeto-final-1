<?php

declare(strict_types=1);

use Dotenv\Dotenv;

require_once dirname(__DIR__) . '/vendor/autoload.php';

/*
 * Conexão centralizada com o banco de dados.
 * Em produção, defina estas credenciais no ambiente do servidor.
 */
$dotenv = Dotenv::createImmutable(dirname(__DIR__));
$dotenv->safeLoad();

$servidor = $_ENV['DB_HOST'] ?? '';
$porta = filter_var($_ENV['DB_PORT'] ?? 3306, FILTER_VALIDATE_INT) ?: 3306;
$usuario = $_ENV['DB_USER'] ?? '';
$senha = $_ENV['DB_PASSWORD'] ?? '';
$banco = $_ENV['DB_NAME'] ?? '';

if ($servidor === '' || $banco === '' || $usuario === '') {
    error_log('Configuração incompleta do banco de dados.');
    http_response_code(500);
    exit('Não foi possível conectar ao banco de dados.');
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $con = new mysqli($servidor, $usuario, $senha, $banco, $porta);
    $con->set_charset('utf8mb4');
} catch (mysqli_sql_exception $erro) {
    error_log('Erro ao conectar ao MySQL: ' . $erro->getMessage());
    http_response_code(500);
    exit('Não foi possível conectar ao banco de dados.');
}
