import { Component, OnInit } from '@angular/core';
import ClickEvent = JQuery.ClickEvent;
import {AttribETypes, IModel, Json, Options, Status, U} from '../common/Joiner';
import {InputPopup, ShortAttribETypes} from '../common/util';
import ChangeEvent = JQuery.ChangeEvent;
import {EType} from '../Model/MetaMetaModel';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

export class TopBar {
  static topbar: TopBar = null;
  $html: JQuery<HTMLElement> = null;
  $topbar: JQuery<HTMLElement> = null;
  html: HTMLElement = null;
  topbar: HTMLElement = null;
  constructor() {
    U.pe(!!TopBar.topbar, 'top bar instantiated twice, but it is a singleton.');
    TopBar.topbar = this;
    this.$html = $('#topbarShell');
    this.html = this.$html[0];
    this.$topbar = this.$html.find('#topbar');
    this.topbar = this.$topbar[0];
    TopBar.topbar.updateRecents();
    this.addEventListeners(); }


  static download_JSON_String(e: ClickEvent, modelstr: string): void {
    const model: IModel = Status.status[modelstr];
    U.pe(!model, 'invalid modelStr in export-save_str: |' + modelstr + '|, status:', status);
    const savetxt: string = model.generateModelString();
    U.pe(!savetxt || savetxt === '', 'empty str');
    U.clipboardCopy(savetxt);
    const popup: InputPopup = new InputPopup((model.isM() ? 'Model' : 'Metamodel') + ' eCore/JSON',
      '', '<br>Already copied to clipboard.', [], null, '' + savetxt, 'textarea');
    const inputStyle = 'width: calc(75vw - 152px); height: calc(75vh - 200px);';
    if (inputStyle) {  popup.getInputNode()[0].setAttribute('style', inputStyle); }
    popup.show();
  }

  static download_JSON_File(e: ClickEvent, modelstr: string): void {
    const model: IModel = Status.status[modelstr];
    U.pe(!model, 'invalid modelStr in export-save_json_file: |' + modelstr + '|, status:', status);
    const savetxt: string = model.generateModelString();
  }

  static download_XMI_File(e: ClickEvent, modelstr: string): void {
    const model: IModel = Status.status[modelstr];
    U.pe(!model, 'invalid modelStr in export-save_xmi_file: |' + modelstr + '|, status:', status); }

  updateRecents(): void {
    let tmp: string;
    tmp = localStorage.getItem('MM_SaveList');
    if (!tmp || tmp === '' || tmp === 'null' || tmp === 'undefined') { tmp = JSON.stringify([]); }
    const mmSaveList: string[] = JSON.parse(tmp);
    tmp = localStorage.getItem('M_SaveList');
    if (!tmp || tmp === '' || tmp === 'null' || tmp === 'undefined') { tmp = JSON.stringify([]); }
    const mSaveList: string[] = JSON.parse(tmp);
    const recentContainerMM: HTMLElement = this.$html.find('.recentSaveContainerMM')[0];
    const recentContainerM: HTMLElement = this.$html.find('.recentSaveContainerM')[0];
    console.log(recentContainerM, recentContainerMM);
    const exampleChilds: HTMLElement[] = [recentContainerMM.childNodes[0], recentContainerM.childNodes[0]] as HTMLElement[];
    U.clear(recentContainerMM);
    U.clear(recentContainerM);
    let i = -1;
    let j = -1;
    let child: HTMLElement;
    const prefixarr = ['MM_', 'M_'];
    const containerArr: HTMLElement[] = [recentContainerMM, recentContainerM];
    const saveList: string[][] = [mmSaveList, mSaveList];

    // U.pw(true, recentContainerM, recentContainerMM, exampleChilds, saveList);
    while (++j < prefixarr.length) {
      i = -1;
      while (++i < saveList[j].length) {
        child = U.cloneHtml(exampleChilds[j]);
        $(child).find('.recentsave')[0].innerText = saveList[j][i];
        // child.dataset.value = prefixarr[j] + mSaveList[i];
        containerArr[j].appendChild(child);
      }
    }
    this.$html.find('.recentsave').off('click.load').on('click.load', (e: Event) => {
      let html: HTMLElement = e.currentTarget as HTMLElement;
      // html = $(html).find('.recentsave')[0];
      // console.log(html, e.currentTarget);
      this.loadRecent(html.innerText, html.classList.contains('metamodel')); });
  }
  loadRecent(name: string, isMetaModel: boolean): void {
    const prefix: string = isMetaModel ? 'MM' : 'M';
    const tmp: string = localStorage.getItem(prefix + '_' + name);
    U.pe(!tmp || tmp === '' || tmp === 'null' || tmp === 'undefined', 'uncorrect savename: |' + prefix + '_' + name + '|');
    localStorage.setItem('LastOpened' + prefix, tmp);
    U.refreshPage();
  }
  addEventListeners() {
    const $t = this.$topbar;
    $t.find('.TypeMapping').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.topbar.showTypeMap(); });
    $t.find('.saveall').off('click.btn').on('click.btn', (e: ClickEvent) => { Options.Save(false, false); } );
    $t.find('.download_MM_JSON_String').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.download_JSON_String(e, 'mm'); } );
    $t.find('.download_MM_JSON').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.download_JSON_File(e, 'mm'); } );
    $t.find('.download_MM_XMI').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.download_XMI_File(e, 'mm'); } );
    $t.find('.download_M_JSON_String').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.download_JSON_String(e, 'm'); } );
    $t.find('.download_M_JSON').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.download_JSON_File(e, 'm'); } );
    $t.find('.download_M_XMI').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.download_XMI_File(e, 'm'); } );
  }
  showTypeMap(): void {
    const $shell = this.$html.find('#TypeMapper');
    const $html = $shell.find('.TypeList');
    const html = $html[0];
    U.clear(html);
    const table: HTMLTableElement = U.toHtml<HTMLTableElement>('<table class="typeTable"><tbody></tbody></table>');
    const tbody = table.firstChild as HTMLElement;
    for (const m3TypeName in ShortAttribETypes) {
      if ( !ShortAttribETypes[m3TypeName] ) { continue; }
      const type: EType = EType.get(ShortAttribETypes[m3TypeName] as ShortAttribETypes);
      const row: HTMLTableRowElement = U.toHtmlRow('' +
        '<tr class="typeRow">' +
          '<td class="typeName" data-m3name="' + type.short + '">' + type.short + '</td>' +
          '<td class="alias">is aliased to</td>' +
          '<td>' +
             '<input class="AliasName form-control" placeholder="Not aliased" value="' + type.name + '"' +
                ' aria-label="Small" aria-describedby="inputGroup-sizing-sm">' +
          '</td>' +
        '</tr>');
      tbody.appendChild(row);
      console.log('row:', row, ', tbody:', tbody);
    }
    html.appendChild(table);
    $html.find('input.AliasName').off('change').on('change', (e: ChangeEvent) => { TopBar.topbar.aliasChange(e); } );
    $shell.show();
    U.closeButtonSetup($shell); }

  aliasChange(e: ChangeEvent): void {
    const input: HTMLInputElement = e.target as HTMLInputElement;
    let row: HTMLElement = input;
    while (!row.classList.contains('typeRow')) { row = row.parentNode as HTMLElement; }
    const m3Type = $(row).find('.typeName')[0].dataset.m3name;
    const type: EType = EType.get(m3Type as ShortAttribETypes);
    type.changeAlias(input.value);
  }
}
