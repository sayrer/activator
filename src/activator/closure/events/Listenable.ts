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
// limitations under the License.

import ListenableKey = require('./ListenableKey');
import Event = require('./Event');

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

interface Listenable {
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
  getParent(): Listenable;

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
  fireListeners
    (type: any,
     capture: boolean,
     eventObject: Event
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
  hasListener(type: any, useCapture: boolean): boolean;
}

export = Listenable;
