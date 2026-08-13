# IncluCity

O **IncluCity** é uma aplicação web colaborativa voltada à acessibilidade urbana. A proposta apresentada nas páginas do projeto é reunir informações sobre locais acessíveis, permitir avaliações e ajudar pessoas a navegar pela cidade com mais segurança, autonomia e informação.

## Objetivo

O projeto busca usar tecnologia e colaboração comunitária para divulgar informações de acessibilidade de espaços urbanos. A interface apresenta um mapa, filtros por tipo de deficiência e avaliação, além de um formulário para adicionar locais acessíveis.

## Contexto acadêmico

Este repositório corresponde a um projeto integrador de curso e ainda está em desenvolvimento. O código não informa o nome específico do curso, a turma ou os integrantes; por isso, esses dados não são documentados aqui.

## Tecnologias utilizadas

- **PHP** em estilo procedural para cadastro, autenticação, sessão e conexão com o banco;
- **MariaDB/MySQL** para persistência dos usuários;
- extensão **MySQLi** do PHP, com consultas preparadas;
- **HTML5**, **CSS3** e **JavaScript** puro;
- **Bootstrap**, carregado por CDN nas versões 5.3.2 e 5.3.8, dependendo da página;
- **Font Awesome**, carregado por CDN nas versões 6.5.0 e 7.0.1;
- **Leaflet** para exibição e manipulação do mapa;
- blocos de mapa do **OpenStreetMap**;
- serviço **Nominatim/OpenStreetMap** para buscar coordenadas a partir de endereços;
- **VLibras** e **Sienna Accessibility Widget**, carregados externamente em diferentes páginas;
- `localStorage` do navegador para armazenar os locais adicionados pelo formulário do mapa.

O projeto não possui `composer.json`, `package.json`, framework PHP ou processo de build. As bibliotecas de interface e mapa são carregadas diretamente por CDN.

## Estrutura do projeto

```text
projeto-final-1/
├── assets/
│   ├── css/                  Estilos separados por página
│   ├── img/                  Logos, fotografias e outras imagens
│   └── js/                   Scripts das páginas e do mapa
├── bd/
│   └── inclucity_db.sql      Estrutura inicial do banco e registro de exemplo
├── pages/
│   └── errors/               Pasta reservada para páginas de erro
├── .env                      Arquivo vazio e ainda não utilizado pelo código
├── .htaccess                 Configuração básica de acesso do Apache
├── index.php                 Ponto de entrada padrão do projeto
├── TelaInicial.php           Página institucional inicial
├── ComoFunciona.php          Explicação da proposta do IncluCity
├── mapa.php                  Interface do mapa de acessibilidade
├── TelaUsuario.php           Interface atual do painel do usuário
├── cadastro.php              Formulário de cadastro
├── salvar_usuario.php        Processamento e persistência do cadastro
├── login.php                 Formulário de login
├── autenticar.php            Validação das credenciais e criação da sessão
├── conexao.php               Configuração da conexão MySQLi
├── esqueceu.senha.php        Primeira tela da recuperação de senha
├── codigo.recuperacao.php    Tela de código de recuperação
├── nova.senha.php            Tela de definição da nova senha
├── termos.php                Termos de uso
└── privacidade.php           Política de privacidade
```

O projeto usa páginas PHP independentes e links relativos contendo a extensão `.php`. Não existe roteador central nem configuração de URLs amigáveis. Ao acessar a pasta da aplicação, o Apache abre `index.php`, que atualmente oferece um link para `TelaInicial.php`.

## Requisitos

- XAMPP ou ambiente equivalente com:
  - Apache;
  - PHP com a extensão MySQLi habilitada;
  - MariaDB ou MySQL;
- navegador moderno;
- acesso à internet para carregar Bootstrap, Font Awesome, Leaflet, OpenStreetMap, Nominatim, VLibras e Sienna.

O arquivo SQL foi exportado em um ambiente com PHP 8.2.12, MariaDB 10.4.32 e phpMyAdmin 5.2.1. Essas versões descrevem o ambiente de origem do dump e não constituem uma declaração de compatibilidade com todas as outras versões.

## Execução local com XAMPP

1. Coloque a pasta do projeto dentro do diretório `htdocs` do XAMPP. Exemplo:

   ```text
   C:\xampp\htdocs\projeto-final-1
   ```

2. Inicie os módulos **Apache** e **MySQL** no painel do XAMPP.

3. Crie e importe o banco conforme a seção seguinte.

4. Confira as credenciais definidas em `conexao.php`.

5. Abra no navegador:

   ```text
   http://localhost/projeto-final-1/
   ```

   Se a pasta estiver em outro caminho dentro de `htdocs`, ajuste a URL para refletir esse caminho.

## Configuração inicial do banco de dados

O arquivo `bd/inclucity_db.sql` contém a tabela `usuarios`, seus índices e um registro de exemplo. O banco esperado pelo código se chama `inclucity_db`.

### Importação pelo phpMyAdmin

1. Acesse `http://localhost/phpmyadmin/`.
2. Crie um banco chamado `inclucity_db` com suporte a `utf8mb4`.
3. Selecione o banco criado e abra a opção **Importar**.
4. Escolha o arquivo `bd/inclucity_db.sql`.
5. Execute a importação.

O script cria a tabela `usuarios` com os campos:

