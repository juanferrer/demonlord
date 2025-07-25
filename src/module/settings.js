const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api

async function resetToDefault(key) {
  const defaultValue = game.settings.settings.get(`demonlord.${key}`).default
  game.settings.set('demonlord', key, defaultValue)
}

async function updateSettings(formData) {
  const settings = foundry.utils.expandObject(formData.object)
  await Promise.all(Object.entries(settings).map(([key, value]) => game.settings.set('demonlord', key, value)))
}

export class DiceSoNiceSettings extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: 'advanced-settings',
    form: {
      handler: DiceSoNiceSettings.handler,
      closeOnSubmit: false,
      submitOnChange: false,
    },
    position: {
      width: 550,
      height: 'auto',
    },
    tag: 'form',
    window: {
      title: 'advanced-settings.app_title',
      contentClasses: ['standard-form'],
    },
    options: {
      scrollable: true,
    },
  }
  static PARTS = {
    body: {
      template: 'systems/demonlord/templates/setting/dicesonicesettings.hbs',
    },
    footer: {
      template: 'templates/generic/form-footer.hbs',
    },
  }

  get title() {
    return `${game.i18n.format('DL.SettingDSNLabel')}`
  }

  // eslint-disable-next-line no-unused-vars  
  _prepareContext(options) {
    return {
      colourBoBDieDSN: game.settings.get('demonlord', 'colourBoBDieDSN'),
      colourBane: game.settings.get('demonlord', 'baneColour'),
      colourBoon: game.settings.get('demonlord', 'boonColour'),
      replaced3: game.settings.get('demonlord', 'replaced3'),
      buttons: [
        {
          type: 'submit',
          action: 'submit',
          icon: 'fa-solid fa-save',
          label: 'SETTINGS.Save',
        },
        {
          type: 'submit',
          action: 'reset',
          icon: 'fas fa-undo',
          label: 'SETTINGS.Reset',
        },
      ],
    }
  }

  // eslint-disable-next-line no-unused-vars  
  _onRender(context, options) {
    const html = $(this.element)
    html.find('button').on('click', async event => {
      if (event.currentTarget?.dataset?.action === 'reset') {
        const keys = ['colourBoBDieDSN', 'boonColour', 'baneColour', 'replaced3']
        await Promise.all(
          keys.map(async key => {
            await resetToDefault(key)
          }),
        )
        this.close()
      }
    })
  }

  static async handler(event, form, formData) {
    const keys = ['colourBoBDieDSN', 'boonColour', 'baneColour', 'replaced3']
    if (event.submitter.dataset.action === 'reset') {
      await Promise.all(
        keys.map(async key => {
          await resetToDefault(key)
        }),
      )
    }
    if (event.submitter.dataset.action === 'submit') {
      await updateSettings(formData)
      this.close()
    }
  }
}

