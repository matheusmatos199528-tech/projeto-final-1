<?php

declare(strict_types=1);

require_once __DIR__ . '/config/session.php';
require_once __DIR__ . '/config/conn.php';

header('Content-Type: application/json; charset=UTF-8');

function responderJson(array $dados, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($dados, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $resultado = $con->query(
        "SELECT l.id, l.nome, l.tipo, l.endereco, l.latitude, l.longitude,
                l.deficiencia, l.avaliacao, l.comentario, l.recursos, l.status,
                l.data_cadastro, u.nome AS usuario_nome
         FROM locais l
         INNER JOIN usuarios u ON u.id = l.usuario_id
         WHERE l.status IN ('pendente', 'aprovado')
         ORDER BY l.data_cadastro DESC"
    );

    $locais = [];
    while ($linha = $resultado->fetch_assoc()) {
        $linha['id'] = (int) $linha['id'];
        $linha['lat'] = (float) $linha['latitude'];
        $linha['lng'] = (float) $linha['longitude'];
        $linha['avaliacao'] = (int) $linha['avaliacao'];
        $linha['recursos'] = json_decode($linha['recursos'], true) ?: [];
        unset($linha['latitude'], $linha['longitude']);
        $locais[] = $linha;
    }

    responderJson(['locais' => $locais]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responderJson(['erro' => 'Método não permitido.'], 405);
}

if (!isset($_SESSION['usuario_id'])) {
    responderJson(['erro' => 'Faça login para adicionar um local.'], 401);
}

$entrada = json_decode(file_get_contents('php://input'), true);
if (!is_array($entrada)) {
    responderJson(['erro' => 'Dados inválidos.'], 400);
}

$token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
if (!csrfValido($token)) {
    responderJson(['erro' => 'Solicitação inválida. Atualize a página.'], 403);
}

$nome = trim((string) ($entrada['nome'] ?? ''));
$tipo = (string) ($entrada['tipo'] ?? '');
$endereco = trim((string) ($entrada['endereco'] ?? ''));
$deficiencia = (string) ($entrada['deficiencia'] ?? '');
$avaliacao = filter_var($entrada['avaliacao'] ?? null, FILTER_VALIDATE_INT);
$comentario = trim((string) ($entrada['comentario'] ?? ''));
$lat = filter_var($entrada['lat'] ?? null, FILTER_VALIDATE_FLOAT);
$lng = filter_var($entrada['lng'] ?? null, FILTER_VALIDATE_FLOAT);
$recursos = array_values(array_filter($entrada['recursos'] ?? [], 'is_string'));

$tiposValidos = ['restaurante', 'loja', 'shopping', 'hospital', 'outro'];
$deficienciasValidas = ['fisica', 'visual', 'auditiva', 'intelectual', 'todas'];

if (mb_strlen($nome) < 3 || mb_strlen($nome) > 150
    || mb_strlen($endereco) < 5 || mb_strlen($endereco) > 255
    || !in_array($tipo, $tiposValidos, true)
    || !in_array($deficiencia, $deficienciasValidas, true)
    || $avaliacao === false || $avaliacao < 1 || $avaliacao > 5
    || mb_strlen($comentario) < 10 || mb_strlen($comentario) > 1000
    || $lat === false || $lat < -90 || $lat > 90
    || $lng === false || $lng < -180 || $lng > 180
    || count($recursos) > 20) {
    responderJson(['erro' => 'Revise os dados informados.'], 422);
}

$recursosJson = json_encode($recursos, JSON_UNESCAPED_UNICODE);
$usuarioId = (int) $_SESSION['usuario_id'];
$stmt = $con->prepare(
    'INSERT INTO locais
     (usuario_id, nome, tipo, endereco, latitude, longitude, deficiencia, avaliacao, comentario, recursos)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);
$stmt->bind_param('isssddsiss', $usuarioId, $nome, $tipo, $endereco, $lat, $lng, $deficiencia, $avaliacao, $comentario, $recursosJson);
$stmt->execute();

responderJson(['sucesso' => true, 'id' => $stmt->insert_id], 201);
