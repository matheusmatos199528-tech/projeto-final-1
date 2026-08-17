<?php

declare(strict_types=1);

require_once __DIR__ . '/config/session.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: TelaUsuario.php');
    exit;
}

exigirCsrf();

$_SESSION = [];

if (ini_get('session.use_cookies')) {
    $parametros = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $parametros['path'], '', $parametros['secure'], $parametros['httponly']);
}

session_destroy();
header('Location: login.php');
exit;
