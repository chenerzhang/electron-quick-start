const {app, protocol, session} = require('electron');
const path = require('path');

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