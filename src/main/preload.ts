// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;

contextBridge.exposeInMainWorld('db', {
  loadOrderList: () => ipcRenderer.invoke('loadOrderList'),
  storeOrderList: (orderList: Array<object>) =>
    ipcRenderer.invoke('storeOrderList', orderList),
  resetOrderList: () => ipcRenderer.invoke('resetOrderList'),
  loadClientList: () => ipcRenderer.invoke('loadClientList'),
  storeClientList: (clientList: Array<object>) =>
    ipcRenderer.invoke('storeClientList', clientList),
  resetClientList: () => ipcRenderer.invoke('resetClientList'),
  exportToExcel: (orderList: Array<object>, clientList: Array<object>) =>
    ipcRenderer.invoke('exportToExcel', orderList, clientList),
  importFromExcel: () => ipcRenderer.invoke('importFromExcel'),
});
