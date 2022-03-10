// main.js
// electron app logic

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// defualt cookie values
let cookies = {
  theme: 'light',
  language: 'english',
  wordCount: 50,
  timeCount: 60,
  typingMode: 'wordcount',
  punctuation: true,
};

const cookieDir = path.join(app.getPath('cache'), 'typings-desktop');
const cookiePath = path.join(cookieDir, 'config.json');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  win.loadFile('index.html');

}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// create cookie file
try {
  fs.mkdirSync(cookieDir, {recursive: true});
  if (!fs.existsSync(cookiePath)) {
    fs.writeFileSync(cookiePath, JSON.stringify(cookies) + '\n');
  }

  cookies = {...cookies, ...JSON.parse(fs.readFileSync(cookiePath))};
  console.log(cookies);
}
catch (e) {
  console.error(e);
}

// cookie handler
ipcMain.handle('load-cookies', async (_) => {
  try {
    cookies = {...cookies, ...JSON.parse(fs.readFileSync(cookiePath))};
  }
  catch (e) {
    console.error(e);
  }

  return cookies;
});

ipcMain.handle('save-cookies', async (_, newCookies) => {
  try {
    fs.writeFileSync(cookiePath, JSON.stringify(newCookies) + '\n');
    cookies = newCookies;
  }
  catch (e) {
    console.error(e);
  }

  return cookies;
});
