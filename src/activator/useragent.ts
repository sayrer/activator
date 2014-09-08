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

module twitter.userAgent {

/**
 * Whether we know at compile-time that the browser is IE.
 */
export var ASSUME_IE = false;


/**
 * Whether we know at compile-time that the browser is GECKO.
 */
export var ASSUME_GECKO = false;


/**
 * Whether we know at compile-time that the browser is WEBKIT.
 */
export var ASSUME_WEBKIT = false;


/**
 * Whether we know at compile-time that the browser is a
 * mobile device running WebKit e.g. iPhone or Android.
 */
export var ASSUME_MOBILE_WEBKIT = false;


/**
 * Whether we know at compile-time that the browser is OPERA.
 */
export var ASSUME_OPERA = false;

/**
 * Whether we know the browser engine at compile-time.
 */
var BROWSER_KNOWN = (
  ASSUME_IE ||
  ASSUME_GECKO ||
  ASSUME_MOBILE_WEBKIT ||
  ASSUME_WEBKIT ||
  ASSUME_OPERA
);

/**
 * Gets the native userAgent string from navigator if it exists.
 * If navigator or navigator.userAgent string is missing, returns an empty
 * string.
 */
export function getUserAgent(): string {
  var navigator = twitter.userAgent.getNavigator();
  if (navigator) {
    var userAgent = navigator.userAgent;
    if (userAgent) {
      return userAgent;
    }
  }
  return '';
}

/**
 * Getter for the native navigator.
 * This is a separate function so it can be stubbed out in testing.
 */
export function getNavigator(): Navigator {
  return twitter.global.navigator;
};

/**
 * @param str
 * @return Whether the user agent contains the given string.
 */
function matchUserAgent(str: string): boolean {
  return twitter.str.contains(getUserAgent(), str);
};

/**
 * @param str
 * @return Whether the user agent contains the given string, ignoring case.
 */
function matchUserAgentIgnoreCase(str: string): boolean {
  return twitter.str.caseInsensitiveContains(getUserAgent(), str);
}

/**
 * @return Whether the user's browser is Opera.
 */
function isOpera(): boolean {
  return matchUserAgent('Opera') || matchUserAgent('OPR');
}

/**
 * @return Whether the user's browser is IE.
 */
function isIE(): boolean {
  return matchUserAgent('Trident') || matchUserAgent('MSIE');
}

/**
 * @return Whether the rendering engine is WebKit.
 */
function isWebKit(): boolean {
  return matchUserAgentIgnoreCase('WebKit');
}

/**
 * @return Whether the rendering engine is Gecko.
 */
function isGecko(): boolean {
  return matchUserAgent('Gecko') && !isIE() && !isWebKit();
}

/**
 * Detects the iPhone, iPod, FirefoxOS, Windows, and Android mobiles (devices that have
 * both Android and Mobile in the user agent string).
 *
 * @return {boolean} Whether the user is using a mobile device.
 */
function isMobile(): boolean {
  return !isTablet() &&
    (matchUserAgent('iPod') ||
     matchUserAgent('iPhone') ||
     matchUserAgent('Android') ||
     (isGecko() && matchUserAgent('Mobile')) ||
     matchUserAgent('IEMobile'));
}

/**
 * Detects Kindle Fire, iPad, FirefoxOS, and Android tablets (devices that have
 * Android but not Mobile in the user agent string).
 *
 * @return Whether the user is using a tablet.
 */
function isTablet(): boolean {
  return matchUserAgent('iPad') ||
  (matchUserAgent('Android') && !matchUserAgent('Mobile')) ||
  (isGecko() && matchUserAgent('Tablet')) ||
  matchUserAgent('Silk');
}

function isDesktop(): boolean {
  return !isTablet() && !isMobile();
}

/**
 * Whether the user agent is Opera.
 */
export var OPERA: boolean = BROWSER_KNOWN ? ASSUME_OPERA : isOpera();

/**
 * Whether the user agent is Internet Explorer. This includes other browsers
 * using Trident as its rendering engine. For example AOL and Netscape 8
 */
export var IE: boolean = BROWSER_KNOWN ? ASSUME_IE : isIE();

/**
 * Whether the user agent is Gecko. Gecko is the rendering engine used by
 * Mozilla, Mozilla Firefox, Camino and many more.
 */
export var GECKO: boolean = BROWSER_KNOWN ? ASSUME_GECKO : isGecko();

/**
 * Whether the user agent is WebKit. WebKit is the rendering engine that
 * Safari, Android and others use.
 */
export var WEBKIT: boolean = BROWSER_KNOWN ? ASSUME_WEBKIT || ASSUME_MOBILE_WEBKIT : isWebKit();

/**
 * Whether the user agent is running on a mobile device.
 */
export var MOBILE: boolean = BROWSER_KNOWN ? ASSUME_MOBILE_WEBKIT : isMobile();

/**
 * @return Whether the browser is Safari.
 */
export var SAFARI: boolean = matchUserAgent('Safari');

/**
 * @return the platform (operating system) the user agent is running
 *     on. Default to empty string because navigator.platform may not be defined
 *     (on Rhino, for example).
 */
function determinePlatform(): string {
  var navigator = getNavigator();
  return navigator && navigator.platform || '';
}

/**
 * The platform (operating system) the user agent is running on. Default to
 * empty string because navigator.platform may not be defined (on Rhino, for
 * example).
 */
export var PLATFORM: string = determinePlatform();

/**
 * Whether the user agent is running on a Macintosh operating system.
 */
export var ASSUME_MAC: boolean = false;

/**
 * Whether the user agent is running on a Windows operating system.
 */
export var ASSUME_WINDOWS: boolean = false;

/**
 * Whether the user agent is running on a Linux operating system.
 */
export var ASSUME_LINUX: boolean = false;

/**
 * Whether the user agent is running on a X11 windowing system.
 */
export var ASSUME_X11: boolean = false;

/**
 * Whether the user agent is running on Android.
 */
export var ASSUME_ANDROID: boolean = false;

/**
 * Whether the user agent is running on an iPhone.
 */
export var ASSUME_IPHONE: boolean = false;

/**
 * Whether the user agent is running on an iPad.
 */
export var ASSUME_IPAD: boolean = false;

var PLATFORM_KNOWN: boolean =
  ASSUME_MAC ||
  ASSUME_WINDOWS ||
  ASSUME_LINUX ||
  ASSUME_X11 ||
  ASSUME_ANDROID ||
  ASSUME_IPHONE ||
  ASSUME_IPAD;

var detectedMac = false;
var detectedWindows = false;
var detectedLinux = false;
var detectedX11 = false;
var detectedAndroid = false;
var detectedIPhone = false;
var detectedIPad = false;

function initPlatform () {
  detectedMac = twitter.str.contains(PLATFORM, 'Mac');
  detectedWindows = twitter.str.contains(PLATFORM, 'Win');
  detectedLinux = twitter.str.contains(PLATFORM, 'Linux');
  var navigator = getNavigator();
  detectedX11 = !!navigator && twitter.str.contains(navigator['appVersion'] || '', 'X11');
  var ua = getUserAgent();
  detectedAndroid = !!ua && twitter.str.contains(ua, 'Android');
  detectedIPhone = !!ua && twitter.str.contains(ua, 'iPhone');
  detectedIPad = !!ua && twitter.str.contains(ua, 'iPad');
}

if (!PLATFORM_KNOWN) {
  initPlatform();
}

/**
 * Whether the user agent is running on a Macintosh operating system.
 */
export var MAC: boolean = PLATFORM_KNOWN ? ASSUME_MAC : detectedMac;

/**
 * Whether the user agent is running on a Windows operating system.
 */
export var WINDOWS: boolean = PLATFORM_KNOWN ? ASSUME_WINDOWS : detectedWindows;

/**
 * Whether the user agent is running on a Linux operating system.
 */
export var LINUX: boolean = PLATFORM_KNOWN ? ASSUME_LINUX : detectedLinux;

/**
 * Whether the user agent is running on a X11 windowing system.
 */
export var X11: boolean = PLATFORM_KNOWN ? ASSUME_X11 : detectedX11;

/**
 * Whether the user agent is running on a X11 windowing system.
 */
export var ANDROID: boolean = PLATFORM_KNOWN ? ASSUME_ANDROID : detectedAndroid;

/**
 * Whether the user agent is running on a X11 windowing system.
 */
export var IPHONE: boolean = PLATFORM_KNOWN ? ASSUME_IPHONE : detectedIPhone;

/**
 * Whether the user agent is running on a X11 windowing system.
 */
export var IPAD: boolean = PLATFORM_KNOWN ? ASSUME_IPAD : detectedIPad;

/**
 * @return The string that describes the version number of the user agent.
 */
export function determineVersion(): string {
  // All browsers have different ways to detect the version and they all have
  // different naming schemes.

  // version is a string rather than a number because it may contain 'b', 'a',
  // and so on.
  var version = '', re;
  if (OPERA && twitter.global['opera']) {
    var operaVersion = twitter.global['opera'].version;
    version = typeof operaVersion == 'function' ? operaVersion() : operaVersion;
  } else {
    if (GECKO) {
      re = /rv\:([^\);]+)(\)|;)/;
    } else if (IE) {
      re = /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/;
    } else if (WEBKIT) {
      re = /WebKit\/(\S+)/;
    }
    if (re) {
      var arr = re.exec(getUserAgent());
      version = arr ? arr[1] : '';
    }
  }

  if (IE) {
    // IE9 can be in document mode 9 but be reporting an inconsistent user agent
    // version.  If it is identifying as a version lower than 9 we take the
    // documentMode as the version instead.  IE8 has similar behavior.
    // It is recommended to set the X-UA-Compatible header to ensure that IE9
    // uses documentMode 9.
    var docMode = getDocumentMode();
    if (docMode > parseFloat(version)) {
      return String(docMode);
    }
  }

  return version;
}

