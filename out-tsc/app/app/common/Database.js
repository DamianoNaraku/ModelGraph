import { U } from './Joiner';
export var DatabaseMode;
(function (DatabaseMode) {
    DatabaseMode[DatabaseMode["browserMemory"] = 0] = "browserMemory";
    DatabaseMode[DatabaseMode["Sql"] = 1] = "Sql";
    DatabaseMode[DatabaseMode["File"] = 2] = "File";
})(DatabaseMode || (DatabaseMode = {}));
var Database = /** @class */ (function () {
    function Database(mode, username, phpDbPageUrl, sqlurl, sqldb, sqlpass) {
        if (mode === void 0) { mode = DatabaseMode.browserMemory; }
        if (username === void 0) { username = '_TestUser_'; }
        if (phpDbPageUrl === void 0) { phpDbPageUrl = null; }
        if (sqlurl === void 0) { sqlurl = null; }
        if (sqldb === void 0) { sqldb = null; }
        if (sqlpass === void 0) { sqlpass = null; }
        this.phpDbPageUrl = null;
        this.sqlurl = null;
        this.sqldb = null;
        this.sqluser = null;
        this.sqlpass = null;
        this.mode = null;
        this.mode = mode;
        this.sqluser = username;
        this.phpDbPageUrl = phpDbPageUrl;
        this.sqldb = sqldb;
        this.sqlpass = sqlpass;
        this.sqlurl = sqlurl;
    }
    Database.prototype.writeKV = function (table, key, value) {
        switch (this.mode) {
            default:
                U.pe(true, 'unexpected db mode:', this.mode);
                break;
            case DatabaseMode.browserMemory:
                key = this.sqluser + '_' + table + '_' + key;
                localStorage.setItem(key, value);
                break;
            case DatabaseMode.Sql:
                U.pw(true, 'update sql: todo');
                break;
            case DatabaseMode.File:
                key = this.sqluser + '_' + table + '_' + key;
                U.pw(true, 'download file: todo');
                break;
        }
    };
    Database.prototype.readKV = function (table, key) {
        switch (this.mode) {
            default:
                U.pe(true, 'unexpected db mode:', this.mode);
                break;
            case DatabaseMode.browserMemory:
                key = this.sqluser + '_' + table + '_' + key;
                return localStorage.getItem(key);
            case DatabaseMode.Sql:
                U.pw(true, 'select sql: todo');
                break;
            case DatabaseMode.File:
                U.pe(true, 'readKV: cannot be executed with savemode = File');
                break;
        }
    };
    Database.db = new Database();
    return Database;
}());
export { Database };
//# sourceMappingURL=Database.js.map