# Fetching Data in Angular2

One of the most common scenario in any application is **client** interacting with the **server**. **HTTP** is the widely used protocol for this interaction. One can fetch data from the server, update data, create data and delete it using **HTTP** protocol.

The focus of this blog is to discuss the **GET** method of **HTTP** protocol.

In **Angular1.x**, we used **$http** service which provided us a **get()** method to fetch data from server. A simple **GET** request in **Angular1.x** was something like:

```JavaScript
$http({method: 'GET', url: '/someUrl'})
    .then(function successCallback(response) {}, 
        function errorCallback(response) {}); 
```

As it can be seen above, **$http** returns a **promise** where we register two callbacks for **success** and **error**.

Now, let's move on to **Angular2**, and see how stuff works in it. **Angular2** has **Http** service which is used to make **get** calls to server. But an important thing to note here is that **$http** service in **Angular1.x** returned a **promise** while  **Http** service in **Angular2** returns **Observables**.

So, before we dive deeper into **Http** service, let's quickly have a glimpse at **Observables**:

To start off with, **Observables** are nothing but a stream of data.These data streams can be of anything - a stream of variables, properties, data structures or
even stream of events. One can react to the stream by listening to it. **Observables** are basically based on **Observer Design Pattern**. In **Observer Design Pattern** one-to-many dependency is maintained between the objects, when one object changes its state all other objects/dependents are notified. These dependents are known as **Observers**.

A stream can emit 3 different things:

1. Value
2. Error
3. Completed signal

Suppose that stream is a stream of events being observed. A function is defined that will be executed when a value is emitted, another function executes when an error is emitted and a third one once the complete signal is emitted.
One can capture these events by using these functions. These functions are known as **Observers** and the stream which is being emitted is the **Observable**.

**Observables** can be of two types:

**1.Hot** - **Hot observables** are those which produce values even before their subscription gets activated. One can consider **Hot Observables** as live performance. The **hot observable** sequence is shared among each **subscriber**, also each **subscriber** gets the next value 
 in the sequence.

**2.Cold** - **Cold observables** behave like standard **iterators**. They push values only when we subscribes to them and they reset when we subscribe again. One can consider **Cold Observables** as a movie.

**Angular2** has chosen **Rxjs** as its core async pattern. **Rxjs** provides a number of operators attached to a stream such as **map**, **filter**, **scan**, **flatMap**, **toPromise**, **catch**.

