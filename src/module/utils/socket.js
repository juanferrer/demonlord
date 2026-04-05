/* global fromUuidSync */
import { DLItemMacro } from '../item-macro/ItemMacro'
export function activateSocketListener() {
  game.socket.on('system.demonlord', async (...[message]) => {
    // Execute it once if multiple GMs are connected.
    if (game.users.activeGM?.isSelf) {
      switch (message.request) {
        case 'createEffect':
          {
            let actor = fromUuidSync(message.tokenuuid).actor
            await actor.createEmbeddedDocuments('ActiveEffect', [message.effectData])
          }
          break
        case 'deleteEffect':
          {
            let actor = fromUuidSync(message.tokenuuid).actor
            await actor.deleteEmbeddedDocuments('ActiveEffect', message.effectData)
          }
          break
        case 'increaseDamage':
          {
            let actor = fromUuidSync(message.tokenuuid).actor
            await actor.increaseDamage(message.increment)
          }
          break
        case 'runMacro': {
          const item = fromUuidSync(message.itemuuid)
          const actor = fromUuidSync(message.actoruuid)
          const character = fromUuidSync(message.characteruuid)
          const token = canvas.tokens?.get(message.speaker.token)
          const body = item.getDLMacro()?.command
          const scriptFunction = Object.getPrototypeOf(async function () {}).constructor
          const fn = new scriptFunction('item', 'speaker', 'actor', 'token', 'character', 'args', body)
          //attempt script execution
          try {
            return await fn.bind(DLItemMacro)(
              item,
              message.speaker,
              actor,
              message.token,
              character,
              message.args,
              body,
            )
          } catch (err) {
            ui.notifications.error('DLItemMacro Execution failed')
          }
        }
      }
    }
  })
}
