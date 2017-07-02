import React from 'react';
import {isEqual} from 'lodash';

let providerRoot  = null;

const render = (object = null, key = null, value = null) => {
    providerRoot.setState({});
}

const proxyToObject = object => {
  if(!object) return undefined;
  let flatObject  = {};
  for(let key in object) {
    switch (typeof object[key]) {
      case 'object':
        flatObject[key]   = proxyToObject(object[key])
        break;
      default:
        flatObject[key]   = object[key];
    }
  }
  return flatObject;
}

const proxyHandler  = {
  get: (object, key) => key in object ? object[key] : object,
  set: (object, key, value, receiver) => {
    if(object.length !== undefined) {
      object[key]   = value;
      render(object, key, value);
      return true;
    }

    switch (typeof value) {
      case 'object':
        if(!isEqual(object[key], value)) {
          object[key]   = createStore(value)
          render(object, key, value)
        }
        break;
      default:
      if(object[key] !== value) {
        object[key]   = value;
        render(object, key, value)
      }
    }
    return true
  },
  delete: (object, key) => {
    if(key in object) {
      delete object[key];
      render(object, key);
      return true
    } else {
      return false
    }
  }
}

export const createStore = (object = {}, config = {}) => {
  for(let key in object) {
    if(typeof object[key] === 'object') object[key] = createStore(object[key]);
  }
  const store   =  new Proxy(object, proxyHandler);
  if(config.toWindow && config.name && typeof window === 'object') {
    if(!window.stores) window.stores   = {};
    if(!window.stores[config.name]) {
      window.stores[config.name]   = store;
      window.getStore   = getStore;
    }
  }
  return store;
}

export const getStore = object => {
  let flatObject  = proxyToObject(object);
  return flatObject;
}

export class Provider extends React.Component {
  componentWillMount() {
    providerRoot  = this.props.bind;
  }

  render() {
    return this.props.children
  }
}
