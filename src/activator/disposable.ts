/// <reference path="base.ts"/>

module twitter {
  export function dispose(obj) {
    if (obj && typeof obj.dispose == 'function') {
      obj.dispose();
    }
  }

  export function disposeAll(var_args) {
    for (var i = 0, len = arguments.length; i < len; ++i) {
      var disposable = arguments[i];
      if (twitter.isArrayLike(disposable)) {
        disposeAll.apply(null, disposable);
      } else {
        dispose(disposable);
      }
    }
  }

  export interface IDisposable {
    isDisposed(): boolean;
    dispose(): void;
  }

  export class Disposable implements IDisposable {
    static ENABLE_MONITORING: boolean = false;
    static instances = {};

    disposed: boolean;
    dependentDisposables = [];

    constructor() {
      if (Disposable.ENABLE_MONITORING) {
        Disposable.instances[twitter.getUid(this)] = this;
      }

      this.disposed = false;
    }

    static getUndisposedObjects(): Array<Object> {
      var ret = [];
      for (var id in Disposable.instances) {
        if (Disposable.instances.hasOwnProperty(id)) {
          ret.push(Disposable.instances[id]);
        }
      }
      return ret;
    }

    static clearUndisposedObjects(): void {
      Disposable.instances = {};
    }

    isDisposed(): boolean {
      return this.disposed;
    }

    dispose(): void {
      if (!this.disposed) {
        this.disposed = true;
        this.disposeInternal();
        if (Disposable.ENABLE_MONITORING) {
          var uid = twitter.getUid(this);
          if (!Disposable.instances.hasOwnProperty(uid)) {
             throw Error(this + ' did not call the Disposable base ' +
            'constructor or was disposed of after a clearUndisposedObjects ' +
            'call');
          }
          delete Disposable.instances[uid];
        }
      }
    }

    registerDisposable(disposable: IDisposable): void {
      this.dependentDisposables.push(disposable);
    }

    disposeInternal(): void {
      if (this.dependentDisposables.length > 0) {
        twitter.disposeAll.apply(null, this.dependentDisposables);
      }
    }
  }
}
