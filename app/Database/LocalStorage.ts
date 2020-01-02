import {IModel, Json, TopBar, U, InputPopup} from '../common/Joiner';
import ChangeEvent = JQuery.ChangeEvent;
import {Vieww, ViewPoint}                    from '../GuiStyles/viewpoint';
import KeyDownEvent = JQuery.KeyDownEvent;
import BlurEvent = JQuery.BlurEvent;
export enum saveEntries {
  saveListView = '_SaveListView',
  lastOpenedView = '_LastOpenedView',
  saveList = '_SaveList',
  lastOpened = '_LastOpened', }


export class LocalStorage {
  prefix: string = '' + '';
  print = true;
  popupTmp: InputPopup = null;
  private modeltmp: IModel = null;
  private isAutosavetmp: boolean;
  private saveAstmp: boolean;

  constructor(model?: IModel, style: boolean = false) {
    this.prefix = style ? 'Style_' : '';
    if (model) { this.prefix = model.getPrefixNum() + '_'; }
  }

  private setObj(key: string, val: Json, forViews: boolean): void { return this.set(key, JSON.stringify(val), forViews); }

  private set(key: string, val: string, forViews: boolean): void {
    if (val !== '' + val) { return this.setObj(key, val, forViews); }
    const saveKeyList: string[] = this.getKeyList(forViews, null);
    const savelistkey = forViews ? saveEntries.saveListView : saveEntries.saveList;
    if (key !== savelistkey && saveKeyList.indexOf(key) === -1) {
      saveKeyList.push(key);
      this.setObj(savelistkey, saveKeyList, forViews); }
    localStorage.setItem(this.prefix + key, val);
    if (key === savelistkey) { TopBar.topbar.updateRecents(); }
  }

  remove(oldKey: string, forViews: boolean): void {
    const keyList: string[] = this.getKeyList(forViews, null);
    U.arrayRemoveAll(keyList, oldKey);
    this.setObj(forViews ? saveEntries.saveListView : saveEntries.saveList, keyList, forViews); }


  getRaw(key: string): string { return localStorage.getItem(this.prefix + key); }
  get<T>(key: string): T {
    // todo: autoupdate the recent list se load un modelSave?
    const strVal: string = this.getRaw(key);
    if (!strVal || strVal === '' || strVal === '' + null || strVal === '' + undefined) { return null; }
    return JSON.parse(strVal) as T; }

  getLast(): Json { return this.get(this.prefix + saveEntries.lastOpened); }

  p(arg1: any, ...restArgs: any[]): void { U.pif(this.print, arg1, ...restArgs); }

  getKeyList(forViews: boolean, limit: number = null): string[] {
    const ret: string[] = this.get<string[]>(forViews ? saveEntries.saveListView : saveEntries.saveList);
    if (!ret) { return []; }
    U.pe(!Array.isArray(ret), 'savelist got is not an array:', ret);
    return isNaN(limit) ? ret : ret.splice(limit); }

  getRecentKeyList(limit: number = 10): string[] { return this.getKeyList(false, limit); }

  contains(key: string, forViews: boolean): boolean { return this.getKeyList(forViews, null).indexOf(key) !== -1; }

  private finishSave(saveKey: string, saveVal: string, v: ViewPoint): void {
    if (this.popupTmp) { this.popupTmp = this.popupTmp.destroy(); }
    // const saveListKey = v ? saveEntries.saveListView : saveEntries.saveList;
    this.set(saveKey, saveVal, !!v);
    /*const saveList: string[] = this.get<string[]>(saveListKey);
    saveList.push(saveKey);
    this.setObj(saveListKey, saveList, !!v);*/
    this.p(saveKey + ' saved:', saveVal);
    U.pe(!!this.modeltmp !== !v, 'those 2 conditions should be equivalent, assertion failed.', this.modeltmp, v);
    if (!this.modeltmp || v) return;
    const viewpoints: ViewPoint[] = this.modeltmp.viewpoints;
    for(let i = 0; i < viewpoints.length; i++) { this.save(null, this.isAutosavetmp, this.saveAstmp, viewpoints[i]); }
  }

