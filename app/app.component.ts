/**
 * Created by namita on 7/15/16.
 */

import {Component} from '@angular/core';
import {PostsComponent} from './posts/post.component'
import './rxjs-operators';

@Component({
    selector: 'my-app',
    template: `
      <h1>Fetching:</h1>
      <posts-parent></posts-parent>
    `,
    directives: <any>[PostsComponent]
})

export class AppComponent {
}
