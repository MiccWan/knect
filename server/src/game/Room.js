import { v4 as uuidv4 } from 'uuid';
import { ServerEvents } from 'knect-common/src/SocketEvents.js';
import ForbiddenError from 'knect-common/src/ForbiddenError.js';
import Bingo from './games/Bingo.js';
import PlayerIdList from './PlayerIdList.js';
import Save from '../db/models/save.js';

/** @typedef {import('./index.js').GameCenter} GameCenter */

export default class Room {
  /**
   * @param {GameCenter} gc
   * @param {string} name
   */
  constructor(gc, name, id = uuidv4()) {
    this.gc = gc;
    this.name = name;
    this.id = id;

    this.allPlayers = new PlayerIdList(gc);

    /**
     * @type {Map<RoleType, string>}
     */
    this.gamers = new Map();
    this.game = new Bingo(gc, this.id);
  }

  isEmpty() {
    return !this.allPlayers.size;
  }

  emitAll(event, arg) {
    this.allPlayers.forEach(playerId => {
      const player = this.gc.allPlayers.getById(playerId);
      player.socket.emit(event, arg);
    });
  }

  /**
   * Join a player to this room
   * @param {string} id
   */
  join(id) {
    if (this.allPlayers.has(id)) {
      throw new ForbiddenError(`Player ${id} already in this room`);
    }
    const player = this.gc.getPlayerById(id);
    this.allPlayers.add(id);
    player.joinRoom(this.id);
    this.emitAll(ServerEvents.UpdatePlayerList, this.allPlayers.serialize());
  }

  remove(id) {
    if (this.allPlayers.has(id)) {
      if (this.getPlayerSide(id) !== null) {
        this.leaveGame(id);
      }
      this.allPlayers.delete(id);

      if (this.isEmpty() && this.id !== this.gc.lobby.id) {
        this.gc.rooms.remove(this.id);
        this.gc.lobby.emitAll(ServerEvents.UpdateRoomList, this.gc.rooms.serialize());
      }
      else {
        this.emitAll(ServerEvents.UpdatePlayerList, this.allPlayers.serialize());
      }
    }
    else throw new ForbiddenError(`Trying to remove non-existing player from room#${this.id}`);
  }

  /**
   * Join a player to the game
   * @param {string} playerId
   * @param {PlayerSideType} side
   */
  joinGame(playerId, side) {
    if (!this.allPlayers.has(playerId)) {
      throw new ForbiddenError(`This player is not in this room`);
    }

    if (this.gamers.has(side)) {
      throw new ForbiddenError(`This side is not joinable`);
    }

    const oldSide = this.getPlayerSide(playerId);
    if (oldSide) {
      this.gamers.delete(oldSide);
    }

    this.gamers.set(side, playerId);

    this.emitAll(ServerEvents.NotifyPlayerJoinGame, this.serializedGamers());
    this.gc.lobby.emitAll(ServerEvents.UpdateRoomList, this.gc.rooms.serialize());

    // TODO: exported constant
    if (this.gamers.size === 2) {
      this.game.init();
      this.game.start();
    }
  }

  leaveGame(id) {
    if (!this.allPlayers.has(id)) {
      throw new ForbiddenError(`Player ${id} is not in this room`);
    }

    const side = this.getPlayerSide(id);
    if (side === null) {
      throw new ForbiddenError(`Player ${id} is not in game`);
    }

    this.gamers.delete(side);

    this.emitAll(ServerEvents.NotifyPlayerJoinGame, this.serializedGamers());
    this.gc.lobby.emitAll(ServerEvents.UpdateRoomList, this.gc.rooms.serialize());

    if (this.game.playing) {
      this.game.playerSurrender(side);
    }
  }

  /**
   * @param {string} id player id
   */
  getPlayerSide(id) {
    const playersList = Array.from(this.gamers);
    const playersIdList = playersList.map(([, playerId]) => playerId);
    const position = playersIdList.indexOf(id);

    if (position === -1) {
      return null;
    }

    return playersList[position][0];
  }

  /**
   * @param {Array<number>} steps
   */
  saveRecord(steps) {
    const save = new Save({
      players: Array.from(this.gamers).map(([, playerId]) => this.gc.getPlayerById(playerId).name),
      steps,
    });
    save.save();
  }

  afterGame() {
    Array.from(this.gamers.values()).forEach(id => this.leaveGame(id));
  }

  serialize() {
    const { id, name, allPlayers, game } = this;
    return {
      id,
      name,
      allPlayers: allPlayers.serialize(),
      gamers: this.serializedGamers(),
      game: game.serialize(),
    };
  }

  serializedGamers() {
    return Object.fromEntries(Array.from(this.gamers).map(([side, playerId]) => {
      const player = this.gc.getPlayerById(playerId);
      return [side, player?.serialize() || null];
    }));
  }
}
