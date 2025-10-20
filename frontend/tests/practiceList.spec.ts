import { test, expect } from '@playwright/test';

test.describe('PracticeList en HomePage (sin mocks)', () => {
  test('Debe mostrar correctamente las prácticas desde el backend real', async ({
    page,
  }) => {
    console.log('🚀 Iniciando test de PracticeList (sin mocks)');

    // 💾 Simular usuario logueado
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({ id: 99, name: 'Tester' }));
      localStorage.setItem('token', 'mock-token');
      // 👉 fuerza a que HomePage arranque en "topics"
      localStorage.setItem('step', 'topics');
    });

    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    // 🕒 Esperar a que se carguen las prácticas
    const firstPractice = page.locator('[data-testid="practice-card"]').first();
    await expect(firstPractice).toBeVisible({ timeout: 20000 });

    const title = firstPractice.locator('h2, h3, h4');
    await expect(title).toBeVisible();

    console.log('✅ PracticeList cargada correctamente desde el backend');
  });
});
