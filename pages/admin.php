<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/config/admin.php';
require_once dirname(__DIR__) . '/config/conn.php';
exigirAdmin();

$sql = "SELECT l.*, u.nome AS usuario_nome, u.email AS usuario_email,
        GROUP_CONCAT(f.arquivo ORDER BY f.id SEPARATOR '||') AS fotos
        FROM locais l
        LEFT JOIN usuarios u ON u.id = l.usuario_id
        LEFT JOIN local_fotos f ON f.local_id = l.id
        GROUP BY l.id
        ORDER BY FIELD(l.status, 'pendente', 'em_analise', 'mais_informacoes', 'aprovado', 'reprovado'), l.data_cadastro DESC";
$locais = $con->query($sql)->fetch_all(MYSQLI_ASSOC);

function e(string|null $valor): string
{
    return htmlspecialchars((string) $valor, ENT_QUOTES, 'UTF-8');
}

$contadores = array_fill_keys(['todos', 'pendente', 'aprovado', 'outros'], 0);
foreach ($locais as $local) {
    $contadores['todos']++;
    if ($local['status'] === 'pendente') $contadores['pendente']++;
    elseif ($local['status'] === 'aprovado') $contadores['aprovado']++;
    else $contadores['outros']++;
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="<?= e(csrfToken()) ?>">
  <title>Painel administrativo — IncluCity</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="../assets/css/admin.css?v=1">
</head>
<body>
  <header class="topo-admin">
    <a href="TelaInicial.php" class="marca"><img src="../assets/img/Imagem1.png" alt="IncluCity"><span>IncluCity</span></a>
    <div class="admin-identidade"><span>Administrador</span><strong><?= e($_SESSION['usuario_nome'] ?? '') ?></strong>
      <form action="../actions/logout.php" method="POST"><input type="hidden" name="csrf_token" value="<?= e(csrfToken()) ?>"><button type="submit">Sair</button></form>
    </div>
  </header>

  <main class="admin-container">
    <section class="cabecalho-painel">
      <div><span class="rotulo">MODERAÇÃO</span><h1>Solicitações de locais</h1><p>Analise as informações enviadas antes de publicá-las no mapa.</p></div>
      <a href="mapa.php" class="link-mapa"><i class="fa-solid fa-map"></i> Abrir mapa</a>
    </section>

    <section class="resumo" aria-label="Resumo das solicitações">
      <article><span>Total</span><strong><?= $contadores['todos'] ?></strong></article>
      <article class="pendentes"><span>Pendentes</span><strong><?= $contadores['pendente'] ?></strong></article>
      <article class="aprovados"><span>Aprovados</span><strong><?= $contadores['aprovado'] ?></strong></article>
      <article><span>Outros status</span><strong><?= $contadores['outros'] ?></strong></article>
    </section>

    <section class="barra-filtros">
      <label><i class="fa-solid fa-magnifying-glass"></i><input id="buscaAdmin" type="search" placeholder="Buscar por nome, bairro ou cidade"></label>
      <select id="statusAdmin" aria-label="Filtrar por status">
        <option value="todos">Todos os status</option><option value="pendente">Pendentes</option><option value="aprovado">Aprovados</option><option value="outros">Outros status</option>
      </select>
    </section>

    <p id="mensagemAdmin" class="mensagem" role="status" aria-live="polite"></p>
    <section id="listaAdmin" class="lista-admin">
      <?php foreach ($locais as $local):
        $categorias = json_decode($local['categorias'], true) ?: [];
        $recursos = json_decode($local['recursos'], true) ?: [];
        $fotos = $local['fotos'] ? explode('||', $local['fotos']) : [];
        $busca = strtolower($local['nome'] . ' ' . $local['bairro'] . ' ' . $local['cidade']);
      ?>
        <article class="solicitacao" data-id="<?= (int) $local['id'] ?>" data-status="<?= e($local['status']) ?>" data-busca="<?= e($busca) ?>">
          <div class="solicitacao-topo">
            <div><span class="status status-<?= e($local['status']) ?>"><?= e(str_replace('_', ' ', $local['status'])) ?></span><h2><?= e($local['nome']) ?></h2><p><i class="fa-solid fa-location-dot"></i> <?= e($local['endereco']) ?>, <?= e($local['numero']) ?> — <?= e($local['bairro']) ?>, <?= e($local['cidade']) ?>/<?= e($local['estado']) ?></p></div>
            <time datetime="<?= e($local['data_cadastro']) ?>"><?= date('d/m/Y H:i', strtotime($local['data_cadastro'])) ?></time>
          </div>
          <div class="detalhes-grid">
            <div><h3>Categorias</h3><div class="chips"><?php foreach ($categorias as $item): ?><span><?= e($item) ?></span><?php endforeach; ?></div></div>
            <div><h3>Recursos informados</h3><div class="chips recursos"><?php foreach ($recursos as $item): ?><span><?= e($item) ?></span><?php endforeach; ?></div></div>
            <div><h3>Responsável pelo envio</h3><p><?= e($local['usuario_nome'] ?: 'Visitante') ?><br><small><?= e($local['usuario_email']) ?></small></p></div>
            <div><h3>Observações</h3><p><?= e($local['observacoes'] ?: 'Nenhuma observação informada.') ?></p></div>
          </div>
          <?php if ($fotos): ?><div class="galeria"><?php foreach ($fotos as $foto): ?><a href="../<?= e($foto) ?>" target="_blank"><img src="../<?= e($foto) ?>" alt="Evidência enviada para <?= e($local['nome']) ?>"></a><?php endforeach; ?></div><?php endif; ?>
          <div class="acoes">
            <?php if ($local['status'] !== 'aprovado'): ?><button class="btn-aprovar" data-acao="aprovar"><i class="fa-solid fa-check"></i> Aprovar e publicar</button><?php endif; ?>
            <button class="btn-excluir" data-acao="excluir"><i class="fa-regular fa-trash-can"></i> Excluir</button>
          </div>
        </article>
      <?php endforeach; ?>
      <p id="semResultados" class="sem-resultados" hidden>Nenhuma solicitação encontrada.</p>
    </section>
  </main>
  <script src="../assets/js/admin.js?v=1"></script>
</body>
</html>
