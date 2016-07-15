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

So, before we dive deeper into **Http** service, let's quickly have a glimpse at **Observables**.
