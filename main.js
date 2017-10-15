//process.env.NODE_ENV = 'production';

var electron = require('electron')

var app = electron.app;  // Module to control application life.
var BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
var Menu = electron.menu;
var Tray = electron.Tray;
var ipc = electron.ipcMain;
var dialog = electron.dialog;

//electron.crashReporter.start('squallified');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
var mainWindow = null;
var appIcon = null;

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        "web-preferences": {
            "web-security": false
        },
        icon: __dirname + "/img/app-icon.png"
    });

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    //mainWindow.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    // appIcon = new Tray(__dirname + '/img/app-icon.png');
});
