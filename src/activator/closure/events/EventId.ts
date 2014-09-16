
/**
 * Counter to create unique event ids.
 */
var uniqueIdCounter: number = 0;

// TODO: fix the types here.
class EventId<T> {
  id: string;
  constructor(eventId: string) { this.id = eventId; }
  toString() { return this.id; }

  /**
   * Creates a unique event id.
   *
   * @param identifier The identifier.
   * @return A unique identifier.
   */
  static getUniqueId(identifier: string): string {
    return identifier + '_' + uniqueIdCounter++;
  }
}

export = EventId;
