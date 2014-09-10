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
 * Constants for event names.
 */

enum EventType {

  // Mouse events
  click,
  rightclick,
  dblclick,
  mousedown,
  mouseup,
  mouseover,
  mouseout,
  mousemove,
  mouseenter,
  mouseleave,
  //  MOUSEWHEEL: twitter.userAgent.GECKO ? 'DOMMouseScroll' : 'mousewheel',
  selectstart, // IE, Safari, Chrome

  // Key events
  keypress,
  keydown,
  keyup,

  // Focus
  blur,
  focus,
  deactivate, // IE only

  // Forms
  change,
  select,
  submit,
  input,
  propertychange, // IE only

  // Drag and drop
  dragstart,
  drag,
  dragenter,
  dragover,
  dragleave,
  drop,
  dragend,

  // WebKit touch events.
  touchstart,
  touchmove,
  touchend,
  touchcancel,

  // Misc
  beforeunload,
  consolemessage,
  contextmenu,
  error,
  help,
  load,
  losecapture,
  orientationchange,
  readystatechange,
  resize,
  scroll,
  unload,

  // HTML 5 History events
  // See http://www.w3.org/TR/html5/browsers.html#history
  hashchange,
  pagehide,
  pageshow,
  popstate,

  // Copy and Paste
  // Support is limited. Make sure it works on your favorite browser
  // before using.
  // http://www.quirksmode.org/dom/events/cutcopypaste.html
  copy,
  paste,
  cut,
  beforecopy,
  beforecut,
  beforepaste,

  // HTML5 online/offline events.
  // http://www.w3.org/TR/offline-webapps/#related
  online,
  offline,

  // HTML 5 worker events
  message,
  connect,

  // Native IMEs/input tools events.
  textinput,
  compositionstart,
  compositionupdate,
  compositionend,

  // HTML5 Page Visibility API.  See details at
  // {@code goog.labs.dom.PageVisibilityMonitor}.
  visibilitychange,

  // LocalStorage event.
  storage
}

export = EventType;
