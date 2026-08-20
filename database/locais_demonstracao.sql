USE `inclucity_db`;

-- Locais fictícios para demonstrar o mapa e seus filtros.
-- O WHERE NOT EXISTS permite executar este arquivo mais de uma vez sem duplicar registros.

-- Usa uma conta cadastrada como responsável pelos registros demonstrativos.
SET @usuario_demonstracao = (
  SELECT `id` FROM `usuarios`
  ORDER BY (`tipo_usuario` = 'admin') DESC, `id`
  LIMIT 1
);

INSERT INTO `locais`
  (`usuario_id`, `nome`, `endereco`, `numero`, `bairro`, `cidade`, `estado`, `cep`, `latitude`, `longitude`, `categorias`, `recursos`, `observacoes`, `status`)
SELECT @usuario_demonstracao, 'Café Inclusivo (Demonstração)', 'Avenida São João', '100', 'Jardim Esplanada', 'São José dos Campos', 'SP', '12242000', -23.1969000, -45.8958000,
  '["Restaurante"]',
  '["Rampa de acesso","Entrada acessível","Banheiro acessível","Braile","Cão-guia permitido"]',
  'Local fictício criado somente para demonstrar o funcionamento dos filtros do IncluCity.', 'aprovado'
WHERE NOT EXISTS (SELECT 1 FROM `locais` WHERE `nome` = 'Café Inclusivo (Demonstração)');

INSERT INTO `locais`
  (`usuario_id`, `nome`, `endereco`, `numero`, `bairro`, `cidade`, `estado`, `cep`, `latitude`, `longitude`, `categorias`, `recursos`, `observacoes`, `status`)
SELECT @usuario_demonstracao, 'Shopping Acessível (Demonstração)', 'Avenida Andrômeda', '500', 'Jardim Satélite', 'São José dos Campos', 'SP', '12230000', -23.2246000, -45.8907000,
  '["Shopping","Comércio"]',
  '["Rampa de acesso","Elevador acessível","Banheiro acessível","Vaga acessível","Piso tátil","Espaço para cadeira de rodas"]',
  'Local fictício criado somente para demonstrar o funcionamento dos filtros do IncluCity.', 'aprovado'
WHERE NOT EXISTS (SELECT 1 FROM `locais` WHERE `nome` = 'Shopping Acessível (Demonstração)');

INSERT INTO `locais`
  (`usuario_id`, `nome`, `endereco`, `numero`, `bairro`, `cidade`, `estado`, `cep`, `latitude`, `longitude`, `categorias`, `recursos`, `observacoes`, `status`)
SELECT @usuario_demonstracao, 'Centro Cultural para Todos (Demonstração)', 'Praça Afonso Pena', '50', 'Centro', 'São José dos Campos', 'SP', '12210090', -23.1865000, -45.8841000,
  '["Espaço cultural","Instituição/serviço"]',
  '["Libras","Audiodescrição","Piso tátil","Comunicação acessível","Sala de conforto"]',
  'Local fictício criado somente para demonstrar o funcionamento dos filtros do IncluCity.', 'aprovado'
WHERE NOT EXISTS (SELECT 1 FROM `locais` WHERE `nome` = 'Centro Cultural para Todos (Demonstração)');

INSERT INTO `locais`
  (`usuario_id`, `nome`, `endereco`, `numero`, `bairro`, `cidade`, `estado`, `cep`, `latitude`, `longitude`, `categorias`, `recursos`, `observacoes`, `status`)
SELECT @usuario_demonstracao, 'Igreja Comunidade Aberta (Demonstração)', 'Rua Paraibuna', '300', 'Jardim São Dimas', 'São José dos Campos', 'SP', '12245120', -23.2024000, -45.8898000,
  '["Igreja"]',
  '["Entrada acessível","Rampa de acesso","Libras","Atendimento prioritário","Vaga acessível"]',
  'Local fictício criado somente para demonstrar o funcionamento dos filtros do IncluCity.', 'aprovado'
WHERE NOT EXISTS (SELECT 1 FROM `locais` WHERE `nome` = 'Igreja Comunidade Aberta (Demonstração)');

INSERT INTO `locais`
  (`usuario_id`, `nome`, `endereco`, `numero`, `bairro`, `cidade`, `estado`, `cep`, `latitude`, `longitude`, `categorias`, `recursos`, `observacoes`, `status`)
