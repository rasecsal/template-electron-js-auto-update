// This is free and unencumbered software released into the public domain.
// See LICENSE for details

const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { autoUpdater } = require("electron-updater");


//-------------------------------------------------------------------
// Define the menu
//
// THIS SECTION IS NOT REQUIRED
//-------------------------------------------------------------------
let template = []
if (process.platform === 'darwin') {
	// OS X
	const name = app.getName();
	template.unshift({
		label: name,
		submenu: [
			{
				label: 'About ' + name,
				role: 'about'
			},
			{
				label: 'Quit',
				accelerator: 'Command+Q',
				click() { app.quit(); }
			},
		]
	})
}


//-------------------------------------------------------------------
// Open a window that displays the version
//
// THIS SECTION IS NOT REQUIRED
//
// This isn't required for auto-updates to work, but it's easier
// for the app to show a window than to have to click "About" to see
// that updates are working.
//-------------------------------------------------------------------
let win;

function sendStatusToWindow(message, text) {
	win.webContents.send(message, text);
}
function createDefaultWindow() {
	win = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false
		}
	});
	win.on('closed', () => {
		win = null;
	});
	win.loadFile('index.html');
	return win;
}
autoUpdater.on('checking-for-update', () => {
	//sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
	sendStatusToWindow('update_available', 'Update available.');
})
autoUpdater.on('update-not-available', (info) => {
	//sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
	sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
	let log_message = "Download speed: " + progressObj.bytesPerSecond;
	log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
	log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
	//sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
	sendStatusToWindow('update_downloaded', 'Update downloaded');
});
app.on('ready', function () {
	// Create the Menu
	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);

	createDefaultWindow();
	sendStatusToWindow('app_version',  { version: app.getVersion() });
	autoUpdater.checkForUpdatesAndNotify();
});
app.on('window-all-closed', () => {
	app.quit();
});

//
// CHOOSE one of the following options for Auto updates
//

//-------------------------------------------------------------------
// Auto updates - Option 1 - Simplest version
//
// This will immediately download an update, then install when the
// app quits.
//-------------------------------------------------------------------

ipcMain.on('restart_app', () => {
	autoUpdater.quitAndInstall();	
});
//-------------------------------------------------------------------
// Auto updates - Option 2 - More control
//
// For details about these events, see the Wiki:
// https://github.com/electron-userland/electron-builder/wiki/Auto-Update#events
//
// The app doesn't need to listen to any events except `update-downloaded`
//
// Uncomment any of the below events to listen for them.  Also,
// look in the previous section to see them being used.
//-------------------------------------------------------------------
// app.on('ready', function()  {
//   autoUpdater.checkForUpdates();
// });
// autoUpdater.on('checking-for-update', () => {
// })
// autoUpdater.on('update-available', (info) => {
// })
// autoUpdater.on('update-not-available', (info) => {
// })
// autoUpdater.on('error', (err) => {
// })
// autoUpdater.on('download-progress', (progressObj) => {
// })
// autoUpdater.on('update-downloaded', (info) => {
//   autoUpdater.quitAndInstall();  
// })
