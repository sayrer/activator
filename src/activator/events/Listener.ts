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

import ListenableKey = require('./ListenableKey');
import Listenable = require('./Listenable');

/**
 * Counter used to create a unique key
 */
var listenableKeyCounter = 0;

/**
 * Simple class that stores information about a listener
 */
class Listener implements ListenableKey {
  listener: Function;
  proxy: Function;
  src: Listenable;
  type: string;
  capture: boolean;
  handler: Object;
  key: number;
  removed: boolean;
  callOnce: boolean;

  /*
   * @param listener Callback function.
   * @param proxy Wrapper for the listener that patches the event.
   * @param src Source object for the event.
   * @param type Event type.
   * @param capture Whether in capture or bubble phase.
   * @param handler Object in whose context to execute the callback.
  */
  constructor(listener: Function,
              proxy: Function,
              src: Listenable,
              type: string,
              capture: boolean,
              handler?: Object) {
    this.listener = listener;
    this.proxy = proxy;
    this.src = src;
    this.type = type;
    this.capture = !!capture;
    this.handler = handler;
    this.key = Listener.reserveKey();
    this.callOnce = false;
    this.removed = false;
  }

  markAsRemoved(): void {
    this.removed = true;
    this.listener = null;
    this.proxy = null;
    this.src = null;
    this.handler = null;
  }

  static reserveKey(): number {
    return ++listenableKeyCounter;
  }
}

export = Listener;
