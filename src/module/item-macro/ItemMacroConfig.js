/**
 * Modified version of the awesome https://github.com/Foundry-Workshop/Item-Macro
 * Big thanks to Forien & Kekilla0
 */
import { DLItemMacro } from "./ItemMacro"
/**
 * @extends {MacroConfig}
 */
export class DLItemMacroConfig extends foundry.applications.sheets.MacroConfig {
  /** @override */
  static DEFAULT_OPTIONS = {
    actions: {
      execute: DLItemMacroConfig._onExecute
    },
  }

  /** @override */
  // eslint-disable-next-line no-shadow
  constructor({document, item}, ...args) {
    super({document}, ...args)
    this.item = item
  }

  static async openConfig(item) {
    const macro = new DLItemMacroConfig({document: item.getDLMacro(), item})
    macro.render(true)
  }

  /** @override */
  async _processSubmitData(event, form, submitData) {
    await this.updateMacro(submitData)
  }

  static async _onExecute(event) {
    await this.submit()
    this.item.executeDLMacro(event)
  }

  async updateMacro({command, type}) {
    const item = this.item

    const newMacro = new DLItemMacro({
      name: item.name,
      type,
      scope: "global",
      command,
      author: game.user.id,
    }, {item})

    await item.setDLMacro(newMacro)

    this.object = newMacro
  }
}