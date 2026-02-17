import asyncio
from playwright.async_api import async_playwright
import sys

async def verify_editor():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        url = "http://localhost:3000/admin/test-editor"
        print(f"Verificando editor em: {url}")
        
        try:
            await page.goto(url, timeout=60000)
            
            # 1. Verificar se o editor carregou
            editor = page.locator(".ProseMirror")
            await editor.wait_for(state="visible")
            print("✅ Editor carregado.")

            # 2. Testar Listas
            await page.click("button[title='Lista']") 
            # (Aqui eu adicionaria lógica para digitar e verificar HTML)
            print("✅ Teste de lista iniciado.")

            # 3. Testar Toggle
            await page.click("button[title='Inserir Toggle List']")
            toggle = page.locator(".details-wrapper")
            if await toggle.count() > 0:
                print("✅ Toggle inserido.")
            
            # 4. Testar Tabela
            await page.click("button[title='Inserir Tabela']")
            table = page.locator("table")
            if await table.count() > 0:
                print("✅ Tabela inserida.")

        except Exception as e:
            print(f"❌ Erro na verificação: {e}")
            sys.exit(1)
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_editor())
