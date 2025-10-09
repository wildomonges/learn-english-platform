import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // carpeta donde están los tests
  timeout: 30 * 1000, // 30 segundos por test
  expect: {
    timeout: 5000, // espera máxima de cada expect()
  },

  // Graba videos y screenshots solo si un test falla
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: 'http://localhost:5173', // URL base de tu app
    headless: false, // para ver las pruebas en modo visual
  },

  // Solo usar Chromium (más rápido)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Antes de correr los tests, levantar tu servidor local (npm run dev)
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI, // reutiliza si ya está levantado
  },

  reporter: [['html', { open: 'never' }]], // genera el reporte HTML
});
