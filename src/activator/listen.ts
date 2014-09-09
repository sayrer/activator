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

import array = require('./array');
import eventid = require('./eventid');
import object = require('./object');

/**
 * A listenable interface. A listenable is an object with the ability
 * to dispatch/broadcast events to "event listeners" registered via
 * listen/listenOnce.
 *
 * The interface allows for an event propagation mechanism similar
 * to one offered by native browser event targets, such as
 * capture/bubble mechanism, stopping propagation, and preventing
 * default actions. Capture/bubble mechanism depends on the ancestor
 * tree constructed via {@code #getParentEventTarget}; this tree
 * must be directed acyclic graph. The meaning of default action(s)
 * in preventDefault is specific to a particular use case.
 *
 * Implementations that do not support capture/bubble or can not have
 * a parent listenable can simply not implement any ability to set the
 * parent listenable (and have {@code #getParentEventTarget} return
 * null).
 *
 *
 * @see http://www.w3.org/TR/DOM-Level-2-Events/events.html
 */

export interface Listenable {
  /**
   * Adds an event listener. A listener can only be added once to an
   * object and if it is added again the key for the listener is
   * returned. Note that if the existing listener is a one-off listener
   * (registered via listenOnce), it will no longer be a one-off
   * listener after a call to listen().
   *
   * @param {string|!goog.events.EventId.<EVENTOBJ>} type The event type id.
   * @param listener Callback method.
   * @param useCapture Whether to fire in capture phase.
   * @param listenerScope Object in whose scope to call the
   *     listener.
   * @return Unique key for the listener.
   */
  listen<SCOPE, EVENTOBJ>
    (type: any,
     // TS deficiency: 'this' should be SCOPE
     listener: (eventObj: EVENTOBJ) => any,
     useCapture: boolean,
     listenerScope?: SCOPE
    ): ListenableKey;

  /**
   * Adds an event listener that is removed automatically after the
   * listener fired once.
   *
   * If an existing listener already exists, listenOnce will do
   * nothing. In particular, if the listener was previously registered
   * via listen(), listenOnce() will not turn the listener into a
   * one-off listener. Similarly, if there is already an existing
   * one-off listener, listenOnce does not modify the listeners (it is
   * still a once listener).
   *
   * @param {string|!goog.events.EventId.<EVENTOBJ>} type The event type id.
   * @param listener Callback method.
   * @param useCapture Whether to fire in capture phase.
   * @param listenerScope Object in whose scope to call the listener.
   * @return Unique key for the listener.
   */
  listenOnce<SCOPE, EVENTOBJ>
    (type: any,
     // TS deficiency: 'this' should be SCOPE
     listener: (eventObj: EVENTOBJ) => any,
     useCapture: boolean,
     listenerScope?: SCOPE
    ): ListenableKey;

  /**
   * Removes an event listener which was added with listen() or listenOnce().
   *
   * @param {string|!goog.events.EventId.<EVENTOBJ>} type The event type id.
   * @param listener Callback method.
   * @param useCapture Whether to fire in capture phase.
   * @param listenerScope Object in whose scope to call the listener.
   * @return Whether any listener was removed.
   */
  unlisten<SCOPE, EVENTOBJ>
    (type: any,
     // TS deficiency: 'this' should be SCOPE
     listener: (eventObj: EVENTOBJ) => any,
     useCapture: boolean,
     listenerScope?: SCOPE
    ): boolean;

  /**
   * Removes an event listener which was added with listen() by the key
   * returned by listen().
   *
   * @param key The key returned by listen() or listenOnce().
   * @return Whether any listener was removed.
   */
  unlistenByKey(key: ListenableKey): boolean;

  /**
   * Dispatches an event (or event like object) and calls all listeners
   * listening for events of this type. The type of the event is decided by the
   * type property on the event object.
   *
   * If any of the listeners returns false OR calls preventDefault then this
   * function will return false.  If one of the capture listeners calls
   * stopPropagation, then the bubble listeners won't fire.
   *
   * @param Event object.
   * @return If anyone called preventDefault on the event object (or
   *     if any of the listeners returns false) this will also return false.
   */
  dispatchEvent(e: any): boolean;

  /**
   * Removes all listeners from this listenable. If type is specified,
   * it will only remove listeners of the particular type. Otherwise, all
   * registered listeners will be removed.
   *
   * @param eventType Type of event to remove, default is to remove all types.
   * @return Number of listeners removed.
   */
  removeAllListeners(eventType?: string): number;

  /**
   * Returns the parent of this event target to use for capture/bubble
   * mechanism.
   *
   * @return The parent Listenable or null if there is no parent.
   */
  getParentListenable(): Listenable;

  /**
   * Fires all registered listeners in this listenable for the given
   * type and capture mode, passing them the given eventObject. This
   * does not perform actual capture/bubble. Only implementors of the
   * interface should be using this.
   *
   * @param {string|!goog.events.EventId.<EVENTOBJ>} type The type of the
   *     listeners to fire.
   * @param capture The capture mode of the listeners to fire.
   * @param eventObject The event object to fire.
   * @return Whether all listeners succeeded without
   *     attempting to prevent default behavior. If any listener returns
   *     false or called goog.events.Event#preventDefault, this returns
   *     false.
   */
  fireListeners<EVENTOBJ>
    (type: any,
     capture: boolean,
     eventObject: EVENTOBJ
    ): boolean;

