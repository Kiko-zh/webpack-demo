console.log('kiki zhang')

// 浏览器支持serviceWorker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('service-worker-registed')
    }).catch(err => {
      console.log('service-worker-error')
    })
  })
}