// Modules to control application life and create native browser window
const {app, BrowserWindow, protocol, session} = require('electron');
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const CUSTOM_SCHEME = 'miniapp';
const LOCAL_HTML_PATH = '/Users/cez/code/github/electron-quick-start/html';
protocol.registerStandardSchemes([CUSTOM_SCHEME]);
app.on('ready', () => {
  const partition1 = 'persist:webview1';
  const partition2 = 'persist:webview2';
  const ses1 = session.fromPartition(partition1);
  const ses2 = session.fromPartition(partition2);
  
  const ses1Url = `${CUSTOM_SCHEME}://webview1.com`;
  ses1.cookies.set({
    url: ses1Url,
    name: 'webview1-cookie',
    value: 'wenview1'
  }, (err) => {
    if (err) console.error('set webview1 cookie error', err);
  });
  ses1.protocol.registerFileProtocol(CUSTOM_SCHEME, (request, callback) => {
    const url = request.url.replace(ses1Url, '');
    console.log(url);
    callback(path.normalize(`${LOCAL_HTML_PATH}${url}`));
  }, (error) => {
    if (error) {
      console.error('registerFileProtocol 1 error', error);
    }
  });

  const ses2Url = `${CUSTOM_SCHEME}://webview2.com`;
  ses2.cookies.set({
    url: ses2Url,
    name: 'webview2-cookie',
    value: 'wenview2'
  }, (err) => {
    if (err) console.error('set webview2 cookie error', err);
  });
  ses2.protocol.registerFileProtocol(CUSTOM_SCHEME, (request, callback) => {
    const url = request.url.replace(ses2Url, '');
    console.log(url);
    callback(path.normalize(`${LOCAL_HTML_PATH}${url}`));
  }, (error) => {
    if (error) {
      console.error('registerFileProtocol 2 error', error);
    }
  });

  // 设置主端 cookie
  const mainCookie = {
    url: 'https://zjurl.cn',
    name: 'main-cookie',
    value: 'main'
  };
  session.defaultSession.cookies.set(mainCookie, (err) => {
    if (err) console.error('set main cookie error', err);
  });
  session.defaultSession.cookies.get({}, (error, cookies) => {
    console.log(error, cookies)
  })
});

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
