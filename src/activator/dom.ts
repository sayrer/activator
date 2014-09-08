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

module twitter.dom {

export function getOwnerDocument(node): Document {
  if (node.nodeType == Node.DOCUMENT_NODE) {
    return node;
  }

  return node.ownerDocument || node.document;
}

/*
function isCSS1Compat(doc: Document): boolean {
  return doc.compatMode == 'CSS1Compat';
}

function getWindow (doc: Document): Window {
  return doc.parentWindow || doc.defaultView;
};

export function getOwnerDocument(node): Document {
  if (node.nodeType == Node.DOCUMENT_NODE) {
    return node;
  }

  return node.ownerDocument || node.document;
}*/

/**
 * @param doc The document to get the scroll element for.
 * @return Scrolling element.
 */

 /*
function getDocumentScrollElement(doc: Document): Element {
  // WebKit needs body.scrollLeft in both quirks mode and strict mode. We also
  // default to the documentElement if the document does not have a body (e.g.
  // a SVG document).
  if (!twitter.userAgent.WEBKIT && isCSS1Compat(doc)) {
    return doc.documentElement;
  }
  return doc.body || doc.documentElement;
};*/

/**
 * Helper for {@code getDocumentScroll}.
 *
 * @param {!Document} doc The document to get the scroll for.
 * @return {!goog.math.Coordinate} Object with values 'x' and 'y'.
 * @private
 */
 /*
function getDocumentScroll_(doc: Document): twitter.style.Coordinate {
  var el = getDocumentScrollElement(doc);
  var win = getWindow(doc);
  if (twitter.userAgent.IE && twitter.userAgent.isVersionOrHigher('10') &&
      win.pageYOffset != el.scrollTop) {
    // The keyboard on IE10 touch devices shifts the page using the pageYOffset
    // without modifying scrollTop. For this case, we want the body scroll
    // offsets.
    return new twitter.style.Coordinate(el.scrollLeft, el.scrollTop);
  }
  return new twitter.style.Coordinate(win.pageXOffset || el.scrollLeft, win.pageYOffset || el.scrollTop);
};

export var getDocumentScroll: (doc: Document) => twitter.style.Coordinate = getDocumentScroll_;
*/

export function isElement(node: Node) : boolean {
  return node.nodeType == Node.ELEMENT_NODE;
}

/**
* Enum of all html tag names specified by the W3C HTML 4.01 Specification.
* Reference http://www.w3.org/TR/html401/index/elements.html
* @enum {string}
*/
export enum TagName {
A,
ABBR,
ACRONYM,
ADDRESS,
APPLET,
AREA,
B,
BASE,
BASEFONT,
BDO,
BIG,
BLOCKQUOTE,
BODY,
BR,
BUTTON,
CANVAS,
CAPTION,
CENTER,
CITE,
CODE,
COL,
COLGROUP,
DD,
DEL,
DFN,
DIR,
DIV,
DL,
DT,
EM,
FIELDSET,
FONT,
FORM,
FRAME,
FRAMESET,
H1,
H2,
H3,
H4,
H5,
H6,
HEAD,
HR,
HTML,
I,
IFRAME,
IMG,
INPUT,
INS,
ISINDEX,
KBD,
LABEL,
LEGEND,
LI,
LINK,
MAP,
MENU,
META,
NOFRAMES,
NOSCRIPT,
OBJECT,
OL,
OPTGROUP,
OPTION,
P,
PARAM,
PRE,
Q,
S,
SAMP,
SCRIPT,
SELECT,
SMALL,
SPAN,
STRIKE,
STRONG,
STYLE,
SUB,
SUP,
TABLE,
TBODY,
TD,
TEXTAREA,
TFOOT,
TH,
THEAD,
TITLE,
TR,
TT,
U,
UL,
VAR
}

}
