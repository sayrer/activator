
/**
 * Constants for event names.
 * @enum {string}
 */

module twitter.events {
  export enum EventType {

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
}
