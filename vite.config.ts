/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Project Pages serve from https://<user>.github.io/<repo>/, so the
  // production build needs that sub-path as its base. Dev/preview stay at '/'.
  base: command === 'build' ? '/Greeks-Lab/' : '/',
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
}))
