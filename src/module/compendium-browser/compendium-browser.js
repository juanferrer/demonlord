const superTypes = [ 'Item', 'Actor', 'Table' ]
// const subTypes = [ 'ancestry', 'path', 'feature', 'talent', 'item', 'spell', 'creature', 'character', 'table' ]
const indices = {
  common: [ 'system.description' ],
  ancestry: [ ''],
  path: [ 'system.type', ],
  feature: [  ],
  talent: [  ],
  item: [ 'system.type', ],
  spell: [ 'system.tradition', 'system.rank' ],
  creature: [ ],
  character: [  ],
  table: [  ]
}

export class DLCompendiumBrowser extends FormApplication {

  constructor(object, options) {
    super(options)
    this.activeTab = 'ancestry' // None active, this way we can start loading in the background
    this.searchFields = []
  }

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: [ 'compendium-browser' ],
      width: 800,
      height: 800,
      tabs: [
        {
          navSelector: '.browser-navigation',
          contentSelector: '.browser-body',
          initial: this.activeTab,
        },
      ],
      scrollY: ['.tab.active'],
    })
  }

  /** @override */
  get template() {
    return 'systems/demonlord/templates/compendium-browser/compendium-browser.hbs'
  }

  /* -------------------------------------------- */
  /**
   * Add the Entity name into the window title
   * @type {String}
   */
  get title() {
    return game.i18n.localize('DL.CompendiumBrowser')
  }

  /**
   * Construct and return the data object used to render the HTML template for this form application.
   * @return {Object}
   */
  async getData() {
    this.activeCompendia = game.packs.filter(p => superTypes.includes(p.metadata.type)).map(p => p.metadata.id) // TODO: Retrieve from settings?
    
    const indexedCompendia = await this.indexCompendia(this.activeCompendia)

    this.compendia = Object.groupBy(
      indexedCompendia.map(i => i?.map(e => e)).flat().filter(Boolean) // Have all wanted items with types
      , i => i.type
    )

    console.log(this.compendia)

    return {
      searchFields: this.searchFields[this.activeTab],
      data: this.compendia
    }
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html)

    // Enable roll formula
    html.find('.stat-editor-roll-button').click(async ev => {
      const div = ev.currentTarget
      const target = div.parentElement.parentElement.firstElementChild
      const formula = div.previousElementSibling.value
      const roll = new Roll(formula, this.system)
      await roll.evaluate()
      target.value = roll.total
    })
  }

  /**
 * This method is called upon form submission after form data is validated
 * @param event {Event}       The initial triggering submission event
 * @param formData {Object}   The object of validated form data with which to update the object
 * @private
 */
  // async _updateObject(event, formData) {
  // }

  async indexCompendia(compendia) {
    return await Promise.all(compendia.map(async compendiumName => {
      const compendium = game.packs.get(compendiumName)
      const itemType = compendium.index.filter(Boolean)[0]?.type
      if (!itemType) return
      const index = indices.common.concat(indices[itemType]).filter(Boolean)
      return await compendium.getIndex({ fields: index })
    }))
  }
}
