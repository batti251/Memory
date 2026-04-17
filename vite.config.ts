import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
        game: 'game.html',
        settings: 'settings.html',
      },
    },
  },
});