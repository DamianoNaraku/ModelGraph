import {U} from './Joiner';

export enum DatabaseMode { browserMemory, Sql, File}
export class Database {
  static db: Database = new Database();
  phpDbPageUrl: string = null;
  sqlurl: string = null;
  sqldb: string = null;
  sqluser: string = null;
  sqlpass: string = null;
  mode: DatabaseMode = null;
  constructor(mode: DatabaseMode = DatabaseMode.browserMemory, username = '_TestUser_',
              phpDbPageUrl = null, sqlurl = null, sqldb = null, sqlpass = null) {
    this.mode = mode;
    this.sqluser = username;
    this.phpDbPageUrl = phpDbPageUrl;
    this.sqldb = sqldb;
    this.sqlpass = sqlpass;
    this.sqlurl = sqlurl; }
    writeKV(table, key, value): void {
      switch (this.mode) {
        default: U.pe(true, 'unexpected db mode:', this.mode); break;
        case DatabaseMode.browserMemory:
          key = this.sqluser + '_' + table + '_' + key;
          localStorage.setItem(key, value);
          break;
        case DatabaseMode.Sql: U.pw(true, 'update sql: todo'); break;
        case DatabaseMode.File:
          key = this.sqluser + '_' + table + '_' + key;
          U.pw(true, 'download file: todo'); break;
      }
    }
    readKV(table, key): string {
      switch (this.mode) {
        default: U.pe(true, 'unexpected db mode:', this.mode); break;
        case DatabaseMode.browserMemory:
          key = this.sqluser + '_' + table + '_' + key;
          return localStorage.getItem(key);
        case DatabaseMode.Sql: U.pw(true, 'select sql: todo'); break;
        case DatabaseMode.File: U.pe(true, 'readKV: cannot be executed with savemode = File'); break;
      }
    }
}