Well, the above discussion is not even a tip of the iceberg on a subject such as **Observable**. You can read out more from [here](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754) and [here](http://www.barbarianmeetscoding.com/blog/2016/04/11/getting-started-with-rx-dot-js/).

Let's now move back the original agenda of this blog i.e. fetching data using **Http** service. Here is a sample use case:

> We need to display a list of posts. The list of posts can be fetched through this API - http://jsonplaceholder.typicode.com/posts/.

To achieve the above scenario let's break this small app into parts:

1. `AppComponent` - This is parent component for our application.
2. `PostComponent` - This is child component inside our `AppComponent`. It will currently have `PostListComponent` as its child component. Tomorrow, if we plan to display the detail of a post, we may add **PostDetailComponent** to display the details.
3. `Post` - We make `Post` **interface** to define the type of element that we will receive from the **GET** api.
4. `PostService` - This service will actually fetch the data via making **GET** call on the api for us.

Here is our `app.component.ts`:

```TypeScript
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
```
   
and here is the `post.component.ts`:

```TypeScript
import {Component}  from '@angular/core';
import {PostListComponent} from './post-list.component';
import {PostService} from './post.service';

@Component({
    selector: 'post-parent',
    template: `
        <h2>View Posts</h2>
        <post-list></post-list>
    `,
    directives: <any>[PostListComponent],
    providers: <any>[PostService]
})
export class PostComponent {
}
```

We have injected `PostService`. We register it as a provider by doing `providers:[PostService]` so that its instance is available to all the child components of `PostComponent`.
In case you are not aware about the **Angular2** **Services**, you can have a quick read [Services in Angular2](http://namitamalik.github.io/Services-in-Angular2/).

Let's see the `post.ts`, where we define the `Post`:

```TypeScript
export interface Post {
    userId:number;
    id:number;
    title:string;
    body:string
}
```

Now, let's have a look at our `post-list.component.ts` which exports the `PostListComponent`:

```TypeScript
import {Component} from '@angular/core';
import {PostService} from './post.service';
import {Post} from './post';

@Component({
    selector: 'post-list',
    template: `
        <div>
        </div>
    `
})

export class PostListComponent {
    constructor(private _postDataService:PostService) {
        this.getPosts();
    }

    private posts:Post[] = [];
    private errorMessage:any = '';

    getPosts() {
        //To Do: Fetch Posts here using PostsDataService
    }
}
```

Couple of most important tasks are still pending in the above component:

1. We haven't yet written any code to display the list of post.
2. We still need to fetch the data from server using the `PostService` i.e. the definition part of the `getPosts()` function.

So, let's move to the `post.service.ts` where a lot of action will actually take place:

```TypeScript
import {Injectable} from "@angular/core";
import {Post} from './post';

@Injectable()
export class PostService {
}
```

Now, let's start one by one:

1. First, we need to import **Http** and **Response** from `@angular/http` and also need to import **Observable** from `rxjs/Observable`.
So our `post.service.ts` would now be:
    ```TypeScript
    import {Injectable} from "@angular/core";
    import {Post} from './post';
    import { Http, Response } from '@angular/http';
    import { Observable } from 'rxjs/Observable';
    
    @Injectable()
    export class PostService {
    }
    ```

2. We need to use a few operators in our `getData()` function so we need to import them. Instead of importing all the operators let's import the required ones 
in `rxjs-operators.ts` and then import this into our `app.component.ts`.

    **rxjs-operators.ts**:
    ```TypeScript
    import 'rxjs/add/operator/catch';
    import 'rxjs/add/operator/map';
    import 'rxjs/add/operator/toPromise';
    ```
    
    **app.components.ts**:
    ```TypeScript
    import {Component} from '@angular/core';
    import {PostComponent} from './post/post.component'
    import './rxjs-operators';
    
    @Component({
        selector: 'my-app',
        template: `
          <h1>Fetching:</h1>
          <post-parent></post-parent>
        `,
        directives:[PostComponent]
    })
    
    export class AppComponent {
    }
    ```

3. Now, we need to have a `getData()` function which will get posts from the api. So here is what our `getData()` function should be like:
    ```TypeScript
    getData():Observable<Post[]> {
        return this.http.get('http://jsonplaceholder.typicode.com/posts/')
            .map(this.extractData)
            .catch(this.handleError);
    }
    ```

The api http://jsonplaceholder.typicode.com/posts/ returns us an array of post whereas our `http.get` would return us an **Observable**.
We then use the **map** operator which transforms the response emitted by **Observable** by applying a function to it. So in case of success, our flow 
would now move to `extractData()` function, which is:

```TypeScript
private extractData(res:Response) {
    let body = res.json();
    return body || [];
}
```

In the above snippet we are transforming response to the **json** format by doing `res.json()`.

But in case had we encountered an error, our flow would have moved to `catch` operator. The **catch** operator intercepts an **onError** notification 
from **Observable** and continues the sequence without error. `handleError()` function would have come into play in that case:

```TypeScript
private handleError(error:any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
}
```

After joining all the parts, our `post.service.ts` would look like:

```TypeScript
import {Injectable} from "@angular/core";
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Post} from './post';

@Injectable()
export class PostService {
    constructor(private http:Http) {
    }

    getData():Observable<Post[]> {
        return this.http.get('http://jsonplaceholder.typicode.com/posts/')
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res:Response) {
        let body = res.json();
        return body || [];
    }

    private handleError(error:any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}
```

We should note that the above **Observable** is a **cold observable**. So one has to **subscribe** to it.

Now, let's move back to the `PostListComponent` and complete our pending stuff:

1. We will first add definition part to our `getPosts()` function:
    ```TypeScript
    getPosts() {
        this._postDataService.getData()
            .subscribe(
                posts => this.posts = posts,
                error => this.errorMessage = <any>error);
    }
    ```    

    We can see the **subscribe** operator in the above snippet. In **Rxjs** one can **subscribe** to an **Observable** by passing 0 to 3 individual 
    functions `onNext`, `onError` and `onCompleted`.

2. Now, we need to display the fetched `post` in this `PostListComponent`. So our template would like:
    ```HTML
    <div>
        <ul class="items">
            <li *ngFor="let post of posts">
                <span>{{post.title}}</span>
            </li>
        </ul>
    </div>
    ```    

In case you are not aware about how to iterate over **Arrays**, **Map**, **Set** you can have a quick read [here](http://namitamalik.github.io/NgRepeat-vs-ngFor/).

So now our complete `PostListComponent` would look like:

```TypeScript
import {Component} from '@angular/core';
import {PostService} from './post.service';
import {Post} from './post';

@Component({
    selector: 'post-list',
    template: `
        <div>
            <ul class="items">
                <li *ngFor="let post of posts">
                    <span>{{post.title}}</span>
                </li>
            </ul>
        </div>
    `
})

export class PostListComponent {
    constructor(private _postDataService:PostService) {
        //should be moved to ngOnInit lifecycle hook
        this.getPosts();
    }

    private posts:Post[] = [];
    private errorMessage:any = '';

    getPosts() {
        this._postDataService.getData()
            .subscribe(
                posts => this.posts = posts,
                error => this.errorMessage = <any>error);
    }
}
```

> It is important to note that though we have called `getPosts` function in constructor, it is not a good practice. We should have called it in the **ngOnInit** lifecycle hook. Our constructors should be simple to enable easy debugging and testing.

We have completed all the pending stuff and now we should be able to see list of post.

But before we end this post, let's have a look at one more operator i.e. **toPromise**. This **operator** converts an **Observable** 
sequence to a **promise**. So if we use promises, then our `post.service.ts` would look like:

```TypeScript
import {Injectable} from "@angular/core";
import {Post} from './post';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PostService {
    constructor (private http: Http) {}
    getData (): Promise<Post[]> {
        return this.http.get('http://jsonplaceholder.typicode.com/posts/')
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }
    private extractData(res: Response) {
        let body = res.json();
        return body || [];
    }
    private handleError (error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}
```

If you could notice the difference, we have moved `this.extractData` which is the **success callback** as the first parameter whereas `this.errorHandler` is the second parameter.

Since we are now using **promises** we will also have to make tweaks in `post-list.component.ts`. We will have to call `then` on the returned promise instead of `subscribe`.

```TypeScript
import {Component} from '@angular/core';
import {PostService} from './post.service';
import {Post} from './post';

@Component({
    selector: 'post-list',
    template: `
        <div>
            <ul class="items">
                <li *ngFor="let post of posts">
                    <span>{{post.title}}</span>
                </li>
            </ul>
        </div>
    `
})

export class PostListComponent {
    constructor(private _postDataService:PostService) {
        this.getPosts();
    }

    private posts:Post[] = [];
    private errorMessage:any = '';

    getPosts() {
        this._postDataService.getData()
            .then(
                posts => this.posts = posts,
                error => this.errorMessage = <any>error);
    }
}
```

As promised this blog educated us on fetching data in **Angular2** We are yet to see how to post data to a server in **Angular2** so stay tuned! Till then Happy Learning!

Follow Me
---
[Github](https://github.com/NamitaMalik)

[Twitter](https://twitter.com/namita13_04)

[LinkedIn](https://in.linkedin.com/in/namita-malik-a7885b23)

[More Blogs By Me](https://namitamalik.github.io/)