// Copyright 2013 The Closure Library Authors. All Rights Reserved.
// Copyright 2014 Twitter, Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import base = require("./base")

export function dispose(obj) {
  if (obj && typeof obj.dispose == 'function') {
    obj.dispose();
  }
}

export function disposeAll(var_args) {
  for (var i = 0, len = arguments.length; i < len; ++i) {
    var disposable = arguments[i];
    if (base.isArrayLike(disposable)) {
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
      Disposable.instances[base.getUid(this)] = this;
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
        var uid = base.getUid(this);
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
      disposeAll.apply(null, this.dependentDisposables);
    }
  }
}

