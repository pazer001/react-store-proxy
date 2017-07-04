import React from 'react';
import {isEqual, cloneDeep} from 'lodash';

export default class RSP extends React.Component {
    static providerRoot;

    static render(object = null, key = null, value = null, middleware = null) {
        if (middleware && typeof middleware === 'function') middleware(cloneDeep(object), key, cloneDeep(value));
        RSP.providerRoot.setState({});
    }

    static createStore(object = {}, config = {}) {
        for (let key in object) {
            if (typeof object[key] === 'object') object[key] = this.createStore(object[key]);
        }

        const proxyHandler = {
            get: (object, key) => key in object ? object[key] : object,
            set: (object, key, value) => {
                if (object.length !== undefined) {
                    object[key] = value;
                    this.render(object, key, value, config.middleware);
                    return true;
                }

                switch (typeof value) {
                    case 'object':
                        if (!isEqual(object[key], value)) {
                            object[key] = this.createStore(value)
                            this.render(object, key, value, config.middleware)
                        }
                        break;
                    default:
                        if (object[key] !== value) {
                            object[key] = value;
                            this.render(object, key, value, config.middleware)
                        }
                }
                return true
            },
            delete: (object, key) => {
                if (key in object) {
                    delete object[key];
                    this.render(object, key, null, config.middleware);
                    return true
                } else {
                    return false
                }
            }
        };


        const store = new Proxy(object, proxyHandler);
        if (config.toWindow && config.name && typeof window === 'object') {
            if (!window.stores) window.stores = {};
            if (!window.stores[config.name]) {
                window.stores[config.name] = store;
                window.getStore = this.getStore;
            }
        }
        return store;
    }

    static getStore(object) {
        let flatObject = cloneDeep(object);
        return flatObject;
    }

    componentWillMount() {
        RSP.providerRoot     =   this.props.bind;
    }

    render() {
        return this.props.children
    }
}