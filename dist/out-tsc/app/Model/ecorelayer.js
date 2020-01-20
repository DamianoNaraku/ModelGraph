import { U } from '../common/Joiner';
var EcoreEModel = /** @class */ (function () {
    function EcoreEModel() {
    }
    return EcoreEModel;
}());
export { EcoreEModel };
var EcoreEPackage = /** @class */ (function () {
    function EcoreEPackage() {
    }
    return EcoreEPackage;
}());
export { EcoreEPackage };
var EcoreEAttribute = /** @class */ (function () {
    function EcoreEAttribute() {
    }
    return EcoreEAttribute;
}());
export { EcoreEAttribute };
var EcoreEReference = /** @class */ (function () {
    function EcoreEReference() {
    }
    return EcoreEReference;
}());
export { EcoreEReference };
var EcoreEClass = /** @class */ (function () {
    function EcoreEClass() {
    }
    return EcoreEClass;
}());
export { EcoreEClass };
import * as Ecoree from 'ecore';
export var Ecore = Ecoree;
var EcoreLayer = /** @class */ (function () {
    function EcoreLayer() {
    }
    EcoreLayer.ModelToXMI = function (s) {
        var modelecore = EcoreLayer.ModelToEcore(s);
        return EcoreLayer.EcoreToXMI(modelecore);
    };
    EcoreLayer.XMIToModel = function (s) {
        var modelecore = EcoreLayer.XMIToEcore(s);
        return EcoreLayer.EcoreToModel(modelecore);
    };
    ///////////////////// others
    EcoreLayer.EcoreToXMI = function (str) {
        var rs = Ecore.ResourceSet.create();
        var r2 = rs.create({ uri: 'uri_test_' });
        r2.parse(str, Ecore.XMI);
        return r2.get('contents').first();
    };
    EcoreLayer.XMIToEcore = function (str) {
        var rset = Ecore.ResourceSet.create();
        var r = rset.create({ uri: 'uri_test_' });
        r.parse(str, Ecore.XMI);
        return r.get('contents').first();
    };
    EcoreLayer.EcoreToModel = function (s) { };
    EcoreLayer.ModelToEcore = function (m) {
        U.pe(m.childrens.length !== 1, 'model must have exactly 1 package.');
        return EcoreLayer.PackageToEcore(m.childrens[0]);
    };
    EcoreLayer.test2 = function () {
        EcoreLayer.example();
        var str = '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<org.eclipse.example.bowling:League xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:org.eclipse.example.bowling="https://org/eclipse/example/bowling">\n' +
            '  <Players name="tizio"/>\n' +
            '  <Players name="asd"/>\n' +
            '</org.eclipse.example.bowling:League>\n';
        var ecore = EcoreLayer.XMIToEcore(str);
        console.log('ecore:', ecore);
    };
    EcoreLayer.testbed = function () {
        var p = Ecore.EPackage.create({
            name: 'p',
            nsPrefix: 'p',
            nsURI: 'http://ecore.js/p',
            eClassifiers: [
                {
                    eClass: Ecore.EClass,
                    name: 'Foo',
                    eAnnotations: [
                        {
                            source: 'my-source',
                            details: [
                                {
                                    key: 'myKey',
                                    value: 'my value'
                                }
                            ]
                        }
                    ],
                    eStructuralFeatures: [
                        {
                            eClass: Ecore.EAttribute,
                            name: 'bar',
                            eType: Ecore.EString
                        }
                    ]
                }
            ]
        });
        var rs = Ecore.ResourceSet.create();
        var r = rs.create({ uri: 'p' });
        r.get('contents').add(p);
        var result = r.to(Ecore.XMI, true);
        // Print the result
        console.log('result:', result);
        console.log('p:', p);
    };
    EcoreLayer.example = function () {
        // XMI is supported in the browser and in node via the sax-js library.
        var p = Ecore.EPackage.create({
            name: 'p',
            nsPrefix: 'p',
            nsURI: 'http://ecore.js/p',
            eClassifiers: [
                {
                    eClass: Ecore.EClass,
                    name: 'Foo',
                    eAnnotations: [
                        {
                            source: 'my-source',
                            details: [
                                {
                                    key: 'myKey',
                                    value: 'my value'
                                }
                            ]
                        }
                    ],
                    eStructuralFeatures: [
                        {
                            eClass: Ecore.EAttribute,
                            name: 'bar',
                            eType: Ecore.EString
                        }
                    ]
                }
            ]
        });
        var rs = Ecore.ResourceSet.create();
        var r = rs.create({ uri: 'p' });
        var rs2 = Ecore.ResourceSet.create();
        var r2 = rs.create({ uri: 'p2' });
        r.get('contents').add(p);
        var result = r.to(Ecore.XMI, true);
        console.log('result to xmi:', result);
        // We can now try to load the xmi in another resource
        r2 = rs.create({ uri: 'p2' });
        // Use the parse method
        r2.parse(result, Ecore.XMI);
        var p2 = r2.get('contents').first();
        console.log('p2 parsed:', p2);
        var classes = p2.get('eClassifiers')._internal;
        console.log('parsed', p2.get('name'));
        console.log('classes', classes, p2.get('eClassifiers').map(function (c) { return c.get('name'); }));
        console.log('annotations', p2.get('eClassifiers').first().get('eAnnotations').map(function (a) {
            return a.get('source') + ' : ' + a.get('details').map(function (d) { return d.get('key') + ' -> ' + d.get('value'); });
        }));
        console.log('attributes', p2.get('eClassifiers').first().get('eStructuralFeatures').map(function (f) {
            return f.get('name') + ' : ' + f.get('eType').get('name');
        }));
        var foo = classes[0].create({ name: 'fooInstance' });
        console.log('foo instance:', foo);
        r.get('contents').add(foo);
        result = r.to(Ecore.XMI, true);
        console.log('result model to xmi:', result);
    };
    EcoreLayer.PackageToEcore = function (p) {
        var classifiers = [];
        var i = -1;
        while (++i < p.childrens.length) {
            classifiers.push(EcoreLayer.ClassToEcore(p.childrens[i]));
        }
        var pkg = { name: p.name,
            nsPrefix: 'test_prefix',
            nsURI: 'http://test.js/',
            eClassifiers: classifiers };
        return pkg;
    };
    EcoreLayer.ClassToEcore = function (m) {
        var structuralFeatures = [];
        var i = -1;
        while (++i < m.attributes.length) {
            structuralFeatures.push(EcoreLayer.AttributeToEcore(m.attributes[i]));
        }
        i = -1;
        /// todo: post processing di tutte le classi, genera un dizionario M2Class -> ecoreClass e tramite quello fai una fixereferences()
        while (++i < m.references.length) {
            structuralFeatures.push(EcoreLayer.ReferenceToEcore(m.references[i], null));
        }
        structuralFeatures.push();
        var classe = Ecore.EClass.create({
            name: m.name,
            eAnnotations: [{
                    source: 'test_my-source',
                    details: [{
                            key: 'test_myKey',
                            value: 'test_my value'
                        }
                    ]
                }],
            eStructuralFeatures: structuralFeatures
        });
        return classe;
    };
    EcoreLayer.AttributeToEcore = function (m) {
        return Ecore.EAttribute.create({
            name: m.name,
            upperBound: m.upperbound,
            eType: Ecore.EString,
            // ipotizzati:
            lowerBound: m.lowerbound
        });
    };
    EcoreLayer.ReferenceToEcore = function (m, type) {
        return Ecore.EReference.create({
            // sicuri:
            name: m.name,
            upperBound: m.upperbound,
            containment: false,
            eType: function () { return type; },
            // ipotizzati:
            lowerBound: m.lowerbound
        });
    };
    return EcoreLayer;
}());
export { EcoreLayer };
//# sourceMappingURL=ecorelayer.js.map