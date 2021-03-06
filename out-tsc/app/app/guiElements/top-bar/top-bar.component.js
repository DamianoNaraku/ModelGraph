import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { MetaModel, Model, Status, U, // Options,
ShortAttribETypes, InputPopup, prxml2json, EType, LocalStorage, prjson2xml } from '../../common/Joiner';
// @ts-ignore
var TopBarComponent = /** @class */ (function () {
    function TopBarComponent() {
    }
    TopBarComponent.prototype.ngOnInit = function () {
    };
    TopBarComponent = tslib_1.__decorate([
        Component({
            selector: 'app-top-bar',
            templateUrl: './top-bar.component.html',
            styleUrls: ['./top-bar.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], TopBarComponent);
    return TopBarComponent;
}());
export { TopBarComponent };
var TopBar = /** @class */ (function () {
    function TopBar() {
        this.$html = null;
        this.$topbar = null;
        this.html = null;
        this.topbar = null;
        U.pe(!!TopBar.topbar, 'top bar instantiated twice, but it is a singleton.');
        TopBar.topbar = this;
        this.$html = $('#topbarShell');
        this.html = this.$html[0];
        this.$topbar = this.$html.find('#topbar');
        this.topbar = this.$topbar[0];
        TopBar.topbar.updateRecents();
        this.addEventListeners();
    }
    TopBar.load_empty = function (e, prefix) {
        var empty = prefix === 'm' ? Model.emptyModel : MetaModel.emptyModel;
        TopBar.load(empty, prefix);
    };
    TopBar.load_XMI_File = function (e, prefix) {
        // filename:   rootClass.name + '.' + MetaModel.name;   es: path\league.bowling
        // open file dialog
        // read file
        // transform in json
        var extension = Status.status.getActiveModel().isM1() ? '.' + Status.status.mm.fullname() : '.ecore';
        var xmistring = '';
        U.fileRead(function (e, files, fileContents) {
            U.pe(!fileContents || !files || fileContents.length !== files.length, 'Failed to get file contents:', files, fileContents);
            U.pe(fileContents.length > 1, 'should not be possible to input multiple files.');
            if (fileContents.length == 0)
                return;
            xmistring = fileContents[0];
            console.log('xmistr input: ', xmistring);
            var xmlDoc = new DOMParser().parseFromString(xmistring, "text/xml");
            console.log('xml:', xmlDoc);
            var jsonstr = prxml2json.xml2json(xmlDoc, '    ');
            console.log('jsonstr input: ', jsonstr);
            // U.pe(true, 'xml -> json', prxml2json, 'json -> xml', prjson2xml);
            TopBar.load(jsonstr, prefix);
        }, [extension], true);
    };
    TopBar.load = function (json, prefix) {
        var m = prefix === 'm' ? Status.status.m : Status.status.mm;
        var num = prefix === 'm' ? 1 : 2;
        window['' + 'discardSave']();
        if (m.name)
            m.save(false);
        if (m.isM2()) {
            Status.status.m.save(false);
            LocalStorage.deleteLastOpened(1);
        }
        LocalStorage.setLastOpened(num, json, null, null);
        U.refreshPage();
    };
    TopBar.load_JSON_Text = function (e, prefix) {
        var onoutput = function (ee) { finish(); };
        var finish = function () {
            var input = popup.getInputNode()[0];
            popup.destroy();
            TopBar.load(input.value, prefix);
        };
        var popup = new InputPopup('paste JSON/string data', '', '', [['input', onoutput], ['change', onoutput]], 'paste data here.', '', 'textarea');
        // $(popup).find('.closeButton');
        popup.addOkButton('Load', finish);
        popup.show();
    };
    TopBar.download_JSON_String = function (e, modelstr) {
        var model = Status.status[modelstr];
        U.pe(!model, 'invalid modelStr in export-save_str: |' + modelstr + '|, status:', status);
        var savetxt = model.generateModelString();
        U.pe(!savetxt || savetxt === '', 'empty str');
        U.clipboardCopy(savetxt);
        var popup = new InputPopup((model.isM() ? 'Model' : 'Metamodel') + ' eCore/JSON', '', '<br>Already copied to clipboard.', [], null, '' + savetxt, 'textarea');
        popup.show();
    };
    TopBar.download_JSON_File = function (e, modelstr) {
        var model = Status.status[modelstr];
        U.pe(!model, 'invalid modelStr in export-save_json_file: |' + modelstr + '|, status:', status);
        var savetxt = model.generateModelString();
        U.download(model.name, savetxt);
    };
    TopBar.download_XMI_File = function (e, modelstr) {
        var model = Status.status[modelstr];
        U.pe(!model, 'invalid modelStr in export-save_xmi_file: |' + modelstr + '|, status:', status);
        var savetxt = model.generateModelString();
        var json = JSON.parse(savetxt);
        /*const parser = new FastXmi.j2xParser(new FastXmiOptions());
        const xml: string = parser.parse(json, new FastXmiOptions());
        savetxt = '' + xml; */
        // savetxt = json2xml(savetxt, { header: true } as JS2XML); // , Options.JS2XML);
        // console.log('xmljson: ', parser.parse(json));
        savetxt = '' + prjson2xml.json2xml(json, ' ');
        savetxt = TopBar.formatXml(savetxt).trim();
        var name;
        var extension;
        if (model.isM()) {
            var classRoot = model.classRoot;
            name = (model.name || (classRoot ? classRoot.metaParent.name : 'M1_unnamed'));
            extension = '.' + (Status.status.mm.childrens[0].name).toLowerCase();
        }
        else {
            name = (model.name || model.getDefaultPackage().name || 'M2_unnamed');
            extension = '.ecore';
        }
        U.download(name + extension, savetxt);
    };
    TopBar.formatXml = function (xml) {
        var reg = /(>)\s*(<)(\/*)/g; // updated Mar 30, 2015
        var wsexp = / *(.*) +\n/g;
        var contexp = /(<.+>)(.+\n)/g;
        xml = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
        var pad = '' || '\t';
        var formatted = '';
        var lines = xml.split('\n');
        var indent = 0;
        var lastType = 'other';
        // 4 types of tags - single, closing, opening, other (text, doctype, comment) - 4*4 = 16 transitions
        var transitions = {
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
        var i = 0;
        for (i = 0; i < lines.length; i++) {
            var ln = lines[i];
            // Luca Viggiani 2017-07-03: handle optional <?xml ... ?> declaration
            if (ln.match(/\s*<\?xml/)) {
                formatted += ln + '\n';
                continue;
            }
            // ---
            var single = Boolean(ln.match(/<.+\/>/)); // is this line a single tag? ex. <br />
            var closing = Boolean(ln.match(/<\/.+>/)); // is this a closing tag? ex. </a>
            var opening = Boolean(ln.match(/<[^!].*>/)); // is this even a tag (that's not <!something>)
            var type = single ? 'single' : closing ? 'closing' : opening ? 'opening' : 'other';
            var fromTo = lastType + '->' + type;
            lastType = type;
            var padding = '';
            indent += transitions[fromTo];
            var j = void 0;
            for (j = 0; j < indent; j++) {
                padding += pad;
            }
            if (fromTo === 'opening->closing') {
                formatted = formatted.substr(0, formatted.length - 1) + ln + '\n'; // substr removes line break (\n) from prev loop
            }
            else {
                formatted += padding + ln + '\n';
            }
        }
        return formatted;
    };
    TopBar.prototype.updateRecents = function () {
        var _this = this;
        var tmp;
        tmp = localStorage.getItem('MM_SaveList');
        if (!tmp || tmp === '' || tmp === 'null' || tmp === 'undefined') {
            tmp = JSON.stringify([]);
        }
        var mmSaveList = JSON.parse(tmp);
        tmp = localStorage.getItem('M_SaveList');
        if (!tmp || tmp === '' || tmp === 'null' || tmp === 'undefined') {
            tmp = JSON.stringify([]);
        }
        var mSaveList = JSON.parse(tmp);
        var $metamodelHtml = this.$html.find('.metamodel');
        var $modelHtml = this.$html.find('.model');
        var recentContainerMM = $metamodelHtml.find('.recentSaveContainer')[0];
        var recentContainerM = $modelHtml.find('.recentSaveContainer')[0];
        console.log(recentContainerM, recentContainerMM);
        var exampleChilds = [recentContainerMM.childNodes[0], recentContainerM.childNodes[0]];
        U.clear(recentContainerMM);
        U.clear(recentContainerM);
        var i = -1;
        var j = -1;
        var child;
        var prefixarr = ['MM_', 'M_'];
        var containerArr = [recentContainerMM, recentContainerM];
        var saveList = [mmSaveList, mSaveList];
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
        $metamodelHtml.find('.recentsave').off('click.load').on('click.load', function (e) {
            _this.loadRecent(e.currentTarget.innerText, true);
        });
        $modelHtml.find('.recentsave').off('click.load').on('click.load', function (e) {
            _this.loadRecent(e.currentTarget.innerText, false);
        });
    };
    TopBar.prototype.loadRecent = function (name, isMetaModel) {
        var prefix = isMetaModel ? 'MM' : 'M';
        var tmp = localStorage.getItem(prefix + '_' + name);
        U.pe(!tmp || tmp === '' || tmp === 'null' || tmp === 'undefined', 'uncorrect savename: |' + prefix + '_' + name + '|');
        localStorage.setItem('LastOpened' + prefix, tmp);
        U.refreshPage();
    };
    TopBar.prototype.addEventListeners = function () {
        var $t = this.$topbar;
        var $m2 = $t.find('.metamodel');
        var $m1 = $t.find('.model');
        $t.find('.TypeMapping').off('click.btn').on('click.btn', function (e) { TopBar.topbar.showTypeMap(); });
        $m2.find('.save').off('click.btn').on('click.btn', function (e) { Status.status.mm.save(false, null); });
        $m1.find('.save').off('click.btn').on('click.btn', function (e) { Status.status.m.save(false, null); });
        // download
        $m2.find('.download_JSON_String').off('click.btn').on('click.btn', function (e) { TopBar.download_JSON_String(e, 'mm'); });
        $m2.find('.download_JSON').off('click.btn').on('click.btn', function (e) { TopBar.download_JSON_File(e, 'mm'); });
        $m2.find('.download_XMI').off('click.btn').on('click.btn', function (e) { TopBar.download_XMI_File(e, 'mm'); });
        $m1.find('.download_JSON_String').off('click.btn').on('click.btn', function (e) { TopBar.download_JSON_String(e, 'm'); });
        $m1.find('.download_JSON').off('click.btn').on('click.btn', function (e) { TopBar.download_JSON_File(e, 'm'); });
        $m1.find('.download_XMI').off('click.btn').on('click.btn', function (e) { TopBar.download_XMI_File(e, 'm'); });
        //// load
        $m2.find('.loadEmpty').off('click.btn').on('click.btn', function (e) { TopBar.load_empty(e, 'mm'); });
        $m2.find('.loadFile').off('click.btn').on('click.btn', function (e) { TopBar.load_XMI_File(e, 'mm'); });
        $m2.find('.loadTxt').off('click.btn').on('click.btn', function (e) { TopBar.load_JSON_Text(e, 'mm'); });
        $m1.find('.loadEmpty').off('click.btn').on('click.btn', function (e) { TopBar.load_empty(e, 'm'); });
        $m1.find('.loadFile').off('click.btn').on('click.btn', function (e) { TopBar.load_XMI_File(e, 'm'); });
        $m1.find('.loadTxt').off('click.btn').on('click.btn', function (e) { TopBar.load_JSON_Text(e, 'm'); });
    };
    TopBar.prototype.showTypeMap = function () {
        var $shell = this.$html.find('#TypeMapper');
        var $html = $shell.find('.TypeList');
        var html = $html[0];
        U.clear(html);
        var table = U.toHtml('<table class="typeTable"><tbody></tbody></table>');
        var tbody = table.firstChild;
        for (var m3TypeName in ShortAttribETypes) {
            if (!ShortAttribETypes[m3TypeName]) {
                continue;
            }
            var type = EType.get(ShortAttribETypes[m3TypeName]);
            var row = U.toHtmlRow('' +
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
        $html.find('input.AliasName').off('change').on('change', function (e) { TopBar.topbar.aliasChange(e); });
        $shell.show();
        U.closeButtonSetup($shell);
    };
    TopBar.prototype.aliasChange = function (e) {
        var input = e.target;
        var row = input;
        while (!row.classList.contains('typeRow')) {
            row = row.parentNode;
        }
        var m3Type = $(row).find('.typeName')[0].dataset.m3name;
        var type = EType.get(m3Type);
        type.changeAlias(input.value);
    };
    TopBar.topbar = null;
    return TopBar;
}());
export { TopBar };
//# sourceMappingURL=top-bar.component.js.map