<?php

declare(strict_types=1);

/*
 * Conexão centralizada com o banco de dados.
 * Em produção, defina estas credenciais no ambiente do servidor.
 */
$servidor = getenv('DB_HOST') ?: 'localhost';
$porta = (int) (getenv('DB_PORT') ?: 3306);
$usuario = getenv('DB_USER') ?: 'root';
$senha = getenv('DB_PASSWORD') ?: '';
$banco = getenv('DB_NAME') ?: 'inclucity_db';

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $con = new mysqli($servidor, $usuario, $senha, $banco, $porta);
    $con->set_charset('utf8mb4');
} catch (mysqli_sql_exception $erro) {
    error_log('Erro na conexão com o banco: ' . $erro->getMessage());
    http_response_code(500);
    exit('Não foi possível conectar ao banco de dados.');
}
