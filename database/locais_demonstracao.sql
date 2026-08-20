USE `inclucity_db`;

-- Locais fictícios para demonstrar o mapa e seus filtros.
-- O WHERE NOT EXISTS permite executar este arquivo mais de uma vez sem duplicar registros.

-- Usuários fictícios cadastrados para representar contribuições da comunidade.
-- A senha é um hash aleatório sem senha conhecida e não permite acesso às contas.
INSERT INTO `usuarios` (`nome`, `email`, `celular`, `cpf`, `senha`, `tipo_usuario`)
SELECT 'Mariana Costa', 'mariana.costa@example.com', '(12) 90000-1001', '900.000.001-00', '$2y$10$LAGeRO49Ofa16zB2tp607.rqHlFkiY80lWbtk.las9zBaDHiMRDz.', 'usuario'
WHERE NOT EXISTS (SELECT 1 FROM `usuarios` WHERE `email` = 'mariana.costa@example.com');

INSERT INTO `usuarios` (`nome`, `email`, `celular`, `cpf`, `senha`, `tipo_usuario`)
SELECT 'Rafael Mendes', 'rafael.mendes@example.com', '(12) 90000-1002', '900.000.002-00', '$2y$10$LAGeRO49Ofa16zB2tp607.rqHlFkiY80lWbtk.las9zBaDHiMRDz.', 'usuario'
WHERE NOT EXISTS (SELECT 1 FROM `usuarios` WHERE `email` = 'rafael.mendes@example.com');

INSERT INTO `usuarios` (`nome`, `email`, `celular`, `cpf`, `senha`, `tipo_usuario`)
SELECT 'Camila Nogueira', 'camila.nogueira@example.com', '(12) 90000-1003', '900.000.003-00', '$2y$10$LAGeRO49Ofa16zB2tp607.rqHlFkiY80lWbtk.las9zBaDHiMRDz.', 'usuario'
WHERE NOT EXISTS (SELECT 1 FROM `usuarios` WHERE `email` = 'camila.nogueira@example.com');

SET @usuario_mariana = (SELECT `id` FROM `usuarios` WHERE `email` = 'mariana.costa@example.com' LIMIT 1);
SET @usuario_rafael = (SELECT `id` FROM `usuarios` WHERE `email` = 'rafael.mendes@example.com' LIMIT 1);
SET @usuario_camila = (SELECT `id` FROM `usuarios` WHERE `email` = 'camila.nogueira@example.com' LIMIT 1);

INSERT INTO `locais`
  (`usuario_id`, `nome`, `endereco`, `numero`, `bairro`, `cidade`, `estado`, `cep`, `latitude`, `longitude`, `categorias`, `recursos`, `observacoes`, `status`)
SELECT @usuario_mariana, 'Café Inclusivo (Demonstração)', 'Avenida São João', '100', 'Jardim Esplanada', 'São José dos Campos', 'SP', '12242000', -23.1969000, -45.8958000,
  '["Restaurante"]',
  '["Rampa de acesso","Entrada acessível","Banheiro acessível","Braile","Cão-guia permitido"]',
  'Local fictício criado somente para demonstrar o funcionamento dos filtros do IncluCity.', 'aprovado'
WHERE NOT EXISTS (SELECT 1 FROM `locais` WHERE `nome` = 'Café Inclusivo (Demonstração)');

INSERT INTO `locais`
  (`usuario_id`, `nome`, `endereco`, `numero`, `bairro`, `cidade`, `estado`, `cep`, `latitude`, `longitude`, `categorias`, `recursos`, `observacoes`, `status`)
SELECT @usuario_rafael, 'Shopping Acessível (Demonstração)', 'Avenida Andrômeda', '500', 'Jardim Satélite', 'São José dos Campos', 'SP', '12230000', -23.2246000, -45.8907000,
  '["Shopping","Comércio"]',
  '["Rampa de acesso","Elevador acessível","Banheiro acessível","Vaga acessível","Piso tátil","Espaço para cadeira de rodas"]',
  'Local fictício criado somente para demonstrar o funcionamento dos filtros do IncluCity.', 'aprovado'
WHERE NOT EXISTS (SELECT 1 FROM `locais` WHERE `nome` = 'Shopping Acessível (Demonstração)');

