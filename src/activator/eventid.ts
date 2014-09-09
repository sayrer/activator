
/**
 * Counter to create unique event ids.
 */
var uniqueIdCounter: number = 0;

/**
 * Creates a unique event id.
 *
 * @param identifier The identifier.
 * @return A unique identifier.
 */
export function getUniqueId(identifier: string): string {
  return identifier + '_' + uniqueIdCounter++;
};

export class EventId<T> {
  id: string;
  constructor(eventId: string) { this.id = eventId; }
  toString() { return this.id; }
}
