import {
  Dictionary,
  EdgePointStyle,
  EdgeStyle, GraphSize, EdgeModes,
  IAttribute,
  IClass,
  IEdge,
  IFeature,
  IModel,
  IPackage,
  IReference,
  IVertex,
  Json, Model, Status,
  U, eCoreClass
} from '../common/Joiner';
export class EcoreEModel {}
export class EcoreEPackage {}
export class EcoreEAttribute { debug1: 0; }
export class EcoreEReference {}
export class EcoreEClass {}
import * as Ecoree from 'ecore';
export let Ecore = Ecoree;
export class EcoreLayer {


  public static ModelToXMI(s: Model): string {
    const modelecore: any = EcoreLayer.ModelToEcore(s);
    return EcoreLayer.EcoreToXMI(modelecore);
  }

  public static XMIToModel(s: string): Model {
    const modelecore: any = EcoreLayer.XMIToEcore(s);
    return EcoreLayer.EcoreToModel(modelecore);
  }


  ///////////////////// others
  public static EcoreToXMI(str: string): any {
    const rs = Ecore.ResourceSet.create();
    const r2 = rs.create({ uri: 'uri_test_' });
    r2.parse(str, Ecore.XMI);
    return r2.get('contents').first(); }
  public static XMIToEcore(str: string): any {
    const rset = Ecore.ResourceSet.create();
    const r = rset.create({ uri: 'uri_test_' });
    r.parse(str, Ecore.XMI);
    return r.get('contents').first(); }

  public static EcoreToModel(s: string): any { }
  public static ModelToEcore(m: IModel): EcoreEModel {
    U.pe(m.childrens.length !== 1, 'model must have exactly 1 package.');
    return EcoreLayer.PackageToEcore(m.childrens[0] as unknown as IPackage) as EcoreEModel;
  }


public static test2() {
    EcoreLayer.example();
    const str = '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<org.eclipse.example.bowling:League xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:org.eclipse.example.bowling="https://org/eclipse/example/bowling">\n' +
      '  <Players name="tizio"/>\n' +
      '  <Players name="asd"/>\n' +
      '</org.eclipse.example.bowling:League>\n';
    const ecore = EcoreLayer.XMIToEcore(str);
    console.log('ecore:', ecore);
}
  static testbed() {
    let p = Ecore.EPackage.create({
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
    var r = rs.create({uri: 'p'});
    r.get('contents').add(p);

    var result = r.to(Ecore.XMI, true);

    // Print the result

    console.log('result:', result);
    console.log('p:', p);
  }

  static example() {
    // XMI is supported in the browser and in node via the sax-js library.
    const p = Ecore.EPackage.create({
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
    const rs = Ecore.ResourceSet.create();
    const r = rs.create({ uri: 'p' });
    const rs2 = Ecore.ResourceSet.create();
    let r2 = rs.create({ uri: 'p2' });
    r.get('contents').add(p);
    let result = r.to(Ecore.XMI, true);
    console.log('result to xmi:', result);
    // We can now try to load the xmi in another resource
    r2 = rs.create({ uri: 'p2' });
    // Use the parse method
    r2.parse(result, Ecore.XMI);
    const p2 = r2.get('contents').first();
    console.log('p2 parsed:', p2);

    const classes = p2.get('eClassifiers')._internal;
    console.log('parsed', p2.get('name'));
    console.log('classes', classes, p2.get('eClassifiers').map((c) => { return c.get('name'); }));
    console.log('annotations', p2.get('eClassifiers').first().get('eAnnotations').map((a) => {
      return a.get('source') + ' : ' + a.get('details').map((d) => { return d.get('key') + ' -> ' + d.get('value'); } );
    }));
    console.log('attributes', p2.get('eClassifiers').first().get('eStructuralFeatures').map((f) => {
      return f.get('name') + ' : ' + f.get('eType').get('name');
    }));
    const foo = classes[0].create({ name: 'fooInstance' });
    console.log('foo instance:', foo);
    r.get('contents').add(foo);
    result = r.to(Ecore.XMI, true);
    console.log('result model to xmi:', result);

  }



  private static PackageToEcore(p: IPackage): EcoreEPackage {
    const classifiers = [];
    let i = -1;
    while (++i < p.childrens.length) { classifiers.push(EcoreLayer.ClassToEcore(p.childrens[i] as IClass)); }
    const pkg: EcoreEPackage = {name: p.name,
      nsPrefix: 'test_prefix',
      nsURI: 'http://test.js/',
      eClassifiers: classifiers };
    return pkg; }
  static ClassToEcore(m: IClass): EcoreEClass {
    const structuralFeatures: any[] = [];
    let i = -1;
    while (++i < m.attributes.length) { structuralFeatures.push(EcoreLayer.AttributeToEcore(m.attributes[i])); }
    i = -1;
    /// todo: post processing di tutte le classi, genera un dizionario IClass -> ecoreClass e tramite quello fai una fixereferences()
    while (++i < m.references.length) { structuralFeatures.push(EcoreLayer.ReferenceToEcore(m.references[i], null)); }
    structuralFeatures.push();
    const classe: EcoreEClass = Ecore.EClass.create({
      name: m.name,
      eAnnotations: [ {
          source: 'test_my-source',
          details: [ {
              key: 'test_myKey',
              value: 'test_my value' }
          ]
        } ],
      eStructuralFeatures: structuralFeatures
    });
    return classe;
  }

  static AttributeToEcore(m: IAttribute): EcoreEAttribute {
    return Ecore.EAttribute.create({
    name: m.name,
    upperBound: m.upperbound,
    eType: Ecore.EString,
    // ipotizzati:
    lowerBound: m.lowerbound
  }) as EcoreEAttribute;
  }

  static ReferenceToEcore(m: IReference, type: any): EcoreEReference {
    return Ecore.EReference.create({
      // sicuri:
      name: m.name,
      upperBound: m.upperbound,
      containment: false,
      eType: () => type,
      // ipotizzati:
      lowerBound: m.lowerbound
    }) as EcoreEReference;
  }
}