INSERT INTO `locais`
  (`usuario_id`, `nome`, `endereco`, `numero`, `bairro`, `cidade`, `estado`, `cep`, `latitude`, `longitude`, `categorias`, `recursos`, `observacoes`, `status`)
SELECT @usuario_camila, 'Centro Cultural para Todos (Demonstração)', 'Praça Afonso Pena', '50', 'Centro', 'São José dos Campos', 'SP', '12210090', -23.1865000, -45.8841000,
  '["Espaço cultural","Instituição/serviço"]',
  '["Libras","Audiodescrição","Piso tátil","Comunicação acessível","Sala de conforto"]',
  'Local fictício criado somente para demonstrar o funcionamento dos filtros do IncluCity.', 'aprovado'
WHERE NOT EXISTS (SELECT 1 FROM `locais` WHERE `nome` = 'Centro Cultural para Todos (Demonstração)');

INSERT INTO `locais`
  (`usuario_id`, `nome`, `endereco`, `numero`, `bairro`, `cidade`, `estado`, `cep`, `latitude`, `longitude`, `categorias`, `recursos`, `observacoes`, `status`)
SELECT @usuario_mariana, 'Igreja Comunidade Aberta (Demonstração)', 'Rua Paraibuna', '300', 'Jardim São Dimas', 'São José dos Campos', 'SP', '12245120', -23.2024000, -45.8898000,
  '["Igreja"]',
  '["Entrada acessível","Rampa de acesso","Libras","Atendimento prioritário","Vaga acessível"]',
  'Solicitação recusada porque não foram enviadas imagens que comprovem os recursos de acessibilidade informados.', 'reprovado'
WHERE NOT EXISTS (SELECT 1 FROM `locais` WHERE `nome` = 'Igreja Comunidade Aberta (Demonstração)');

INSERT INTO `locais`
  (`usuario_id`, `nome`, `endereco`, `numero`, `bairro`, `cidade`, `estado`, `cep`, `latitude`, `longitude`, `categorias`, `recursos`, `observacoes`, `status`)
SELECT @usuario_rafael, 'Instituto Cidadania (Demonstração)', 'Avenida Cassiano Ricardo', '800', 'Parque Residencial Aquarius', 'São José dos Campos', 'SP', '12246000', -23.2137000, -45.9108000,
  '["Instituição/serviço","Órgão público"]',
  '["Balcão acessível","Sinalização acessível","Braile","Libras","Comunicação acessível","Atendimento prioritário"]',
  'Local fictício criado somente para demonstrar o funcionamento dos filtros do IncluCity.', 'aprovado'
WHERE NOT EXISTS (SELECT 1 FROM `locais` WHERE `nome` = 'Instituto Cidadania (Demonstração)');

UPDATE `locais`
SET `usuario_id` = CASE `nome`
  WHEN 'Café Inclusivo (Demonstração)' THEN @usuario_mariana
  WHEN 'Shopping Acessível (Demonstração)' THEN @usuario_rafael
  WHEN 'Centro Cultural para Todos (Demonstração)' THEN @usuario_camila
  WHEN 'Igreja Comunidade Aberta (Demonstração)' THEN @usuario_mariana
  WHEN 'Instituto Cidadania (Demonstração)' THEN @usuario_rafael
END
WHERE `nome` LIKE '%(Demonstração)';

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

UPDATE `locais`
SET `observacoes` = 'Solicitação recusada porque não foram enviadas imagens que comprovem os recursos de acessibilidade informados.'
WHERE `nome` = 'Igreja Comunidade Aberta (Demonstração)';

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

DELETE f FROM `local_fotos` f
INNER JOIN `locais` l ON l.id = f.local_id
WHERE l.nome = 'Igreja Comunidade Aberta (Demonstração)';

INSERT INTO `local_fotos` (`local_id`, `arquivo`)
SELECT l.id, 'assets/uploads/solicitacoes/demo-instituto-cidadania.png'
FROM `locais` l
WHERE l.nome = 'Instituto Cidadania (Demonstração)'
  AND NOT EXISTS (
    SELECT 1 FROM `local_fotos` f
    WHERE f.local_id = l.id AND f.arquivo = 'assets/uploads/solicitacoes/demo-instituto-cidadania.png'
  );
