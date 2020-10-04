const { BrowserWindow, app } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

if (isDev) {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "../node_modules", ".bin", "electron"),
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
}

app.on("ready", () => {
  createWindow();
});
