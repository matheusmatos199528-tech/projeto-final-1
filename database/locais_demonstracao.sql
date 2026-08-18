USE `inclucity_db`;

-- Locais fictícios para demonstrar o mapa e seus filtros.
-- O WHERE NOT EXISTS permite executar este arquivo mais de uma vez sem duplicar registros.

INSERT INTO `locais`
  (`usuario_id`, `nome`, `endereco`, `numero`, `bairro`, `cidade`, `estado`, `cep`, `latitude`, `longitude`, `categorias`, `recursos`, `observacoes`, `status`)
SELECT NULL, 'Café Inclusivo (Demonstração)', 'Avenida São João', '100', 'Jardim Esplanada', 'São José dos Campos', 'SP', '12242000', -23.1969000, -45.8958000,
  '["Restaurante"]',
  '["Rampa de acesso","Entrada acessível","Banheiro acessível","Braile","Cão-guia permitido"]',
  'Local fictício criado somente para demonstrar o funcionamento dos filtros do IncluCity.', 'aprovado'
WHERE NOT EXISTS (SELECT 1 FROM `locais` WHERE `nome` = 'Café Inclusivo (Demonstração)');

INSERT INTO `locais`
  (`usuario_id`, `nome`, `endereco`, `numero`, `bairro`, `cidade`, `estado`, `cep`, `latitude`, `longitude`, `categorias`, `recursos`, `observacoes`, `status`)
SELECT NULL, 'Shopping Acessível (Demonstração)', 'Avenida Andrômeda', '500', 'Jardim Satélite', 'São José dos Campos', 'SP', '12230000', -23.2246000, -45.8907000,
  '["Shopping","Comércio"]',
  '["Rampa de acesso","Elevador acessível","Banheiro acessível","Vaga acessível","Piso tátil","Espaço para cadeira de rodas"]',
  'Local fictício criado somente para demonstrar o funcionamento dos filtros do IncluCity.', 'aprovado'
WHERE NOT EXISTS (SELECT 1 FROM `locais` WHERE `nome` = 'Shopping Acessível (Demonstração)');

INSERT INTO `locais`
  (`usuario_id`, `nome`, `endereco`, `numero`, `bairro`, `cidade`, `estado`, `cep`, `latitude`, `longitude`, `categorias`, `recursos`, `observacoes`, `status`)
SELECT NULL, 'Centro Cultural para Todos (Demonstração)', 'Praça Afonso Pena', '50', 'Centro', 'São José dos Campos', 'SP', '12210090', -23.1865000, -45.8841000,
  '["Espaço cultural","Instituição/serviço"]',
  '["Libras","Audiodescrição","Piso tátil","Comunicação acessível","Sala de conforto"]',
  'Local fictício criado somente para demonstrar o funcionamento dos filtros do IncluCity.', 'aprovado'
WHERE NOT EXISTS (SELECT 1 FROM `locais` WHERE `nome` = 'Centro Cultural para Todos (Demonstração)');

INSERT INTO `locais`
  (`usuario_id`, `nome`, `endereco`, `numero`, `bairro`, `cidade`, `estado`, `cep`, `latitude`, `longitude`, `categorias`, `recursos`, `observacoes`, `status`)
SELECT NULL, 'Igreja Comunidade Aberta (Demonstração)', 'Rua Paraibuna', '300', 'Jardim São Dimas', 'São José dos Campos', 'SP', '12245120', -23.2024000, -45.8898000,
  '["Igreja"]',
  '["Entrada acessível","Rampa de acesso","Libras","Atendimento prioritário","Vaga acessível"]',
  'Local fictício criado somente para demonstrar o funcionamento dos filtros do IncluCity.', 'aprovado'
WHERE NOT EXISTS (SELECT 1 FROM `locais` WHERE `nome` = 'Igreja Comunidade Aberta (Demonstração)');

INSERT INTO `locais`
  (`usuario_id`, `nome`, `endereco`, `numero`, `bairro`, `cidade`, `estado`, `cep`, `latitude`, `longitude`, `categorias`, `recursos`, `observacoes`, `status`)
SELECT NULL, 'Instituto Cidadania (Demonstração)', 'Avenida Cassiano Ricardo', '800', 'Parque Residencial Aquarius', 'São José dos Campos', 'SP', '12246000', -23.2137000, -45.9108000,
  '["Instituição/serviço","Órgão público"]',
  '["Balcão acessível","Sinalização acessível","Braile","Libras","Comunicação acessível","Atendimento prioritário"]',
  'Local fictício criado somente para demonstrar o funcionamento dos filtros do IncluCity.', 'aprovado'
WHERE NOT EXISTS (SELECT 1 FROM `locais` WHERE `nome` = 'Instituto Cidadania (Demonstração)');
