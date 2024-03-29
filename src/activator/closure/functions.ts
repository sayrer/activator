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

/**
 * Creates a function that always returns the same value.
 * @param The value to return.
 * @return The new function.
 */
export function constant<T>(retValue: T): () => T {
  return function(): T {
    return retValue;
  };
};

/**
 * Always returns false.
 */
export var FALSE: () => boolean = constant(false);

/**
 * Always returns true.
 */
export var TRUE: () => boolean = constant(true);
