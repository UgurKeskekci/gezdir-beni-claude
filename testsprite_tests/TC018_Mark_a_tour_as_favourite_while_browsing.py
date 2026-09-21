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
        
        # -> Navigate to the 'Turlar' (Tours) page (/tr/tours) to view the full tour catalogue.
        await page.goto("http://localhost:3000/tr/tours")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the 'Favorilere ekle' (Add to favourites) button on the Kapadokya Balon Rotası tour card to toggle its favourite state.
        # Favorilere ekle button
        elem = page.get_by_role("article").filter(has_text="En çok satanÜrgüp, Tü").get_by_label("Favorilere ekle")
        await elem.click(timeout=10000)
        
        # -> Scroll the tours list and verify the 'Kapadokya Balon Rotası' card still shows the favourited heart (aria-pressed=true) while browsing the catalogue.
        await page.mouse.wheel(0, 300)
        
        # -> Confirm the Kapadokya Balon Rotası card displays the 'Favorilerden çıkar' (favourited) button with aria-pressed=true, then scroll the catalogue and re-check that the 'Favorilerden çıkar' button still appears with aria-pressed=true.
        await page.mouse.wheel(0, 300)
        
        # --> Assertions to verify final state
        
        # --> The Kapadokya Balon Rotası card shows a favourited state (button label changed and aria-pressed=true).
        # Assert-outcome: passed
        # Assert: The favourite button has aria-pressed=true.
        await expect(page.get_by_role("button", name="Favorilerden çıkar").nth(0)).to_have_attribute("aria-pressed", "true", timeout=15000), "The favourite button has aria-pressed=true."
        # Assert-outcome: passed
        # Assert: The favourite button's aria-label is 'Favorilerden çıkar'.
        await expect(page.get_by_role("button", name="Favorilerden çıkar").nth(0)).to_have_attribute("aria-label", "Favorilerden \u00e7\u0131kar", timeout=15000), "The favourite button's aria-label is 'Favorilerden \u00e7\u0131kar'."
        
        # --> The favourited control remained visible while browsing the tour catalogue.
        await page.get_by_role("button", name="Favorilerden çıkar").nth(0).scroll_into_view_if_needed()
        # Assert-outcome: passed
        # Assert: The favourited button is visible after scrolling the catalogue.
        await expect(page.get_by_role("button", name="Favorilerden çıkar").nth(0)).to_be_visible(timeout=15000), "The favourited button is visible after scrolling the catalogue."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    