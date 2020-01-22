import * as tslib_1 from "tslib";
import { Component, Input, ViewChild } from '@angular/core';
import { ContextMenuComponent, ContextMenuService } from 'ngx-contextmenu';
// @ts-ignore
var MyContextMenuClass = /** @class */ (function () {
    function MyContextMenuClass(contextMenuService) {
        this.contextMenuService = contextMenuService;
        this.items = [
            { name: 'John', otherProperty: 'Foo' },
            { name: 'Joe', otherProperty: 'Bar' }
        ];
    }
    MyContextMenuClass.prototype.onContextMenu = function ($event, item) {
        console.log('onContextMenu( event:', $event, ', item:', item, ')');
        this.contextMenuService.show.next({
            // Optional - if unspecified, all context menu components will open
            contextMenu: this.contextMenu,
            event: $event,
            item: item,
        });
        $event.preventDefault();
        $event.stopPropagation();
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", ContextMenuComponent)
    ], MyContextMenuClass.prototype, "contextMenu", void 0);
    tslib_1.__decorate([
        ViewChild(ContextMenuComponent),
        tslib_1.__metadata("design:type", ContextMenuComponent)
    ], MyContextMenuClass.prototype, "basicMenu", void 0);
    MyContextMenuClass = tslib_1.__decorate([
        Component({
            selector: 'app-ngxx-context-menu',
            templateUrl: './context-menu.component.html',
            styleUrls: ['./context-menu.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [ContextMenuService])
    ], MyContextMenuClass);
    return MyContextMenuClass;
}());
export { MyContextMenuClass };
//# sourceMappingURL=context-menu.component.js.map