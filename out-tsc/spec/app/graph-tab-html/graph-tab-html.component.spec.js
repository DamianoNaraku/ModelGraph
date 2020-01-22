import { async, TestBed } from '@angular/core/testing';
import { GraphTabHtmlComponent } from './graph-tab-html.component';
describe('GraphTabHtmlComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [GraphTabHtmlComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(GraphTabHtmlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=graph-tab-html.component.spec.js.map