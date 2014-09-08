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

export interface ArrayLike<T> {
  [index: number]: T;
  length: number;
}

/**
 * Does a shallow copy of an array.
 * @param Array or ArrayLike object to clone.
 * @return Clone of the input array.
 */
export function clone<T>(arr: ArrayLike<T>): Array<T> {
  var len = (arr.length < 0) ? 0 : arr.length;
  var rv = new Array(len);
  for (var i = 0; i < len; i++) {
    rv[i] = arr[i];
  }
  return rv;
}

/**
 * Returns the index of the first element of an array with a specified value, or
 * -1 if the element is not present in the array.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-indexof}
 *
 * @param The Array or ArrayLike to be searched.
 * @param The object for which we are searching.
 * @param The index at which to start the search. If omitted the search starts at index 0.
 * @return The index of the first matching array element.
 */
export function indexOf<T>(arr: ArrayLike<T>, obj: T, fromIndex?: number) : number {
  return Array.prototype.indexOf.call(arr, obj, fromIndex);
}

/**
 * Removes from an array the element at index i
 * @param The Array or ArrayLike from which to remove value.
 * @param The index to remove.
 * @return True if an element was removed.
 */
export function removeAt<T>(arr: ArrayLike<T>, i: number) : boolean {
  return Array.prototype.splice.call(arr, i, 1).length == 1;
}

/**
 * Removes the first occurrence of a particular value from an array.
 * @param The Array or ArrayLike from which to remove value.
 * @param Object to remove.
 * @return True if an element was removed.
 */
export function remove<T>(arr: ArrayLike<T>, obj: T) : boolean {
  var i = indexOf(arr, obj);
  var rv;
  if ((rv = i >= 0)) {
    removeAt(arr, i);
  }

  return rv;
}

/**
 * Inserts an object at the given index of the array.
 * @param The Array or ArrayLike to modify.
 * @param The object to insert.
 * @param The index at which to insert the object. If omitted, treated as 0.
 * A negative index is counted from the end of the array.
 */
export function insertAt<T>(arr: ArrayLike<T>, obj: T, index?: number) : Array<T> {
  return Array.prototype.splice.call(arr, index, 0, obj);
}

/**
 * Whether the array is empty.
 * @param The Array or ArrayLike to test.
 * @return true if empty.
 */
export function isEmpty<T>(arr: ArrayLike<T>): boolean {
  return arr.length == 0;
}
