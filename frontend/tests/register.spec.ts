import { test, expect } from '@playwright/test';

test('🧍 Permite al usuario registrarse manualmente y verifica el éxito', async ({
  page,
}) => {
  //  Aumentamos el timeout global del test a 70 segundos
  test.setTimeout(70000);

  console.log('Abriendo formulario de registro...');
  await page.goto('http://localhost:5173/register');

  // Esperar a que cargue el formulario
  await expect(
    page.getByRole('heading', { name: /registrarse/i })
  ).toBeVisible();

  console.log(' Esperando que completes el formulario manualmente...');
  console.log(' Completa los campos y haz clic en "Crear cuenta".');
  console.log(' El test esperará 40 segundos antes de verificar.');

  //  Te da 40 segundos para tipear y enviar
  await page.waitForTimeout(40000);

  // Luego verifica que se muestre el mensaje
  const successMsg = page.locator('p', { hasText: /registro exitoso/i });
  await expect(successMsg).toBeVisible({ timeout: 15000 });

  console.log('Registro exitoso detectado correctamente.');
});
