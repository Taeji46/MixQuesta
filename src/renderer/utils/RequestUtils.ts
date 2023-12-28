import { Request } from '../types/types';

interface ElectronWindow extends Window {
  db: {
    loadRequestList: () => Promise<Array<Request> | null>;
    storeRequestList: (todoList: Array<Request>) => Promise<void>;
    resetRequestList: () => Promise<void>;
  };
}

declare const window: ElectronWindow;

export const loadRequestList = async (): Promise<Array<Request> | null> => {
  const todoList = await window.db.loadRequestList();
  return todoList;
};

export const storeRequestList = async (todoList: Array<Request>): Promise<void> => {
  await window.db.storeRequestList(todoList);
};

export const resetRequestList = async (): Promise<void> => {
  await window.db.resetRequestList();
};