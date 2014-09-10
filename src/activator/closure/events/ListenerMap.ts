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

import Listenable = require('./Listenable');
import ListenableKey = require('./ListenableKey');
import Listener = require('./Listener');
import array = require('../array');
import object = require('../object');

class ListenerMap {
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
   * @param key The listener to remove.
   * @return Whether the listener is removed.
   */
  removeByKey(key: ListenableKey): boolean {
    var type = key.type;
    if (!(type in this.listeners)) {
      return false;
    }

    var removed = array.remove(this.listeners[type], key);
    if (removed) {
      key.markAsRemoved();
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

export = ListenerMap;
