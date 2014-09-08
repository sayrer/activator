import disposable = require("./disposable");

export class Event extends disposable.Disposable {
  eventType: string;
  target: Object;
  currentTarget: Object;

  /* Whether to cancel the event in internal capture/bubble processing for IE. */
  propagationStopped: boolean = false;

  /* Return value for internal capture/bubble processing for IE. */
  returnValue: boolean = true;

  constructor(eventType: string, target?: Object) {
    super();
    this.eventType = eventType;
    this.target = target;
    this.currentTarget = this.target;
  }

  disposeInternal() {
    delete this.eventType;
    delete this.target;
    delete this.currentTarget;
  }

  stopPropagation(): void {
    this.propagationStopped = true;
  }

  preventDefault(): void {
    this.returnValue = false;
  }

  static stopPropagation(e) {
    e.stopPropagation();
  }

  static preventDefault(e) {
    e.preventDefault();
  }
}
