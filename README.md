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
   
@Component({
   selector:'posts-parent',
   template:  `
       <h2>View Posts</h2>
       <posts-list></posts-list>
     `,
     directives:[PostsListsComponent]
})
export class PostsComponent {
}
```