export class OptionalRulesSettings extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: 'advanced-settings',
    form: {
      handler: OptionalRulesSettings.handler,
      closeOnSubmit: false,
      submitOnChange: false,
    },
    position: {
      width: 720,
      height: 'auto',
    },
    tag: 'form',
    window: {
      title: 'advanced-settings.app_title',
      contentClasses: ['standard-form'],
    },
    options: {
      scrollable: true,
    },
  }
  static PARTS = {
    body: {
      template: 'systems/demonlord/templates/setting/optionalrules.hbs',
    },
    footer: {
      template: 'templates/generic/form-footer.hbs',
    },
  }

  get title() {
    return `${game.i18n.format('DL.SettingOptionalRulesLabel')}`
  }

  // eslint-disable-next-line no-unused-vars
  _prepareContext(options) {
    return {
      optionalRuleConsistentDamage: game.settings.get('demonlord', 'optionalRuleConsistentDamage'),
      optionalRuleDieRollsMode: game.settings.get('demonlord', 'optionalRuleDieRollsMode'),
      selectedDieRollsDropDrown: game.settings.get('demonlord', 'optionalRuleDieRollsMode'),
      dieRollsDropDrown: {
        d: game.i18n.localize('DL.SettingOptionalRuleBellStandardRolls'),
        b: game.i18n.localize('DL.SettingOptionalRuleBellCurveRolls'),
        s: game.i18n.localize('DL.SettingOptionalRuleStaticBoonsAndBanes'),
      },
      optionalRuleInitiativeMode: game.settings.get('demonlord', 'optionalRuleInitiativeMode'),
      selectedInitiativeMethodDropDrown: game.settings.get('demonlord', 'optionalRuleInitiativeMode'),
      initiativeMethodDropDrown: {
        s: game.i18n.localize('DL.SettingOptionalRuleInitiativeStd'),
        i: game.i18n.localize('DL.SettingOptionalRuleInitiativeInduvidual'),
        h: game.i18n.localize('DL.SettingOptionalRuleInitiativeGroup'),
      },
      selectedSurroundingModeDropDown: game.settings.get('demonlord', 'optionalRuleSurroundingMode'),
      SurroundingDropDown: {
        d: game.i18n.localize('DL.disabled'),
        a: game.i18n.localize('DL.SettingOptionalRuleSurroundingModeAlltype'),
        n: game.i18n.localize('DL.SettingOptionalRuleSurroundingModeNPCCreature'),
        c: game.i18n.localize('DL.SettingOptionalRuleSurroundingModeCreatureOnly'),
      },
      selectedAllowedDispositionDropDown: game.settings.get('demonlord', 'optionalRuleSurroundingDispositions'),
      AllowedDispositionDropDown: {
        d: game.i18n.localize('DL.None'),
        b: game.i18n.localize('DL.SettingOptionalRuleSurroundingDispositionsAllowBoth'),
        n: game.i18n.localize('DL.SettingOptionalRuleSurroundingDispositionsAllowNeutral'),
        s: game.i18n.localize('DL.SettingOptionalRuleSurroundingDispositionsAllowSecret'),
      },
      optionalRuleSurroundingRevealChatCard: game.settings.get('demonlord', 'optionalRuleSurroundingRevealChatCard'),
      optionalRuleSurroundingExcludeTokens: game.settings.get('demonlord', 'optionalRuleSurroundingExcludeTokens'),
      optionalRuleRollInitEachRound: game.settings.get('demonlord', 'optionalRuleRollInitEachRound'),
      optionalRuleExceedsByFive: game.settings.get('demonlord', 'optionalRuleExceedsByFive'),
      horrifyingBane: game.settings.get('demonlord', 'horrifyingBane'),
      optionalRuleLevelDependentBane: game.settings.get('demonlord', 'optionalRuleLevelDependentBane'),
      optionalRuleRevealHorrifyingBane: game.settings.get('demonlord', 'optionalRuleRevealHorrifyingBane'),
      buttons: [
        {
          type: 'submit',
          action: 'submit',
          icon: 'fa-solid fa-save',
          label: 'SETTINGS.Save',
        },
        {
          type: 'submit',
          action: 'reset',
          icon: 'fas fa-undo',
          label: 'SETTINGS.Reset',
        },
      ],
    }
  }

  // eslint-disable-next-line no-unused-vars
  _onRender(context, options) {
    const html = $(this.element)
    html.find('button').on('click', async event => {
      if (event.currentTarget?.dataset?.action === 'reset') {
        const keys = [
          'optionalRuleConsistentDamage',
          'optionalRuleDieRollsMode',
          'optionalRuleInitiativeMode',
          'optionalRuleRollInitEachRound',
          'optionalRuleExceedsByFive',
          'horrifyingBane',
          'optionalRuleLevelDependentBane',
          'optionalRuleRevealHorrifyingBane',
          'optionalRuleSurroundingMode',
          'optionalRuleSurroundingDispositions',
          'optionalRuleSurroundingExcludeTokens',
          'optionalRuleSurroundingRevealChatCard',
        ]
        await Promise.all(
          keys.map(async key => {
            await resetToDefault(key)
          }),
        )
        this.close()
      }
    })
  }

  static async handler(event, form, formData) {
    const keys = [
      'optionalRuleConsistentDamage',
      'optionalRuleDieRollsMode',
      'optionalRuleInitiativeMode',
      'optionalRuleRollInitEachRound',
      'optionalRuleExceedsByFive',
      'horrifyingBane',
      'optionalRuleLevelDependentBane',
      'optionalRuleRevealHorrifyingBane',
      'optionalRuleSurroundingMode',
      'optionalRuleSurroundingDispositions',
      'optionalRuleSurroundingExcludeTokens',
      'optionalRuleSurroundingRevealChatCard',
    ]
    if (event.submitter.dataset.action === 'reset') {
      await Promise.all(
        keys.map(async key => {
          await resetToDefault(key)
        }),
      )
    }
    if (event.submitter.dataset.action === 'submit') {
      await updateSettings(formData)
      this.close()
    }
  }
}

