const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  Tray,
  nativeImage,
} = require("electron");
const path = require("path");
const { trayIcon, appIcon } = require("../setup");

const { storeItem, clearItems, idgen, checkReminders } = require("./renderer");
const open = require("open");

// globals
let mainWindow;
let addItemWindow;
let tray;
let isQuitting = false;
// let mwinc = 0;
let awinc = 0;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 600,
    maxHeight: 700,
    maxWidth: 600,
    minHeight: 400,
    minWidth: 300,
    icon: appIcon,
    title: "Hello There!",
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  //build menu from custom template
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  mainWindow.setMenu(mainMenu);

  // create and add tray
  const trayMenu = Menu.buildFromTemplate(contextMenuTemplate);
  tray = new Tray(nativeImage.createFromPath(trayIcon));
  tray.setContextMenu(trayMenu);
  tray.setToolTip("Hello There!");

  setTimeout(() => mainWindow.webContents.send("refresh"), 500);
  setInterval(() => mainWindow.webContents.send("refresh"), 8000);
  setInterval(() => checkReminders(), 3000);

  //minimize to tray when main window closes
  mainWindow.on("close", (e) => {
    if (!isQuitting) {
      e.preventDefault();
      mainWindow.hide();
    }
  });
  //hide window when minimized
  mainWindow.on("minimize", (e) => {
    e.preventDefault();
    mainWindow.hide();
  });
  // reopen window when tray icon is double clicked
  tray.on("double-click", () => {
    mainWindow.show();
  });
};

// create window function for add reminder
function createAddItemWindow() {
  addItemWindow = new BrowserWindow({
    width: 400,
    height: 550,
    resizable: false,
    title: "Add Reminder",
    icon: appIcon,
    parent: mainWindow,
    modal: true,
    minimizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (awinc > 0) {
    addItemWindow.show();
    addItemWindow.focus();
    return;
  }
  addItemWindow.removeMenu();

  addItemWindow.loadFile(path.join(__dirname, "addReminder.html"));
  awinc += 1;
  addItemWindow.on("closed", () => {
    addItemWindow = null;
    awinc -= 1;
  });
}

// Create main window
app.on("ready", createWindow);

//Handle ipc
ipcMain.on("item:add", (e, rmndr) => {
  const [title, time, catg, notif] = rmndr;
  let [hr, min] = time.split(":");
  let t = new Date();
  t.setHours(hr, min);
  let idn = idgen();
  const obj = {
    id: idn,
    title: title,
    timeHuman: time,
    time: t,
    category: catg,
    isNotified: notif,
  };
  storeItem(obj);
  setTimeout(() => mainWindow.webContents.send("refresh"), 500);
  setTimeout(() => {
    addItemWindow.close();
  }, 200);
});

ipcMain.on("addWin", () => createAddItemWindow());

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

//Menu App
const menuTemplate = [
  {
    label: "Action",
    submenu: [
      {
        label: "Add Item",
        click() {
          createAddItemWindow();
        },
        accelerator:
          process.platform === "darwin" ? "Alt+Cmd+A" : "Ctrl+Shift+A",
      },
      {
        label: "Remove All",
        click() {
          clearItems();
          setTimeout(() => {
            mainWindow.webContents.send("refresh");
          }, 500);
        },
        accelerator:
          process.platform === "darwin" ? "Alt+Cmd+X" : "Ctrl+Shift+X",
      },
      {
        label: "Dev Tool",
        click() {
          mainWindow.webContents.openDevTools();
        },
      },
      { type: "separator" },
      {
        label: "Info",
        click() {
          open("https://github.com/asteroid2k/hello-there");
        },
      },
      { type: "separator" },
      {
        label: "Exit",
        click() {
          isQuitting = true;
          app.quit();
        },
        accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
      },
    ],
  },
];

//Context Menu

const contextMenuTemplate = [
  {
    label: "Open",
    click() {
      mainWindow.show();
    },
  },

  {
    label: "Info",
    click() {
      createAbout();
    },
  },
  { type: "separator" },
  {
    label: "Exit",
    click() {
      isQuitting = true;
      app.quit();
    },
  },
];
