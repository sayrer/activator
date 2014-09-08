
var g = this;

module twitter {

/* Name for unique ID property. */
var UID_PROPERTY: string = 'twitter_uid_' + Math.floor(Math.random() * 2147483648).toString(36);
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
export var global = g;

}
