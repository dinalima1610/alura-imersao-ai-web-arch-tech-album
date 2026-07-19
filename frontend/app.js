// ===================================================
// CONFIGURAÇÃO DA API
// Quando o frontend for servido pelo FastAPI (Dia 3), a API está
// no mesmo servidor — usamos uma URL relativa ou o endereço completo.
// ===================================================

// Verifica se o site está rodando localmente
const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

// Define a API com base no ambiente atual
const API_BASE_URL = isLocalhost
    ? "http://localhost:8000"
    : "https://alura-imersao-ai-web-arch-tech-album.vercel.app";

// ===================================================
// FUNÇÃO: Preenche os slots do álbum com imagens da API
// Esta função é chamada após o álbum ser inicializado.
// ===================================================
async function preencherFigurinhas() {
    try {
        // 1. Busca as figurinhas disponíveis na API
        const response = await fetch(`${API_BASE_URL}/figurinhas`);

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
        }

        // 2. Converte o JSON em array JavaScript
        const figurinhas = await response.json();

        // 3. Cria um Map de id → figurinha para lookup rápido
        //    Ex: 1 → { id: 1, nome: "Alan Turing", imagem_url: "/imgs/01-alan-turing.jpg" }
        const porId = new Map(figurinhas.map(f => [f.id, f]));

        // 4. Percorre todos os slots do HTML
        const slots = document.querySelectorAll(".sticker-slot");

        for (const slot of slots) {
            const slotNumeroEl = slot.querySelector(".slot-number");
            if (!slotNumeroEl) continue;

            // Extrai o número do slot: "#01" → 1
            const id = parseInt(slotNumeroEl.textContent.replace("#", ""), 10);

            if (!porId.has(id)) continue;

            // A figurinha existe: insere a imagem
            const figurinha = porId.get(id);

            const img = document.createElement("img");
            img.src = `${API_BASE_URL}${figurinha.thumb_url || figurinha.imagem_url}`;
            img.alt = figurinha.nome;
            img.className = "sticker-img";

            img.onload = () => slot.classList.add("slot-preenchido");
            img.onerror = () => console.warn(`Imagem não encontrada: ${figurinha.nome}`);

            slot.insertBefore(img, slot.firstChild);
            slot.addEventListener("click", (e) => {
                e.stopPropagation();
                zoom(figurinha.id);
            });
        }

        console.log(`✅ ${figurinhas.length} figurinhas carregadas da API!`);

    } catch (erro) {
        console.warn("⚠️  Não foi possível conectar à API do backend:", erro.message);
        console.info("ℹ️  Inicie o servidor: cd backend/dia-3 && uvicorn main:app --reload");
    }
}

function total_slots_album() {
    return document.querySelectorAll('.sticker-slot').length;
}

