# React Store Proxy

# Introduction
RSP is a store library for react which uses Proxy.

It helps you write a general store which connect all your app to.

RSP is a very tiny library which not affect your bundle size and aim to be very fast.

# Motivation
RSP is here to solve a problem caused by Redux and Mobx.

## Redux
The most popular store library for react (but not only) made by dan abramov.

Redux is a good library but it's weakness is it's boilerplate. it takes more boilerplate and learning curve.

to use redux use must control - Dispatcher / Action Creators / Constants / Reducers / Combined reducers / Connect etc...

## Mobx
A new kind of store library but its main core is that it watch for changes.

This method create a little boilerplate and is efficient but not efficient as redux.

## RSP
RSP came to solve these problem.

instead of creating lots of boilerplate, all you have to do is to create a store, use our RSP component and import your store when ever you want. that's it!

Well, it seems easy like mobx but here you don't have to use decorators which affect yor bundle size, you don't have to use observables which affects your performance and also you can create as many stores you like.

# How To Use
First of all install the library:

```javascript
npm install react-store-proxy --save
```

Now, lets say you have this store object:

```javascript
const initialState   =  {
  todos: [{
    text: 'Eat food',
    completed: true
  }, {
    text: 'Exercise',
    completed: false
  }]
}
```
To use it, all we have to do is to import RSP class and use it's createStore function and export it's result

```javascript
import RSP from 'react-store-proxy';
const initialState   =  {
  todos: [{
    text: 'Eat food',
    completed: true
  }, {
    text: 'Exercise',
    completed: false
  }]
};

const store    = RSP.createStore(initialState);
export default store;
```
Now, go to your root App component and wrap it with our Provider component like that.

```javascript
import React, { Component } from 'react';
import RSP from 'react-store-proxy';
import store from './store';

class App extends Component {
  render() {
    return (
      <RSP bind={this}>
      <div className="App">
        <button onClick={() => store.todos.push({text: 'My new todo', completed: false})}>click here</button>
        <p className="App-intro">
          {store.todos.map((todo, key) =>
            <li key={key}>{todo.text}</li>
          )}
        </p>
      </div>
      </RSP>
    );
  }
}

export default App;
```

Thats it!

for this simple usage, all you have to do when you want to add you new todo is just to create you action and push to its array.

it doesn't matter if you use some async action. the only thing matter is that you assign a new value to your store.

And if you want, you can build as many stores as you like and architect your actions where ever you want.

# Performance
RSP is will re-render your app only if change has been detected.
Also, if you change some sub-property of your store, RSP will not deep check the whole store but only the sub-property you made change to.

#Immutability
No need to worry about this. when a new object assign to the store, we deep check to see if it changed from the last state.
If so, a new Proxy object is created.

# Problems
Currently this library supports IE9 with one limitation - you cannot delete a property from your store like:

```javascript
delete object[key];
```

If IE9 is relevant to you, you can make the property to by null or undefined.

```javascript
object[key]     =   undefined;
object[key]     =   null;
```

# API
## RSP.createStore
This method will take 2 arguments. and return a new Proxy store object.
First is the store object. the store object can be a regular object or an array.
The second argument is a config object.
```javascript
const initialState   =  {
  todos: [{
    text: 'Eat food',
    completed: true
  }, {
    text: 'Exercise',
    completed: false
  }]
};


const config  = {
  name: 'Main',
  toWindow: true,
  middleware: (store, key, value) => store[key] === 'someValue'
};

const store   = Proxer.createStore(initialState, config);
```

## RSP.getStore
When store is created, the object will become a Proxy object which is hard to watch on the console.
if you want to see whats in you your store, you can use this method to recreate it as a regular object.
```javascript
const normalStore   =   RSP.getStore(store);
console.log(normalStore);
```

# Config
A config object can be attached to the createStore method as a second argument.
The config object should look like:
```javascript
const config  = {
  name: 'Main',
  toWindow: true,
  middleware: (store, key, value) => object[key] === 'someValue';
```

## toWindow
This will attach the store to the global window object so you can change the store on the fly from the console.
It will ignore it on Node environment.
To use this parameter you must give a name like 'Main' in our example.
Then on the console you can change your store with:
```javascript
stores.Main.someKey     =   `someValue`;
```

## middleware
Its a function that let you intercept the render process.
When called, it gets 3 arguments from the last change - store, key and value.
This function must return true for rendering or it will not continue and render.
If all you want to do is just log the values then return true anyway.

## renderCallback
Because setState in react is async, you can now set this property as a function for callback after rendering.