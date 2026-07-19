# 🏆 Alura Album - Copa do Mundo Tech

O **Alura Album - Copa do Mundo Tech** é um álbum virtual de figurinhas interativo, desenvolvido para celebrar a história e os grandes nomes da tecnologia nacional e internacional.

Este projeto foi criado no contexto da **Imersão Arquitetura Web com IA** da Alura.

Veja o álbum publicado [aqui](https://dinalima1610.github.io/alura-imersao-ai-web-arch-tech-album/frontend/).

---

## 🎯 Objetivo do Projeto

O objetivo principal do projeto é oferecer uma experiência imersiva e interativa de colecionar figurinhas digitais de personalidades da tecnologia.

O álbum está dividido em categorias históricas de grande relevância para a computação e o desenvolvimento de software:

- **Inteligência Artificial (IA):** pioneiros e nomes marcantes da evolução das redes neurais e da IA moderna.
- **Linguagens e Web:** criadores e mantenedores de tecnologias fundamentais para programação e internet.
- **Dados e Banco de Dados:** nomes importantes para análise de dados, computação científica e bancos relacionais ou não relacionais.
- **Sistemas, Software Livre e Empreendedorismo:** personalidades que influenciaram sistemas operacionais, cultura open source e empresas de tecnologia.
- **Alura e Devs do Brasil:** homenagem a educadores, produtores de conteúdo e referências da tecnologia brasileira.

---

## ✨ Funcionalidades

- Álbum digital com efeito de livro físico usando a biblioteca `St.PageFlip`.
- Carregamento dinâmico das figurinhas a partir de uma API FastAPI.
- Exibição das imagens das figurinhas por endpoint dinâmico.
- Busca de figurinhas por **ID**, **nome** ou **contribuição**.
- Destaque visual da figurinha encontrada e navegação automática até sua página.
- Zoom da figurinha ao clicar em um slot preenchido.
- Estatísticas do álbum na contracapa: total de figurinhas, coladas e faltantes.
- Alternância entre tema escuro e claro, com persistência no `localStorage`.
- Navegação por botões, teclado, clique/toque e swipe em dispositivos móveis.
- Som sintético de virada de página com Web Audio API.
- Correção da navegação mobile para manter o botão de voltar disponível quando necessário.
- Metadados básicos de SEO e favicon ajustado para publicação no GitHub Pages.

---

## 🛠️ Estrutura e Componentes do Projeto

O projeto está dividido em **frontend** e **backend**:

- **Frontend:** HTML5, CSS3 e JavaScript puro.
- **Backend:** API em FastAPI, responsável por fornecer os dados e imagens das figurinhas.
- **Deploy:** frontend publicado no GitHub Pages e backend preparado para publicação na Vercel.

### 🎨 Frontend (`/frontend`)

#### 1. 📄 [index.html](frontend/index.html)

Estrutura semântica principal da aplicação.

- Define a estrutura das páginas do álbum: capa, páginas de categorias e contracapa.
- Contém os botões de pesquisa, alternância de tema, controle de som e navegação.
- Usa o landmark principal `<main>` para melhorar acessibilidade.
- Exibe as estatísticas do álbum na contracapa.
- Carrega as fontes do Google Fonts (`Inter` e `Outfit`).
- Importa a biblioteca externa `St.PageFlip` por CDN.
- Define metadados básicos, como `description` e favicon.

#### 2. 🎨 [style.css](frontend/style.css)

Responsável por toda a parte visual, animações e responsividade da interface.

- **Sistema de temas:** usa variáveis CSS em `:root` e `[data-theme="light"]`.
- **Efeitos visuais:** glitch na capa, brilho no selo, animação ao colar figurinha e sombras de lombada.
- **Busca e zoom:** estilos para o popup de pesquisa, feedback visual, destaque da figurinha selecionada e modal de zoom.
- **Responsividade:** adapta o álbum para telas menores, incluindo navegação mobile e visualização em página única.

#### 3. ⚙️ [app.js](frontend/app.js)

Contém a lógica e interatividade do álbum.

- Define a URL base da API de acordo com o ambiente:
  - local: `http://localhost:8000`;
  - produção: `https://alura-imersao-ai-web-arch-tech-album.vercel.app`.
- Busca a lista de figurinhas via `GET /figurinhas`.
- Preenche os slots do álbum com as imagens retornadas pela API.
- Implementa pesquisa por ID, nome ou contribuição.
- Consulta a API para validar a figurinha pesquisada por ID.
- Destaca a figurinha encontrada e navega até a página correspondente.
- Exibe zoom da figurinha usando os dados retornados pelo backend.
- Calcula e exibe as estatísticas do álbum na contracapa.
- Gerencia tema claro/escuro e persistência no `localStorage`.
- Configura a biblioteca `St.PageFlip`.
- Gera o som de virada de página usando Web Audio API.
- Controla navegação por botões, teclado e gestos de toque.

---

### 💻 Backend (`/backend`)

O backend foi desenvolvido com **FastAPI** para fornecer uma API simples, rápida e integrada ao frontend.

#### 1. 🐍 [main.py](backend/main.py)

Contém a inicialização da aplicação, configuração de CORS, lista de figurinhas e rotas da API.

- Cria a instância principal do FastAPI.
- Configura CORS para permitir requisições do frontend.
- Define a pasta de imagens das figurinhas.
- Mantém a lista de 30 figurinhas cadastradas.
- Retorna dados em JSON e imagens via `FileResponse`.
- Lança erro `404` quando a figurinha ou imagem não é encontrada.

#### Endpoints da API

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/` | Retorna uma mensagem inicial da API. |
| `GET` | `/figurinhas` | Lista todas as figurinhas cadastradas. |
| `GET` | `/figurinhas/{id}` | Busca uma figurinha específica pelo ID. |
| `GET` | `/figurinhas/{id}/imagem` | Retorna a imagem da figurinha pelo ID. |
| `GET` | `/figurinhas/{id}/exibir` | Retorna os dados usados na exibição ampliada da figurinha. |
| `GET` | `/figurinhas/total?total_album=30` | Retorna total do álbum, figurinhas coladas e faltantes. |

---

## 🔗 Integração Frontend e Backend

A integração entre frontend e backend foi consolidada durante a Aula 04.

O frontend consome a API FastAPI para buscar a lista das figurinhas, carregar suas imagens, pesquisar por ID e exibir estatísticas do álbum.

Em desenvolvimento local, o frontend usa:

```text
http://localhost:8000
```

Na versão publicada, o frontend usa a API hospedada na Vercel:

```text
https://alura-imersao-ai-web-arch-tech-album.vercel.app
```

O arquivo [vercel.json](vercel.json) configura o deploy do backend apontando para `backend/main.py` com `@vercel/python`.

---

## 🌗 Desafios Concluídos

### Desafio 1: Alternar Tema do Álbum

- Adicionado botão `#theme-toggle` em [index.html](frontend/index.html).
- Criada a variação `[data-theme="light"]` em [style.css](frontend/style.css).
- Implementada a troca de tema no [app.js](frontend/app.js).
- Persistência da escolha do usuário no `localStorage`.

### Desafio 2: Buscar Figurinha por ID

- Criado endpoint `GET /figurinhas/{id}` no backend.
- Adicionado popup de pesquisa no frontend.
- Implementada validação de ID com ou sem `#`.
- A figurinha encontrada é destacada visualmente.
- O álbum navega automaticamente até a página da figurinha.

### Desafio 3: Estatísticas das Figurinhas Coladas

- Criado endpoint `GET /figurinhas/total?total_album=30`.
- A API retorna `total_album`, `coladas` e `faltam`.
- As estatísticas são exibidas na contracapa do álbum.

### Melhorias Extras

- Busca expandida para aceitar nome ou contribuição.
- Zoom da figurinha ao clicar em uma figurinha colada.
- Correção do botão de navegação que não voltava corretamente em modo mobile.
- Ajustes simples apontados pelo Lighthouse:
  - favicon com caminho compatível com GitHub Pages;
  - scripts carregados com `defer`;
  - criação de landmark principal com `<main>`;
  - metadescrição para SEO.

---

## 🚀 Como Executar o Projeto

### 1. Executar o Backend

Instale as dependências:

```bash
pip install -r requirements.txt
```

Navegue até a pasta do backend:

```bash
cd backend
```

Inicie o servidor com Uvicorn:

```bash
uvicorn main:app --reload
```

O servidor ficará disponível em:

```text
http://localhost:8000
```

Documentação interativa da API:

```text
http://localhost:8000/docs
```

### 2. Executar o Frontend

Abra o arquivo [frontend/index.html](frontend/index.html) diretamente no navegador ou use uma extensão de servidor local, como o **Live Server** do VS Code, a partir da pasta `/frontend`.

---

## 🧪 Qualidade e Lighthouse

Uma avaliação inicial no Google Lighthouse indicou bons resultados gerais, com todos os itens chegando a 100 exceto pontos específicos de Performance, Acessibilidade e SEO em alguns cenários.

Melhorias futuras possíveis:

- otimizar imagens pesadas das figurinhas;
- gerar thumbnails para o álbum e manter imagens maiores apenas para zoom;
- carregar imagens sob demanda conforme a página visível;
- reduzir animações contínuas em dispositivos móveis;
- revisar pesos de fontes carregados do Google Fonts.

---

