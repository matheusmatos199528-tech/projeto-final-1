<?php

declare(strict_types=1);

require_once __DIR__ . '/config/session.php';
require_once __DIR__ . '/conexao.php';

$erro = '';
$mensagem = '';
$codigoDesenvolvimento = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['emailCelular'])) {
    exigirCsrf();
    $identificador = trim((string) $_POST['emailCelular']);
    $solicitacoes = array_values(array_filter(
        $_SESSION['recuperacao_solicitacoes'] ?? [],
        static fn (int $instante): bool => $instante > time() - 900
    ));

    if ($identificador === '') {
        $erro = 'Informe seu e-mail ou celular.';
    } elseif (count($solicitacoes) >= 3) {
        $erro = 'Muitas solicitações. Aguarde alguns minutos e tente novamente.';
    } else {
        $solicitacoes[] = time();
        $_SESSION['recuperacao_solicitacoes'] = $solicitacoes;

        $stmt = $con->prepare('SELECT email FROM usuarios WHERE email = ? OR celular = ? LIMIT 1');
        $stmt->bind_param('ss', $identificador, $identificador);
        $stmt->execute();
        $usuario = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        $codigo = (string) random_int(100000, 999999);
        $_SESSION['email_recuperacao'] = $usuario['email'] ?? '__conta_inexistente__';
        $_SESSION['codigo_recuperacao_hash'] = password_hash($usuario ? $codigo : bin2hex(random_bytes(16)), PASSWORD_DEFAULT);
        $_SESSION['codigo_recuperacao_expira'] = time() + 600;
        $_SESSION['recuperacao_verificada'] = false;
        $_SESSION['recuperacao_tentativas'] = 0;
        $mensagem = 'Se os dados estiverem cadastrados, enviaremos um código válido por 10 minutos.';

        if ($usuario) {
            $ambiente = $_ENV['APP_ENV'] ?? 'production';
            $entrega = $_ENV['RECOVERY_DELIVERY'] ?? 'mail';

            if ($ambiente === 'development' && $entrega === 'screen') {
                $codigoDesenvolvimento = $codigo;
            } else {
                $assunto = 'Código de recuperação - IncluCity';
                $corpo = "Seu código de recuperação é: {$codigo}\nEle expira em 10 minutos.";
                $remetente = $_ENV['MAIL_FROM'] ?? 'no-reply@inclucity.local';
                $cabecalhos = "From: IncluCity <{$remetente}>\r\nContent-Type: text/plain; charset=UTF-8";
                if (!mail($usuario['email'], $assunto, $corpo, $cabecalhos)) {
                    error_log('Falha ao enviar código de recuperação para o e-mail cadastrado.');
                }
            }
        }
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['codigo'])) {
    exigirCsrf();
    $codigoInformado = trim((string) $_POST['codigo']);
    $hash = (string) ($_SESSION['codigo_recuperacao_hash'] ?? '');
    $expira = (int) ($_SESSION['codigo_recuperacao_expira'] ?? 0);
    $tentativas = (int) ($_SESSION['recuperacao_tentativas'] ?? 0);

    if (!isset($_SESSION['email_recuperacao']) || $hash === '') {
        $erro = 'Solicite um novo código de recuperação.';
    } elseif ($tentativas >= 5) {
        $erro = 'Limite de tentativas atingido. Solicite um novo código.';
        unset($_SESSION['codigo_recuperacao_hash'], $_SESSION['codigo_recuperacao_expira']);
    } elseif (time() > $expira) {
        $erro = 'O código expirou. Solicite um novo código.';
        unset($_SESSION['codigo_recuperacao_hash'], $_SESSION['codigo_recuperacao_expira']);
    } elseif (!password_verify($codigoInformado, $hash)) {
        $_SESSION['recuperacao_tentativas'] = $tentativas + 1;
        $erro = 'Código inválido.';
    } else {
        $_SESSION['recuperacao_verificada'] = true;
        unset($_SESSION['codigo_recuperacao_hash'], $_SESSION['codigo_recuperacao_expira'], $_SESSION['recuperacao_tentativas']);
        header('Location: nova.senha.php');
        exit;
    }
} elseif (!isset($_SESSION['email_recuperacao'])) {
    header('Location: esqueceu.senha.php');
    exit;
}

$con->close();
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Código de recuperação</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="./assets/css/codigo.recuperacao.css">
</head>
<body>
  <div class="container">
    <img class="login-img" src="./assets/img/Imagem1.png" alt="Código de recuperação">
    <?php if ($erro !== ''): ?>
      <div class="alert alert-danger" role="alert"><?= htmlspecialchars($erro, ENT_QUOTES, 'UTF-8') ?></div>
    <?php endif; ?>
    <?php if ($mensagem !== ''): ?>
      <div class="alert alert-info" role="status"><?= htmlspecialchars($mensagem, ENT_QUOTES, 'UTF-8') ?></div>
    <?php endif; ?>
    <?php if ($codigoDesenvolvimento !== ''): ?>
      <div class="alert alert-warning" role="status">
        Ambiente de desenvolvimento — código: <strong><?= htmlspecialchars($codigoDesenvolvimento, ENT_QUOTES, 'UTF-8') ?></strong>
      </div>
    <?php endif; ?>
    <?php if (isset($_SESSION['email_recuperacao'])): ?>
      <form class="form" action="codigo.recuperacao.php" method="POST">
        <input type="hidden" name="csrf_token" value="<?= htmlspecialchars(tokenCsrf(), ENT_QUOTES, 'UTF-8') ?>">
        <input placeholder="Digite o código" id="codigo" name="codigo" type="text" class="input" required
          inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="one-time-code"
          title="O código deve conter exatamente 6 números.">
        <button type="submit" class="login-button">Confirmar código</button>
      </form>
    <?php else: ?>
      <a href="esqueceu.senha.php" class="btn btn-primary">Solicitar novo código</a>
    <?php endif; ?>
  </div>
</body>
</html>
