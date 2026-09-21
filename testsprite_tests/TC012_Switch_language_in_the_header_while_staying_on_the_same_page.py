import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        # Wider default timeout to match the agent's DOM-stability budget;
        # auto-waiting Playwright APIs (expect, locator.wait_for) inherit this.
        context.set_default_timeout(15000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> navigate
        await page.goto("http://localhost:3000")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Open the 'Turlar' page by navigating to /tr/tours.
        await page.goto("http://localhost:3000/tr/tours")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the 'English' language link in the header
        # English en link
        elem = page.get_by_role("link", name="English")
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Page content is displayed in English as shown by the header label 'Tours'.
        # Assert-outcome: passed
        # Assert: Header navigation shows the 'Tours' label in English.
        await expect(page.locator("xpath=/html/body/div[3]/header/div/nav/a[1]").nth(0)).to_have_text("Tours", timeout=15000), "Header navigation shows the 'Tours' label in English."
        
        # --> The tour catalogue remains visible after switching to English (a tour card is present).
        # Assert-outcome: passed
        # Assert: A tour card titled 'Cappadocia Balloon Route' is visible, indicating the catalogue remained open.
        await expect(page.locator("xpath=/html/body/div[3]/main/div/div/div[2]/div[1]/article/div[2]/div[1]/h3/a").nth(0)).to_have_text("Cappadocia Balloon Route", timeout=15000), "A tour card titled 'Cappadocia Balloon Route' is visible, indicating the catalogue remained open."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    