/**
 * @return {number|undefined} Returns the document mode (for testing).
 * @private
 */
function getDocumentMode() {
  // twitter.userAgent may be used in context where there is no DOM.
  var doc = twitter.global['document'];
  return doc ? doc['documentMode'] : undefined;
};

/**
 * The version of the user agent. This is a string because it might contain
 * 'b' (as in beta) as well as multiple dots.
 */
export var VERSION: string = determineVersion();

/**
 * Cache for isVersion. Calls to compareVersions are
 * surprisingly expensive and as a browsers version number is unlikely to change
 * during a session we cache the results.
 */
var isVersionOrHigherCache = {};

export function isVersionOrHigher(version): boolean {
  return isVersionOrHigherCache[version] || (isVersionOrHigherCache[version] = twitter.str.compareVersions(VERSION, version) >= 0);
}

/**
 * Whether the IE effective document mode is higher or the same as the given
 * document mode version.
 * NOTE: Only for IE, return false for another browser.
 *
 * @param documentMode The document mode version to check.
 * @return Whether the IE effective document mode is higher or the
 *     same as the given version.
 */
export function isDocumentMode(documentMode: number): boolean {
  return IE && DOCUMENT_MODE >= documentMode;
}

export var DOCUMENT_MODE = (function() {
  var doc = twitter.global['document'];
  if (!doc || !IE) {
    return undefined;
  }
  var mode = getDocumentMode();
  return mode || (doc['compatMode'] == 'CSS1Compat' ?
      parseInt(VERSION, 10) : 5);
})();

}
