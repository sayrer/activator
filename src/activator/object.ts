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
 * Calls a function for each element in an object/map/hash.
 */
export function forEach<T,V>
  (obj: { [index: string]: V; },
   f: (v: V, k: string, obj: {[index: string]: V; }) => any,
   opt_obj?: T): void {
  for (var key in obj) {
    // TS deficiency: annotate 'this' as type T somehow
    f.call(opt_obj, obj[key], key, obj);
  }
}

/**
 * Calls a function for each element in an object/map/hash. If any
 * call returns true, returns true (without checking the rest). If
 * all calls return false, returns false.
 *
 * @param obj The object to check.
 * @param f The function to
 *     call for every element. This function
 *     takes 3 arguments (the element, the index and the object) and should
 *     return a boolean.
 * @param opt_obj This is used as the 'this' object within f.
 * @return true if any element passes the test.
 */
export function some<T,V>
  (obj: { [index: string]: V; },
   f: (v: V, k: string, obj: {[index: string]: V; }) => boolean,
   opt_obj?: T): boolean {
  for (var key in obj) {
    if (f.call(opt_obj, obj[key], key, obj)) {
      // TS deficiency: annotate 'this' as type T somehow
      return true;
    }
  }
  return false;
};

/**
 * Whether the object/map/hash is empty.
 *
 * @param obj The object to test.
 * @return true if obj is empty.
 */
export function isEmpty(obj: Object): boolean {
  for (var key in obj) {
    return false;
  }
  return true;
};

/**
 * The names of the fields that are defined on Object.prototype.
 */
var PROTOTYPE_FIELDS: Array<string> = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

/**
 * Extends an object with another object.
 * This operates 'in-place'; it does not create a new Object.
 *
 * Example:
 * var o = {};
 * goog.object.extend(o, {a: 0, b: 1});
 * o; // {a: 0, b: 1}
 * goog.object.extend(o, {b: 2, c: 3});
 * o; // {a: 0, b: 2, c: 3}
 *
 * @param {Object} target The object to modify. Existing properties will be
 *     overwritten if they are also present in one of the objects in
 *     {@code var_args}.
 * @param {...Object} var_args The objects from which values will be copied.
 */
export function extend(target: any, ...args: any[]): void {
  var key, source;
  for (var i = 0; i < args.length; i++) {
    source = args[i];
    for (key in source) {
      target[key] = source[key];
    }

    // For IE the for-in-loop does not contain any properties that are not
    // enumerable on the prototype object (for example isPrototypeOf from
    // Object.prototype) and it will also not include 'replace' on objects that
    // extend String and change 'replace' (not that it is common for anyone to
    // extend anything except Object).

    for (var j = 0; j < PROTOTYPE_FIELDS.length; j++) {
      key = PROTOTYPE_FIELDS[j];
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
};
