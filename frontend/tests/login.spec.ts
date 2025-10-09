import { test, expect } from '@playwright/test';

test.describe('Formulario de Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
  });

  test('Muestra errores si los campos son inválidos', async ({ page }) => {
    await page.fill(
      'input[placeholder="Correo electrónico"]',
      'correo_invalido'
    );
    await page.fill('input[placeholder="Contraseña"]', '123');
    await page.getByRole('button', { name: 'Iniciar' }).click();
    const errores = page.locator('.error-text');
    await expect(errores.nth(0)).toContainText('El correo no es válido.');
    await expect(errores.nth(1)).toContainText(
      'La contraseña debe tener entre 6 y 20 caracteres.'
    );
  });

  test('Permite login con datos correctos', async ({ page }) => {
    await page.route('**/auth/sign_in', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'fake_token',
          user: { id: 1, name: 'Test User', email: 'test@example.com' },
        }),
      });
    });
    await page.fill(
      'input[placeholder="Correo electrónico"]',
      'test@example.com'
    );
    await page.fill('input[placeholder="Contraseña"]', '123456');
    await page.getByRole('button', { name: 'Iniciar' }).click();
    await page.waitForURL('http://localhost:5173/');
    await expect(page.locator('.error-text')).toHaveCount(0);
  });
});
