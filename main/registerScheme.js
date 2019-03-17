const {app, protocol, ipcMain, webContents} = require('electron');
const url = require('url');
const querystring = require('querystring');

const SCHEME = 'test';

protocol.registerStandardSchemes([SCHEME]);

app.on('ready', () => {
  protocol.registerStringProtocol(SCHEME, (request, callback) => {
    const params = url.parse(request.url);
    console.log('registerStringProtocol', params, request);
    callback("");
  }, err => {
    console.log('registerStringProtocol', err);
  });
});

module.exports.triggerSendUrlToRenderProcess = function triggerSendUrlToRenderProcess(schema) {
  let allWebContents = webContents.getAllWebContents();
  let schemaParams = url.parse(schema);
  const hash = (schemaParams.hash || '').slice(1);
  const params = {
    schema,
    hostname: schemaParams.hostname,
    protocol: schemaParams.protocol,
    pathname: schemaParams.pathname,
    query: schemaParams.query,
    queryParams: querystring.parse(schemaParams.query),
    hash,
    hashParams: querystring.parse(hash),
  }
  for (let i = 0; i < allWebContents.length; i++) {
    allWebContents[i].send('chat.com', params);
  }
  allWebContents.length = 0;
}
