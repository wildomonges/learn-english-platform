import { test, expect } from '@playwright/test';

test.describe('Audio desde lista de prácticas (mockeado)', () => {
  test('Debe abrir la práctica y cambiar la velocidad del audio', async ({
    page,
  }) => {
    // Mock de /practices
    await page.route(/.*practices.*/i, async (route) => {
      console.log('📡 Interceptado:', route.request().url());
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 123,
            title: 'Practice On English For Developer',
            description: 'Simulated dialog for testing audio',
            language: 'English',
            createdAt: '2024-10-01T00:00:00.000Z',
            updatedAt: '2024-10-01T00:00:00.000Z',
          },
        ]),
      });
    });

    // --- 2️⃣ Ir a la app ---
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    // Log para depurar llamadas reales
    page.on('request', (req) => console.log('➡️', req.url()));
    page.on('response', (res) => console.log('⬅️', res.url(), res.status()));

    //  Esperar a que aparezca la práctica mockeada
    const practiceCard = page.getByText(/practice on english for developer/i);
    await expect(practiceCard).toBeVisible({ timeout: 30000 });

    //  Entrar en la práctica
    const continueBtn = page.getByRole('button', { name: /continuar/i });
    if (await continueBtn.isVisible()) {
      await continueBtn.click();
    } else {
      await practiceCard.click();
    }

    // Esperar la carga del diálogo ---
    await expect(page.getByText(/hi! what do you do\?/i)).toBeVisible({
      timeout: 20000,
    });

    // Cambiar velocidad ---
    const speedButton = page.getByRole('button', { name: /velocidad/i });
    await expect(speedButton).toBeVisible();
    await speedButton.click();

    const speedOption = page.getByText('1.25x');
    await expect(speedOption).toBeVisible();
    await speedOption.click();

    //Verificar el cambio ---
    const label = page.getByText(/velocidad: 1.25x/i);
    await expect(label).toBeVisible();

    console.log('✅ Test completado correctamente');
  });
});
