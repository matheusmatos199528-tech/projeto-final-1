<?php

declare(strict_types=1);

if (session_status() !== PHP_SESSION_ACTIVE) {
    $diretorioSessoes = dirname(__DIR__) . '/sessions';
    if (!is_dir($diretorioSessoes) && !mkdir($diretorioSessoes, 0700, true) && !is_dir($diretorioSessoes)) {
        throw new RuntimeException('Não foi possível preparar o diretório de sessões.');
    }
    session_save_path($diretorioSessoes);
    ini_set('session.use_strict_mode', '1');
    session_set_cookie_params([
        'httponly' => true,
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'samesite' => 'Lax',
        'path' => '/',
    ]);
    session_start();
}

function tokenCsrf(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    return $_SESSION['csrf_token'];
}

function csrfValido(?string $token): bool
{
    return is_string($token)
        && isset($_SESSION['csrf_token'])
        && hash_equals($_SESSION['csrf_token'], $token);
}

function exigirCsrf(): void
{
    if (!csrfValido($_POST['csrf_token'] ?? null)) {
        http_response_code(403);
        exit('Solicitação inválida. Atualize a página e tente novamente.');
    }
}
