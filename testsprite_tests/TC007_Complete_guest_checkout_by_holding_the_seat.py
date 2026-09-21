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
        
        # -> Open the booking page for 'Kapadokya Balon Rotası'.
        await page.goto("http://localhost:3000/tr/tours/kapadokya-balon-rotasi/book")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Open the 'Tarih' (departure date) dropdown and view available date options.
        # 1 Ekim 2026 22 Ekim 2026 12 Kasım 2026 3 Aralık... dropdown
        elem = page.get_by_label("Tarih")
        await elem.click(timeout=10000)
        
        # -> Select the '22 Ekim 2026' option in the 'Tarih' (Date) dropdown and then check whether the 'Kişi sayısı' (traveller) select and 'Bu tarihte kalan yer' text update accordingly.
        # 1 Ekim 2026 22 Ekim 2026 12 Kasım 2026 3 Aralık... dropdown
        elem = page.locator("xpath=/html/body/div[2]/main/div/div/div[2]/form/div/section/div/div/select").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.select_option("")
        
        # -> Select '2' from the 'Kişi sayısı' (travellers) dropdown.
        # 1 2 3 4 5 6 dropdown
        elem = page.locator("xpath=/html/body/div[2]/main/div/div/div[2]/form/div/section/div/div[2]/select").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.select_option("")
        
        # -> Select '2' from the 'Kişi sayısı' (travellers) dropdown.
        # fullName text field
        elem = page.get_by_role("textbox", name="Ad soyad")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Guest Booker")
        
        # -> Select '2' from the 'Kişi sayısı' (travellers) dropdown.
        # email email field
        elem = page.get_by_role("textbox", name="E-posta")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("guest@example.com")
        
        # -> Select '2' from the 'Kişi sayısı' (travellers) dropdown.
        # paymentMode radio button
        elem = page.get_by_role("radio", name="Şimdilik sadece yer ayır")
        await elem.click(timeout=10000)
        
        # -> Fill the 'Telefon' field and required billing address fields, then click the 'Rezervasyonu tamamla' button to submit the booking.
        # phone tel field
        elem = page.get_by_role("textbox", name="Telefon")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("555-123-4567")
        
        # -> Fill the 'Telefon' field and required billing address fields, then click the 'Rezervasyonu tamamla' button to submit the booking.
        # addressLine1 text field
        elem = page.get_by_role("textbox", name="Adres")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Test Street 1")
        
        # -> Fill the 'Telefon' field and required billing address fields, then click the 'Rezervasyonu tamamla' button to submit the booking.
        # city text field
        elem = page.get_by_role("textbox", name="Şehir")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Istanbul")
        
        # -> Fill the 'Telefon' field and required billing address fields, then click the 'Rezervasyonu tamamla' button to submit the booking.
        # postalCode text field
        elem = page.get_by_role("textbox", name="Posta kodu")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("34000")
        
        # -> Fill the 'Telefon' field and required billing address fields, then click the 'Rezervasyonu tamamla' button to submit the booking.
        # Rezervasyonu tamamla button
        elem = page.get_by_role("button", name="Rezervasyonu tamamla")
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> A pending booking confirmation is shown with the header 'Rezervasyonun alındı'.
        # Assert-outcome: passed
        # Assert: The confirmation header 'Rezervasyonun alındı' is visible on the page.
        await expect(page.get_by_role("main").nth(0)).to_contain_text("Rezervasyonun al\u0131nd\u0131", timeout=15000), "The confirmation header 'Rezervasyonun al\u0131nd\u0131' is visible on the page."
        
        # --> The booking reference 'GB-3YHDCH' is displayed on the confirmation page.
        # Assert-outcome: passed
        # Assert: The reservation reference 'GB-3YHDCH' is visible on the confirmation page.
        await expect(page.get_by_role("main").nth(0)).to_contain_text("GB-3YHDCH", timeout=15000), "The reservation reference 'GB-3YHDCH' is visible on the confirmation page."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    