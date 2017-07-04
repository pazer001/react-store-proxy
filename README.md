# Proxer

# Introduction
Proxer is a store library for react which uses Proxy.

It helps you write a general store which connect all your app to.

Proxer is a very tiny library which not affect your bundle size and aim to be very fast.

# Motivation
Proxer is here to solve a problem caused by Redux and Mobx.

##Redux
The most popular store library for redux made by dan abramov.

Redux is a good library but it's weakness is it's boilerplate. it takes more boilerplate and learning curve.

to use redux use must control - Dispatcher / Action Creators / Constants / Reducers / Combined reducers / Connect etc...

## Mobx
A new kind of store library but its main core is that it watch for changes.

This method create a little boilerplate and is efficient but not efficient as redux.

## Proxer
Proxer came to solve these problem.

instead of creating lots of boilerplate, all you have to do is to create a store, use our Provider component and import your store when ever you want. that's it!

Well, it seems easy like mobx but here you dont have to use decorators which affect yor bundle size, you dont have to use observables which affects your performance and also you can create as many stores you like.

# How To Use
First of all install the library:

npm install react-store-proxy --save
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
To use it, all we have to do is to import createStore function and export its result

import Proxer from 'react-store-proxy';

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

const store    = Proxer.createStore(initialState);
export default store;
```
Now, go to your root App component and wrap it with our Provider component like that.

```javascript
import React, { Component } from 'react';
import Proxer from 'react-store-proxy';
import store from './store';

class App extends Component {
  render() {
    return (
      <Proxer bind={this}>
      <div className="App">
        <button onClick={() => store.todos.push({text: 'My new todo', completed: false})}>click here</button>
        <p className="App-intro">
          {store.todos.map((todo, key) =>
            <li key={key}>{todo.text}</li>
          )}
        </p>
      </div>
      </Proxer>
    );
  }
}

export default App;
```

Thats it!

for this simple usage, all you have to do when you want to add you new todo is just to create you action and push to its array.

it doesnt care if you use some async action. the only thing matter is that you assign a new value to you store.

And if you bwant you can build as many stores as you like and architect your actions where ever you want.

# Performance
Proxer is will rerender your state only if change has been detected.
Also, if you chand some sub-property of your store, Proxer will not deep check it the whole store but only the sub-property you made change to.