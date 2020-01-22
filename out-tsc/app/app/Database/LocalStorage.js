import * as tslib_1 from "tslib";
import { TopBar, U, InputPopup } from '../common/Joiner';
var SaveListEntry = /** @class */ (function () {
    function SaveListEntry(lastopened, prefix, listname) {
        this.lastopened = lastopened;
        this.prefix = prefix;
        this.listname = listname;
    }
    SaveListEntry.vertexPos = new SaveListEntry('_LastOpenedVertexPos', 'VertexPos', '_SaveListVertexPos');
    SaveListEntry.view = new SaveListEntry('_LastOpenedView', 'ViewRule', '_SaveListView');
    SaveListEntry.model = new SaveListEntry('_LastOpened', '', '_SaveList');
    return SaveListEntry;
}());
export { SaveListEntry };
var LocalStorage = /** @class */ (function () {
    function LocalStorage(model) {
        this.prefix = '' + '';
        this.print = true;
        this.popupTmp = null;
        this.model = null;
        this.model = model;
        this.prefix = model.getPrefixNum() + '_';
    }
    LocalStorage.getLastOpened = function (modelNumber) {
        var ret = { model: null, vertexpos: null, view: null };
        ret.model = localStorage.getItem(LocalStorage.reservedprefix + 'm' + modelNumber + '_' + SaveListEntry.model.lastopened);
        ret.view = localStorage.getItem(LocalStorage.reservedprefix + 'm' + modelNumber + '_' + SaveListEntry.view.lastopened);
        ret.vertexpos = localStorage.getItem(LocalStorage.reservedprefix + 'm' + modelNumber + '_' + SaveListEntry.vertexPos.lastopened);
        return ret;
    };
    LocalStorage.deleteLastOpened = function (modelNumber) { this.setLastOpened(modelNumber, null, null, null); };
    LocalStorage.setLastOpened = function (modelNumber, model, view, vertex) {
        if (model === void 0) { model = null; }
        if (view === void 0) { view = null; }
        if (vertex === void 0) { vertex = null; }
        var prefix = LocalStorage.reservedprefix + 'm' + modelNumber + '_';
        if (model)
            localStorage.setItem(prefix + SaveListEntry.model.lastopened, model);
        else
            localStorage.removeItem(prefix + SaveListEntry.model.lastopened);
        if (view)
            localStorage.setItem(prefix + SaveListEntry.view.lastopened, view);
        else
            localStorage.removeItem(prefix + SaveListEntry.view.lastopened);
        if (vertex)
            localStorage.setItem(prefix + SaveListEntry.vertexPos.lastopened, vertex);
        else
            localStorage.removeItem(prefix + SaveListEntry.vertexPos.lastopened);
    };
    LocalStorage.prototype.getViewPoints = function () {
        var m = this.model;
        var ret = { view: null, vertexPos: null };
        if (!m.name)
            return ret;
        ret.view = this.get(m.name, SaveListEntry.view);
        ret.vertexPos = this.get(m.name, SaveListEntry.vertexPos);
        return ret;
    };
    LocalStorage.prototype.addToList = function (key, listname) {
        var saveKeyList = this.getKeyList(listname, null);
        if (U.arrayContains(saveKeyList, key))
            return;
        saveKeyList.push(key);
        this.overwriteList(listname, saveKeyList);
    };
    LocalStorage.prototype.removeFromList = function (key, listname) {
        var saveKeyList = this.getKeyList(listname, null);
        if (!U.arrayContains(saveKeyList, key))
            return;
        U.arrayRemoveAll(saveKeyList, key);
        this.overwriteList(listname, saveKeyList);
    };
    LocalStorage.prototype.overwriteList = function (listname, value) {
        U.pe(!Array.isArray(value), 'recent savelist must be an array.');
        localStorage.setItem(LocalStorage.reservedprefix + this.prefix + listname, JSON.stringify(value));
        TopBar.topbar.updateRecents();
    };
    LocalStorage.prototype.getKeyList = function (listname, limit) {
        if (limit === void 0) { limit = null; }
        var ret = JSON.parse(localStorage.getItem(LocalStorage.reservedprefix + this.prefix + listname));
        if (!ret) {
            return [];
        }
        U.pe(!Array.isArray(ret), 'savelist got is not an array:', ret);
        return isNaN(limit) ? ret : ret.splice(limit);
    };
    LocalStorage.prototype.add = function (key, val, saveList) {
        if (key === void 0) { key = null; }
        U.pe(val !== '' + val, 'parameter should be string:', val);
        if (val !== '' + val) {
            val = JSON.stringify(val);
        }
        key = key ? this.prefix + saveList.prefix + key : null;
        if (val !== 'null' && val !== 'undefined')
            localStorage.setItem(LocalStorage.reservedprefix + this.prefix + saveList.lastopened, val);
        else
            localStorage.removeItem(LocalStorage.reservedprefix + this.prefix + saveList.lastopened);
        if (!key) {
            return;
        }
        this.addToList(key, saveList.listname);
        localStorage.setItem(key, val);
    };
    LocalStorage.prototype.remove = function (oldKey, saveList) {
        if (!oldKey)
            return;
        oldKey = this.prefix + saveList.prefix + oldKey;
        this.removeFromList(oldKey, saveList.listname);
        localStorage.removeItem(oldKey);
    };
    LocalStorage.prototype.get = function (key, saveList) {
        key = this.prefix + saveList.prefix + key;
        return localStorage.getItem(key);
    };
    LocalStorage.prototype.rename = function (oldKey, newKey, saveList) {
        var oldVal = this.get(oldKey, saveList);
        this.remove(oldKey, saveList);
        this.add(newKey, oldVal, saveList);
    };
    LocalStorage.prototype.p = function (arg1) {
        var restArgs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            restArgs[_i - 1] = arguments[_i];
        }
        U.pif.apply(U, [this.print, arg1].concat(restArgs));
    };
    LocalStorage.prototype.finishSave = function (saveVal) {
        var m = this.model;
        if (this.popupTmp) {
            this.popupTmp = this.popupTmp.destroy();
        }
        U.pe(!m.name, 'model name should be filled with a validated user input.');
        // must be recalculated, model.name might have been changed by user input (saveas or un-named model being given a name)
        var viewpointSave = JSON.stringify(m.generateViewPointSaveArr());
        this.add(m.name, saveVal, SaveListEntry.model);
        this.add(m.name, viewpointSave, SaveListEntry.view);
        this.add(m.name, this.vertexSaveStr, SaveListEntry.vertexPos);
        this.p(m.name + ' VertexPositions saved:', saveVal);
        this.p(m.name + ' ViewPoints saved:', viewpointSave);
        this.p(m.name + ' Model saved:', this.vertexSaveStr);
    };
    LocalStorage.prototype.save_BlurEvent = function (e, saveVal) {
        var input = e.currentTarget;
        if (!+input.getAttribute('valid'))
            return;
        this.finishSave(saveVal);
    };
    LocalStorage.prototype.save_OnKeyDown = function (e, saveVal) {
        // this.save_OnChange(e, popup, model);
        if (e.key !== 'return') {
            return;
        }
        this.save_BlurEvent(e, saveVal);
    };
    LocalStorage.prototype.save_OnChange = function (e, model) {
        this.p('onchange');
        var input = e.currentTarget;
        var error = false;
        try {
            model.setName(input.value);
        }
        catch (e) {
            error = true;
        }
        finally { }
        if (error || input.value !== model.name) {
            this.popupTmp.setPostText('invalid or already registered name, a fix');
            input.setAttribute('valid', '0');
            if (model.name) {
                input.value = model.name;
            }
            return;
        }
        input.setAttribute('valid', '1');
    };
    LocalStorage.prototype.saveModel = function (isAutosave, saveAs) {
        var _this = this;
        if (saveAs === void 0) { saveAs = false; }
        U.pe(!!this.popupTmp, 'should not be allowed to have 2 popup for the same Storage. this would lead to a conflict mixing data.');
        this.isAutosavetmp = isAutosave;
        this.saveAstmp = saveAs;
        var model = this.model;
        var ecoreJSONStr = model.generateModelString();
        this.vertexSaveStr = JSON.stringify(model.generateVertexPositionSaveArr());
        var name = model.name;
        var viepointJSONStr = JSON.stringify(model.generateViewPointSaveArr());
        this.p('save ' + this.prefix + 'Model[' + name + '] = ', ecoreJSONStr, 'viewpoints:', viepointJSONStr);
        this.add(null, ecoreJSONStr, SaveListEntry.model);
        this.add(null, viepointJSONStr, SaveListEntry.view);
        this.add(null, this.vertexSaveStr, SaveListEntry.vertexPos);
        var popup;
        var onblur = function (e) { _this.save_BlurEvent(e, ecoreJSONStr); };
        var onkeydown = function (e) { _this.save_OnKeyDown(e, ecoreJSONStr); };
        var onchange = function (e) { _this.save_OnChange(e, model); };
        this.p('isAutosave:', isAutosave, 'saveAs:', saveAs, 'model.name:', model.name);
        // save with a name.
        if (name && name !== '') {
            this.finishSave(ecoreJSONStr);
            return;
        }
        // autosave without a name.
        if (isAutosave) {
            return;
        }
        // saveas without a name.
        if (saveAs) {
            popup = new InputPopup('Choose a name for the ' + model.friendlyClassName(), '', '', [['change', onchange], ['keydown', onkeydown], ['blur', onblur]], 'Viewpoint', model.friendlyClassName() + ' name', '');
            popup.show();
            return;
        }
        // user clicked save without a name
    };
    LocalStorage.prototype.pushToServer = function () { };
    LocalStorage.prototype.autosave = function (turn, permanendNotImplemented) {
        if (permanendNotImplemented === void 0) { permanendNotImplemented = false; }
        localStorage.setItem('autosave', '' + turn);
    };
    LocalStorage.reservedprefix = '_';
    return LocalStorage;
}());
export { LocalStorage };
var LocalStorageM = /** @class */ (function () {
    function LocalStorageM() {
    }
    return LocalStorageM;
}());
export { LocalStorageM };
var LocalStorageM3 = /** @class */ (function (_super) {
    tslib_1.__extends(LocalStorageM3, _super);
    function LocalStorageM3() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return LocalStorageM3;
}(LocalStorageM));
export { LocalStorageM3 };
var LocalStorageM2 = /** @class */ (function (_super) {
    tslib_1.__extends(LocalStorageM2, _super);
    function LocalStorageM2() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return LocalStorageM2;
}(LocalStorageM));
export { LocalStorageM2 };
var LocalStorageM1 = /** @class */ (function (_super) {
    tslib_1.__extends(LocalStorageM1, _super);
    function LocalStorageM1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return LocalStorageM1;
}(LocalStorageM));
export { LocalStorageM1 };
var LocalStorageStyles = /** @class */ (function (_super) {
    tslib_1.__extends(LocalStorageStyles, _super);
    function LocalStorageStyles() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return LocalStorageStyles;
}(LocalStorage));
export { LocalStorageStyles };
//# sourceMappingURL=LocalStorage.js.map