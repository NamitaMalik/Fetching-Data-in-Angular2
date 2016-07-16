# Fetching-Data-in-Angular2

One of the most common scenario in any application is **client** interacting with the **server**. **HTTP** is the widely used protocol for this interaction. One can fetch data from the server, update data, create data and delete it using **HTTP** protocol.

The focus of this blog is to discuss the **GET** method of **HTTP** protocol.

In **Angular1.x**, we used **$http** service which provided us a **get()** method to fetch data from server. A simple **GET** request in **Angular1.x** was something like:

```
$http({method: 'GET', url: '/someUrl'})
    .then(function successCallback(response) {}, 
        function errorCallback(response) {}); 
```

As it can be seen above, **$http** returns a **promise** where we register two callbacks for **success** and **error**.

Now, let's move on to **Angular2**, and see how stuff works in it. **Angular2** has **Http** service which is used to make **get** calls to server. But an important thing to note here is that though **$http** service in **Angular1.x** returned a **promise**, **Http** service in **Angular2** returns **Observables**.

So, before we dive deeper into **Http** service, let's quickly have a glimpse at **Observables**:

To start off with, Observables are nothing but a stream of data.These data streams can be of anything - a stream of variables, properties, data structures or
even stream of events. One react to the stream by listening to it. Observables are basically based on **Observer Design Pattern**. In **Observer Design Pattern** one-to-many dependency is maintained between the objects, when one object changes its state all other objects/dependents are notified. These dependents are known as **Observers**.

A stream can emit 3 different things:
1. Value
2. Error
3. Completed signal

Suppose that stream is a stream of events being observed. A function is defined that will be executed when a value is emitted, another function executes when an error is emitted and a third one once the complete signal is emitted.
One can capture these events by using these functions. These functions are known as **Observers** and the stream which is being emitted is the **Observable**.

**Observables** can be of two types:

**1.Hot** - **Hot observables** are those which produce values even before their subscription gets activated. One can consider **Hot Observables** as live performances. The **hot observable** sequence is shared among each **subscriber**, also each **subscriber** gets the next value 
 in the sequence.
**2.Cold** - **Cold observables** behave like standard **iterators**. They push values only when we subscribes to them and they reset when we subscribe again. One can consider **Cold Observables** as a movie.

**Angular2** has chosen **Rxjs** as its core async pattern. **Rxjs** provides a number of operators attached to a stream such as **map**, **filter**, **scan**, **flatMap**, **toPromise**, **catch**.

