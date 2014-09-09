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
import ListenableKey = require('./ListenableKey');
import ListenerMap = require('./ListenerMap');
import Listener = require('./Listener');
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
  private eventTargetListeners: ListenerMap;

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
    super();
    this.eventTargetListeners = new ListenerMap(this);
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

  /** @override */
  dispatchEvent(e): boolean {
    var ancestorsTree, ancestor = this.getParent();
    if (ancestor) {
      ancestorsTree = [];
      var ancestorCount = 1;
      for (; ancestor; ancestor = ancestor.getParent()) {
        ancestorsTree.push(ancestor);
        // assert((++ancestorCount < MAX_ANCESTORS), 'infinite loop');
      }
    }

    return EventTarget.dispatchEventInternal(this.actualEventTarget, e, ancestorsTree);
  }

  /**
   * Removes listeners from this object.  Classes that extend EventTarget may
   * need to override this method in order to remove references to DOM Elements
   * and additional listeners.
   * @override
   */
  disposeInternal(): void {
    super.disposeInternal();
    this.removeAllListeners();
    this.parent = null;
  }

  /** @override */
  listen<EVENTOBJ, SCOPE>
    (type: any,
     // TS deficiency: 'this' should be SCOPE
     listener: (eventObj: EVENTOBJ) => any,
     useCapture: boolean,
     listenerScope?: SCOPE): ListenableKey {
    return this.eventTargetListeners.add(String(type), listener, false /* callOnce */, useCapture, listenerScope);
  }

  /** @override */
  listenOnce<EVENTOBJ, SCOPE>
    (type: any,
     // TS deficiency: 'this' should be SCOPE
     listener: (eventObj: EVENTOBJ) => any,
     useCapture: boolean,
     listenerScope?: SCOPE
    ): ListenableKey {
    return this.eventTargetListeners.add(String(type), listener, true /* callOnce */, useCapture, listenerScope);
  }

  /** @override */
  unlisten<SCOPE, EVENTOBJ>
    (type: any,
     // TS deficiency: 'this' should be SCOPE
     listener: (eventObj: EVENTOBJ) => any,
     useCapture: boolean,
     listenerScope?: SCOPE
    ): boolean {
    return this.eventTargetListeners.remove(String(type), listener, useCapture, listenerScope);
  }

  /** @override */
  unlistenByKey(key: ListenableKey): boolean {
    return this.eventTargetListeners.removeByKey(key);
  }

  /** @override */
  removeAllListeners(eventType?: string): number {
    return this.eventTargetListeners.removeAll(eventType);
  }

  /** @override */
  fireListeners
    (type: any,
     capture: boolean,
     eventObject: Event
    ): boolean {
    var listeners: Array<Listener> = this.eventTargetListeners.listeners[String(type)];
    if (!listenerArray) {
      return true;
    }
    var listenerArray: Array<Listener> = listeners.concat();

    var rv = true;
    for (var i = 0; i < listenerArray.length; ++i) {
      var listener = listenerArray[i];
      // We might not have a listener if the listener was removed.
      if (listener && !listener.removed && listener.capture == capture) {
        var listenerFn = listener.listener;
        var listenerHandler = listener.handler || listener.src;

        if (listener.callOnce) {
          this.unlistenByKey(listener);
        }
        rv = listenerFn.call(listenerHandler, eventObject) !== false && rv;
      }
    }

    return rv && eventObject.returnValue != false;
  }

  /** @override */
  getListeners(type: any, capture: boolean): Array<ListenableKey> {
    return this.eventTargetListeners.getListeners(String(type), capture);
  }

  /** @override */
  getListener<SCOPE, EVENTOBJ>
    (type: any,
     // TS deficiency: 'this' should be SCOPE
     listener: (eventObj: EVENTOBJ) => any,
     useCapture: boolean,
     listenerScope?: SCOPE
    ): ListenableKey {
    return this.eventTargetListeners.getListener(String(type), listener, useCapture, listenerScope);
  }

  hasListener(type: any, useCapture: boolean): boolean {
    var id = type != null ? String(type) : undefined;
    return this.eventTargetListeners.hasListener(id, useCapture);
  }

  /**
   * Dispatches the given event on the ancestorsTree.
   *
   * @param {!Object} target The target to dispatch on.
   * @param {goog.events.Event|Object|string} e The event object.
   * @param {Array.<goog.events.Listenable>=} opt_ancestorsTree The ancestors
   *     tree of the target, in reverse order from the closest ancestor
   *     to the root event target. May be null if the target has no ancestor.
   * @return {boolean} If anyone called preventDefault on the event object (or
   *     if any of the listeners returns false) this will also return false.
   * @private
   */
  static dispatchEventInternal(target: Object, ev: any, ancestorsTree?: Array<Listenable>): boolean {
    var type = ev.type || /** @type {string} */ (ev);
    var e = coerceEvent(ev, target, type);
    var rv = true, currentTarget;

    // Executes all capture listeners on the ancestors, if any.
    if (ancestorsTree) {
      for (var i = ancestorsTree.length - 1; !e.propagationStopped && i >= 0;
           i--) {
        currentTarget = e.currentTarget = ancestorsTree[i];
        rv = currentTarget.fireListeners(type, true, e) && rv;
      }
    }

    // Executes capture and bubble listeners on the target.
    if (!e.propagationStopped) {
      currentTarget = e.currentTarget = target;
      rv = currentTarget.fireListeners(type, true, e) && rv;
      if (!e.propagationStopped) {
        rv = currentTarget.fireListeners(type, false, e) && rv;
      }
    }

    // Executes all bubble listeners on the ancestors, if any.
    if (ancestorsTree) {
      for (i = 0; !e.propagationStopped && i < ancestorsTree.length; i++) {
        currentTarget = e.currentTarget = ancestorsTree[i];
        rv = currentTarget.fireListeners(type, false, e) && rv;
      }
    }

    return rv;
  }
}

function coerceEvent(e: any, target: Object, type: any): Event {
  var rv: Event;
  // If accepting a string or object, create a custom event object so that
  // preventDefault and stopPropagation work with the event.
  if (typeof e == 'string') {
    rv = new Event(e, target);
  } else if (!(e instanceof Event)) {
    rv = new Event(type, target);
    object.extend(rv, e);
  } else {
    rv.target = e.target || target;
  }

  return rv;
}

/**
 * An artificial cap on the number of ancestors you can have. This is mainly
 * for loop detection.
 */
var MAX_ANCESTORS: number = 1000;
