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
        
        # -> Click the 'English' language switcher in the page header to change the site language to English while staying on the same page.
        # English en link
        elem = page.get_by_role("link", name="English")
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> The page UI is displayed in English (header shows 'Tours').
        # Assert-outcome: passed
        # Assert: Header navigation link reads 'Tours'.
        await expect(page.locator("xpath=/html/body/div[3]/header/div/nav/a[1]").nth(0)).to_have_text("Tours", timeout=15000), "Header navigation link reads 'Tours'."
        
        # --> Switching to English kept the user on the home page.
        await page.locator("xpath=/html/body/div[3]/main/div/section[1]/div[3]/div[1]/div[1]/div/a[1]").nth(0).scroll_into_view_if_needed()
        # Assert-outcome: passed
        # Assert: The home page 'Explore tours' button is visible, indicating the home content is present.
        await expect(page.locator("xpath=/html/body/div[3]/main/div/section[1]/div[3]/div[1]/div[1]/div/a[1]").nth(0)).to_be_visible(timeout=15000), "The home page 'Explore tours' button is visible, indicating the home content is present."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    