export const registerSettings = function () {
  game.settings.registerMenu('demonlord', 'advancedSettings', {
    name: game.i18n.localize('DL.SettingDSN'),
    label: game.i18n.localize('Configure'),
    hint: game.i18n.localize('DL.SettingDSNHint'),
    icon: 'fas fa-sliders-h',
    type: DiceSoNiceSettings,
  })

  game.settings.register('demonlord', 'colourBoBDieDSN', {
    name: game.i18n.localize('DL.SettingColourBoBDieDSNMessage'),
    hint: game.i18n.localize('DL.SettingColourBoBDieDSNMessageHint'),
    default: false,
    scope: 'client',
    type: Boolean,
    config: false,
  })

  game.settings.register('demonlord', 'boonColour', {
    name: game.i18n.localize('DL.SettingBoonDieColour'),
    scope: 'client',
    type: new foundry.data.fields.ColorField({ required: true, blank: false }),
    default: '#104f09',
    config: false,
  })
  game.settings.register('demonlord', 'baneColour', {
    name: game.i18n.localize('DL.SettingBaneDieColour'),
    scope: 'client',
    type: new foundry.data.fields.ColorField({ required: true, blank: false }),
    default: '#bf0202',
    config: false,
  })
  game.settings.register('demonlord', 'replaced3', {
    name: game.i18n.localize('DL.SettingDSN3d'),
    scope: 'client',
    type: Boolean,
    default: false,
    config: false,
    requiresReload: true,
  })

  game.settings.registerMenu('demonlord', 'optionalRulesSettings', {
    name: game.i18n.localize('DL.SettingOptionalRules'),
    label: game.i18n.localize('Configure'),
    hint: game.i18n.localize('DL.SettingOptionalRulesHint'),
    icon: 'fas fa-sliders-h',
    type: OptionalRulesSettings,
    restricted: true,
  })

  game.settings.register('demonlord', 'optionalRuleConsistentDamage', {
    name: game.i18n.localize('DL.SettingOptionalRuleConsistentDamage'),
    hint: game.i18n.localize('DL.SettingOptionalRuleConsistentDamageHint'),
    default: false,
    scope: 'world',
    type: Boolean,
    config: false,
  })

  game.settings.register('demonlord', 'optionalRuleExceedsByFive', {
    name: game.i18n.localize('DL.SettingOptionalRuleExceedsByFive'),
    hint: game.i18n.localize('DL.SettingOptionalRuleExceedsByFiveDamageHint'),
    default: false,
    scope: 'world',
    type: Boolean,
    config: false,
  })

  game.settings.register('demonlord', 'optionalRuleLevelDependentBane', {
    name: game.i18n.localize('DL.SettingOptionalRuleLevelDependentBane'),
    hint: game.i18n.localize('DL.SettingOptionalRuleLevelDependentBaneHint'),
    default: false,
    scope: 'world',
    type: Boolean,
    config: false,
  })

  game.settings.register('demonlord', 'optionalRuleRevealHorrifyingBane', {
    name: game.i18n.localize('DL.SettingOptionalRuleRevealHorrifyingBane'),
    hint: game.i18n.localize('DL.SettingOptionalRuleRevealHorrifyingBaneHint'),
    default: false,
    scope: 'world',
    type: Boolean,
    config: false,
  })

  game.settings.register('demonlord', 'optionalRuleDieRollsMode', {
    name: game.i18n.localize('DL.SettingOptionalRuleDieRollsMode'),
    scope: 'world',
    type: String,
    config: false,
    default: 'd',
    choices: {
      d: game.i18n.localize('DL.disabled'),
      s: game.i18n.localize('DL.SettingOptionalRuleStaticBoonsAndBanes'),
      b: game.i18n.localize('DL.SettingOptionalRuleBellCurveRolls'),
    },
  })

  game.settings.register('demonlord', 'optionalRuleInitiativeMode', {
    name: game.i18n.localize('DL.SettingOptionalRuleInitiative'),
    scope: 'world',
    type: String,
    config: false,
    default: 's',
    choices: {
      s: game.i18n.localize('DL.SettingOptionalRuleInitiativeStd'),
      i: game.i18n.localize('DL.SettingOptionalRuleInitiativeInduvidual'),
      h: game.i18n.localize('DL.SettingOptionalRuleInitiativeGroup'),
    },
    requiresReload: true,
  })

  game.settings.register('demonlord', 'optionalRuleRollInitEachRound', {
    name: game.i18n.localize('DL.SettingOptionalRuleRollInitEachRound'),
    default: false,
    scope: 'world',
    type: Boolean,
    config: false,
  })

  game.settings.register('demonlord', 'optionalRuleSurroundingMode', {
    name: game.i18n.localize('DL.SettingOptionalRuleSurroundingMode'),
    scope: 'world',
    type: String,
    config: false,
    default: 'd',
    choices: {
      d: game.i18n.localize('DL.disabled'),
      a: game.i18n.localize('DL.SettingOptionalRuleSurroundingModeAlltype'),
      n: game.i18n.localize('DL.SettingOptionalRuleSurroundingModeNPCCreature'),
      c: game.i18n.localize('DL.SettingOptionalRuleSurroundingModeCreatureOnly'),
    },
  })

  game.settings.register('demonlord', 'optionalRuleSurroundingDispositions', {
    name: game.i18n.localize('DL.SettingOptionalRuleSurroundingDispositions'),
    scope: 'world',
    type: String,
    config: false,
    default: 'd',
    choices: {
      d: game.i18n.localize('DL.None'),
      b: game.i18n.localize('DL.SettingOptionalRuleSurroundingDispositionsAllowBoth'),
      n: game.i18n.localize('DL.SettingOptionalRuleSurroundingDispositionsAllowNeutral'),
      s: game.i18n.localize('DL.SettingOptionalRuleSurroundingDispositionsAllowSecret'),
    },
    requiresReload: true,
  })

  game.settings.register('demonlord', 'optionalRuleSurroundingExcludeTokens', {
    name: game.i18n.localize('DL.SettingOptionalRuleSurroundingExcludeTokens'),
    default: true,
    scope: 'world',
    type: Boolean,
    config: false,
  })

  game.settings.register('demonlord', 'optionalRuleSurroundingRevealChatCard', {
    name: game.i18n.localize('DL.SettingOptionalRuleSurroundingRevealChatCard'),
    default: false,
    scope: 'world',
    type: Boolean,
    config: false,
  })

  game.settings.register('demonlord', 'ignoreEncumbrance', {
    name: game.i18n.localize('DL.SettingIgnoreEncumbrance'),
    hint: game.i18n.localize('DL.SettingIgnoreEncumbranceHint'),
    default: false,
    scope: 'world',
    type: Boolean,
    config: true,
  })

  game.settings.register('demonlord', 'systemMigrationVersion', {
    name: 'System Migration Version',
    scope: 'world',
    config: false,
    type: String,
    default: '',
  })
  game.settings.register('demonlord', 'lockAncestry', {
    name: game.i18n.localize('DL.SettingLockAncestry'),
    hint: game.i18n.localize('DL.SettingLockAncestrHint'),
    default: false,
    scope: 'world',
    type: Boolean,
    config: true,
  })
  game.settings.register('demonlord', 'initMessage', {
    name: game.i18n.localize('DL.SettingInitMessage'),
    hint: game.i18n.localize('DL.SettingInitMessageHint'),
    default: true,
    scope: 'world',
    type: Boolean,
    config: true,
  })
  game.settings.register('demonlord', 'initRandomize', {
    name: game.i18n.localize('DL.SettingInitRandomize'),
    hint: game.i18n.localize('DL.SettingInitRandomizeHint'),
    default: false,
    scope: 'world',
    type: Boolean,
    config: true,
  })
  game.settings.register('demonlord', 'autoSetDefeated', {
    name: game.i18n.localize('DL.SettingAutoSetDefeated'),
    hint: game.i18n.localize('DL.SettingAutoSetDefeatedHint'),
    default: false,
    scope: 'world',
    type: Boolean,
    config: true,
  })
  game.settings.register('demonlord', 'showEncounterDifficulty', {
    name: game.i18n.localize('DL.SettingShowEncounterDifficulty'),
    hint: game.i18n.localize('DL.SettingShowEncounterDifficultyHint'),
    default: false,
    scope: 'world',
    type: Boolean,
    config: true,
    // eslint-disable-next-line no-unused-vars
    onChange: value => {
      ui.combat.render()
    },
  })
  game.settings.register('demonlord', 'attackShowAttack', {
    name: game.i18n.localize('DL.SettingAttackShowEnemyAttributeAtt'),
    hint: game.i18n.localize('DL.SettingAttackShowEnemyAttributeAttHint'),
    default: true,
    scope: 'world',
    type: Boolean,
    config: true,
  })
  game.settings.register('demonlord', 'attackShowDefense', {
    name: game.i18n.localize('DL.SettingAttackShowEnemyAttribute'),
    hint: game.i18n.localize('DL.SettingAttackShowEnemyAttributeHint'),
    default: false,
    scope: 'world',
    type: Boolean,
    config: true,
  })
  game.settings.register('demonlord', 'rollCreaturesToGM', {
    name: game.i18n.localize('DL.SettingRollCreaturesToGM'),
    hint: game.i18n.localize('DL.SettingRollCreaturesToGMHint'),
    default: true,
    scope: 'world',
    type: Boolean,
    config: true,
  })
  game.settings.register('demonlord', 'hideActorInfo', {
    name: game.i18n.localize('DL.SettingHideActorInfo'),
    hint: game.i18n.localize('DL.SettingHideActorInfoHint'),
    default: false,
    scope: 'world',
    type: Boolean,
    config: true,
    requiresReload: true,
  })
  game.settings.register('demonlord', 'hideDescription', {
    name: game.i18n.localize('DL.SettingHideCreatureDescription'),
    hint: game.i18n.localize('DL.SettingHideCreatureDescriptionHint'),
    default: true,
    scope: 'world',
    type: Boolean,
    config: true,
    requiresReload: true,
  })
  game.settings.register('demonlord', 'statusIcons', {
    name: game.i18n.localize('DL.SettingStatusIcons'),
    hint: game.i18n.localize('DL.SettingStatusIconsHint'),
    default: false,
    scope: 'world',
    type: Boolean,
    config: true,
    requiresReload: true,
  })
  game.settings.register('demonlord', 'templateAutoTargeting', {
    name: game.i18n.localize('DL.SettingTemplateAutoTargeting'),
    hint: game.i18n.localize('DL.SettingTemplateAutoTargetingHint'),
    default: true,
    scope: 'world',
    type: Boolean,
    config: true,
  })
  game.settings.register('demonlord', 'replaceIcons', {
    name: game.i18n.localize('DL.SettingReplaceIcons'),
    hint: game.i18n.localize('DL.SettingReplaceIconsHint'),
    default: true,
    scope: 'world',
    type: Boolean,
    config: true,
  })
  game.settings.register('demonlord', 'convertIntoBadge', {
    name: game.i18n.localize('DL.SettingConvertIntoBadge'),
    hint: game.i18n.localize('DL.SettingConvertIntoBadgeHint'),
    default: true,
    scope: 'world',
    type: Boolean,
    config: true,
  })
  game.settings.register('demonlord', 'gmEffectsControls', {
    name: game.i18n.localize('DL.SettingGMEffectsControls'),
    hint: game.i18n.localize('DL.SettingGMEffectsControlsHint'),
    default: false,
    scope: 'world',
    type: Boolean,
    config: true,
  })
  game.settings.register('demonlord', 'targetingOnSelect', {
    name: game.i18n.localize('DL.SettingtargetingOnSelect'),
    hint: game.i18n.localize('DL.SettingtargetingOnSelectHint'),
    default: false,
    scope: 'world',
    type: Boolean,
    config: true,
  })
  game.settings.register('demonlord', 'templateAutoTargeting', {
    name: game.i18n.localize('DL.SettingTemplateAutoTargeting'),
    hint: game.i18n.localize('DL.SettingTemplateAutoTargetingHint'),
    default: false,
    scope: 'world',
    type: Boolean,
    config: true,
  })
  game.settings.register('demonlord', 'templateAutoRemove', {
    name: game.i18n.localize('DL.SettingTemplateAutoRemove'),
    hint: game.i18n.localize('DL.SettingTemplateAutoRemoveHint'),
    default: true,
    scope: 'world',
    type: Boolean,
    config: true,
  })
  game.settings.register('demonlord', 'autoDeleteEffects', {
    name: game.i18n.localize('DL.SettingAutoDeleteEffects'),
    hint: game.i18n.localize('DL.SettingAutoDeleteEffectsHint'),
    default: true,
    scope: 'world',
    type: Boolean,
    config: true,
  })
  game.settings.register('demonlord', 'confirmAncestryPathRemoval', {
    name: game.i18n.localize('DL.SettingConfirmAncestryPathRemoval'),
    hint: game.i18n.localize('DL.SettingConfirmAncestryPathRemovalHint'),
    default: true,
    scope: 'world',
    type: Boolean,
    config: true,
  })
  game.settings.register('demonlord', 'horrifyingBane', {
    name: game.i18n.localize('DL.SettingHorrifyingBane'),
    hint: game.i18n.localize('DL.SettingHorrifyingBaneHint'),
    default: true,
    scope: 'world',
    type: Boolean,
    config: false,
  })
  game.settings.register('demonlord', 'concentrationEffect', {
    name: game.i18n.localize('DL.SettingConcentrationEffect'),
    hint: game.i18n.localize('DL.SettingConcentrationEffectHint'),
    default: true,
    scope: 'world',
    type: Boolean,
    config: true,
  })
  game.settings.register('demonlord', 'integrateTokenRuler', {
    name: game.i18n.localize('DL.SettingIntegrateTokenRuler'),
    hint: game.i18n.localize('DL.SettingIntegrateTokenRulerHint'),
    default: false,
    scope: 'world',
    type: Boolean,
    config: true,
    requiresReload: true,
  })
  game.settings.register('demonlord', 'fortuneAwardPrevented', {
    name: game.i18n.localize('DL.SettingFortuneAwardPrevented'),
    hint: game.i18n.localize('DL.SettingFortuneAwardPreventedHint'),
    default: false,
    scope: 'world',
    type: Boolean,
    config: true,
  })
  game.settings.register('demonlord', 'fortuneHide', {
    name: game.i18n.localize('DL.SettingFortuneHide'),
    hint: game.i18n.localize('DL.SettingFortuneHideHint'),
    default: false,
    scope: 'world',
    type: Boolean,
    config: true,
    requiresReload: true
  })
  game.settings.register('demonlord', 'addCreatureInventoryTab', {
    name: game.i18n.localize('DL.SettingAddCreatureInventoryTab'),
    default: false,
    scope: 'world',
    type: Boolean,
    config: true,
    requiresReload: true
  })
}
