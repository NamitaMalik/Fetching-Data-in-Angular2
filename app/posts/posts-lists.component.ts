/**
 * Created by namita on 7/15/16.
 */

import {Component} from '@angular/core';
import {PostsDataService} from './posts-data.service';
import {PostsData} from './posts-data';

@Component({
    selector:'posts-list',
    template: `
    <div>
        <ul class="items">
        <li *ngFor="let postData of postsData">
        <span>{{postData.title}}</span></li>
        </ul>
    </div>
    `,
    providers: [PostsDataService]
})

export class PostsListsComponent {
    constructor(private _postsDataService: PostsDataService) {
        this.log();
    }

    private postsData:PostsData[]=[];
    private errorMessage:any='';

    log() {
        this._postsDataService.getData()
            .subscribe(
                posts => this.postsData=posts,
                error =>  this.errorMessage = <any>error);
    }
}