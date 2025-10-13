import { test, expect } from '@playwright/test';

test.describe('Flujo completo de práctica', () => {
  test('Flujo desde bienvenida hasta carga de diálogo', async ({ page }) => {
    // --- Paso 1: Página de bienvenida ---
    await page.goto('http://localhost:5173');
    await expect(page.getByText(/bienvenido/i)).toBeVisible({ timeout: 20000 });

    // Click en "Empezar"
    const startButton = page.getByRole('button', { name: /empezar/i });
    await expect(startButton).toBeVisible();
    await startButton.click();

    // --- Paso 2: Carga de temas (topics) ---
    await expect(page.getByText(/qué te interesa aprender/i)).toBeVisible({
      timeout: 20000,
    });

    const topicButtons = page.locator('.button-group button');
    await topicButtons.first().waitFor({ state: 'visible', timeout: 20000 });

    // Seleccionamos el primer topic
    await topicButtons.first().click();

    // --- Paso 3: Ver Interests ---
    await expect(page.getByText(/qué área/i)).toBeVisible({ timeout: 20000 });

    const interestButtons = page.locator('.button-group button');
    await interestButtons.first().waitFor({ state: 'visible', timeout: 20000 });

    // Seleccionamos el primer interés
    await interestButtons.first().click();

    // --- Paso 4: Carga del diálogo ---
    await expect(page.getByText(/diálogo|dialog/i)).toBeVisible({
      timeout: 20000,
    });

    // Esperar a que aparezcan las líneas del diálogo
    const dialogLines = page.locator(
      '.dialog-line, .dialog-pair, .practice-chat'
    );
    await dialogLines.first().waitFor({ state: 'visible', timeout: 20000 });
  });
});
