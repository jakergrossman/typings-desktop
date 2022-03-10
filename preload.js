// preload.js
// embed configuration

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  defaultCookies: {
    theme: 'light',
    language: 'english',
    wordCount: 50,
    timeCount: 60,
    typingMode: 'wordcount',
    punctuation: 'false',
  },
  loadCookies: () => ipcRenderer.invoke('load-cookies'),
  saveCookies: (c) => ipcRenderer.invoke('save-cookies', c),
});
