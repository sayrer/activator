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

declare var __act_global: any;

/* Name for unique ID property. */
var UID_PROPERTY: string = 'activator_uid_' + Math.floor(Math.random() * 2147483648).toString(36);
var UidCounter: number = 0;

export function getUid(obj: Object) {
  return obj[UID_PROPERTY] || (obj[UID_PROPERTY] = ++UidCounter);
}

export function isArrayLike(val) {
  return val && ((typeof val) == 'object' && typeof val.length == 'number');
}

/**
 * Reference to the global context.  In most cases this will be 'window'.
 */
export var global = __act_global;
