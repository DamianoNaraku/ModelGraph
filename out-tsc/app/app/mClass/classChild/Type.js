import { AttribETypes, EOperation, EParameter, M2Attribute, M2Reference, ModelPiece, ShortAttribETypes, Status, Typedd, U } from '../../common/Joiner';
var Type = /** @class */ (function () {
    function Type(owner, typestr) {
        if (typestr === void 0) { typestr = null; }
        this.primitiveType = null;
        this.classType = null;
        this.enumType = null;
        this.owner = null; // todo: cambia to Typedd
        this.owner = owner;
        this.typestr = typestr;
        this.id = Type.idMax++;
        Type.allByID[this.id] = this;
        Type.all.push(this);
    }
    Type.updateTypeSelectors = function ($searchRoot, primitives, enums, classes) {
        if (primitives === void 0) { primitives = true; }
        if (enums === void 0) { enums = true; }
        if (classes === void 0) { classes = true; }
        if (!$searchRoot) {
            $searchRoot = $(document.body);
        }
        var key = U.getStartSeparatorKey();
        var query = (primitives ? U.startSeparator(key) + 'select[data-primitive="true"]' : '') +
            (enums ? U.startSeparator(key) + 'select[data-enum="true"]' : '') +
            (classes ? U.startSeparator(key) + 'select[data-class="true"]' : '');
        key = U.getStartSeparatorKey();
        var notquery = (primitives ? U.startSeparator(key) + '.template select[data-primitive="true"]' : '') +
            (enums ? U.startSeparator(key) + '.template select[data-enum="true"]' : '') +
            (classes ? U.startSeparator(key) + '.template select[data-class="true"]' : '');
        //    console.log(query);
        var $selects = $searchRoot.find(query).not(notquery);
        for (var i = 0; i < $selects.length; i++) {
            Type.updateTypeSelector($selects[i]);
        }
        if (classes && Status.status.m && Status.status.m.sidebar) {
            Status.status.m.sidebar.updateAll();
        }
    };
    Type.updateTypeSelector = function (selectHtml) {
        var addPrimitive = selectHtml.dataset.primitive === "true";
        var addEnum = selectHtml.dataset.enum === "true";
        var addClass = selectHtml.dataset.class === "true";
        var addVoid = selectHtml.dataset.void === "true";
        var type = Type.get(+selectHtml.dataset.typeid);
        Type.makeTypeSelector(selectHtml, type, addPrimitive, addEnum, addClass, addVoid);
    };
    Type.makeTypeSelector = function (selectHtml, selectedType, addPrimitive, addEnum, addClass, addVoid) {
        U.pe(!selectHtml, 'select is null');
        U.clear(selectHtml);
        var mp = ModelPiece.getLogic(selectHtml);
        if (mp && mp instanceof Typedd) {
            selectedType = mp.getType();
            $(selectHtml).off('change.type').on('change.type', function (e) { mp.fieldChanged(e); });
        }
        else
            return; //U.pw(true, 'type selector inserted on non-typed element:', selectHtml, mp);
        selectHtml.dataset.typeid = '' + selectedType.id;
        selectHtml.dataset.primitive = '' + (addPrimitive ? "true" : "false");
        selectHtml.dataset.enum = '' + (addEnum ? "true" : "false");
        selectHtml.dataset.class = '' + (addClass ? "true" : "false");
        selectHtml.dataset.void = '' + (addVoid ? "true" : "false");
        var grpReturn = document.createElement('optgroup');
        var grpPrimitive = document.createElement('optgroup');
        var grpEnum = document.createElement('optgroup');
        var grpClass = document.createElement('optgroup');
        grpReturn.label = 'Return Types';
        grpPrimitive.label = 'Primitive Types';
        grpEnum.label = 'Enumerative Types';
        grpClass.label = 'ClassReference Types';
        var optionFound = false;
        var key;
        var i;
        var foundit = function (opt) { optionFound = true; opt.setAttribute('selected', ''); opt.selected = true; };
        // primitive:
        if (addPrimitive) {
            for (key in EType.shorts) {
                if (!EType.shorts[key]) {
                    continue;
                }
                var etype = EType.shorts[key];
                if (etype.short === ShortAttribETypes.void && !addVoid) {
                    continue;
                }
                var opt = document.createElement('option');
                grpPrimitive.appendChild(opt);
                opt.value = etype.long;
                opt.innerHTML = etype.name;
                if (selectedType && etype === selectedType.primitiveType) {
                    foundit(opt);
                }
            }
        }
        // primitive end
        // Enum Start:
        if (addEnum) {
            var enumarr = Status.status.mm.getAllEnums();
            for (i = 0; i < enumarr.length; i++) {
                var e = enumarr[i];
                var opt = document.createElement('option');
                grpEnum.appendChild(opt);
                opt.value = e.getEcoreTypeName();
                opt.innerHTML = e.name;
                if (e === selectedType.enumType) {
                    foundit(opt);
                }
            }
        }
        // Enum End:
        // class Start:
        if (addClass) {
            var classarr = Status.status.mm.getAllClasses();
            for (i = 0; i < classarr.length; i++) {
                var e = classarr[i];
                var opt = document.createElement('option');
                grpClass.appendChild(opt);
                opt.value = e.getEcoreTypeName();
                opt.innerHTML = e.name;
                if (e === selectedType.classType) {
                    foundit(opt);
                }
            }
        }
        // class End:
        U.ArrayAdd(Type.selectors.all, selectHtml);
        if (addPrimitive) {
            U.ArrayAdd(Type.selectors.primitives, selectHtml);
        }
        if (addEnum) {
            U.ArrayAdd(Type.selectors.enums, selectHtml);
        }
        if (addClass) {
            U.ArrayAdd(Type.selectors.classes, selectHtml);
        }
        if (grpReturn.children.length)
            selectHtml.appendChild(grpReturn);
        if (grpPrimitive.children.length)
            selectHtml.appendChild(grpPrimitive);
        if (grpEnum.children.length)
            selectHtml.appendChild(grpEnum);
        if (grpClass.children.length)
            selectHtml.appendChild(grpClass);
        U.pe(selectedType && !optionFound, 'selected type option not found; select:', selectHtml, ' EType.shorts:', EType, EType.shorts, ', searchedVal:', selectedType);
    };
    Type.linkAll = function () { for (var i = 0; i < Type.all.length; i++) {
        Type.all[i].applyTypeStr();
    } };
    Type.get = function (id) { return Type.allByID[id]; };
    Type.prototype.changeType = function (typestr, primitiveType, classType, enumType) {
        if (typestr === void 0) { typestr = null; }
        if (primitiveType === void 0) { primitiveType = null; }
        if (classType === void 0) { classType = null; }
        if (enumType === void 0) { enumType = null; }
        U.pe((typestr ? 1 : 0) + (primitiveType ? 1 : 0) + (classType ? 1 : 0) !== 1, 'changeType(): exactly one argument is required. str:', typestr, 'primitive:', primitiveType, 'classType:', classType);
        if (!(typestr || primitiveType || classType || enumType))
            return;
        if (typestr) {
            this.typestr = typestr;
        }
        if (primitiveType) {
            this.typestr = primitiveType.long;
        }
        if (classType) {
            this.typestr = classType.getEcoreTypeName();
        }
        if (enumType) {
            this.typestr = enumType.getEcoreTypeName();
        }
        this.applyTypeStr();
    };
    Type.prototype.defaultValue = function () {
        if (this.primitiveType)
            return this.primitiveType.defaultValue;
        if (this.enumType)
            return this.enumType.childrens[0].name;
        return null;
    };
    Type.prototype.applyTypeStr = function () {
        if (!this.typestr || !Status.status.mm)
            return;
        this.applyTypeStr0();
        if (this.primitiveType)
            this.printablename = this.primitiveType.name;
        if (this.enumType)
            this.printablename = this.enumType.name;
        if (this.classType)
            this.printablename = this.classType.name ? this.classType.name : this.classType.metaParent.name;
        if (this.typestr === '???void')
            this.printablename = 'void';
        U.pe(!this.printablename, this);
    };
    Type.prototype.applyTypeStr0 = function () {
        var debug = true;
        var i;
        var oldClass = this.classType;
        var oldEnum = this.enumType;
        var oldPrimitive = this.primitiveType;
        this.enumType = this.classType = this.primitiveType = null;
        var typestr = this.typestr;
        // this.typestr = null;
        if (debug) {
            U.cclear();
        }
        U.pif(debug, 'changeType()', this, this.typestr);
        this.primitiveType = EType.getFromLongString(typestr, false);
        if (!this.primitiveType) {
            U.pe(typestr.indexOf(Type.classTypePrefix) !== 0, 'allyTypeStr(): found typestr neither primitive nor classifier.', this.typestr, this);
            var s = typestr.substr(Type.classTypePrefix.length);
            var packages = Status.status.mm.childrens;
            for (i = 0; i < packages.length; i++) {
                var pkg = packages[i];
                var c = pkg.getClass(s);
                if (c) {
                    this.classType = c;
                    break;
                }
                var e = pkg.getEnum(s);
                if (e) {
                    this.enumType = e;
                    break;
                }
            }
        }
        U.pe(!this.primitiveType && !this.enumType && !this.classType, 'failed to find target: |' + typestr + '|', Status.status.mm);
        if (this.owner instanceof M2Reference) {
            if (oldClass === this.classType)
                return;
            if (oldClass) {
                U.arrayRemoveAll(oldClass.referencesIN, this.owner);
            }
            this.classType.referencesIN.push(this.owner);
            if (this.owner.edges && this.owner.edges.length) {
                this.owner.edges[0].setTarget(this.classType.vertex);
                this.owner.edges[0].refreshGui();
            }
            U.pif(debug, 'ref target changed; type:' + this + 'inside:', this.owner);
            this.owner.refreshGUI();
            U.pif(debug, 'exit2: m2reference');
            return;
        }
        U.pif(debug, 'typechanged:', this.owner, this);
        if (this.owner instanceof M2Attribute) {
            for (i = 0; i < this.owner.instances.length; i++) {
                this.owner.instances[i].valuesAutofix();
            }
            this.owner.refreshGUI();
            U.pif(debug, 'exit3: attrib.');
            return;
        }
        if (this.owner instanceof EOperation) {
            this.owner.refreshGUI();
            return;
        }
        if (this.owner instanceof EParameter) {
            this.owner.refreshGUI();
            return;
        }
        U.pe(true, 'unexpected owner instance in changeType():', this);
    };
    Type.prototype.toEcoreString = function () {
        if (this.classType)
            return Type.classTypePrefix + this.classType.name;
        if (this.enumType)
            return Type.classTypePrefix + this.enumType.name;
        if (this.primitiveType)
            return this.primitiveType.long;
        return null;
    };
    Type.prototype.toShortString = function () {
        if (this.classType)
            return '' + this.classType.name;
        if (this.enumType)
            return '' + this.enumType.name;
        if (this.primitiveType)
            return '' + this.primitiveType.name;
        return null;
    };
    Type.all = [];
    Type.idMax = 0;
    Type.allByID = {};
    Type.classTypePrefix = '#//';
    Type.selectors = { all: [], primitives: [], classes: [], enums: [] };
    return Type;
}());
export { Type };
var EType = /** @class */ (function () {
    function EType(long, short, defaultVal, minValue, maxValue) {
        if (minValue === void 0) { minValue = null; }
        if (maxValue === void 0) { maxValue = null; }
        this.name = null;
        this.long = null;
        this.short = null;
        this.defaultValue = null;
        U.pe(EType.shorts[short], 'etype created twice:', EType.shorts[short]);
        EType.shorts[short] = this;
        this.long = long;
        this.short = short;
        this.defaultValue = defaultVal;
        this.minValue = minValue;
        this.maxValue = maxValue;
        var alias = Status.status.typeAliasDictionary[short];
        this.name = alias ? alias : short;
    }
    EType.staticInit = function () {
        EType.shorts = {};
        var noWarning;
        noWarning = new EType(AttribETypes.void, ShortAttribETypes.void, undefined);
        noWarning = new EType(AttribETypes.EDate, ShortAttribETypes.EDate, ' ');
        noWarning = new EType(AttribETypes.EChar, ShortAttribETypes.EChar, ' ');
        noWarning = new EType(AttribETypes.EString, ShortAttribETypes.EString, '');
        noWarning = new EType(AttribETypes.EBoolean, ShortAttribETypes.EBoolean, true);
        noWarning = new EType(AttribETypes.EByte, ShortAttribETypes.EByte, 0, -128, 127);
        noWarning = new EType(AttribETypes.EShort, ShortAttribETypes.EShort, 0, -32768, 32767);
        noWarning = new EType(AttribETypes.EInt, ShortAttribETypes.EInt, 0, -2147483648, 2147483647);
        noWarning = new EType(AttribETypes.ELong, ShortAttribETypes.ELong, 0, -9223372036854775808, 9223372036854775808);
        noWarning = new EType(AttribETypes.EFloat, ShortAttribETypes.EFloat, 0, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
        noWarning = new EType(AttribETypes.EDouble, ShortAttribETypes.EDouble, 0, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
        return EType.shorts;
    };
    EType.getFromLongString = function (ecorelongstring, throww) {
        if (throww === void 0) { throww = true; }
        switch (ecorelongstring) {
            default:
                U.pe(throww, 'Etype.Get() unrecognized type: ', ecorelongstring, '; string: ', AttribETypes.EString);
                break;
            case AttribETypes.void: return EType.get(ShortAttribETypes.void);
            case AttribETypes.EChar: return EType.get(ShortAttribETypes.EChar);
            case AttribETypes.EString: return EType.get(ShortAttribETypes.EString);
            case AttribETypes.EBoolean: return EType.get(ShortAttribETypes.EBoolean);
            case AttribETypes.EByte: return EType.get(ShortAttribETypes.EByte);
            case AttribETypes.EShort: return EType.get(ShortAttribETypes.EShort);
            case AttribETypes.EInt: return EType.get(ShortAttribETypes.EInt);
            case AttribETypes.ELong: return EType.get(ShortAttribETypes.ELong);
            case AttribETypes.EFloat: return EType.get(ShortAttribETypes.EFloat);
            case AttribETypes.EDouble: return EType.get(ShortAttribETypes.EDouble);
            case AttribETypes.EDate: return EType.get(ShortAttribETypes.EDate);
        }
        return null;
    };
    EType.get = function (a) { return EType.shorts[a]; };
    EType.getAlias = function (a) {
        var str = Status.status.typeAliasDictionary[a];
        return !str ? '' + a : Status.status.typeAliasDictionary[a];
    };
    EType.prototype.changeAlias = function (value) {
        this.name = value;
        Status.status.typeAliasDictionary[this.short] = this.name;
        Status.status.aliasTypeDictionary[this.name] = this.short;
        Status.status.mm.refreshGUI();
        Status.status.m.refreshGUI();
        Status.status.mm.graph.propertyBar.refreshGUI();
        Status.status.m.graph.propertyBar.refreshGUI();
    };
    EType.shorts = {};
    return EType;
}());
export { EType };
//# sourceMappingURL=Type.js.map