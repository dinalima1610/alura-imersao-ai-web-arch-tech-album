import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
# Cria a instância principal da aplicação FastAPI
app = FastAPI()

# Configuração obrigatória do CORS para o navegador aceitar as requisições
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, deve ser substituído pelo link do front-end
    allow_credentials=True,
    allow_methods=["*"],  # Permite GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],
)

# Define o caminho absoluto da pasta de imagens (para o servidor encontrar
# a pasta independente de onde for executado)
PASTA_BASE = os.path.dirname(os.path.abspath(__file__))
PASTA_IMAGENS = os.path.join(PASTA_BASE, "figurinhas")

# Configura os arquivos estáticos: "monte" a pasta PASTA_IMAGENS na rota "/imgs"
# usando StaticFiles, com name="imgs"
app.mount("/imgs", StaticFiles(directory=PASTA_IMAGENS), name="imgs")

# Lista de figurinhas com as informações dos personagens e a URL da imagem correspondente
figurinhas = [
    {
        "id": 1, 
        "nome": "Alan Turing", 
        "categoria": "IA", 
        "imagem_url": "/imgs/01-alan-turing.jpg"
    },
    {
        "id": 2, 
        "nome": "John McCarthy", 
        "categoria": "IA", 
        "imagem_url": "/imgs/02-john-mccarthy.jpg"
    }
]

# Endpoint para listar as figurinhas cadastradas
@app.get("/figurinhas")
def listar_figurinhas():
    # Retorna a lista de figurinhas, convertida automaticamente para JSON pelo FastAPI
    return figurinhas

