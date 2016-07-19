/**
 * Created by namita on 7/15/16.
 */
import {Component} from '@angular/core';
import {PostComponent} from './post/post.component'
import './rxjs-operators';

@Component({
    selector: 'my-app',
    template: `
        <h1>Fetching:</h1>
        <post-parent></post-parent>
    `,
    directives: <any>[PostComponent]
})

export class AppComponent {
}