async function estatisticas_album() {
    const totalAlbum = total_slots_album();
    const response = await fetch(`${API_BASE_URL}/figurinhas/total?total_album=${totalAlbum}`);

    if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

async function exibe_estatisticas() {
    try {
        const estatisticas = await estatisticas_album();

        const totalAlbum = document.getElementById("stats-total-album");
        const coladas = document.getElementById("stats-coladas");
        const faltam = document.getElementById("stats-faltam");

        if (!totalAlbum || !coladas || !faltam) return;

        totalAlbum.textContent = estatisticas.total_album;
        coladas.textContent = estatisticas.coladas;
        faltam.textContent = estatisticas.faltam;
    } catch (erro) {
        console.warn("⚠️  Não foi possível carregar as estatísticas do álbum:", erro.message);
    }
}

// ===================================================
// FUNÇÃO: Preenche os slots do álbum com imagens da API
// Esta função é chamada após o álbum ser inicializado.
// ===================================================
let albumPageFlip = null;
let searchMatchesAtuais = [];
let searchMatchIndexAtual = -1;
let searchFeedbackElement = null;
let zoomDialogElement = null;

function atualizarControlesNavegacao(pageIndex) {
    const btnPrev = document.getElementById("btn-prev");
    const btnNext = document.getElementById("btn-next");

    if (!albumPageFlip || !btnPrev || !btnNext) return;

    const totalPages = albumPageFlip.getPageCount();

    btnPrev.classList.toggle("hidden", pageIndex === 0);
    btnNext.classList.toggle("hidden", pageIndex === totalPages - 1);
}

function irParaPaginaDaFigurinha(figurinha) {
    if (!figurinha || !albumPageFlip) return;

    const pagina = figurinha.closest(".page");
    const paginas = Array.from(document.querySelectorAll(".page"));
    const pageIndex = paginas.indexOf(pagina);

    if (pageIndex >= 0) {
        if (typeof albumPageFlip.turnToPage === "function") {
            albumPageFlip.turnToPage(pageIndex);
        } else if (typeof albumPageFlip.flip === "function") {
            albumPageFlip.flip(pageIndex);
        }

        atualizarControlesNavegacao(pageIndex);
    }
}

function normalizarTextoPesquisa(texto) {
    return String(texto)
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function escaparHtml(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

function limparRealcesPesquisa() {
    document.querySelectorAll(".slot-name, .slot-role").forEach(elemento => {
        const textoOriginal = elemento.dataset.searchOriginalText;

        if (textoOriginal !== undefined) {
            elemento.textContent = textoOriginal;
        }
    });
}

function obterIndicePaginaFigurinha(figurinha) {
    const pagina = figurinha.closest(".page");
    const paginas = Array.from(document.querySelectorAll(".page"));
    return paginas.indexOf(pagina);
}

function obterPaginaAtualPesquisa() {
    if (!albumPageFlip) return 0;
    return albumPageFlip.getCurrentPageIndex();
}

function buscarOcorrenciasPesquisa(texto) {
    const termoOriginal = String(texto).trim();
    const termoNormalizado = normalizarTextoPesquisa(termoOriginal);

    if (!termoNormalizado) return [];

    const slots = Array.from(document.querySelectorAll(".sticker-slot"));
    const ocorrencias = [];

    slots.forEach(slot => {
        [".slot-name", ".slot-role"].forEach(selector => {
            const elemento = slot.querySelector(selector);
            const textoCampo = elemento?.dataset.searchOriginalText ?? elemento?.textContent ?? "";
            const textoNormalizado = normalizarTextoPesquisa(textoCampo);
            const indice = textoNormalizado.indexOf(termoNormalizado);

            if (elemento && indice >= 0) {
                ocorrencias.push({
                    slot,
                    elemento,
                    pageIndex: obterIndicePaginaFigurinha(slot),
                    exact: textoNormalizado === termoNormalizado,
                    term: termoOriginal
                });
            }
        });
    });

    return ocorrencias;
}

function realcarElementoPesquisa(elemento, termo, ativo) {
    if (!elemento.dataset.searchOriginalText) {
        elemento.dataset.searchOriginalText = elemento.textContent;
    }

    const textoOriginal = elemento.dataset.searchOriginalText;
    const classeAtiva = ativo ? " search-match-active" : "";
    const termoNormalizado = normalizarTextoPesquisa(termo);
    const mapa = [];
    let textoNormalizado = "";

    Array.from(textoOriginal).forEach((char, originalIndex) => {
        const normalizado = normalizarTextoPesquisa(char);

        Array.from(normalizado).forEach(normalizedChar => {
            textoNormalizado += normalizedChar;
            mapa.push(originalIndex);
        });
    });

    const ranges = [];
    let buscaInicio = 0;

    while (termoNormalizado && buscaInicio <= textoNormalizado.length) {
        const indice = textoNormalizado.indexOf(termoNormalizado, buscaInicio);

        if (indice < 0) break;

        const inicioOriginal = mapa[indice];
        const fimOriginal = (mapa[indice + termoNormalizado.length - 1] ?? inicioOriginal) + 1;
        ranges.push([inicioOriginal, fimOriginal]);
        buscaInicio = indice + Math.max(termoNormalizado.length, 1);
    }

    if (!ranges.length) {
        elemento.textContent = textoOriginal;
        return;
    }

    let html = "";
    let cursor = 0;

    ranges.forEach(([inicio, fim]) => {
        html += escaparHtml(textoOriginal.slice(cursor, inicio));
        html += `<mark class="search-match${classeAtiva}">${escaparHtml(textoOriginal.slice(inicio, fim))}</mark>`;
        cursor = fim;
    });

    html += escaparHtml(textoOriginal.slice(cursor));
    elemento.innerHTML = html;
}

function aplicarRealcesPesquisa() {
    limparRealcesPesquisa();

    const paginaAtual = obterPaginaAtualPesquisa();
    searchMatchesAtuais.forEach((match, index) => {
        if (match.pageIndex !== paginaAtual) return;

        realcarElementoPesquisa(match.elemento, match.term, index === searchMatchIndexAtual);
    });
}

function atualizarFeedbackPesquisa() {
    if (!searchFeedbackElement) return;

    if (!searchMatchesAtuais.length) {
        searchFeedbackElement.textContent = "0/0";
        return;
    }

    searchFeedbackElement.textContent = `${searchMatchIndexAtual + 1}/${searchMatchesAtuais.length}`;
}

function focarOcorrenciaPesquisa(index) {
    if (!searchMatchesAtuais.length) {
        searchMatchIndexAtual = -1;
        aplicarRealcesPesquisa();
        atualizarFeedbackPesquisa();
        return;
    }

    searchMatchIndexAtual = (index + searchMatchesAtuais.length) % searchMatchesAtuais.length;
    const match = searchMatchesAtuais[searchMatchIndexAtual];

    irParaPaginaDaFigurinha(match.slot);
    window.setTimeout(() => {
        aplicarRealcesPesquisa();
        atualizarFeedbackPesquisa();
    }, 120);
}

function navegarPesquisa(direcao) {
    if (!searchMatchesAtuais.length) return;
    focarOcorrenciaPesquisa(searchMatchIndexAtual + direcao);
}

function fecharZoom() {
    if (zoomDialogElement) {
        zoomDialogElement.hidden = true;
    }
}

function criarPopupZoom() {
    if (zoomDialogElement) return zoomDialogElement;

    const dialog = document.createElement("section");
    dialog.id = "zoom-dialog";
    dialog.className = "zoom-dialog";
    dialog.hidden = true;
    dialog.tabIndex = -1;
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "zoom-dialog-title");

    dialog.innerHTML = `
        <div class="zoom-dialog-content">
            <h2 id="zoom-dialog-title" class="zoom-dialog-title">Figurinha ampliada</h2>
            <p class="zoom-dialog-role"></p>
            <img class="zoom-dialog-img" alt="">
        </div>
    `;

    dialog.addEventListener("click", fecharZoom);
    document.addEventListener("keydown", (e) => {
        if (!dialog.hidden && e.key === "Escape") {
            fecharZoom();
        }
    });

    document.body.appendChild(dialog);
    zoomDialogElement = dialog;
    return dialog;
}

async function zoom(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/figurinhas/${id}/exibir`);

        if (!response.ok) {
            const erroApi = await response.json().catch(() => null);
            const mensagem = erroApi?.detail || `Erro na API: ${response.status} ${response.statusText}`;
            throw new Error(mensagem);
        }

        const figurinha = await response.json();
        const dialog = criarPopupZoom();
        const title = dialog.querySelector(".zoom-dialog-title");
        const role = dialog.querySelector(".zoom-dialog-role");
        const img = dialog.querySelector(".zoom-dialog-img");
        const screenId = `#${String(id).padStart(2, "0")}`;
        const slot = Array.from(document.querySelectorAll(".sticker-slot")).find(elemento =>
            elemento.querySelector(".slot-number")?.textContent.trim() === screenId
        );
        const nomeFigurinha = slot?.querySelector(".slot-name")?.dataset.searchOriginalText
            || slot?.querySelector(".slot-name")?.textContent
            || figurinha.nome;
        const roleFigurinha = slot?.querySelector(".slot-role")?.dataset.searchOriginalText
            || slot?.querySelector(".slot-role")?.textContent
            || figurinha.categoria
            || "";

        title.textContent = nomeFigurinha;
        role.textContent = roleFigurinha;
        img.src = `${API_BASE_URL}${figurinha.imagem_url}`;
        img.alt = nomeFigurinha;

        dialog.hidden = false;
        dialog.focus();
    } catch (erro) {
        console.warn("⚠️  Não foi possível exibir a figurinha:", erro.message);
    }
}

function pesquisarFigurinha(termoPesquisa) {
    limparRealcesPesquisa();
    searchMatchesAtuais = buscarOcorrenciasPesquisa(termoPesquisa);

    if (!String(termoPesquisa).trim()) {
        searchMatchIndexAtual = -1;
        atualizarFeedbackPesquisa();
        return;
    }

    if (!searchMatchesAtuais.length) {
        searchMatchIndexAtual = -1;
        atualizarFeedbackPesquisa();
        return;
    }

    const paginaAtual = obterPaginaAtualPesquisa();
    const primeiraNaPaginaAtual = searchMatchesAtuais.findIndex(match => match.pageIndex === paginaAtual);
    focarOcorrenciaPesquisa(primeiraNaPaginaAtual >= 0 ? primeiraNaPaginaAtual : 0);

    const exatas = searchMatchesAtuais.filter(match => match.exact);
    if (exatas.length === 1) {
        focarOcorrenciaPesquisa(searchMatchesAtuais.indexOf(exatas[0]));
        window.setTimeout(() => exatas[0].slot.click(), 180);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const bookElement = document.getElementById("book");
    const btnPrev = document.getElementById("btn-prev");
    const btnNext = document.getElementById("btn-next");
    const soundToggle = document.getElementById("sound-toggle");
    const iconOn = soundToggle.querySelector(".sound-icon-on");
    const iconOff = soundToggle.querySelector(".sound-icon-off");
    const searchButton = document.getElementById("search-btn");


    let isMuted = false;
    let pageFlip = null;

    function criarPopupPesquisa() {
        const dialog = document.createElement("section");
        dialog.id = "search-dialog";
        dialog.className = "search-dialog";
        dialog.hidden = true;
        dialog.setAttribute("role", "search");
        dialog.setAttribute("aria-label", "Pesquisar na pagina atual");

        dialog.innerHTML = `
            <div class="search-dialog-content">
                <input id="search_id" name="search_id" class="search-input" type="text" autocomplete="off" aria-label="Pesquisar" aria-describedby="search-feedback">
                <span id="search-feedback" class="search-feedback" role="status" aria-live="polite">0/0</span>
                <button type="button" class="search-nav-btn search-prev-btn" aria-label="Ocorrencia anterior">
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
                        <path fill="currentColor" d="M7.41,15.41L12,10.83l4.59,4.58L18,14l-6,-6l-6,6l1.41,1.41Z" />
                    </svg>
                </button>
                <button type="button" class="search-nav-btn search-next-btn" aria-label="Proxima ocorrencia">
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
                        <path fill="currentColor" d="M7.41,8.59L12,13.17l4.59,-4.58L18,10l-6,6l-6,-6l1.41,-1.41Z" />
                    </svg>
                </button>
                <button type="button" class="search-close-btn" aria-label="Fechar pesquisa">
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
                        <path fill="currentColor" d="M18.3,5.71L12,12l6.3,6.29l-1.41,1.41L10.59,13.41L4.29,19.71L2.88,18.3L9.17,12L2.88,5.71L4.29,4.29l6.3,6.3l6.29,-6.3l1.42,1.42Z" />
                    </svg>
                </button>
            </div>
        `;

        document.body.appendChild(dialog);

        const input = dialog.querySelector("#search_id");
        const previousButton = dialog.querySelector(".search-prev-btn");
        const nextButton = dialog.querySelector(".search-next-btn");
        const closeButton = dialog.querySelector(".search-close-btn");
        searchFeedbackElement = dialog.querySelector("#search-feedback");

        function fecharPopupPesquisa() {
            dialog.hidden = true;
            input.value = "";
            searchMatchesAtuais = [];
            searchMatchIndexAtual = -1;
            limparRealcesPesquisa();
            atualizarFeedbackPesquisa();
            searchButton?.focus();
        }

        function abrirPopupPesquisa() {
            dialog.hidden = false;
            input.focus();
            input.select();
            pesquisarFigurinha(input.value);
        }

        input.addEventListener("input", () => pesquisarFigurinha(input.value));

        input.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                fecharPopupPesquisa();
                return;
            }

            if (e.key === "Enter") {
                e.preventDefault();
                navegarPesquisa(e.shiftKey ? -1 : 1);
            }
        });

        previousButton.addEventListener("click", () => navegarPesquisa(-1));
        nextButton.addEventListener("click", () => navegarPesquisa(1));
        closeButton.addEventListener("click", fecharPopupPesquisa);
        searchButton?.addEventListener("click", abrirPopupPesquisa);
    }

    criarPopupPesquisa();

    // 1. Initialize St.PageFlip
    try {
        pageFlip = new St.PageFlip(bookElement, {
            width: 550, // Base page width
            height: 800, // Base page height
            size: "stretch",
            minWidth: 315,
            maxWidth: 1000,
            minHeight: 420,
            maxHeight: 1350,
            drawShadow: true,
            maxShadowOpacity: 0.4, // Aumenta levemente contraste da sombra
            showCover: true,
            mobileScrollSupport: true,
            useMouseEvents: false, // Desativa gestos padrão do StPageFlip para evitar cliques indesejados nas bordas/páginas
            showPageCorners: false, // Remove dobras dos cantos no hover
            disableFlipByClick: true, // Garante que a virada por cliques simples esteja desativada
            flippingTime: 800 // Transição mais ágil e snappier (800ms em vez de 1000ms)
        });

        // Load pages from HTML
        pageFlip.loadFromHTML(document.querySelectorAll(".page"));
        albumPageFlip = pageFlip;

        // Estado de arraste personalizado
        let activeDragPage = null;
        let isClicking = false;
        let startX = 0;
        let startY = 0;
        let dragStarted = false;
        let touchHandledBySwipe = false;

        // Monitora o mousedown/touchstart em cada página para iniciar a intenção de arraste
        document.querySelectorAll(".page").forEach((page, index) => {
            page.addEventListener("mousedown", (e) => {
                if (e.target.closest("button") || e.target.closest("a")) return;
                isClicking = true;
                startX = e.clientX;
                startY = e.clientY;
                dragStarted = false;
                activeDragPage = { page, index };
            });

            page.addEventListener("touchstart", (e) => {
                if (e.target.closest("button") || e.target.closest("a")) return;
                const touch = e.touches[0];
                isClicking = true;
                startX = touch.clientX;
                startY = touch.clientY;
                dragStarted = false;
                touchHandledBySwipe = false;
                activeDragPage = { page, index };
            });
        });

        const isMobileViewport = () => window.matchMedia("(max-width: 768px)").matches;

        // Executa o movimento de dobra apenas se o mouse/dedo se mover além de um limiar (threshold)
        const handleMove = (clientX, clientY, isTouch = false) => {
            if (!isClicking || !activeDragPage) return;

            const deltaX = clientX - startX;
            const deltaY = clientY - startY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            const bookRect = bookElement.getBoundingClientRect();

            // Só ativa o flip se mover mais de 10px (evita disparar ao clicar e soltar estático)
            if (distance > 10 && !dragStarted) {
                dragStarted = true;
                let cornerX, cornerY;

                // Determina canto vertical (topo vs base) em coordenadas relativas ao livro
                const centerY = bookRect.top + bookRect.height / 2;
                if (startY < centerY) {
                    cornerY = 0; // Canto superior
                } else {
                    cornerY = bookRect.height; // Canto inferior
                }

                // Determina canto horizontal (direita vs esquerda) em coordenadas relativas ao livro
                if (activeDragPage.index % 2 === 0) {
                    cornerX = bookRect.width; // Canto direito
                } else {
                    cornerX = 0; // Canto esquerdo
                }

                document.body.classList.add("dragging");
                pageFlip.startUserTouch({ x: cornerX, y: cornerY });
            }

            if (dragStarted) {
                const relX = clientX - bookRect.left;
                const relY = clientY - bookRect.top;
                pageFlip.userMove({ x: relX, y: relY }, isTouch);
            }
        };

        const handleRelease = (clientX, clientY, isTouch = false) => {
            if (dragStarted) {
                const bookRect = bookElement.getBoundingClientRect();
                const relX = clientX - bookRect.left;
                const relY = clientY - bookRect.top;
                pageFlip.userStop({ x: relX, y: relY }, isTouch);
            }
            isClicking = false;
            dragStarted = false;
            activeDragPage = null;
            document.body.classList.remove("dragging");
        };

        window.addEventListener("mousemove", (e) => {
            handleMove(e.clientX, e.clientY, false);
        });

        window.addEventListener("touchmove", (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];

                if (isMobileViewport() && isClicking && activeDragPage) {
                    const deltaX = touch.clientX - startX;
                    const deltaY = touch.clientY - startY;

                    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
                        touchHandledBySwipe = true;
                    }

                    return;
                }

                handleMove(touch.clientX, touch.clientY, true);
            }
        });

        window.addEventListener("mouseup", (e) => {
            handleRelease(e.clientX, e.clientY, false);
        });

        window.addEventListener("touchend", (e) => {
            const touch = e.changedTouches[0] || e.touches[0];
            if (isMobileViewport() && touchHandledBySwipe && touch) {
                const deltaX = touch.clientX - startX;

                if (deltaX > 0) {
                    pageFlip.turnToPrevPage();
                } else {
                    pageFlip.turnToNextPage();
                }

                atualizarControlesNavegacao(pageFlip.getCurrentPageIndex());
                isClicking = false;
                dragStarted = false;
                touchHandledBySwipe = false;
                activeDragPage = null;
                document.body.classList.remove("dragging");
                return;
            }

            if (touch) {
                handleRelease(touch.clientX, touch.clientY, true);
            } else {
                handleRelease(startX, startY, true);
            }
        });

        // Show book after successful initialization
        bookElement.style.display = "block";

        // Dia 3: Busca as figurinhas da API e preenche o álbum
        // A função é async, chamamos sem await para não bloquear a inicialização do álbum
        preencherFigurinhas();

    } catch (error) {
        console.error("Erro ao inicializar a biblioteca PageFlip:", error);
    }

    // 2. Sound Effect Generator (Web Audio API)
    function playPaperTurnSound() {
        if (isMuted) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            const audioCtx = new AudioContext();
            const duration = 0.45; // seconds
            const sampleRate = audioCtx.sampleRate;
            const bufferSize = sampleRate * duration;
            const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
            const data = buffer.getChannelData(0);

            // Synthesize white noise with a custom page-flip volume envelope
            for (let i = 0; i < bufferSize; i++) {
                const progress = i / bufferSize;
                // Noise value between -1 and 1
                const noise = Math.random() * 2 - 1;

                // Volume envelope: smooth curve that peaks around 30% of the duration
                let envelope = 0;
                if (progress < 0.3) {
                    envelope = progress / 0.3; // Rapid ramp up
                } else {
                    envelope = (1 - progress) / 0.7; // Smooth decay
                }

                // Add minor irregular spikes to simulate paper friction/crackle
                const paperCrackle = Math.random() > 0.985 ? (Math.random() * 2 - 1) * 0.35 : 0;

                data[i] = (noise * 0.65 + paperCrackle) * envelope * 0.12;
            }

            // Create nodes
            const noiseNode = audioCtx.createBufferSource();
            noiseNode.buffer = buffer;

            // Bandpass filter to extract the "whoosh" sound of paper shuffling
            const bandpassFilter = audioCtx.createBiquadFilter();
            bandpassFilter.type = "bandpass";
            bandpassFilter.Q.value = 2.0;

            // Dynamic frequency sweep: starts at 1500Hz, sweeps down to 350Hz (sound of page moving away)
            bandpassFilter.frequency.setValueAtTime(1500, audioCtx.currentTime);
            bandpassFilter.frequency.exponentialRampToValueAtTime(350, audioCtx.currentTime + duration);

            // Lowpass filter to remove harsh high-frequency digital artifacts
            const lowpassFilter = audioCtx.createBiquadFilter();
            lowpassFilter.type = "lowpass";
            lowpassFilter.frequency.setValueAtTime(3800, audioCtx.currentTime);

            // Connect graph: Source -> Bandpass -> Lowpass -> Destination
            noiseNode.connect(bandpassFilter);
            bandpassFilter.connect(lowpassFilter);
            lowpassFilter.connect(audioCtx.destination);

            noiseNode.start();
        } catch (e) {
            console.warn("Falha ao tocar som de virada de página:", e);
        }
    }

    // 3. Audio State Controls
    soundToggle.addEventListener("click", () => {
        isMuted = !isMuted;
        if (isMuted) {
            iconOn.classList.add("hidden");
            iconOff.classList.remove("hidden");
        } else {
            iconOn.classList.remove("hidden");
            iconOff.classList.add("hidden");
        }
    });

    // 4. Navigation controls and events
    if (pageFlip) {
        // Play turn sound when page starts flipping
        pageFlip.on("changeState", (e) => {
            if (e.data === "flipping") {
                playPaperTurnSound();
            }
        });

        // Discrete arrow toggle depending on current page
        pageFlip.on("flip", (e) => {
            const currentPage = e.data;
            atualizarControlesNavegacao(currentPage);
            aplicarRealcesPesquisa();

            if (currentPage === pageFlip.getPageCount() - 1) {
                exibe_estatisticas();
            }
        });

        // Click events for navigational arrows
        btnPrev.addEventListener("click", () => {
            pageFlip.turnToPrevPage();
            atualizarControlesNavegacao(pageFlip.getCurrentPageIndex());
        });

        btnNext.addEventListener("click", () => {
            pageFlip.turnToNextPage();
            atualizarControlesNavegacao(pageFlip.getCurrentPageIndex());
        });

        // Keyboard events for navigational arrows
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft") {
                pageFlip.flipPrev();
            } else if (e.key === "ArrowRight") {
                pageFlip.flipNext();
            }
        });

        // Hide left button initially since start page is 0
        btnPrev.classList.add("hidden");
    }



    // Seleciona o botão de alternância de tema
    const themeToggle = document.getElementById('theme-toggle');

    // Função para alternar o tema
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Atualiza o ícone do botão
        updateButtonIcon(newTheme);
    }

    // Função para atualizar o ícone do botão
    function updateButtonIcon(theme) {
        themeToggle.textContent = theme === 'light' ? '☀️' : '🌙';
    }

    // Verifica o tema salvo no localStorage ao carregar a página
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Padrão dark
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateButtonIcon(savedTheme);

    // Adiciona evento de clique ao botão
    themeToggle.addEventListener('click', toggleTheme);
});
