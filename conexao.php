<?php

$servidor = "localhost";
$usuario = "root";
$senha = "";
$banco = "inclucity_db";

$con = new mysqli($servidor, $usuario, $senha, $banco);

if ($con->connect_error) {
    die("Erro na conexão com o banco de dados: " . $con->connect_error);
}

$con->set_charset("utf8mb4");

?>