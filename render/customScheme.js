const { ipcRenderer } = require('electron');

ipcRenderer.on('chat.com', function(event, args) {
  console.log(args);
});

