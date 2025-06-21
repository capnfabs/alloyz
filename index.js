if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(new URL('./service-worker.js', import.meta.url));
  });
}

console.log('App loaded!');