  /**
   * Gets all listeners in this listenable for the given type and
   * capture mode.
   *
   * @param {string|!goog.events.EventId} type The type of the listeners to fire.
   * @param {boolean} capture The capture mode of the listeners to fire.
   * @return {!Array.<goog.events.ListenableKey>} An array of registered
   *     listeners.
   */
   getListeners(type: any, capture: boolean): Array<ListenableKey>;

  /**
   * Gets the ListenableKey for the event or null if no such
   * listener is in use.
   *
   * @param {string|!goog.events.EventId.<EVENTOBJ>} type The name of the event
   *     without the 'on' prefix.
   * @param {function(this:SCOPE, EVENTOBJ):(boolean|undefined)} listener The
   *     listener function to get.
   * @param {boolean} capture Whether the listener is a capturing listener.
   * @param {SCOPE=} opt_listenerScope Object in whose scope to call the
   *     listener.
   * @return {goog.events.ListenableKey} the found listener or null if not found.
   * @template SCOPE,EVENTOBJ
   */
  getListener<SCOPE, EVENTOBJ>
    (type: any,
     // TS deficiency: 'this' should be SCOPE
     listener: (eventObj: EVENTOBJ) => any,
     useCapture: boolean,
     listenerScope?: SCOPE
    ): ListenableKey;

  /**
   * Whether there is any active listeners matching the specified
   * signature. If either the type or capture parameters are
   * unspecified, the function will match on the remaining criteria.
   *
   * @param {string|!goog.events.EventId.<EVENTOBJ>=} opt_type Event type.
   * @param opt_capture Whether to check for capture or bubble listeners.
   * @return Whether there is any active listeners matching the requested
   *     type and/or capture phase.
   */
  hasListener<EVENTOBJ>(type: any, useCapture: boolean): boolean;
}

/**
 * An interface that describes a single registered listener.
 */
export interface ListenableKey {
  /**
   * The source event target.
   * @type {!(Object|goog.events.Listenable|goog.events.EventTarget)}
   */
  src: Object;

  /**
   * The event type the listener is listening to.
   */
  type: string;

  /**
   * The listener function.
   * @type {function(?):?|{handleEvent:function(?):?}|null}
   */
  listener: any;

  /**
   * Whether the listener works on capture phase.
   */
  capture: boolean;

  /**
   * The 'this' object for the listener function's scope.
   */
  handler: Object;

  /**
   * A globally unique number to identify the key, generated
   * by calling the listen.reserveKey() function below.
   */
  key: number;
}

/**
 * Counter used to create a unique key
 */
var listenableKeyCounter = 0;
export function reserveKey(): number {
  return ++listenableKeyCounter;
}

/**
 * Simple class that stores information about a listener
 */
export class Listener implements ListenableKey {
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
    this.key = reserveKey();
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
}

export class ListenerMap {
  src: Listenable;

  /**
   * Maps of event type to an array of listeners.
   */
  listeners: { [index: string]: Array<Listener>; };

  /**
   * The count of types in this map that have registered listeners.
   */
  private typeCount;

  constructor(src: Listenable) {
    this.src = src;
    this.listeners = {};
    this.typeCount = 0;
  }

  /**
   * @return The count of event types in this map that actually have registered listeners.
   */
  getTypeCount(): number {
    return this.typeCount;
  }

  /**
   * @return Total number of registered listeners.
   */
  getListenerCount(): number {
    var count = 0;
    for (var type in this.listeners) {
      count += this.listeners[type].length;
    }
    return count;
  }

  /**
   * Adds an event listener. A listener can only be added once to an
   * object and if it is added again the key for the listener is
   * returned.
   *
   * Note that a one-off listener will not change an existing listener,
   * if any. On the other hand a normal listener will change existing
   * one-off listener to become a normal listener.
   *
   * @param type The listener event type.
   * @param listener This listener callback method.
   * @param callOnce Whether the listener is a one-off
   *     listener.
   * @param useCapture The capture mode of the listener.
   * @param listenerScope Object in whose scope to call the
   *     listener.
   * @return Unique key for the listener.
   */
  add(type: any, listener: Function, callOnce: boolean,
      useCapture?: boolean, listenerScope?: Object): ListenableKey {
    var typeStr = type.toString();
    var listenerArray: Array<Listener> = this.listeners[typeStr];
    if (!listenerArray) {
      listenerArray = this.listeners[typeStr] = [];
      this.typeCount++;
    }

    var listenerObj : Listener;
    var index = ListenerMap.findListenerIndex(listenerArray, listener, useCapture, listenerScope);
    if (index > -1) {
      listenerObj = listenerArray[index];
      if (!callOnce) {
        // Ensure that, if there is an existing callOnce listener, it is no
        // longer a callOnce listener.
        listenerObj.callOnce = false;
      }
    } else {
      listenerObj = new Listener(listener, null, this.src, typeStr, !!useCapture, listenerScope);
      listenerObj.callOnce = callOnce;
      listenerArray.push(listenerObj);
    }

    return listenerObj;
  }

