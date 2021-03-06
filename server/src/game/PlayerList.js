/** @typedef {import('./Player.js').default} Player */

export default class PlayerList {
  constructor(gc) {
    this.gc = gc;
    /**
     * @type {Map<string, Player>}
     */
    this._all = new Map();
  }

  /**
   * @param {Player} player
   */
  add(player) {
    this._all.set(player.id, player);
  }

  /**
   * @param {string} id
   */
  remove(id) {
    this._all.delete(id);
  }

  /**
   * @param {string} id
   * @return {Player}
   */
  getById(id) {
    return this._all.get(id);
  }

  /**
   * @return {Array<Player>}
   */
  getAll() {
    return Array.from(this._all.values());
  }

  /**
   * @param {string} name
   */
  isPlayerNameExist(name) {
    return this.getAll().reduce((prev, player) => prev || player.name === name, false);
  }

  serialize() {
    return this.getAll().map(player => player.serialize());
  }
}
