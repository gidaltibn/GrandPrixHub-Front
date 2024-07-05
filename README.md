# GrandPrixHub Front-End

Este é o repositório do front-end da aplicação GrandPrixHub. A aplicação foi desenvolvida utilizando HTML, CSS e JavaScript para criar uma Single Page Application (SPA) que permite gerenciar equipes, pilotos, pistas, corridas e resultados de corridas de Fórmula 1.

## Requisitos

- Navegador web moderno (Google Chrome, Mozilla Firefox, etc.)
- Servidor web para servir os arquivos HTML e JavaScript (opcional para desenvolvimento local)

## Estrutura do Projeto

- `index.html`: Página principal da aplicação.
- `css/styles.css`: Arquivo de estilos CSS.
- `js/scripts.js`: Arquivo JavaScript com a lógica da aplicação.

## Instalação

1. Clone o repositório:
   git clone https://github.com/gidaltibn/GrandPrixHub-Front.git

## Executando a Aplicação

1. Abra o arquivo `index.html` em um navegador web.

2. A aplicação se comunicará com a API back-end para carregar e manipular os dados.

## Funcionalidades

A aplicação possui as seguintes funcionalidades:

- Gerenciamento de Equipes:

  - Adicionar uma nova equipe.
  - Atualizar uma equipe existente.
  - Excluir uma equipe (verificação de pilotos associados antes da exclusão).

- Gerenciamento de Pilotos:

  - Adicionar um novo piloto.
  - Atualizar um piloto existente.
  - Excluir um piloto.

- Gerenciamento de Pistas:

  - Adicionar uma nova pista.
  - Atualizar uma pista existente.
  - Excluir uma pista (verificação de corridas associadas antes da exclusão).

- Gerenciamento de Corridas:

  - Adicionar uma nova corrida.
  - Atualizar uma corrida existente.
  - Excluir uma corrida (verificação de resultados associados antes da exclusão).

- Gerenciamento de Resultados:
  - Adicionar um novo resultado.
  - Atualizar um resultado existente.
  - Excluir um resultado.

## Relacionamento entre Classes e Entidades

A aplicação front-end interage com as seguintes entidades e seus relacionamentos:

- **Equipe**: Gerencia as equipes de Fórmula 1. Cada equipe pode ter vários pilotos associados.
- **Piloto**: Gerencia os pilotos de Fórmula 1. Cada piloto pertence a uma equipe específica.
- **Pista**: Gerencia as pistas de corrida. Cada pista pode ser associada a várias corridas.
- **Corrida**: Gerencia as corridas de Fórmula 1. Cada corrida é realizada em uma pista específica e pode ter vários resultados associados.
- **Resultado**: Gerencia os resultados das corridas, associando os pilotos às suas respectivas posições.

## Criatividade e Inovação

A aplicação front-end foi desenvolvida com uma interface intuitiva e responsiva, utilizando JavaScript para realizar chamadas assíncronas à API e atualizar a interface do usuário dinamicamente. A aplicação é capaz de gerenciar dados de Fórmula 1 de maneira eficiente e prática.

## Autor

- Gidalti Brito Nascimento
- [Github](https://github.com/gidaltibn)
- [Email](mailto:gidaltibn@outlook.com)