Well, the above discussion is not even a tip of the iceberg on a subject such as **Observable**. You can read out more from [here](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754) and [here](http://www.barbarianmeetscoding.com/blog/2016/04/11/getting-started-with-rx-dot-js/).

Let's now move back the original agenda of this blog i.e. fetching data using **Http** service. Here is a sample use case:

-> We need to display a list of posts. The list of posts can be fetched through this API - 'http://jsonplaceholder.typicode.com/posts/'.

To achieve the above scenario let's break this small app into parts:

1. `AppComponent` - This the parent component for our application.
2. `PostsComponent` - This the child component inside our `AppComponent`. It will currently have `PostsListsComponent` as its child component. Tomorrow, if we plan to display the detail of a post, we may add **PostsDetailComponent** to display the details.
3. `PostsData` - We make `PostsData` **interface** to define the type of that we will receive from the **get** api.
4. `PostsDataService` - This service will actually fetch the data from the **get** api for us.

Here is our `app.component.ts`:

```
import {Component} from '@angular/core';
import {PostsComponent} from './posts/post.component'

@Component({
    selector: 'my-app',
    template: `
      <h1>Fetching:</h1>
      <posts-parent></posts-parent>
    `,
    directives:[PostsComponent]
})

export class AppComponent {
}
```
   
and here is the `posts.component.ts`:
   
```
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
export class PostsComponent {
}
```

We have injected `PostsDataService`. We register it as a provider by doing `providers:[PostsDataService]` so that its instance is available to all the child components of `PostsComponent`.
In case you are not aware about the **Angular2** services, you can have a quick read [here](http://namitamalik.github.io/Services-in-Angular2/)

Let's see the `posts-data.ts`, where we define the `PostsData`:

```
export interface PostsData {
    userId:number;
    id:number;
    title:string;
    body:string
}
```

Now, let's have a look at our `posts-lists.component.ts` which exports the `PostsListsComponent`:

```
import {Component} from '@angular/core';
import {PostsDataService} from './posts-data.service';
import {PostsData} from './posts-data';

@Component({
    selector:'posts-list',
    template: `
    <div>
    </div>
    `
})

export class PostsListsComponent {
    constructor(private _postsDataService: PostsDataService) {
        this.getPosts();
    }

    private postsData:PostsData[]=[];
    private errorMessage:any='';

    getPosts() {
        //To Do: Fetch Posts here using PostsDataService
    }
}
```

Couple of most important tasks are still pending in the above component:

1. We haven't yet written any code to display the list of posts.
2. We still need to fetch the data from server using the `PostsDataService` i.e. the definition part of the `getPosts()` function.

So, let's move to the `posts-data.service.ts` where a lot of action will actually take place:

```
import {Injectable} from "@angular/core";
import {PostsData} from './posts-data';

@Injectable()
export class PostsDataService {
}
```

Now, let's start one by one:

1. First, we need to import **Http** and **Response** from `@angular/http` and also need to import **Observable** from `rxjs/Observable`.
2. We need to use a few operators in our `getData()` function so we need to import them. Instead of importing all the operators let's import the required ones
 in `rxjs-operators.ts` and then import this into our `app.component.ts`. So our `app.component.ts` would now be:
 
```
import {Component} from '@angular/core';
import {PostsComponent} from './posts/post.component'
import './rxjs-operators';

@Component({
    selector: 'my-app',
    template: `
      <h1>Fetching:</h1>
      <posts-parent></posts-parent>
    `,
    directives:[PostsComponent]
})

export class AppComponent {
}
```
 
3. Now, we need to have a `getData()` function which will get posts from the api. So here is what our `getData()` function should be like:

```
getData (): Observable<PostsData[]> {
           return this.http.get('http://jsonplaceholder.typicode.com/posts/')
               .map(this.extractData)
               .catch(this.handleError);
       }
```

The api 'http://jsonplaceholder.typicode.com/posts/' returns us an array of posts data whereas our `http.get` would return us an **Observable**.
We then use the **map** operator which transforms the response emitted by Observable by applying a function to it. So in case of success, our flow would now move to `extractData()` function, which is:

```
private extractData(res: Response) {
        let body = res.json();
        return body || [];
    }
```

In the above snippet we are transforming are response to the **json** format by doing `res.json()`.

But in case, we had encountered error, our flow would have moved to `catch` operator. The **catch** operator intercepts an **onError** notification from **Observable** and continues the sequence without error. `handleError()` function would have come into play in that case:

```
private handleError (error: any) {
        let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Observable.throw(errMsg);
    }
```

After joining all the parts, our `posts-data.services.ts` would look like:

```
import {Injectable} from "@angular/core";
import {PostsData} from './posts-data';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PostsDataService {
    constructor (private http: Http) {}
    getData (): Observable<PostsData[]> {
        return this.http.get('http://jsonplaceholder.typicode.com/posts/')
            .map(this.extractData)
            .catch(this.handleError);
    }
    private extractData(res: Response) {
        let body = res.json();
        return body || [];
    }
    private handleError (error: any) {
        let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Observable.throw(errMsg);
    }
}
```

We should note that the above **Observable** is a **cold observable**. So one has to **subscribe** to it.

Now, let's move back to the `PostsListsComponent` and complete our pending stuff:

1. We will first add definition part to our `getPosts()` function:

```
getPosts() {
        this._postsDataService.getData()
            .subscribe(
                posts => this.postsData=posts,
                error =>  this.errorMessage = <any>error);
    }
```    

We can see the **subscribe** operator in the above snippet. In **Rxjs** one can **subscribe** to an **Observable** by passing 0 to 3 individual functions `onNext`, `onError` and `onCompleted`.

2. Now, we need to display the fetched `posts` in this `PostsListsComponent`. So our template would like:

```
   <div>
        <ul class="items">
        <li *ngFor="let postData of postsData">
        <span>{{postData.title}}</span></li>
        </ul>
    </div>
```    

In case you are not aware about how to iterate over **Arrays**, **Map**, **Set** you can have a quick read [here](http://namitamalik.github.io/NgRepeat-vs-ngFor/).


So now our complete `PostsListsComponent` would look like:

```
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
    `
})

export class PostsListsComponent {
    constructor(private _postsDataService: PostsDataService) {
        this.getPosts();
    }

    private postsData:PostsData[]=[];
    private errorMessage:any='';

    getPosts() {
        this._postsDataService.getData()
            .subscribe(
                posts => this.postsData=posts,
                error =>  this.errorMessage = <any>error);
    }
}
```

We have completed all the pending stuff and now we should be able to see list of posts.

As promised this blog educated us on fetching data in **Angular2** We are yet to see how to post data to a server in **Angular2** so stay tuned! till then Happy Learning!

