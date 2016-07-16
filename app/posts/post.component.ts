/**
 * Created by namita on 7/15/16.
 */

import {Component}  from '@angular/core';
import {PostsListsComponent} from './posts-lists.component';
import {PostsDataService} from './posts-data.service';

@Component({
    selector:'posts-parent',
    template:  `
    <h2>View Posts</h2>
    <posts-list></posts-list>
  `,
    directives:[PostsListsComponent],
    providers: [PostsDataService]
})
export class PostsComponent { }
