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
        
        # -> Open the 'Turlar' (Tours) page by navigating to /tr/tours.
        await page.goto("http://localhost:3000/tr/tours")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the 'Kapadokya Balon Rotası' tour card to open its tour page.
        # Kapadokya Balon Rotası link
        elem = page.get_by_role("link", name="Kapadokya Balon Rotası")
        await elem.click(timeout=10000)
        
        # -> Click the 'Rezervasyon yap' (Book) button to go to checkout after the date selection has been applied.
        # Bu tarihi seç link
        elem = page.get_by_role("listitem").filter(has_text="1 Ekim 2026son 1 yer kaldı₺18").get_by_role("link")
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> The checkout page is displayed with the primary action button 'Rezervasyonu tamamla'.
        # Assert-outcome: passed
        # Assert: The checkout page shows the primary action button labeled 'Rezervasyonu tamamla'.
        await expect(page.get_by_role("button").nth(0)).to_have_text("Rezervasyonu tamamla", timeout=15000), "The checkout page shows the primary action button labeled 'Rezervasyonu tamamla'."
        
        # --> The chosen departure '1 Ekim 2026' is preselected in the departure dropdown on checkout.
        # Assert-outcome: passed
        # Assert: The departure dropdown includes the chosen date '1 Ekim 2026'.
        await expect(page.get_by_label("Tarih").nth(0)).to_contain_text("1 Ekim 2026", timeout=15000), "The departure dropdown includes the chosen date '1 Ekim 2026'."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    