from fastapi import FastAPI

# Cria a instância principal da aplicação FastAPI
app = FastAPI()

# Define uma rota HTTP GET no caminho raiz "/"
@app.get("/")
def hello_world():
    # Retorna o dicionário Python, que o FastAPI automaticamente converte para JSON
    return {"mensagem": "Olá, mundo! 🌍"}
