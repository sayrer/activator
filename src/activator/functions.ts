module twitter.functions {
/**
 * Creates a function that always returns the same value.
 * @param {T} retValue The value to return.
 * @return {function():T} The new function.
 * @template T
 */
export function constant<T>(retValue: T): () => T {
  return function(): T {
    return retValue;
  };
};

/**
 * Always returns false.
 * @type {function(...): boolean}
 */
export var FALSE: () => boolean = constant(false);

/**
 * Always returns true.
 * @type {function(...): boolean}
 */
export var TRUE: () => boolean = constant(true);

}
