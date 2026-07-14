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

## 🛠️ Funcionalidades dos Arquivos Envolvidos

O projeto é construído em uma arquitetura limpa de frontend baseada em **HTML5**, **CSS3** e **JavaScript** puro, consumindo dados de uma API externa/local.

### 1. 📄 [index.html](index.html)
Estrutura semântica principal da aplicação.
- Define a disposição física das páginas do álbum (Capa, Páginas de Categorias com seus respectivos slots de figurinhas, e Contracapa).
- Carrega as fontes do Google Fonts (`Inter` e `Outfit`) e vincula os estilos e scripts de lógica.
- Importa a biblioteca externa `St.PageFlip` a partir de uma CDN para habilitar o efeito tridimensional de folheação do livro físico.

### 2. 🎨 [style.css](style.css)
Responsável por toda a parte visual, animações e responsividade da interface.
- **Sistema de Cores Dinâmico (`:root`):** Utiliza variáveis CSS personalizadas configuradas com tons de **Teal** (verde-azulado), fornecendo uma estética tecnológica e elegante.
- **Efeitos e Animações Premium:**
  - **Glitch Text Effect:** Efeito visual na tipografia da capa (`ALURA ALBUM`).
  - **Seal Shine:** Animação de brilho metálico no selo de autenticidade da capa.
  - **Sticker Animation:** Efeito suave de escala e opacidade ao "colar" uma figurinha no álbum.
  - **Lombada Crease Shadows:** Gradientes de sombra que simulam a dobra das páginas de um livro físico no centro.
- **Responsividade:** Media queries dedicadas para adaptar a visualização tridimensional em telas menores (tablets e celulares), ajustando o álbum para visualização em página única de maneira fluida.

### 3. ⚙️ [app.js](app.js)
Contém toda a lógica e interatividade do sistema do álbum.
- **Integração com API Backend:** Busca a lista de figurinhas disponíveis a partir de uma API externa (`http://localhost:8000/figurinhas`). Se a figurinha correspondente ao slot estiver cadastrada e ativa no backend, ela é inserida no slot em tempo de execução via manipulação de DOM.
- **Efeito de Folheamento Interativo (`St.PageFlip`):** Configura os parâmetros de transição, sombra e limites de arrasto de página por mouse e toque para dispositivos móveis.
- **Síntese de Áudio (Web Audio API):** Gera dinamicamente, por meio de código, o som de uma folha de papel virando (ruído branco filtrado por filtros passa-banda e passa-baixa). Não requer arquivos de som externos.
- **Controle de Navegação e Atalhos:** Mapeamento de setas do teclado (Esquerda/Direita), setas na interface visual e botões de controle de volume (Mudo/Som ativo).

---

## 🚀 Como Executar o Projeto

1. Certifique-se de ter o backend da aplicação rodando (opcional para preenchimento de figurinhas):
   ```bash
   cd backend/dia-3
   uvicorn main:app --reload
   ```
2. Abra o arquivo [index.html](index.html) diretamente no navegador, ou use uma extensão de servidor local (ex: *Live Server* do VS Code) para visualizar e interagir com o álbum completo.
