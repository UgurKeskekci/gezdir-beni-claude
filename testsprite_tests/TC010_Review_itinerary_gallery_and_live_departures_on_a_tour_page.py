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
        
        # -> Click the 'Turlar' link to open the tours listing.
        # Turlar link
        elem = page.get_by_role("banner").get_by_role("link", name="Turlar")
        await elem.click(timeout=10000)
        
        # -> Click the 'Kapadokya Balon Rotası' tour card to open its detail page.
        # Kapadokya Balon Rotası link
        elem = page.get_by_role("link", name="Kapadokya Balon Rotası")
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> The day-by-day itinerary is shown (daily items are listed under the program).
        # Assert-outcome: passed
        # Assert: A day label (e.g. 'gün') is visible in the itinerary list.
        await expect(page.locator("ol").nth(0)).to_contain_text("g\u00fcn", timeout=15000), "A day label (e.g. 'g\u00fcn') is visible in the itinerary list."
        
        # --> The tour gallery is visible with photographer credits.
        # Assert-outcome: passed
        # Assert: A gallery photo credit 'Bernard Gagnon' is present.
        await expect(page.locator("xpath=/html/body/div[2]/main/div/article/div/div/div/section[3]/div[2]/figure[1]/p/a").nth(0)).to_have_text("Bernard Gagnon", timeout=15000), "A gallery photo credit 'Bernard Gagnon' is present."
        
        # --> Live departure availability is shown with a selectable 'Bu tarihi seç' link.
        # Assert-outcome: passed
        # Assert: A 'Bu tarihi seç' link for choosing a departure date is visible.
        await expect(page.locator("xpath=/html/body/div[2]/main/div/article/div/div/aside/div/ul/li[1]/div[2]/a").nth(0)).to_have_text("Bu tarihi se\u00e7", timeout=15000), "A 'Bu tarihi se\u00e7' link for choosing a departure date is visible."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    