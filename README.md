# 🏆 Alura Album - Copa do Mundo Tech

O **Alura Album - Copa do Mundo Tech** é um álbum virtual de figurinhas interativo e moderno, desenvolvido para celebrar a história e os grandes nomes da tecnologia nacional e internacional. 

Este projeto foi criado no contexto da **Imersão Arquitetura Web com IA** da Alura.

Veja o álbum [aqui](https://dinalima1610.github.io/alura-imersao-ai-web-arch-tech-album/frontend/).

---

## 🎯 Objetivo do Projeto

O objetivo principal do projeto é oferecer uma experiência imersiva e interativa de colecionar figurinhas digitais de personalidades da tecnologia. O álbum está dividido em categorias históricas de grande relevância para a área da computação e do desenvolvimento de software:

- **Inteligência Artificial (IA):** Pioneiros e nomes marcantes da evolução das redes neurais e IA moderna.
- **Python:** Os arquitetos que idealizaram e mantêm a filosofia de simplicidade e legibilidade da linguagem.
- **Banco de Dados (DB):** Criadores e idealizadores dos principais modelos relacionais e não-relacionais.
- **Sistemas Operacionais (OS):** Mentes brilhantes que construíram as bases da computação pessoal e corporativa.
- **Brasil (Devs do Brasil):** Homenagem e reconhecimento a professores, produtores de conteúdo e educadores da tecnologia brasileira.

---

## 🛠️ Estrutura e Componentes do Projeto

O projeto está dividido de forma organizada e integrada em **frontend** (uma arquitetura limpa baseada em **HTML5**, **CSS3** e **JavaScript** puro) e **backend** (baseado em **FastAPI**), permitindo o carregamento dinâmico de figurinhas e troca de temas de forma fluida.

### 🎨 Frontend (`/frontend`)

O frontend é construído em uma arquitetura limpa baseada em **HTML5**, **CSS3** e **JavaScript** puro.

#### 1. 📄 [index.html](frontend/index.html)
Estrutura semântica principal da aplicação.
- Define a disposição física das páginas do álbum (Capa, Páginas de Categorias com seus respectivos slots de figurinhas, e Contracapa).
- Contém o botão de alternância de tema (`#theme-toggle`) para alternar entre os modos escuro e claro.
- Carrega as fontes do Google Fonts (`Inter` e `Outfit`) e vincula os estilos e scripts de lógica.
- Importa a biblioteca externa `St.PageFlip` a partir de uma CDN para habilitar o efeito tridimensional de folheação do livro físico.

#### 2. 🎨 [style.css](frontend/style.css)
Responsável por toda a parte visual, animações e responsividade da interface.
- **Sistema de Temas e Cores Dinâmico (`:root` e `[data-theme="light"]`):** Utiliza variáveis CSS personalizadas. O tema padrão é o escuro (azul tech sobre fundo escuro) e o tema claro (com cores de contraste adaptadas) é aplicado dinamicamente usando a diretiva `[data-theme="light"]`.
- **Efeitos e Animações Premium:**
  - **Glitch Text Effect:** Efeito visual na tipografia da capa (`ALURA ALBUM`).
  - **Seal Shine:** Animação de brilho metálico no selo de autenticidade da capa.
  - **Sticker Animation:** Efeito suave de escala e opacidade ao "colar" uma figurinha no álbum.
  - **Lombada Crease Shadows:** Gradientes de sombra que simulam a dobra das páginas de um livro físico no centro.
- **Responsividade:** Media queries dedicadas para adaptar a visualização tridimensional em telas menores (tablets e celulares), ajustando o álbum para visualização em página única de maneira fluida.

#### 3. ⚙️ [app.js](frontend/app.js)
Contém toda a lógica e interatividade do sistema do álbum.
- **Integração Dinâmica com a API:** Busca a lista de figurinhas em tempo de execução via API local (`http://localhost:8000/figurinhas`). Se a figurinha correspondente ao slot estiver cadastrada e ativa no backend, preenche o slot dinamicamente com a imagem disponibilizada pelo servidor.
- **Alternância de Tema (Desafio 1):** Gerencia a troca de tema claro/escuro ao clicar no botão de alternar tema, aplicando o atributo correspondente no elemento raiz (`html`) e persistindo a escolha no `localStorage` do navegador para manter o tema escolhido após atualizações de página.
- **Efeito de Folheamento Interativo (`St.PageFlip`):** Configura os parâmetros de transição, sombra e limites de arrasto de página por mouse e toque para dispositivos móveis.
- **Síntese de Áudio (Web Audio API):** Gera dinamicamente, por meio de código, o som de uma folha de papel virando (ruído branco filtrado por filtros passa-banda e passa-baixa). Não requer arquivos de som externos.
- **Controle de Navegação e Atalhos:** Mapeamento de setas do teclado (Esquerda/Direita), setas na interface visual e botões de controle de volume (Mudo/Som ativo).

---

### 💻 Backend (`/backend`)

O backend foi desenvolvido utilizando **FastAPI** para fornecer uma API robusta, rápida e assíncrona.

#### 1. 🐍 [main.py](backend/main.py)
Contém a inicialização da aplicação web, configuração de CORS, serviço de arquivos estáticos e definição de rotas.
- **Servidor FastAPI:** Configurado para rodar localmente com recarregamento automático (reload).
- **Habilitação de CORS:** Permite que o frontend faça requisições HTTP para a API local sem bloqueios do navegador.
- **Serviço de Imagens Estáticas Dinâmico (`GET /figurinhas/{id}/imagem`):** Retorna o arquivo de imagem correspondente a cada figurinha de forma dinâmica por ID, buscando na pasta `figurinhas` pelo padrão do arquivo e entregando via `FileResponse`.
- **Rota Inicial (`GET /`):** Retorna uma mensagem de boas-vindas em formato JSON: `{"mensagem": "Olá, mundo! 🌍"}`.
- **Rota de Figurinhas (`GET /figurinhas`):** Retorna a lista completa em formato JSON com todas as 30 figurinhas cadastradas (contendo ID, nome, categoria e link dinâmico da imagem).

---

### 🔗 Ligação Backend e Frontend (Concluída na Aula 04)

A integração completa entre o frontend e o backend foi consolidada com sucesso durante a **Aula 04**. O frontend se comunica diretamente com a API do FastAPI para buscar a lista de todas as 30 figurinhas e suas respectivas imagens. As figurinhas agora são carregadas e coladas nos slots corretos de acordo com a resposta do backend.

---

### 🌓 Desafios Concluídos

#### **Desafio 1: Alternar Tema do Álbum**
- **HTML:** Adicionado o botão `#theme-toggle` no [index.html](frontend/index.html) para alternar o tema.
- **CSS:** Criação da variação `[data-theme="light"]` no [style.css](frontend/style.css) utilizando variáveis de cor adaptadas para garantir ótima legibilidade e acessibilidade.
- **JavaScript:** Manipulação do DOM no [app.js](frontend/app.js) para alternar o atributo `data-theme` no `document.documentElement` sem recarregar a página, além de persistir a escolha no `localStorage`.

---

## 🚀 Como Executar o Projeto

### 1. Executar o Backend
Para rodar o servidor backend local do FastAPI:

1. Certifique-se de instalar as dependências do arquivo [requirements.txt](requirements.txt):
   ```bash
   pip install -r requirements.txt
   ```
2. Navegue até a pasta do backend e inicie o servidor com Uvicorn:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```
   O servidor estará ativo no endereço `http://localhost:8000`.
  
  Para visualizar a documentação interativa da API (Swagger UI): acesse `http://localhost:8000/docs`.

### 2. Executar o Frontend
Abra o arquivo [frontend/index.html](frontend/index.html) diretamente no navegador, ou use uma extensão de servidor local (como a extensão *Live Server* do VS Code) a partir da pasta `/frontend` para visualizar e interagir com a interface do álbum.
