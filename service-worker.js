self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open('randomquote').then(function (cache) {
      return cache.addAll([
        './',
        './index.html',
        './src/main.js',
        './src/index.css'
      ]);
    })
  );
});

self.addEventListener('fetch', function (event) {
  const url = event.request.url;
  if (url.startsWith('https://andruxnet-random-famous-quotes.p.mashape.com/') || 
      url.startsWith('http://quotes.rest/qod')) {
    if (!navigator.onLine){
      event.respondWith(new Response({
        status: 200
      }));
      return; 
    }
  }
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});