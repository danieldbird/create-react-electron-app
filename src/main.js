const { BrowserWindow, Menu, app, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const isDev = require("electron-is-dev");
const { exec } = require("child_process");
const Store = require("electron-store");
const store = new Store();
if (isDev) {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "../node_modules", ".bin", "electron"),
  });
}
const test = require("./test");

console.log(test.someFunction1());

// set about panel options

// set application menu
const isMac = process.platform === "darwin";

const template = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideothers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" },
          ],
        },
      ]
    : []),
  // { role: 'fileMenu' }
  {
    label: "File",
    submenu: [isMac ? { role: "close" } : { role: "quit" }],
  },

  // { role: 'viewMenu' }
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { role: "toggleDevTools" },
      { type: "separator" },
      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  },
  // { role: 'windowMenu' }
  {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      ...(isMac
        ? [
            { type: "separator" },
            { role: "front" },
            { type: "separator" },
            { role: "window" },
          ]
        : [{ role: "close" }]),
    ],
  },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal("https://github.com/danieldbird/desky");
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// check if app has been run before
if (fs.existsSync(store.path)) {
  // get preferences from store
  console.log("app has storage!");
} else {
  store.set("version", app.getVersion());
  store.set("showWelcomeMessageAtStartup", true);
}

function createWindow() {
  win = new BrowserWindow({
    x: 1500,
    y: -1500,
    width: 400,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  // win.webContents.openDevTools();
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
}

app.on("ready", () => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  // if (process.platform !== "darwin") {
  app.quit();
  // }
});

// renderer requests
ipcMain.on("clear-store", () => {
  store.clear();
});

ipcMain.on("remove-store", () => {
  console.log(store.path);
  fs.rm(store.path, (err) => {
    if (err) {
      console.log(err);
    }
  });
});

ipcMain.on("open-store-directory", () => {
  exec(
    "open " + app.getPath("userData").replace(/\s/g, "\\ "),
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      if (stdout) {
        console.log(`stdout: ${stdout}`);
      }
    }
  );
});

ipcMain.on("edit-store", () => {
  store.openInEditor();
});
