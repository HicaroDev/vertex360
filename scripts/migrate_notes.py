import os
import re
import json
from pathlib import Path

# Configuração de caminhos
BASE_DIR = Path(r"c:\n\PRODUTOS RV\METÓDO VERTEX 360\Clientes")
OUTPUT_FILE = Path(r"c:\n\rv-portal\scripts\migration_data.json")

def clean_html(html_content):
    # Remove scripts e estilos
    html_content = re.sub(r'<style.*?>.*?</style>', '', html_content, flags=re.DOTALL)
    html_content = re.sub(r'<script.*?>.*?</script>', '', html_content, flags=re.DOTALL)
    
    # Extrair o corpo da página (Notion export usa .page-body)
    body_match = re.search(r'<div class="page-body">(.*?)</div>\s*</article>', html_content, flags=re.DOTALL)
    if body_match:
        content = body_match.group(1)
    else:
        # Fallback para o corpo inteiro
        content = re.sub(r'<body.*?>(.*?)</body>', r'\1', html_content, flags=re.DOTALL)

    # Limpeza básica de tags mantendo quebras de linha para legibilidade
    content = re.sub(r'</p>', '\n', content)
    content = re.sub(r'</li>', '\n', content)
    content = re.sub(r'<br\s*/?>', '\n', content)
    content = re.sub(r'<h[1-6].*?>(.*?)</h[1-6]>', r'\n\n# \1\n', content)
    
    # Remove o restante das tags
    content = re.sub(r'<.*?>', '', content)
    
    # Decodificar entidades HTML comuns
    content = content.replace('&nbsp;', ' ').replace('&lt;', '<').replace('&gt;', '>').replace('&amp;', '&').replace('&quot;', '"')
    
    return content.strip()

def extract_title(html_content):
    title_match = re.search(r'<title>(.*?)</title>', html_content)
    if title_match:
        return title_match.group(1).split(' - ')[0].split(' 1d')[0].split(' 2d')[0].strip()
    return "Sem Título"

def migrate():
    migration_results = []
    
    if not BASE_DIR.exists():
        print(f"Diretório base não encontrado: {BASE_DIR}")
        return

    print(f"Iniciando busca em: {BASE_DIR}")
    
    for client_path in BASE_DIR.iterdir():
        if client_path.is_dir() and "Pasta Modelo" not in client_path.name:
            client_name = client_path.name
            print(f"Processando Cliente: {client_name}")
            
            # Busca recursiva por arquivos HTML
            for html_file in client_path.rglob("*.html"):
                # Ignorar arquivos que parecem ser índices de diretório (geralmente repetem o nome da pasta)
                if html_file.name.startswith(client_name) and len(html_file.name) < len(client_name) + 40:
                    # Muitas vezes o Notion gera um html com o nome da pasta que é apenas um índice
                    # Vamos tentar identificar se é um arquivo de conteúdo real
                    pass

                try:
                    with open(html_file, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    title = extract_title(content)
                    cleaned_body = clean_html(content)
                    
                    if len(cleaned_body) < 50: # Pular arquivos vazios ou apenas índices
                        continue
                        
                    migration_results.append({
                        "id": str(html_file.stem),
                        "client_name": client_name,
                        "title": title,
                        "content": cleaned_body,
                        "source_path": str(html_file),
                        "category": "note" if "Reunião" in title or "Reunião" in str(html_file) else "document"
                    })
                except Exception as e:
                    print(f"Erro ao processar {html_file}: {e}")

    # Salvar resultados
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(migration_results, f, ensure_ascii=False, indent=2)
    
    print(f"Migração concluída! {len(migration_results)} documentos processados.")
    print(f"Dados salvos em: {OUTPUT_FILE}")

if __name__ == "__main__":
    migrate()
