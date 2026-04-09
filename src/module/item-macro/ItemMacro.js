/**
 * Modified version of the awesome https://github.com/Foundry-Workshop/Item-Macro
 * Big thanks to Forien & Kekilla0
 */

export class DLItemMacro extends Macro {
  constructor(data, context) {
    super(data, context)

    this.item = context.item
  }

  #executeChat(speaker) {
    return ui.chat.processMessage(this.command, { speaker }).catch(err => {
      Hooks.onError('Macro#_executeChat', err, {
        msg: 'There was an error in your chat message syntax.',
        log: 'error',
        notify: 'error',
        command: this.command,
      })
    })
  }

  async #executeScript(args = null) {
    const item = this.item
    const speaker = ChatMessage.getSpeaker({ actor: item.actor })
    const actor = item.actor ?? game.actors.get(speaker.actor)

    /* MMH@TODO Check the types returned by linked and unlinked */
    const token = canvas.tokens?.get(speaker.token)
    const character = game.user.character

    //build script execution
    const scriptFunction = Object.getPrototypeOf(async function () {}).constructor
    const body = this.command

    if (game.user.isGM) {
      const fn = new scriptFunction('item', 'speaker', 'actor', 'token', 'character', 'args', body)

      //attempt script execution
      try {
        return await fn.bind(this)(item, speaker, actor, token, character, args)
      } catch (err) {
        ui.notifications.error('DLItemMacro Execution failed')
      }
    } else {
      game.socket.emit('system.demonlord', {
        request: 'runMacro',
        itemuuid : item.uuid,
        speaker : speaker,
        actoruuid: actor.uuid,
        characteruuid: character.uuid,
        args: args
      })
    }
  }

  execute(scope = {}, args = null) {
    switch (this.type) {
      case 'chat':
        return this.#executeChat(scope.speaker)
      case 'script':
        return this.#executeScript(args)
    }
  }
}
