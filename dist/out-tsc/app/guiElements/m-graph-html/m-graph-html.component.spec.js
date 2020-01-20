import { async, TestBed } from '@angular/core/testing';
import { MGraphHtmlComponent } from './m-graph-html.component';
describe('MGraphHtmlComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [MGraphHtmlComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(MGraphHtmlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=m-graph-html.component.spec.js.map