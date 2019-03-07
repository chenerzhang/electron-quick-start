// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

setTimeout(() => {
  const $webview1 = document.querySelector('#webview1');
  const $webview2 = document.querySelector('#webview2');
  const $webview3 = document.querySelector('#webview3');

  $webview1.openDevTools();
  $webview2.openDevTools();
  $webview3.openDevTools();
}, 2000);