SELECT @usuario_demonstracao, 'Instituto Cidadania (Demonstração)', 'Avenida Cassiano Ricardo', '800', 'Parque Residencial Aquarius', 'São José dos Campos', 'SP', '12246000', -23.2137000, -45.9108000,
  '["Instituição/serviço","Órgão público"]',
  '["Balcão acessível","Sinalização acessível","Braile","Libras","Comunicação acessível","Atendimento prioritário"]',
  'Local fictício criado somente para demonstrar o funcionamento dos filtros do IncluCity.', 'aprovado'
WHERE NOT EXISTS (SELECT 1 FROM `locais` WHERE `nome` = 'Instituto Cidadania (Demonstração)');

UPDATE `locais`
SET `usuario_id` = @usuario_demonstracao
WHERE `nome` LIKE '%(Demonstração)'
  AND `usuario_id` IS NULL
  AND @usuario_demonstracao IS NOT NULL;

-- Estados variados para demonstrar a moderação no painel administrativo.
UPDATE `locais`
SET `status` = CASE `nome`
  WHEN 'Shopping Acessível (Demonstração)' THEN 'pendente'
  WHEN 'Igreja Comunidade Aberta (Demonstração)' THEN 'reprovado'
  ELSE 'aprovado'
END
WHERE `nome` IN (
  'Café Inclusivo (Demonstração)',
  'Shopping Acessível (Demonstração)',
  'Centro Cultural para Todos (Demonstração)',
  'Igreja Comunidade Aberta (Demonstração)',
  'Instituto Cidadania (Demonstração)'
);

-- Fotos demonstrativas correspondentes a cada local.
-- Cada SELECT localiza o local pelo nome e evita cadastrar a mesma foto novamente.

INSERT INTO `local_fotos` (`local_id`, `arquivo`)
SELECT l.id, 'assets/uploads/solicitacoes/demo-cafe-inclusivo.png'
FROM `locais` l
WHERE l.nome = 'Café Inclusivo (Demonstração)'
  AND NOT EXISTS (
    SELECT 1 FROM `local_fotos` f
    WHERE f.local_id = l.id AND f.arquivo = 'assets/uploads/solicitacoes/demo-cafe-inclusivo.png'
  );

INSERT INTO `local_fotos` (`local_id`, `arquivo`)
SELECT l.id, 'assets/uploads/solicitacoes/demo-shopping-acessivel.png'
FROM `locais` l
WHERE l.nome = 'Shopping Acessível (Demonstração)'
  AND NOT EXISTS (
    SELECT 1 FROM `local_fotos` f
    WHERE f.local_id = l.id AND f.arquivo = 'assets/uploads/solicitacoes/demo-shopping-acessivel.png'
  );

INSERT INTO `local_fotos` (`local_id`, `arquivo`)
SELECT l.id, 'assets/uploads/solicitacoes/demo-centro-cultural.png'
FROM `locais` l
WHERE l.nome = 'Centro Cultural para Todos (Demonstração)'
  AND NOT EXISTS (
    SELECT 1 FROM `local_fotos` f
    WHERE f.local_id = l.id AND f.arquivo = 'assets/uploads/solicitacoes/demo-centro-cultural.png'
  );

INSERT INTO `local_fotos` (`local_id`, `arquivo`)
SELECT l.id, 'assets/uploads/solicitacoes/demo-igreja-comunidade.png'
FROM `locais` l
WHERE l.nome = 'Igreja Comunidade Aberta (Demonstração)'
  AND NOT EXISTS (
    SELECT 1 FROM `local_fotos` f
    WHERE f.local_id = l.id AND f.arquivo = 'assets/uploads/solicitacoes/demo-igreja-comunidade.png'
  );

INSERT INTO `local_fotos` (`local_id`, `arquivo`)
SELECT l.id, 'assets/uploads/solicitacoes/demo-instituto-cidadania.png'
FROM `locais` l
WHERE l.nome = 'Instituto Cidadania (Demonstração)'
  AND NOT EXISTS (
    SELECT 1 FROM `local_fotos` f
    WHERE f.local_id = l.id AND f.arquivo = 'assets/uploads/solicitacoes/demo-instituto-cidadania.png'
  );
