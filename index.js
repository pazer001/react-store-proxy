import React from 'react';
import {isEqual, cloneDeep} from 'lodash';

export default class RSP extends React.Component {
    static providerRoot;

    static render(object = null, key = null, value = null, middleware = null, renderCallback = null) {
        if (middleware) middleware(cloneDeep(object), key, cloneDeep(value));
        RSP.providerRoot.setState({}, renderCallback);
    }

    static errorHandler(middleware = null, renderCallback = null) {
        if(middleware && typeof middleware !== 'function') {
            console.error('middleware must be a function and must return true or false');
        }

        if(renderCallback && typeof renderCallback !== 'function') {
            console.error('renderCallback must be a function');
        }
    }

    static createStore(object = {}, config = {}) {
        const middleware        =   config.middleware || null;
        const renderCallback    =   config.renderCallback || null;
        RSP.errorHandler(middleware, renderCallback);

        for (let key in object) {
            if (typeof object[key] === 'object') object[key] = this.createStore(object[key]);
        }

        const proxyHandler = {
            get: (object, key) => key in object ? object[key] : undefined,
            set: (object, key, value) => {
                if (object.length !== undefined) {
                    object[key] = value;
                    this.render(object, key, value, middleware, renderCallback);
                    return true;
                }

                switch (typeof value) {
                    case 'object':
                        if (!isEqual(object[key], value)) {
                            object[key] = this.createStore(value);
                            this.render(object, key, value, middleware, renderCallback)
                        }
                        break;
                    default:
                        if (!object[key] || object[key] !== value) {
                            object[key] = value;
                            this.render(object, key, value, middleware, renderCallback)
                        }
                }
                return true
            },
            delete: (object, key) => {
                if (key in object) {
                    delete object[key];
                    this.render(object, key, null, middleware, renderCallback);
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
        return cloneDeep(object);
    }

    componentWillMount() {
        RSP.providerRoot     =   this.props.bind;
    }

    render() {
        return this.props.children
    }
}