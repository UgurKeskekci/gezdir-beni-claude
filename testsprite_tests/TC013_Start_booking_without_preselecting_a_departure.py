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
        
        # -> Open the 'Turlar' (Tours) page so a tour card can be selected.
        await page.goto("http://localhost:3000/tr/tours")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the 'Kapadokya Balon Rotası' tour card to open its detail page.
        # Kapadokya Balon Rotası link
        elem = page.get_by_role("link", name="Kapadokya Balon Rotası")
        await elem.click(timeout=10000)
        
        # -> Click the 'Rezervasyon yap' (Start booking) button on the tour page to open the booking/checkout flow.
        # Rezervasyon yap link
        elem = page.get_by_role("link", name="Rezervasyon yap")
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Booking page opened at /tr/tours/kapadokya-balon-rotasi/book.
        # Assert-outcome: passed
        # Assert: The browser URL contains the booking path.
        await expect(page).to_have_url(re.compile("/tr/tours/kapadokya\\-balon\\-rotasi/book"), timeout=15000), "The browser URL contains the booking path."
        
        # --> The booking form shows a populated departure (Tarih) select including '1 Ekim 2026'.
        # Assert-outcome: passed
        # Assert: The departure date select contains the date option '1 Ekim 2026'.
        await expect(page.get_by_label("Tarih").nth(0)).to_contain_text("1 Ekim 2026", timeout=15000), "The departure date select contains the date option '1 Ekim 2026'."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    