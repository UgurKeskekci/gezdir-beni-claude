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
        
        # -> Click the 'Kapadokya Balon Rotası' tour card link to open its detail page.
        # Kapadokya Balon Rotası link
        elem = page.get_by_role("link", name="Kapadokya Balon Rotası", exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> The tour detail page opened for the Kapadokya Balon Rotası tour.
        # Assert-outcome: passed
        # Assert: The browser is on the tour detail URL for Kapadokya Balon Rotası.
        await expect(page).to_have_url(re.compile("/tr/tours/kapadokya\\-balon\\-rotasi"), timeout=15000), "The browser is on the tour detail URL for Kapadokya Balon Rotas\u0131."
        
        # --> The tour's itinerary (Günlük program) is displayed on the detail page.
        # Assert-outcome: passed
        # Assert: An itinerary day label ('1 gün') is visible in the Günlük program section.
        await expect(page.locator("xpath=/html/body/div[2]/main/div/article/div/div/div/section[2]/ol/li[1]/span").nth(0)).to_have_text("1\\ng\u00fcn", timeout=15000), "An itinerary day label ('1 g\u00fcn') is visible in the G\u00fcnl\u00fck program section."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    