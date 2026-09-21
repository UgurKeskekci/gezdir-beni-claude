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
        
        # -> Open the booking page for 'Kapadokya Balon Rotası' (the booking URL /tr/tours/kapadokya-balon-rotasi/book).
        await page.goto("http://localhost:3000/tr/tours/kapadokya-balon-rotasi/book")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Open the 'Tarih' (Date) dropdown to view available departure dates.
        # 1 Ekim 2026 22 Ekim 2026 12 Kasım 2026 3 Aralık... dropdown
        elem = page.get_by_label("Tarih")
        await elem.click(timeout=10000)
        
        # -> Select the '22 Ekim 2026' departure date from the 'Tarih' dropdown and then observe the page for updates.
        # 1 Ekim 2026 22 Ekim 2026 12 Kasım 2026 3 Aralık... dropdown
        elem = page.locator("xpath=/html/body/div[2]/main/div/div/div[2]/form/div/section/div/div/select").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.select_option("")
        
        # -> Fill the booking form: enter 'Guest Booker' into Ad soyad, 'guest@example.com' into E-posta, a valid phone number into Telefon, 'Test Street 1' into Adres, and set the Kart üzerindeki isim (cardholder) to 'Guest Booker'.
        # fullName text field
        elem = page.get_by_role("textbox", name="Ad soyad")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Guest Booker")
        
        # -> Fill the booking form: enter 'Guest Booker' into Ad soyad, 'guest@example.com' into E-posta, a valid phone number into Telefon, 'Test Street 1' into Adres, and set the Kart üzerindeki isim (cardholder) to 'Guest Booker'.
        # email email field
        elem = page.get_by_role("textbox", name="E-posta")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("guest@example.com")
        
        # -> Fill the booking form: enter 'Guest Booker' into Ad soyad, 'guest@example.com' into E-posta, a valid phone number into Telefon, 'Test Street 1' into Adres, and set the Kart üzerindeki isim (cardholder) to 'Guest Booker'.
        # phone tel field
        elem = page.get_by_role("textbox", name="Telefon")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("555-123-4567")
        
        # -> Fill the booking form: enter 'Guest Booker' into Ad soyad, 'guest@example.com' into E-posta, a valid phone number into Telefon, 'Test Street 1' into Adres, and set the Kart üzerindeki isim (cardholder) to 'Guest Booker'.
        # addressLine1 text field
        elem = page.get_by_role("textbox", name="Adres")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Test Street 1")
        
        # -> Fill the booking form: enter 'Guest Booker' into Ad soyad, 'guest@example.com' into E-posta, a valid phone number into Telefon, 'Test Street 1' into Adres, and set the Kart üzerindeki isim (cardholder) to 'Guest Booker'.
        # cardHolder text field
        elem = page.get_by_role("textbox", name="Kart üzerindeki isim")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Guest Booker")
        
        # -> Select the 'Kişi sayısı' dropdown and choose '2', then fill City and Posta kodu and click the 'Rezervasyonu tamamla' button.
        # 1 2 3 4 5 6 dropdown
        elem = page.locator("xpath=/html/body/div[2]/main/div/div/div[2]/form/div/section/div/div[2]/select").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.select_option("")
        
        # -> Select the 'Kişi sayısı' dropdown and choose '2', then fill City and Posta kodu and click the 'Rezervasyonu tamamla' button.
        # city text field
        elem = page.get_by_role("textbox", name="Şehir")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Goreme")
        
        # -> Select the 'Kişi sayısı' dropdown and choose '2', then fill City and Posta kodu and click the 'Rezervasyonu tamamla' button.
        # postalCode text field
        elem = page.get_by_role("textbox", name="Posta kodu")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("50180")
        
        # -> Select the 'Kişi sayısı' dropdown and choose '2', then fill City and Posta kodu and click the 'Rezervasyonu tamamla' button.
        # Rezervasyonu tamamla button
        elem = page.get_by_role("button", name="Rezervasyonu tamamla")
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> A booking confirmation banner is shown on the page.
        # Assert-outcome: passed
        # Assert: The confirmation banner contains the text 'Rezervasyonun alındı'.
        await expect(page.get_by_role("main").nth(0)).to_contain_text("Rezervasyonun al\u0131nd\u0131", timeout=15000), "The confirmation banner contains the text 'Rezervasyonun al\u0131nd\u0131'."
        
        # --> A reservation reference is displayed on the confirmation page.
        # Assert-outcome: passed
        # Assert: The confirmation area shows a reservation number label ('Rezervasyon numarası').
        await expect(page.get_by_role("main").nth(0)).to_contain_text("Rezervasyon numaras\u0131", timeout=15000), "The confirmation area shows a reservation number label ('Rezervasyon numaras\u0131')."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    