/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import Store, { Schema } from 'electron-store';
import * as xlsx from 'xlsx';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { Request } from '../renderer/types/types';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    minWidth: 800,
    minHeight: 575,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

const storeData = new Store();

ipcMain.handle('loadRequestList', async (event) => {
  return storeData.get('requestList');
});

ipcMain.handle('storeRequestList', async (event, data) => {
  storeData.set('requestList', data);
});

ipcMain.handle('resetRequestList', async (event) => {
  storeData.set('requestList', null);
});

// ipcMain.handle('exportToExcel', async (event, requestData: Request[]) => {
//   const workbook = xlsx.utils.book_new();

//   const headerRow = ['UUID', '顧客ID', '依頼日', '納品日', '希望納期', '進行状況', 'プラン', '料金', '支払い方法', '受領', '曲名', '備考'];

//   const sheetData = [headerRow, ...requestData.map((request: Request) => [
//     request.id,
//     request.clientId,
//     request.requestDate,
//     request.deliveryDate,
//     request.deadline,
//     request.status,
//     request.plan,
//     request.fee,
//     request.paymentMethod,
//     request.paymentReceived,
//     request.songName,
//     request.notes,
//   ])];

//   xlsx.utils.book_append_sheet(
//     workbook,
//     xlsx.utils.aoa_to_sheet(sheetData),
//     'Request List',
//   );

//   xlsx.writeFile(workbook, 'output.xlsx');
// });

const showSuccessAlert = (message: string) => {
  const successDialogOptions = {
    type: 'info' as const,
    buttons: ['OK'],
    title: '成功',
    message: message,
  };

  dialog.showMessageBox(successDialogOptions);
};

const showErrorAlert = (message: string) => {
  const errorDialogOptions = {
    type: 'error' as const,
    buttons: ['OK'],
    title: 'エラー',
    message: message,
  };

  dialog.showMessageBox(errorDialogOptions);
};

ipcMain.handle('exportToExcel', async (event, requestData: Request[]) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const day = ('0' + now.getDate()).slice(-2);
    const hour = ('0' + now.getHours()).slice(-2);
    const minute = ('0' + now.getMinutes()).slice(-2);
    const second = ('0' + now.getSeconds()).slice(-2);

    const formattedDate = `${year}${month}${day}_${hour}${minute}${second}`;

    const { filePath } = await dialog.showSaveDialog({
      defaultPath: `MixQuesta_${formattedDate}.xlsx`,
      filters: [{ name: 'Excel Files', extensions: ['xlsx'] }],
    });

    if (!filePath) {
      return;
    }

    const workbook = xlsx.utils.book_new();

    const headerRow = [
      'UUID',
      '顧客ID',
      '依頼日',
      '納品日',
      '希望納期',
      '進行状況',
      'プラン',
      '料金',
      '支払い方法',
      '受領',
      '曲名',
      '備考',
    ];

    const sheetData = [
      headerRow,
      ...requestData?.sort(
        (a, b) =>
          new Date(a.requestDate).getTime() -
          new Date(b.requestDate).getTime(),
      ).map((request: Request) => [
        request.id,
        request.clientId,
        request.requestDate,
        request.deliveryDate,
        request.deadline,
        request.status,
        request.plan,
        request.fee,
        request.paymentMethod,
        request.paymentReceived ? '受領済' : '未受領',
        request.songName,
        request.notes,
      ]),
    ];

    xlsx.utils.book_append_sheet(
      workbook,
      xlsx.utils.aoa_to_sheet(sheetData),
      'Request List',
    );

    xlsx.writeFile(workbook, filePath);

    const successMessage = 'エクスポートに成功しました。';
    showSuccessAlert(successMessage);
  } catch (e) {
    const errorMessage = 'エクスポートに失敗しました。';
    showErrorAlert(errorMessage);
    console.error(`エラー発生: ${e}`);
    throw new Error('Error exporting to Excel');
  }
});

const serialToDateString = (serial: string | number): string => {
  if (typeof serial === 'string') {
    // 日付のデータが文字列形式(string型)のとき
    if (serial.includes('/')) {
      // 日付の文字列が "/" 区切りのとき
      const [year, month, day] = serial
        .split('/')
        .map((part) => part.padStart(2, '0'));
      return `${year}-${month}-${day}`;
    } else if (serial.includes('-')) {
      // 日付の文字列が "-" 区切りのとき
      const [year, month, day] = serial
        .split('-')
        .map((part) => part.padStart(2, '0'));
      return `${year}-${month}-${day}`;
    } else {
      return serial;
    }
  }

  // 日付のデータがシリアル形式(number型)のとき
  const baseDate = new Date(1899, 11, 31);
  const date = new Date(baseDate.getTime() + serial * 24 * 60 * 60 * 1000);
  return date.toISOString().split('T')[0];
}

ipcMain.handle('importFromExcel', async (event) => {
  try {
    const { filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Excel Files', extensions: ['xlsx', 'xls'] }],
    });

    if (!filePaths || filePaths.length === 0) {
      return null;
    }

    const workbook = xlsx.readFile(filePaths[0]);

    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets['Request List'], {
      header: 1,
      defval: null,
    });

    const data: Request[] = jsonData
      .slice(1) // 1行目を無視
      .map((row: any) => ({
        id: row[0],
        clientId: row[1],
        requestDate: serialToDateString(row[2]),
        deliveryDate: serialToDateString(row[3]),
        deadline: serialToDateString(row[4]),
        status: row[5],
        plan: row[6],
        fee: row[7],
        paymentMethod: row[8],
        paymentReceived: row[9] === '受領済' ? true : false,
        songName: row[10],
        notes: row[11],
      }));

      const successMessage = 'インポートに成功しました。';
      showSuccessAlert(successMessage);

    return data;
  } catch (e) {
    const errorMessage = 'インポートに失敗しました。';
    showErrorAlert(errorMessage);
    console.error(`エラー発生: ${e}`);
    throw new Error('Error reading Excel file');
  }
});
