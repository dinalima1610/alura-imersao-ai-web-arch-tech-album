# 🏆 Alura Album - Copa do Mundo Tech

O **Alura Album - Copa do Mundo Tech** é um álbum virtual de figurinhas interativo e moderno, desenvolvido para celebrar a história e os grandes nomes da tecnologia nacional e internacional. Este projeto foi criado no contexto da **Imersão AI - Web Arch** da Alura.

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

O projeto agora está dividido de forma organizada em **frontend**, uma arquitetura limpa baseada em **HTML5**, **CSS3** e **JavaScript**, e **backend**, embora a ligação de dados automática entre os dois ainda esteja pendente.

### 🎨 Frontend (`/frontend`)

O frontend é construído em uma arquitetura limpa baseada em **HTML5**, **CSS3** e **JavaScript** puro.

#### 1. 📄 [index.html](frontend/index.html)
Estrutura semântica principal da aplicação.
- Define a disposição física das páginas do álbum (Capa, Páginas de Categorias com seus respectivos slots de figurinhas, e Contracapa).
- Carrega as fontes do Google Fonts (`Inter` e `Outfit`) e vincula os estilos e scripts de lógica.
- Importa a biblioteca externa `St.PageFlip` a partir de uma CDN para habilitar o efeito tridimensional de folheação do livro físico.

#### 2. 🎨 [style.css](frontend/style.css)
Responsável por toda a parte visual, animações e responsividade da interface.
- **Sistema de Cores Dinâmico (`:root`):** Utiliza variáveis CSS personalizadas configuradas com tons de **Teal** (verde-azulado), fornecendo uma estética tecnológica e elegante.
- **Efeitos e Animações Premium:**
  - **Glitch Text Effect:** Efeito visual na tipografia da capa (`ALURA ALBUM`).
  - **Seal Shine:** Animação de brilho metálico no selo de autenticidade da capa.
  - **Sticker Animation:** Efeito suave de escala e opacidade ao "colar" uma figurinha no álbum.
  - **Lombada Crease Shadows:** Gradientes de sombra que simulam a dobra das páginas de um livro físico no centro.
- **Responsividade:** Media queries dedicadas para adaptar a visualização tridimensional em telas menores (tablets e celulares), ajustando o álbum para visualização em página única de maneira fluida.

#### 3. ⚙️ [app.js](frontend/app.js)
Contém toda a lógica e interatividade do sistema do álbum.
- **Integração com API Backend:** Busca a lista de figurinhas disponíveis a partir de uma API externa (`http://localhost:8000/figurinhas`). Se a figurinha correspondente ao slot estiver cadastrada e ativa no backend, ela é inserida no slot em tempo de execução via manipulação de DOM.
- **Efeito de Folheamento Interativo (`St.PageFlip`):** Configura os parâmetros de transição, sombra e limites de arrasto de página por mouse e toque para dispositivos móveis.
- **Síntese de Áudio (Web Audio API):** Gera dinamicamente, por meio de código, o som de uma folha de papel virando (ruído branco filtrado por filtros passa-banda e passa-baixa). Não requer arquivos de som externos.
- **Controle de Navegação e Atalhos:** Mapeamento de setas do teclado (Esquerda/Direita), setas na interface visual e botões de controle de volume (Mudo/Som ativo).

---

### 💻 Backend (`/backend`)

O backend foi iniciado utilizando **FastAPI** para fornecer uma API robusta e rápida.

#### 1. 🐍 [main.py](backend/main.py)
Contém a inicialização da aplicação web e a definição de rotas.
- **Servidor FastAPI:** Configurado para rodar localmente com recarregamento automático (reload).
- **Rota Inicial (`GET /`):** Retorna uma mensagem de boas-vindas em formato JSON: `{"mensagem": "Olá, mundo! 🌍"}`.

---

### ⚠️ Integração Pendente

> [!WARNING]
> A ligação direta entre o frontend e o backend ainda está pendente de implementação.
> Atualmente, o script do frontend (`frontend/app.js`) tenta requisitar o endpoint `/figurinhas` na porta `8000`, mas o backend possui apenas a rota inicial `/` configurada. Nas próximas etapas, o backend será expandido para retornar o JSON com as informações das figurinhas e servir os arquivos de imagens.

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
