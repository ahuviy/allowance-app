(function (angular) {
    angular
        .module('app')
        .service('dataEventSrvc', service);

    service.$inject = ['dataSrvc', '$q'];

    function service(dataSrvc, $q) {
        var observables = {};
        var snapshots = {};
        
        var EXPORTED_FUNCTIONS = {
            subscribe: subscribe.bind(this),         // subscribe to an observable
            snapshot: snapshot.bind(this),           // get the current snapshot of an observable
            emit: emit.bind(this),                   // make an observable transmit an event
            dispose: dispose.bind(this),             // remove an observable and free system resources
            getActiveKeys: getActiveKeys.bind(this)  // get all active observable keys
        };
        Object.assign(this, EXPORTED_FUNCTIONS);
        

        function subscribe(key, callback) {
            var existingPromise = getObservable(key).promise;
            var subscriberAlreadyExists = false;
            subscriberAlreadyExists = doesSubscriberAlreadyExist(callback, existingPromise);
            return subscriberAlreadyExists ? null : existingPromise.then(null, null, callback);
        }

        function snapshot(key) {
            return snapshots[key] !== undefined ? snapshots[key] : null;
        }

        function emit(key, val) {
            snapshots[key] = val;
            getObservable(key).notify(val);
        }

        function dispose(key) {
            if (observables[key]) {
                observables[key].resolve();
                delete observables[key];
            }
            if (snapshots[key]) {
                delete snapshots[key];
            }
        }

        function getActiveKeys() {
            return Object.keys(observables);
        }

        function getObservable(key) {
            if (!observables[key]) {
                observables[key] = $q.defer();
            }
            return observables[key];
        }

        function doesSubscriberAlreadyExist(newSubscriber, existingPromise) {
            var subscriberAlreadyExists = false;
            if (existingPromise.$$state.pending) {
                existingPromise.$$state.pending.forEach(function (existingSubscriber) {
                    if (newSubscriber.toString() === existingSubscriber[3].toString()) {
                        subscriberAlreadyExists = true;
                    }
                });
            }
            return subscriberAlreadyExists;
        }
    }
}(angular));