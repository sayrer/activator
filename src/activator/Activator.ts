import EventTarget = require('closure/events/EventTarget');

class Activator {
  el: HTMLElement;
  invocationCount: number;
  messageElementId: string;
  handlers: { [index: string]: EventTarget };

  constructor(id: string) {
    this.handlers = {};
    this.invocationCount = 0;
    this.messageElementId = id;
    this.el = document.getElementById(this.messageElementId);
  }

  invocationCountMessage() {
    return "stats:" + "<br>" +
           "[invocations: " + this.invocationCount++ + "]" + "<br>" +
           "[handlers: " + Object.keys(this.handlers) + "]";
  }

  event1() {
    this.el.innerHTML = "event1 " + this.invocationCountMessage();
  }

  event2() {
    this.el.innerHTML = "event2 " + this.invocationCountMessage();
  }

  clear() {
    for (var handler in this.handlers) {
      this.handlers[handler].dispose();
      delete this.handlers[handler];
    }
    this.invocationCount = 0;
    this.el.innerHTML = "";
  }

  buttonClicked(e): void {
    var action = e.target.getAttribute('jsaction');
    if (!this[action]) {
      return;
    }

    if (!(action in this.handlers)) {
      var ev = new EventTarget();
      ev.listen(action, this[action], false, this);
      this.handlers[action] = ev;
    }

    this.handlers[action].dispatchEvent(action);
  }
}

export = Activator;