import { async, TestBed } from '@angular/core/testing';
import { MmGraphHtmlComponent } from './mm-graph-html.component';
describe('MmGraphHtmlComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [MmGraphHtmlComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(MmGraphHtmlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=mm-graph-html.component.spec.js.map