  private save_BlurEvent(e: BlurEvent | KeyDownEvent, saveKey: string, saveVal: string, v: ViewPoint): void {
    const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
    if (!+input.getAttribute('valid')) return;
    if (this.popupTmp) { this.popupTmp = this.popupTmp.destroy(); }
    this.finishSave(saveKey, saveVal, v); }

  private save_OnKeyDown(e: KeyDownEvent, saveKey: string, saveVal: string, v: ViewPoint): void {
    // this.save_OnChange(e, popup, model);
    if (e.key !== 'return') { return; }
    this.save_BlurEvent(e, saveKey, saveVal, v); }

  private save_OnChange(e: ChangeEvent, model: IModel, v: ViewPoint): void {
    this.p('onchange');
    const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
    let error: boolean = false && false;
    U.pe(!!v, 'input dialog should not happen on viewpoints.');
    try { model.setName(input.value); } catch (e) { error = false; } finally {}
    if (error || input.value !== model.name) {
      this.popupTmp.setPostText('invalid or already registered name, a fix');
      input.setAttribute('valid', '0');
      if (model.name) { input.value = model.name; }
      return; }
    input.setAttribute('valid', '1'); }

  saveView(m: IModel, viewPoint: ViewPoint, isAutosave: boolean, saveas: boolean) { this.save(m, isAutosave, saveas, viewPoint); }
  save(model: IModel, isAutosave: boolean, saveAs: boolean = false, v: ViewPoint = null): void {
    U.pe(!!this.popupTmp, 'should not be allowed to have 2 popup for the same Storage. this would lead to a conflict mixing data.');
    this.modeltmp = model;
    this.isAutosavetmp = isAutosave;
    this.saveAstmp = saveAs;
    // const prefix: string = model.getPrefix();
    const ecoreJSONStr: string = v ? v.toString() : model.generateModelString();
    const name = v ? v.name : model.name;
    this.p('save ' + this.prefix + (v ? 'Viewpoint[' : 'Model[') + name + '] = ', ecoreJSONStr);
    this.set(v ? saveEntries.lastOpenedView : saveEntries.lastOpened, ecoreJSONStr, !!v);
    let popup: InputPopup;
    const onblur = (e: BlurEvent) => { this.save_BlurEvent(e, name, ecoreJSONStr, v); };
    const onkeydown = (e: KeyDownEvent) => { this.save_OnKeyDown(e, name, ecoreJSONStr, v); };
    const onchange = (e: ChangeEvent) => { this.save_OnChange(e, model, v); };
    const oninput = (e: any) => { this.save_OnChange(e, model, v); };

    this.p('isAutosave:', isAutosave, 'saveAs:', saveAs, (v ? 'viewpoint' : 'model') + '.name:', v ? v.name : model.name);
// todo: se model è anonimo non parte mai finishsave (parte solo il salvataggio in LastModelOpened) e non parte mai il salvataggio dei viewpoint.
    //if (v) { this.finishSave(name, ecoreJSONStr, v);}
    if (isAutosave) {
      if (name && name !== '') { this.finishSave(name, ecoreJSONStr, v); }
    } else
    if (saveAs || !name || name === '') {
      popup = new InputPopup('Choose a name for the ' + ( v ? 'Viewpoint' : model.friendlyClassName()),
        '', '', [['input', oninput], ['change', onchange]],
        'Viewpoint', model.friendlyClassName() + ' name', '');
      popup.show(); }
  }
  pushToServer(): void {}


  rename(oldKey: string, newKey: string, forViews: boolean) {
    const oldVal: any = this.get(oldKey);
    this.remove(oldKey, forViews);
    this.set(newKey, oldVal, forViews);
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
