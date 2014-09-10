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

import dom = require('./dom');
import userAgent = require('./useragent');

export class Coordinate {
  x: number;
  y: number;
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
}

interface ClientRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/**
 * Retrieves a computed style value of a node. It returns empty string if the
 * value cannot be computed (which will be the case in Internet Explorer) or
 * "none" if the property requested is an SVG one and it has not been
 * explicitly set (firefox and webkit).
 *
 * @param element Element to get style of.
 * @param property Property to get (camel-case).
 * @return Style value.
 */
function getComputedStyle(element: HTMLElement, property: string): string {
  var doc = dom.getOwnerDocument(element);
  if (doc.defaultView && doc.defaultView.getComputedStyle) {
    var styles = doc.defaultView.getComputedStyle(element, null);
    if (styles) {
      // element.style[..] is undefined for browser specific styles
      // as 'filter'.
      return styles[property] || styles.getPropertyValue(property) || '';
    }
  }

  return '';
};

/**
 * Gets the cascaded style value of a node, or null if the value cannot be
 * computed (only Internet Explorer can do this).
 *
 * @param element Element to get style of.
 * @param style Property to get (camel-case).
 * @return Style value.
 */
function getCascadedStyle(element: HTMLElement, style: string) {
  return element.currentStyle ? element.currentStyle[style] : null;
};

/**
 * Cross-browser pseudo get computed style. It returns the computed style where
 * available. If not available it tries the cascaded style value (IE
 * currentStyle) and in worst case the inline style value.  It shouldn't be
 * called directly, see http://wiki/Main/ComputedStyleVsCascadedStyle for
 * discussion.
 *
 * @param element Element to get style of.
 * @param style Property to get (must be camelCase, not css-style.).
 * @return Style value.
 */
function getStyle(element: HTMLElement, style: string): string {
  return getComputedStyle(element, style) ||
         getCascadedStyle(element, style) ||
         (element.style && element.style[style]);
};

/**
 * Gets the client rectangle of the DOM element.
 *
 * getBoundingClientRect is part of a new CSS object model draft (with a
 * long-time presence in IE), replacing the error-prone parent offset
 * computation and the now-deprecated Gecko getBoxObjectFor.
 *
 * This utility patches common browser bugs in getBoundingClientRect. It
 * will fail if getBoundingClientRect is unsupported.
 *
 * If the element is not in the DOM, the result is undefined, and an error may
 * be thrown depending on user agent.
 *
 * @param el The element whose bounding rectangle is being queried.
 * @return A native bounding rectangle with numerical left, top, right, and bottom.
 * Reported by Firefox to be of object type ClientRect.
 */
function getBoundingClientRect(el: Element): ClientRect {
  var rect;
  try {
    rect = el.getBoundingClientRect();
  } catch (e) {
    // In IE < 9, calling getBoundingClientRect on an orphan element raises an
    // "Unspecified Error". All other browsers return zeros.
    return {left: 0, top: 0, bottom: 0, right: 0};
  }

  // Patch the result in IE only, so that this function can be inlined if
  // compiled for non-IE.
  if (userAgent.IE && el.ownerDocument.body) {

    // In IE, most of the time, 2 extra pixels are added to the top and left
    // due to the implicit 2-pixel inset border.  In IE6/7 quirks mode and
    // IE6 standards mode, this border can be overridden by setting the
    // document element's border to zero -- thus, we cannot rely on the
    // offset always being 2 pixels.

    // In quirks mode, the offset can be determined by querying the body's
    // clientLeft/clientTop, but in standards mode, it is found by querying
    // the document element's clientLeft/clientTop.  Since we already called
    // getBoundingClientRect we have already forced a reflow, so it is not
    // too expensive just to query them all.

    // See: http://msdn.microsoft.com/en-us/library/ms536433(VS.85).aspx
    var doc = el.ownerDocument;
    rect.left -= doc.documentElement.clientLeft + doc.body.clientLeft;
    rect.top -= doc.documentElement.clientTop + doc.body.clientTop;
  }
  return rect;
};

/**
 * Returns the position of the event or the element's border box relative to
 * the client viewport.
 * @param el Element whose position to get.
 * @return The position.
 */
function getClientPositionForElement(el: Element): Coordinate {
  // IE, Gecko 1.9+, and most modern WebKit
  // Removed some ancient browser compat code that bloated the size.
  var box = getBoundingClientRect(el);
  return new Coordinate(box.left, box.top);
};

export function getClientPosition(el: Element): Coordinate {
  return getClientPositionForElement(el);
}
