// filepath: /Users/apple/Downloads/project 4 copy/frontend/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    base: '/', // Set the base path for the application
});
