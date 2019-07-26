import { Component, OnInit } from '@angular/core';
import ClickEvent = JQuery.ClickEvent;
import {AttribETypes, IModel, Json, Model, Options, prjson2xml, Status, U} from '../common/Joiner';
import {FastXmi, FastXmiOptions, InputPopup, ShortAttribETypes} from '../common/util';
import ChangeEvent = JQuery.ChangeEvent;
import {EType} from '../Model/MetaMetaModel';
import {json2xml, Options as XMLJSOptions} from 'xml-js';
import JS2XML = XMLJSOptions.JS2XML;

// @ts-ignore
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


  static load_empty(e: JQuery.ClickEvent, prefix: string) {
    const empty: string = prefix === 'm' ? Model.emptyModel : IModel.emptyModel;
    TopBar.load(empty, prefix);
  }

  static load_XMI_File(e: JQuery.ClickEvent, prefix: string) {
    U.pe(true, 'loadXML todo: use load by JSON/string instead.');
    // open file dialog
    // read file
    // transform in json
    const json = 'fileContentTransformed';
    TopBar.load(json, prefix);
  }
  static load(json: string, prefix: string) {
    const m: IModel = prefix === 'm' ? Status.status.m : Status.status.mm;
    m.save(false);
    window['' + 'discardSave']();
    localStorage.setItem('LastOpened' + prefix.toUpperCase(), json);
    U.refreshPage();
  }

  static load_JSON_Text(e: JQuery.ClickEvent, prefix: string) {
    const onoutput = (ee: Event) => {  finish(); };
    const finish = () => {
      const input: HTMLInputElement = popup.getInputNode()[0] as HTMLInputElement;
      popup.destroy();
      TopBar.load(input.value, prefix);
    };
    const popup: InputPopup = new InputPopup('paste JSON/string data', '', '',
      [['input', onoutput], ['change', onoutput]], 'paste data here.', '', 'textarea');
    // $(popup).find('.closeButton');
    popup.addOkButton('Load', finish);
    popup.show(); }
  static download_JSON_String(e: ClickEvent, modelstr: string): void {
    const model: IModel = Status.status[modelstr];
    U.pe(!model, 'invalid modelStr in export-save_str: |' + modelstr + '|, status:', status);
    const savetxt: string = model.generateModelString();
    U.pe(!savetxt || savetxt === '', 'empty str');
    U.clipboardCopy(savetxt);
    const popup: InputPopup = new InputPopup((model.isM() ? 'Model' : 'Metamodel') + ' eCore/JSON',
      '', '<br>Already copied to clipboard.', [], null, '' + savetxt, 'textarea');
    popup.show();
  }

  static download_JSON_File(e: ClickEvent, modelstr: string): void {
    const model: IModel = Status.status[modelstr];
    U.pe(!model, 'invalid modelStr in export-save_json_file: |' + modelstr + '|, status:', status);
    const savetxt: string = model.generateModelString();
    U.download(model.name, savetxt); }

  static download_XMI_File(e: ClickEvent, modelstr: string): void {
    const model: IModel = Status.status[modelstr];
    U.pe(!model, 'invalid modelStr in export-save_xmi_file: |' + modelstr + '|, status:', status);
    let savetxt: string = model.generateModelString();
    const json: Json = JSON.parse(savetxt);
    /*const parser = new FastXmi.j2xParser(new FastXmiOptions());
    const xml: string = parser.parse(json, new FastXmiOptions());
    savetxt = '' + xml; */
    // savetxt = json2xml(savetxt, { header: true } as JS2XML); // , Options.JS2XML);
    // console.log('xmljson: ', parser.parse(json));
    savetxt = '' + prjson2xml.json2xml(json, ' ');
    savetxt = TopBar.formatXml(savetxt).trim();
    U.download((model.name || model.getDefaultPackage().name || 'unnamed') + '.ecore', savetxt); }
  static formatXml(xml: string): string {
    const reg = /(>)\s*(<)(\/*)/g; // updated Mar 30, 2015
    const wsexp = / *(.*) +\n/g;
    const contexp = /(<.+>)(.+\n)/g;
    xml = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
    const pad = 0;
    let formatted = '';
    const lines = xml.split('\n');
    let indent = 0;
    let lastType = 'other';
    // 4 types of tags - single, closing, opening, other (text, doctype, comment) - 4*4 = 16 transitions
    const transitions = {
      'single->single': 0,
      'single->closing': -1,
      'single->opening': 0,
      'single->other': 0,
      'closing->single': 0,
      'closing->closing': -1,
      'closing->opening': 0,
      'closing->other': 0,
      'opening->single': 1,
      'opening->closing': 0,
      'opening->opening': 1,
      'opening->other': 1,
      'other->single': 0,
      'other->closing': -1,
      'other->opening': 0,
      'other->other': 0
    };
    let i = 0;
    for (i = 0; i < lines.length; i++) {
      const ln = lines[i];

      // Luca Viggiani 2017-07-03: handle optional <?xml ... ?> declaration
      if (ln.match(/\s*<\?xml/)) {
        formatted += ln + '\n';
        continue;
      }
      // ---

      const single = Boolean(ln.match(/<.+\/>/)); // is this line a single tag? ex. <br />
      const closing = Boolean(ln.match(/<\/.+>/)); // is this a closing tag? ex. </a>
      const opening = Boolean(ln.match(/<[^!].*>/)); // is this even a tag (that's not <!something>)
      const type = single ? 'single' : closing ? 'closing' : opening ? 'opening' : 'other';
      const fromTo = lastType + '->' + type;
      lastType = type;
      let padding = '';

      indent += transitions[fromTo];
      let j: number;
      for (j = 0; j < indent; j++) {
        padding += '\t';
      }
      if (fromTo === 'opening->closing') {
        formatted = formatted.substr(0, formatted.length - 1) + ln + '\n'; // substr removes line break (\n) from prev loop
      } else {
        formatted += padding + ln + '\n';
      }
    }

    return formatted;
  };
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
    // download
    $t.find('.download_MM_JSON_String').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.download_JSON_String(e, 'mm'); } );
    $t.find('.download_MM_JSON').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.download_JSON_File(e, 'mm'); } );
    $t.find('.download_MM_XMI').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.download_XMI_File(e, 'mm'); } );
    $t.find('.download_M_JSON_String').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.download_JSON_String(e, 'm'); } );
    $t.find('.download_M_JSON').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.download_JSON_File(e, 'm'); } );
    $t.find('.download_M_XMI').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.download_XMI_File(e, 'm'); } );
    //// load
    $t.find('.loadmmEmpty').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.load_empty(e, 'mm'); } );
    $t.find('.loadmmFile').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.load_XMI_File(e, 'mm'); } );
    $t.find('.loadmmTxt').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.load_JSON_Text(e, 'mm'); } );
    $t.find('.loadmEmpty').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.load_empty(e, 'm'); } );
    $t.find('.loadmFile').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.load_XMI_File(e, 'm'); } );
    $t.find('.loadmTxt').off('click.btn').on('click.btn', (e: ClickEvent) => { TopBar.load_JSON_Text(e, 'm'); } );
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
