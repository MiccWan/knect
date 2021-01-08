/** @typedef {import('./index.js').GameCenter} GameCenter */

import Room from './Room.js';

export default class RoomList {
  /**
   * @param {GameCenter} gc
   */
  constructor(gc) {
    this.gc = gc;
    /**
     * @type {Map<string, Room>}
     */
    this._all = new Map();
  }

  /**
   * @param {string} id
   */
  getById(id) {
    return this._all.get(id);
  }

  create() {
    const room = new Room();
    this._all.set(room.id, room);
    return room;
  }

  remove(id) {
    const room = this.getById(id);
    if (room.isEmpty) {
      this._all.delete(room.id);
    }
    else {
      throw new Error(`Trying to remove non empty room#${id}`);
    }
  }
}