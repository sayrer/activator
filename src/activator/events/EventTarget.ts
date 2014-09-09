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
import event = require('./Event');
import Listenable = require('./Listenable');
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
 *   var source = new EventTarget();
 *   function handleEvent(e) {
 *     alert('Type: ' + e.type + '; Target: ' + e.target);
 *   }
 *   source.listen('foo', handleEvent);
 *   ...
 *   source.dispatchEvent('foo');  // will call handleEvent
 *   ...
 *   source.unlisten('foo', handleEvent);
 * </pre>
 *
 */
export class EventTarget extends disposable.Disposable implements Listenable {

}
