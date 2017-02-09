'use strict';

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StickyComponent} from './ng2-sticky/ng2-sticky';

export * from './ng2-sticky/ng2-sticky';

export default {
    directives: [StickyComponent]
}

@NgModule({
    imports: [CommonModule],
    declarations: [StickyComponent],
    exports: [StickyComponent]
})
export class StickyModule { }