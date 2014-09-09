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
// limitations under the License

import disposable = require('../disposable');
import Event = require('./Event');
import Listenable = require('./Listenable');
import ListenerMap = require('./ListenerMap');
import object = require('../object');

/**
 * An implementation of Listenable with full W3C EventTarget-like
 * support (capture/bubble mechanism, stopping event propagation,
 * preventing default actions).
 *
 * You may subclass this class to turn your class into a Listenable.
 *
 * Unless propagation is stopped, an event dispatched by an
 * EventTarget will bubble to the parent returned by
 * {@code getParentEventTarget}. To set the parent, call
 * {@code setParentEventTarget}. Subclasses that don't support
 * changing the parent can override the setter to throw an error.
 *
 * Example usage:
 * <pre>
 *   var source = new goog.events.EventTarget();
 *   function handleEvent(e) {
 *     alert('Type: ' + e.type + '; Target: ' + e.target);
 *   }
 *   source.listen('foo', handleEvent);
 *   // Or: events.listen(source, 'foo', handleEvent);
 *   ...
 *   source.dispatchEvent('foo');  // will call handleEvent
 *   ...
 *   source.unlisten('foo', handleEvent);
 *   // Or: events.unlisten(source, 'foo', handleEvent);
 * </pre>
 *
 */
export class EventTarget extends disposable.Disposable implements Listenable {
  /**
   * Maps of event type to an array of listeners.
   */
  private eventTargetListener: ListenerMap;

  /**
   * The object to use for event.target. Useful when mixing in an
   * EventTarget to another object.
   */
  private actualEventTarget: Object;

  /**
   * Parent event target, used during event bubbling.
   */
  private parent: Listenable;

  constructor() {
    this.eventTargetListener = new ListenerMap(this);
    this.actualEventTarget = this;
    this.parent = null;
  }

  /**
   * Returns the parent of this event target to use for bubbling.
   *
   * @return The parent Listenable or null if there is no parent.
   */
  getParent(): Listenable {
    return this.parent;
  }

  /**
   * Sets the parent of this event target to use for capture/bubble
   * mechanism.
   * @param parent Parent listenable (null if none).
   */
   setParent(parent: Listenable): void {
     this.parent = parent;
   }
}

/**
 * An artificial cap on the number of ancestors you can have. This is mainly
 * for loop detection.
 */
var MAX_ANCESTORS: number = 1000;