  /**
   * Removes a matching listener.
   * @param type The listener event type.
   * @param listener This listener callback method.
   * @param useCapture The capture mode of the listener.
   * @param listenerScope Object in whose scope to call the listener.
   * @return Whether any listener was removed.
   */
  remove(type: any, listener: Function, useCapture?: boolean, listenerScope?: Object): boolean {
    var typeStr = type.toString();
    if (!(typeStr in this.listeners)) {
      return false;
    }

    var listenerArray = this.listeners[typeStr];
    var index = ListenerMap.findListenerIndex(listenerArray, listener, useCapture, listenerScope);
    if (index > -1) {
      var listenerObj: Listener = listenerArray[index];
      listenerObj.markAsRemoved();
      array.removeAt(listenerArray, index);
      if (listenerArray.length == 0) {
        delete this.listeners[typeStr];
        this.typeCount--;
      }
      return true;
    }
    return false;
  }

  /**
   * Removes the given listener object.
   * @param listener The listener to remove.
   * @return Whether the listener is removed.
   */
  removeByKey(listener: Listener): boolean {
    var type = listener.type;
    if (!(type in this.listeners)) {
      return false;
    }

    var removed = array.remove(this.listeners[type], listener);
    if (removed) {
      listener.markAsRemoved();
      if (this.listeners[type].length == 0) {
        delete this.listeners[type];
        this.typeCount--;
      }
    }
    return removed;
  }

  /**
   * Removes all listeners from this map. If opt_type is provided, only
   * listeners that match the given type are removed.
   * @param optType Type of event to remove.
   * @return Number of listeners removed.
   */
  removeAll(optType?: any): number {
    var typeStr = optType && optType.toString();
    var count = 0;
    for (var type in this.listeners) {
      if (!typeStr || type == typeStr) {
        var listenerArray: Array<Listener> = this.listeners[type];
        for (var i = 0; i < listenerArray.length; i++) {
          ++count;
          listenerArray[i].markAsRemoved();
        }
        delete this.listeners[type];
        this.typeCount--;
      }
    }
    return count;
  }

  /**
   * Gets all listeners that match the given type and capture mode. The
   * returned array is a copy (but the listener objects are not).
   * @param type The type of the listeners to retrieve.
   * @param capture The capture mode of the listeners to retrieve.
   * @return An array of matching listeners.
   */
  getListeners(type: any, capture: boolean): Array<ListenableKey> {
    var listenerArray = this.listeners[type.toString()];
    var rv: Array<ListenableKey> = [];
    if (listenerArray) {
      for (var i = 0; i < listenerArray.length; ++i) {
        var listenerObj = listenerArray[i];
        if (listenerObj.capture == capture) {
          rv.push(listenerObj);
        }
      }
    }
    return rv;
  }

  /**
   * Gets the goog.events.ListenableKey for the event or null if no such
   * listener is in use.
   *
   * @param type The type of the listener to retrieve.
   * @param listener The listener function to get.
   * @param capture Whether the listener is a capturing listener.
   * @param listenerScope Object in whose scope to call the
   *     listener.
   * @return the found listener or null if not found.
   */
  getListener(type: any, listener: Function, capture: boolean, listenerScope?: Object): ListenableKey {
    var listenerArray = this.listeners[type.toString()];
    var i = -1;
    if (listenerArray) {
      i = ListenerMap.findListenerIndex(listenerArray, listener, capture, listenerScope);
    }
    return i > -1 ? listenerArray[i] : null;
  }

  /**
   * Whether there is a matching listener. If either the type or capture
   * parameters are unspecified, the function will match on the
   * remaining criteria.
   *
   * @param optType The type of the listener.
   * @param optCapture The capture mode of the listener.
   * @return Whether there is an active listener matching
   *     the requested type and/or capture phase.
   */
  hasListener(optType?: any, optCapture?: boolean): boolean {
    var hasType = optType != null;
    var typeStr = hasType ? optType.toString() : '';
    var hasCapture = optCapture != null;

    return object.some(this.listeners,
      function(listenerArray: Array<Listener>, type) {
        for (var i = 0; i < listenerArray.length; ++i) {
          if ((!hasType || listenerArray[i].type == typeStr) &&
              (!hasCapture || listenerArray[i].capture == optCapture)) {
            return true;
          }
        }

        return false;
      }
    );
  }


  static findListenerIndex(listenerArray: Array<Listener>, listener: Function,
                           useCapture?: boolean, listenerScope?: Object): number {
    for (var i = 0; i < listenerArray.length; ++i) {
      var listenerObj: Listener = listenerArray[i];
      if (!listenerObj.removed &&
          listenerObj.listener == listener &&
          listenerObj.capture == !!useCapture &&
          listenerObj.handler == listenerScope) {
        return i;
      }
    }
    return -1;
  }
}