- `id`;
- `nome`;
- `email`;
- `celular`;
- `cpf`;
- `senha`;
- `data_cadastro`.

E-mail e CPF possuem índices únicos. As senhas cadastradas pela aplicação são geradas com `password_hash()` e verificadas com `password_verify()`.

> O dump contém um registro de exemplo. Revise dados de demonstração antes de usar o projeto fora de um ambiente local ou acadêmico.

## Conexão com o banco

A conexão está configurada diretamente em `conexao.php`:

```php
$servidor = "localhost";
$usuario = "root";
$senha = "";
$banco = "inclucity_db";
```

Esses valores correspondem à configuração local presente no projeto. Caso o seu MariaDB/MySQL use outro host, usuário, senha ou nome de banco, ajuste somente esses valores de acordo com o seu ambiente.

O arquivo `.env` existe, mas está vazio e não é lido pelo código atual. Portanto, alterar apenas o `.env` não modifica a conexão.

## Funcionalidades existentes

- páginas institucionais de início e explicação do IncluCity;
- navegação entre início, mapa, funcionamento, login e cadastro;
- páginas de termos de uso e política de privacidade;
- formulário de cadastro com validações no navegador;
- cadastro de usuário no banco, com verificação de e-mail e CPF duplicados;
- armazenamento seguro da senha por hash;
- autenticação por e-mail ou CPF usando consulta preparada;
- criação de uma sessão PHP após autenticação válida;
- mapa Leaflet centralizado em São José dos Campos, com locais demonstrativos;
- filtros visuais por tipo de deficiência e avaliação;
- busca de coordenadas de endereços pelo Nominatim;
- leitura de imagem no navegador para o formulário de local;
- armazenamento de locais enviados no `localStorage`, na chave `admLocais`;
- recursos externos de acessibilidade com VLibras e Sienna em diferentes páginas.

## Estado atual e limitações conhecidas

O IncluCity ainda é um protótipo em evolução. No estado atual:

- somente usuários são persistidos no MariaDB/MySQL;
- locais, avaliações e comentários não possuem tabelas no banco;
- os locais adicionados pelo mapa ficam no navegador e não são enviados ao servidor;
- o painel `TelaUsuario.php` apresenta dados e conteúdos fixos no HTML, sem carregar a sessão criada no login;
- `TelaUsuario.php` não verifica se o visitante está autenticado;
- as telas de recuperação de senha formam apenas um fluxo de interface e não atualizam o banco;
- após um cadastro bem-sucedido, `salvar_usuario.php` aponta para `login.html`, mas o arquivo existente é `login.php`;
- os botões de login com Google e Microsoft apontam para arquivos HTML que não existem no repositório;
- no mapa, o JavaScript procura um botão `btnFechar` cujo elemento está comentado no HTML, o que pode interromper parte do script;
- algumas imagens demonstrativas referenciadas em `assets/js/mapa.js` usam caminhos que não existem no diretório `assets/img`;
- existem versões diferentes de Bootstrap e Font Awesome entre as páginas;
- algumas páginas e arquivos apresentam sinais de inconsistência na codificação de caracteres;
- o projeto depende de serviços externos e algumas funções visuais ficam indisponíveis sem internet;
- os nomes de alguns arquivos usam letras maiúsculas. Em servidores com sistema de arquivos sensível a maiúsculas e minúsculas, os caminhos devem manter exatamente a mesma grafia;
- a configuração de banco está escrita diretamente em `conexao.php` e deve ser tratada com cuidado antes de qualquer publicação.

## Segurança e configuração do Apache

O `.htaccess` da raiz contém a configuração inicial:

```apache
DirectoryIndex index.php

Options -Indexes

<FilesMatch "(?i)(^\.env(?:\..*)?$|\.sql$)">
    Require all denied
</FilesMatch>
```

Essa configuração:

- define `index.php` como arquivo de entrada ao abrir o diretório;
- impede a listagem automática de diretórios;
- bloqueia via HTTP o acesso a `.env`, variações desse nome e arquivos terminados em `.sql`, sem diferenciar maiúsculas de minúsculas.

O bloqueio depende de o Apache permitir configurações por `.htaccess` para esse diretório. Não há regras de reescrita: as URLs com `.php` continuam sendo necessárias.

O `.htaccess` reduz a exposição acidental desses arquivos, mas não substitui práticas como credenciais próprias por ambiente, validação no servidor, controle de sessão, revisão de dados de exemplo e configuração segura do servidor.

## Próximos passos

Como o projeto ainda está em desenvolvimento, próximos trabalhos possíveis incluem:

- integrar o painel do usuário aos dados da sessão e proteger páginas autenticadas;
- persistir locais, recursos de acessibilidade, avaliações e comentários no banco;
- implementar o fluxo real de recuperação e alteração de senha;
- corrigir links e referências para arquivos inexistentes;
- concluir e validar o formulário do mapa;
- mover configurações sensíveis para uma estratégia de ambiente efetivamente utilizada pelo PHP;
- padronizar versões das dependências, nomes de arquivos e codificação de caracteres;
- adicionar tratamento de erros e validações no servidor;
- documentar e testar os fluxos completos antes de uma publicação.

Esses itens descrevem possibilidades coerentes com as limitações observadas no código atual; não representam funcionalidades já implementadas.
