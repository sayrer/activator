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
// limitations under the License

export function getOwnerDocument(node): Document {
  if (node.nodeType == Node.DOCUMENT_NODE) {
    return node;
  }

  return node.ownerDocument || node.document;
}

export function isElement(node: Node) : boolean {
  return node.nodeType == Node.ELEMENT_NODE;
}

/**
 * Enum of all html tag names specified by the W3C HTML4.01 and HTML5
 * specifications.
 */
export enum TagName {
  A,
  ABBR,
  ACRONYM,
  ADDRESS,
  APPLET,
  AREA,
  ARTICLE,
  ASIDE,
  AUDIO,
  B,
  BASE,
  BASEFONT,
  BDI,
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
  COMMAND,
  DATA,
  DATALIST,
  DD,
  DEL,
  DETAILS,
  DFN,
  DIALOG,
  DIR,
  DIV,
  DL,
  DT,
  EM,
  EMBED,
  FIELDSET,
  FIGCAPTION,
  FIGURE,
  FONT,
  FOOTER,
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
  HEADER,
  HGROUP,
  HR,
  HTML,
  I,
  IFRAME,
  IMG,
  INPUT,
  INS,
  ISINDEX,
  KBD,
  KEYGEN,
  LABEL,
  LEGEND,
  LI,
  LINK,
  MAP,
  MARK,
  MATH,
  MENU,
  META,
  METER,
  NAV,
  NOFRAMES,
  NOSCRIPT,
  OBJECT,
  OL,
  OPTGROUP,
  OPTION,
  OUTPUT,
  P,
  PARAM,
  PRE,
  PROGRESS,
  Q,
  RP,
  RT,
  RUBY,
  S,
  SAMP,
  SCRIPT,
  SECTION,
  SELECT,
  SMALL,
  SOURCE,
  SPAN,
  STRIKE,
  STRONG,
  STYLE,
  SUB,
  SUMMARY,
  SUP,
  SVG,
  TABLE,
  TBODY,
  TD,
  TEXTAREA,
  TFOOT,
  TH,
  THEAD,
  TIME,
  TITLE,
  TR,
  TRACK,
  TT,
  U,
  UL,
  VAR,
  VIDEO,
  WBR
}
