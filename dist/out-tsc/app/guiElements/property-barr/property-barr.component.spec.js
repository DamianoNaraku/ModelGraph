import { async, TestBed } from '@angular/core/testing';
import { PropertyBarrComponent } from './property-barr.component';
describe('PropertyBarrComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [PropertyBarrComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(PropertyBarrComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=property-barr.component.spec.js.map