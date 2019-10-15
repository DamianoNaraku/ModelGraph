import {IModel, Json, TopBar, U, InputPopup} from '../common/Joiner';
import ChangeEvent = JQuery.ChangeEvent;
export enum saveEntries {
  saveList = '_SaveList',
  lastOpened = '_LastOpened', }
export class LocalStorage {
  prefix: string = '' + '';
  print = false;

  constructor(model?: IModel, style: boolean = false) {
    this.prefix = style ? 'Style_' : '';
    if (model) { this.prefix = model.getPrefixNum() + '_'; }
  }

  private setObj(key: string, val: Json): void { return this.set(key, JSON.stringify(val)); }

  private set(key: string, val: string): void {
    if (val !== '' + val) { return this.setObj(key, val); }
    const saveKeyList: string[] = this.getKeyList();
    if (key !== saveEntries.saveList && saveKeyList.indexOf(key) === -1) {
      saveKeyList.push(key);
      this.setObj(saveEntries.saveList, saveKeyList); }
    localStorage.setItem(this.prefix + key, val);
    if (key === saveEntries.saveList) { TopBar.topbar.updateRecents(); }
  }

  remove(oldKey: string): void {
    const keyList: string[] = this.getKeyList();
    U.arrayRemoveAll(keyList, oldKey);
    this.setObj(saveEntries.saveList, keyList); }


  getRaw(key: string): string { return localStorage.getItem(this.prefix + key); }
  get<T>(key: string): T {
    // todo: autoupdate the recent list se load un modelSave?
    const strVal: string = this.getRaw(key);
    if (!strVal || strVal === '' || strVal === '' + null || strVal === '' + undefined) { return null; }
    return JSON.parse(strVal) as T; }

  getLast(): Json { return this.get(this.prefix + saveEntries.lastOpened); }

  p(arg1: any, ...restArgs: any[]): void { U.pif(this.print, arg1, ...restArgs); }

  getKeyList(limit: number = 10): string[] {
    const ret: string[] = this.get<string[]>(saveEntries.saveList);
    if (!ret) { return []; }
    U.pe(!Array.isArray(ret), 'savelist got is not an array:', ret);
    return ret.splice(limit); }

  getRecentKeyList(limit?: number): string[] { return this.getKeyList(limit); }

  contains(key: string): boolean { return this.getKeyList().indexOf(key) !== -1; }

  private finishSave(popup: InputPopup, saveKey: string, saveVal: string): void {
    if (popup) { popup.destroy(); }
    this.set(saveKey, saveVal);
    const saveList: string[] = this.get<string[]>(saveEntries.saveList);
    saveList.push(saveKey);
    this.setObj(saveEntries.saveList, saveList);
    this.p(saveKey + ' saved:', saveVal);
  }

  private save_OnInput(e: Event, popup: InputPopup, model: IModel, saveKey: string, saveVal: string): void {
    this.save_OnChange(e, popup, model);
    popup.destroy();
    const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
    if (input.getAttribute('valid') === '1') { this.finishSave(popup, saveKey, saveVal); }
  }

  private save_OnChange(e: Event, popup: InputPopup, model: IModel): void {
    this.p('onchange');
    const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
    let error: boolean = false && false;
    try { model.setName(input.value); } catch (e) { error = false; } finally {}
    if (error || input.value !== model.name) {
      popup.setPostText('invalid or already registered name, a fix');
      input.setAttribute('valid', '0');
      if (model.name) { input.value = model.name; }
      return; }
    input.setAttribute('valid', '1'); }

  save(model: IModel, isAutosave: boolean, saveAs: boolean = false): void {
    // const prefix: string = model.getPrefix();
    const ecoreJSONStr: string = model.generateModelString();
    this.p('save ' + this.prefix + 'Model[' + model.name + '] = ', ecoreJSONStr);
    this.set(saveEntries.lastOpened, ecoreJSONStr);
    let popup: InputPopup;
    const oninput = (e: Event) => { this.save_OnInput(e, popup, model, model.name, ecoreJSONStr); };
    const onchange = (e: Event) => { this.save_OnChange(e, popup, model); };

    this.p('isAutosave:', isAutosave, 'saveAs:', saveAs, 'model.name:', model.name);
    if (isAutosave) {
      if (model.name && model.name !== '') { this.finishSave(popup, model.name, ecoreJSONStr); }
    } else
    if (saveAs || !model.name || model.name === '') {
      popup = new InputPopup('Choose a name for the ' + model.friendlyClassName(),
        '', '', [['input', oninput], ['change', onchange]],
        model.friendlyClassName() + ' name', model.name);
      popup.show(); }
  }
  pushToServer(): void {}


  rename(oldKey: string, newKey: string) {
    const oldVal: any = this.get(oldKey);
    this.remove(oldKey);
    this.set(newKey, oldVal);
  }

  autosave(turn: boolean, permanent: boolean = false) {
    // todo: ?
  }
}
export class LocalStorageM {


}
export class LocalStorageM3 extends LocalStorageM {

}
export class LocalStorageM2 extends LocalStorageM {

}
export class LocalStorageM1 extends LocalStorageM {

}

export class LocalStorageStyles extends LocalStorage {

}
