// Copyright 2013 The Closure Library Authors. All Rights Reserved.
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
// limitations under the License

import disposable = require('../disposable');

class Event extends disposable.Disposable {
  eventType: string;
  target: Object;
  currentTarget: Object;

  /**
   * Whether the default action has been prevented.
   * This is a property to match the W3C specification at
   * {@link http://www.w3.org/TR/DOM-Level-3-Events/
   * #events-event-type-defaultPrevented}.
   * Must be treated as read-only outside the class.
   */
  defaultPrevented: boolean = false;

  /* Whether to cancel the event in internal capture/bubble processing for IE. */
  propagationStopped: boolean = false;

  /* Return value for internal capture/bubble processing for IE. */
  returnValue: boolean = true;

  constructor(eventType: string, target?: Object) {
    super();
    this.eventType = eventType;
    this.target = target;
    this.currentTarget = this.target;
  }

  disposeInternal() {
    delete this.eventType;
    delete this.target;
    delete this.currentTarget;
  }

  stopPropagation(): void {
    this.propagationStopped = true;
  }

  preventDefault(): void {
    this.defaultPrevented = true;
    this.returnValue = false;
  }

  static stopPropagation(e) {
    e.stopPropagation();
  }

  static preventDefault(e) {
    e.preventDefault();
  }
}

export = Event;
