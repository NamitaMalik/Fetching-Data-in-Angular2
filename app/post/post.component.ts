/**
 * Created by namita on 7/15/16.
 */
import {Component}  from '@angular/core';
import {PostListComponent} from './post-list.component';
import {PostDataService} from './post-data.service';

@Component({
    selector: 'post-parent',
    template: `
        <h2>View Posts</h2>
        <post-list></post-list>
    `,
    directives: <any>[PostListComponent],
    providers: <any>[PostDataService]
})
export class PostComponent {
}
