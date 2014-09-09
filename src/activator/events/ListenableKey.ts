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

/**
 * An interface that describes a single registered listener.
 */
interface ListenableKey {
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
   * by calling the Listener.reserveKey() function.
   */
  key: number;

  markAsRemoved(): void;
}

export = ListenableKey;
