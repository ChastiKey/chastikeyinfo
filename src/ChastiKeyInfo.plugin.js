/**
 * @name ChastiKeyInfo
 * @authorLink https://github.com/rileyio
 * @source https://github.com/rileyio/chastikeyinfo
 */
/*@cc_on
@if (@_jscript)
	
  // Offer to self-install for clueless users that try to run this directly.
  var shell = WScript.CreateObject("WScript.Shell");
  var fs = new ActiveXObject("Scripting.FileSystemObject");
  var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
  var pathSelf = WScript.ScriptFullName;
  // Put the user at ease by addressing them in the first person
  shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
  if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
    shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
  } else if (!fs.FolderExists(pathPlugins)) {
    shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
  } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
    fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
    // Show the user where to put plugins in the future
    shell.Exec("explorer " + pathPlugins);
    shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
  }
  WScript.Quit();

@else@*/

const config = {  
  main: 'index.js',
  info: {
    name: 'ChastiKeyInfo',
    authors: [
      {
        name: 'Emma <RileyIO>',
        discord_id: '146439529824256000',
        github_username: 'rileyio'
      }
    ],
    version: '2.1.2',
    description: 'Display ChastiKey public stats & locks data inline next to message authors.',
    github: 'https://github.com/rileyio/chastikeyinfo',
    github_raw: 'https://raw.githubusercontent.com/rileyio/chastikeyinfo/master/src/ChastiKeyInfo.plugin.js'
  },
  changelog: [
    {
      title: 'Fixed',
      type: 'fixed',
      items: ['Tags not working']
    },
    // {
    //   title: "On-going",
    //   type: "progress",
    //   items: [
    //     "More modals and popouts being added",
    //     "More classes and modules being added",
    //   ],
    // },
  ],
  defaultConfig: [
    {
      type: 'category',
      id: 'api',
      name: 'API Configuration',
      collapsible: true,
      shown: false,
      settings: [
        {
          type: 'textbox',
          id: 'clientID',
          name: 'ChastiKey API Client ID',
          note: "Get this from the ChastiKey Application - Open the sidebar > API > Click the '+' in the bottom right",
          value: '',
          placeholder: 'Place the ChastiKey Application Client ID here'
        },
        {
          type: 'textbox',
          id: 'clientSecret',
          name: 'ChastiKey API Client Secret',
          note: 'Get this from the new project created in the above step. Click the pencil under the project to retrieve the secret.',
          value: '',
          placeholder: 'Place the ChastiKey Application Client Secret here'
        }
      ]
    },
    {
      type: 'category',
      id: 'tags',
      name: 'Tags Displayed',
      collapsible: true,
      shown: false,
      settings: [
        {
          type: 'dropdown',
          id: 'verifiedTag',
          name: 'CK Verified',
          note: `This needs to be enabled to see any CK Verified tag - Additional Modifications can be found in that category.`,
          value: true,
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false }
          ]
        },
        {
          type: 'dropdown',
          id: 'lockedTime',
          name: 'Locked Time',
          note: `This needs to be enabled to see any Locked Months tag - Additional Modifications can be found in that category.`,
          value: true,
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false }
          ]
        },
        {
          type: 'dropdown',
          id: 'keyholders',
          name: 'Show Keyholder(s)',
          note: 'This needs to be enabled to see any Keyholder tags of Lockees - Additional Modifications can be found in that category.',
          value: true,
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false }
          ]
        },
        {
          type: 'dropdown',
          id: 'lockeeRating',
          name: 'Lockee Average Rating',
          note: `This needs to be enabled to see a Lockee's average rating - Additional Modifications can be found in that category.`,
          value: false,
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false }
          ]
        },
        {
          type: 'dropdown',
          id: 'lockeeTrust',
          name: 'Lockee Trust of Keyholder by active lock percentage',
          note: 'This needs to be enabled to see the percentage of Lockee trust on active locks - Additional Modifications can be found in that category.',
          value: false,
          options: [
            { label: "Yes", value: true },
            { label: "No", value: false }
          ]
        }
      ]
    },
    {
      type: 'category',
      id: 'mods',
      name: 'Additional Modifications',
      collapsible: true,
      shown: false,
      settings: [
        {
          type: 'dropdown',
          id: 'verifiedTagMods',
          name: 'CK Verified Tag Modifications',
          value: 'full',
          options: [
            { label: 'Full text: ✓ CK Verified', value: 'full' },
            { label: 'Checkmark only (Square): ✓', value: 'checkmark' },
            { label: 'Checkmark only (Circle): ✓', value: 'checkmarkCircle' }
          ]
        },
        {
          type: 'dropdown',
          id: 'lockedTimeMods',
          name: 'Locked Time Tag Modifications',
          value: 'full',
          options: [
            { label: 'Full text including lock emoji and number of decimal months', value: 'full' },
            { label: 'Decimal Months Only', value: 'decimal' }
          ]
        },
        {
          type: 'dropdown',
          id: 'keyholdersMods',
          name: `Lockee's Keyholder(s) Modifications`,
          value: 'multiple',
          options: [
            { label: 'Show Multiple Keyholders as separate tags (Max 3)', value: 'multiple' },
            { label: 'Single Keyholder (Plugin picks the first locked lock for the Keyholder name)', value: 'single' }
          ]
        },
        {
          type: 'dropdown',
          id: 'lockeeTrustMods',
          name: `Lockee's Keyholder Trust of their locked locks`,
          value: 'fullActive',
          options: [
            { label: 'Show Trust text followed by percentage (Active Locks)', value: 'fullActive' },
            { label: 'Show just percentage (Active Locks)', value: 'minimalActive' }
          ]
        },
        {
          type: 'dropdown',
          id: 'placeholder',
          name: `Placeholder (does nothing)`,
          value: '1',
          options: [
            { label: '1', value: '1' },
            { label: '2', value: '2' }
          ]
        }
      ]
    }
  ]
}

const css = `
.cktag {
  position: relative;
  font-size: 12px;
  border-radius: 4px;
  font-weight: 500;
  padding: 0 4px;
  line-height: 1.5em;
  height: 18px;
  margin: 0 4px 0 0px;
}

.cktag.verified {
  background-color: #27ae60;
  color: #fff;
  margin-left: 4px;
}
.cktag.verifiedCircle {
  background-color: #27ae60;
  color: #fff;
  border-radius: 50%;
  margin-left: 4px;
}

.cktag.keyholder {
  background-color: #904fad;
  color: #fff;
}

.cktag.totalTimeLocked {
  background-color: #239cb7;
  color: #fff;
}

.cktag.generic {
  background-color: #444;
  color: #fff;
}

.cktag.keyholder-level-1 { background-color: #904fad; }
.cktag.keyholder-level-2 { background-color: #a069ba; }
.cktag.keyholder-level-3 { background-color: #b184c7; color: #333; }
.cktag.keyholder-level-4 { background-color: #c19ed4; color: #333;}
.cktag.keyholder-level-5 { background-color: #d1b8e1; color: #333;}
`

const buildPlugin = ([Plugin, Api]) => {
  const { DOMTools, Logger, PluginUpdater, PluginUtilities, ReactTools, Utilities, WebpackModules } = Api
  const req = require('request')
  const MessageClasses = {
    ...WebpackModules.getByProps('message', 'groupStart'),
    ...WebpackModules.getByProps('compact', 'cozy', 'username')
  }

  const plugin = () => {
    var usersCache = []
    var runningLocksCache = []
    var cacheUpdater

    return class ChastiKeyInfo extends Plugin {
      constructor() {
        super()
        PluginUtilities.addStyle(this.getName(), css)
      }

      // * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // * Lifecycle Hooks
      // * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      async onStart() {
        Logger.log('Started')
        // Force Update Check
        Logger.log('Checking for ChastiKeyInfo BD update! Current:', this.getVersion())
        PluginUpdater.checkForUpdate(
          this.getName(),
          this.getVersion(),
          'https://raw.githubusercontent.com/rileyio/chastikeyinfo/master/src/ChastiKeyInfo.plugin.js');

        this.settings = this.loadSettings(this.default)
        this.reinjectCSS()
        Logger.log(this.settings)

        if (!this.settings.api.clientID && !this.settings.api.clientSecret) {
          BdApi.showToast('Please complete the ChastiKeyInfo Plugin settings.', { type: 'error', timeout: 10000 })
          return // Stop Here
        }

        // Reload: Users Cache
        await this.fetchRemoteUsersCache()

        // Reload: Running Locks Cache
        await this.fetchRemoteLocksCache()

        // Start Cache Updater
        this.startCacheUpdater()

        // Force Update now
        for (const node of document.querySelectorAll(`.${MessageClasses.groupStart.split(' ')[0]}`)) this.processNode(node)
      }

      onStop() {
        PluginUtilities.removeStyle(this.short)
        // Clear CK Tags
        this.clearTags()

        // Kill Cache Updater
        Logger.log('Killing cacheUpdater')
        clearInterval(cacheUpdater)
        Logger.log('Stopped')
      }

      onSwitch() {
        Logger.log('onSwitch')
        for (const node of document.querySelectorAll(`.${MessageClasses.groupStart.split(' ')[0]}`)) this.processNode(node)
      }

      // ? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // ? Helper Methods
      // ? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      removeDupsFromArray(array) {
        return [...new Set(array)]
      }

      reinjectCSS() {
        Logger.log('reinjectCSS')
        PluginUtilities.removeStyle('cktag')
        PluginUtilities.addStyle('cktag')
      }

      request(method, url) {
        return new Promise((resolve) => {
          Logger.log(`request => [${method}] ${url}`)
          req(
            url,
            {
              method,
              headers: {
                'content-type': 'application/json',
                accept: 'application/json',
                clientID: this.settings.api.clientID,
                clientSecret: this.settings.api.clientSecret
              }
            },
            (error, response, result) => {
              if (error || response.statusCode !== 200) {
                Logger.error(`request => ${error}`)
                return resolve({ successful: false })
              }

              resolve({ successful: true, data: JSON.parse(result) })
            }
          )
        })
      }

      getUser(id) {
        return usersCache.find((user) => user.discordID === id)
      }

      getLocks(id) {
        return runningLocksCache.filter((lock) => lock.discordID === id)
      }

      reduceUser(user) {
        return {
          username: user.username,
          discordID: user.discordID,
          averageKeyholderRating: user.averageKeyholderRating,
          averageLockeeRating: user.averageLockeeRating,
          keyholderLevel: user.keyholderLevel,
          lockeeLevel: user.lockeeLevel,
          mainRole: user.mainRole,
          noOfLockeeRatings: user.noOfLockeeRatings,
          totalLocksManaged: user.totalLocksManaged,
          totalNoOfCompletedLocks: user.totalNoOfCompletedLocks,
          _totalTimeLocked: Math.round((user.cumulativeSecondsLocked / 2592000) * 100) / 100
        }
      }

      reduceLock(lock) {
        return {
          // autoResetFrequencyInSeconds: lock.autoResetFrequencyInSeconds,
          // autoResetsPaused: lock.autoResetsPaused,
          // botChosen: lock.botChosen,
          // build: lock.build,
          // cardInfoHidden: lock.cardInfoHidden,
          // cumulative: lock.cumulative,
          // discardPile: lock.discardPile,
          discordID: lock.discordID,
          // doubleUpCards: lock.doubleUpCards,
          // fixed: lock.fixed,
          // freezeCards: lock.freezeCards,
          // greenCards: lock.greenCards,
          // greenCardsPicked: lock.greenCardsPicked,
          lockFrozen: lock.lockFrozen,
          // lockFrozenByCard: lock.lockFrozenByCard,
          // lockFrozenByKeyholder: lock.lockFrozenByKeyholder,
          lockGroupID: lock.lockGroupID,
          lockID: lock.lockID,
          lockName: lock.lockName,
          lockedBy: lock.lockedBy,
          // logID: lock.logID,
          // maximumAutoResets: lock.maximumAutoResets,
          // multipleGreensRequired: lock.multipleGreensRequired,
          // noOfTimesAutoReset: lock.noOfTimesAutoReset,
          // noOfTimesCardReset: lock.noOfTimesCardReset,
          // noOfTimesFullReset: lock.noOfTimesFullReset,
          // noOfTurns: lock.noOfTurns,
          // redCards: lock.redCards,
          // regularity: lock.regularity,
          // resetCards: lock.resetCards,
          // sharedLockID: lock.sharedLockID,
          // sharedLockQRCode: lock.sharedLockQRCode,
          // sharedLockURL: lock.sharedLockURL,
          status: lock.status,
          // stickyCards: lock.stickyCards,
          // timerHidden: lock.timerHidden,
          // timestampExpectedUnlock: lock.timestampExpectedUnlock,
          // timestampFrozenByCard: lock.timestampFrozenByCard,
          // timestampFrozenByKeyholder: lock.timestampFrozenByKeyholder,
          // timestampLastAutoReset: lock.timestampLastAutoReset,
          // timestampLastCardReset: lock.timestampLastCardReset,
          // timestampLastFullReset: lock.timestampLastFullReset,
          // timestampLastPicked: lock.timestampLastPicked,
          // timestampLocked: lock.timestampLocked,
          // timestampNextPick: lock.timestampNextPick,
          // timestampRealLastPicked: lock.timestampRealLastPicked,
          // totalTimeFrozen: lock.totalTimeFrozen,
          trustKeyholder: lock.trustKeyholder,
          // userID: lock.userID,
          username: lock.username
          // yellowCards: lock.yellowCards,
        }
      }

      async fetchRemoteUsersCache(skipElse) {
        if (Date.now() - 3600000 > BdApi.getData(this.getName(), 'usersCacheTimestamp') || usersCache.length <= 1) {
          BdApi.showToast('Reloading ChastiKey Users Cache', { type: 'info' })

          // Make Request
          const res = await this.request('post', 'https://api.chastikey.com/v0.5/userdata.php')

          // Update cached variable
          if (res.successful) {
            // Store last fetch time to not poll too frequently
            PluginUtilities.saveData(this.getName(), 'usersCacheTimestamp', Date.now())
            usersCache = res.data.users.filter((u) => u.discordID !== '').map((u) => this.reduceUser(u))
            BdApi.showToast(`ChastiKey Users Cache Reloaded! (${usersCache.length})`, { type: 'success' })
          } else {
            BdApi.showToast('ChastiKey Users Cache Not Reloaded!', { type: 'error' })
          }
        }

        // Else: There's no reason to reload the cache
        else {
          if (!skipElse) BdApi.showToast(`ChastiKey Users Cache Already loaded! Size = ${usersCache.length}`, { type: 'info' })
        }
      }

      async fetchRemoteLocksCache(skipElse) {
        if (Date.now() - 3600000 > BdApi.getData(this.getName(), 'runningLocksCacheTimestamp') || runningLocksCache.length <= 1) {
          BdApi.showToast('Reloading ChastiKey Running Locks Cache', { type: 'info' })

          // Make Request
          const res = await this.request('post', 'https://api.chastikey.com/v0.5/runninglocks.php')

          // Update cached variable
          if (res.successful) {
            // Store last fetch time to not poll too frequently
            PluginUtilities.saveData(this.getName(), 'runningLocksCacheTimestamp', Date.now())
            runningLocksCache = res.data.locks.filter((u) => u.discordID !== '').map((l) => this.reduceLock(l))
            BdApi.showToast(`ChastiKey Running Locks Cache Reloaded! (${runningLocksCache.length})`, { type: 'success' })
          } else {
            BdApi.showToast('ChastiKey Running Locks Cache Not Reloaded!', { type: 'error' })
          }
        } else {
          // Suppress if skip is passed
          if (!skipElse) BdApi.showToast(`ChastiKey Running Locks Cache Already loaded! Size = ${runningLocksCache.length}`, { type: 'info' })
        }
      }

      // ? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // ? Background Tasks
      // ? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      startCacheUpdater() {
        if (!cacheUpdater) {
          cacheUpdater = setInterval(() => {
            this.fetchRemoteUsersCache(true)
            this.fetchRemoteLocksCache(true)
          }, 10000)
        } else {
          Logger.warn('startCacheUpdater => cacheUpdater is already running!')
        }
      }

      // ? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // ? Getters
      // ? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      // ? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // ? Setters
      // ? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      // ! ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // ! Play 'Tag God' Methods
      // ! ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      createTag(text, type) {
        return DOMTools.parseHTML(`<span class="cktag ${type}">${text}</span>`)
      }

      removeTag(node) {
        if (!node || !!node.querySelectorAll('.cktag').length) {
          return // Stop here
        }
        const els = node.querySelectorAll('.cktag')
        els.forEach((el) => el.remove())
      }

      clearTags() {
        for (const node of document.querySelectorAll(`.${MessageClasses.groupStart.split(' ')[0]}`)) {
          this.removeTag(node)
        }
      }

      getSettingsPanel() {
        return this.buildSettingsPanel().getElement()
      }

      observer({ addedNodes }) {
        for (const node of addedNodes) {
          if (!node) continue
          if (node.classList && node.classList.contains(MessageClasses.groupStart.split(' ')[0])) {
            this.processNode(node)
          }
        }
      }

      processMessageUsername(e) {
        Logger.load('processMessageUsername', e)
      }

      processNode(node) {
        // Logger.log('node', node)
        // Skip if already rendered on this node
        if (node.querySelectorAll('.cktag').length) {
          Logger.log('Skip as something is already here!')
          return
        }

        const instance = ReactTools.getReactInstance(node);
        if (!instance) return
        const { message: { author } } = Utilities.getNestedProp(instance, 'memoizedProps.children.1.props.children.1.props')

        // Prepare items to append
        var toAppend = []

        // Is user cached and has a discord id?
        const user = this.getUser(author.id)
        if (!user) return // Stop here

        // Logger.log(`isVerified = ${true} :: username: ${user.username},`)

        // Look for user in running locks
        const runningLocks = this.getLocks(author.id)
        const hasRunningLock = runningLocks.length > 0

        // Get Username element to append to
        const username = node.querySelector('span[class^="header"]')

        // When verified
        if (this.settings.tags.verifiedTag) toAppend.push(this.verifiedTag())
        // Cumulative Time Locked
        if (this.settings.tags.lockedTime) toAppend.push(this.lockedTime(user))
        // User Ratings
        if (this.settings.tags.lockeeRating && user.noOfLockeeRatings >= 5) toAppend.push(this.averageLockeeRating(user))
        // When there's an active lock
        if (this.settings.tags.lockeeTrust && hasRunningLock) toAppend.push(this.runningLocksKHTrust(runningLocks))
        if (this.settings.tags.keyholders && hasRunningLock) this.keyholders(runningLocks).forEach((tag) => toAppend.push(tag))

        // Append all tags - If there are any
        toAppend.reverse()
        toAppend.forEach((tag) => username.insertAdjacentElement('afterend', tag))
      }

      // * Tags * //
      verifiedTag() {
        const isCircle = this.settings.mods.verifiedTagMods === 'checkmarkCircle'
        const tag = this.createTag(this.settings.mods.verifiedTagMods !== 'full' ? '✓' : '✓ CK Verified', isCircle ? 'verifiedCircle' : 'verified')
        tag.classList.add('before')
        return tag
      }

      lockedTime(user) {
        // When there's no data, just return a tag with 0 in it
        const tag = this.createTag(this.settings.mods.lockedTimeMods === 'decimal' ? `${user._totalTimeLocked} mo.` : `🔒 ${user._totalTimeLocked} mo.`, 'totalTimeLocked')
        tag.classList.add('before')
        return tag
      }

      keyholders(runningLocks) {
        // Get an array of just keyholder names
        const keyholders = this.removeDupsFromArray(runningLocks.map((lock) => (lock.lockedBy === '' ? 'Self Locked' : lock.lockedBy)))
        keyholders.reverse()
        const tags = []

        const maxKHs = this.settings.mods.keyholdersMods !== 'multiple' ? 1 : keyholders.length <= 3 ? keyholders.length : 3
        for (let index = 0; index < maxKHs; index++) {
          const kh = keyholders[index]
          // Find the keyholder
          const keyholderFromUsersCache = usersCache.find((u) => u.username === kh)
          const tag = this.createTag(kh, 'keyholder')

          // Add KH Level, if one
          if (keyholderFromUsersCache) {
            tag.classList.add(`keyholder-level-${keyholderFromUsersCache.keyholderLevel}`)
          }

          tag.classList.add('before')
          tags.push(tag)
        }

        return tags
      }

      averageLockeeRating(user) {
        const rating = (Math.round(user.averageLockeeRating * 100) / 100).toFixed(2)
        const inFull = rating === 5.0 || rating === 4.0 || rating === 3.0 || rating === 2.0 || rating === 1.0
        const tag = this.createTag(`${inFull ? Math.round(rating) : rating}`, 'generic')
        tag.classList.add('before')
        return tag
      }

      runningLocksKHTrust(runningLocks) {
        const runningLocksTrust = runningLocks.map((l) => l.trustKeyholder)
        const runningLocksTrustPerc = Math.round((runningLocksTrust.filter((l) => l === 1).length / runningLocksTrust.length) * 100).toFixed(1)
        const tag = this.createTag(
          `${this.settings.mods.lockeeTrustMods === 'fullActive' ? 'Trust: ' : ''}${runningLocksTrustPerc < 100 ? runningLocksTrustPerc : 100}%`,
          'generic'
        )
        tag.classList.add('before')
        return tag
      }
    }
  }
  return plugin(Plugin, Api)
}

module.exports = (() => {
  return !global.ZeresPluginLibrary
    ? class {
      constructor() {
        this._config = config
      }
      getName() {
        return config.info.name
      }
      getAuthor() {
        return config.info.authors.map((a) => a.name).join(', ')
      }
      getDescription() {
        return config.info.description
      }
      getVersion() {
        return config.info.version
      }
      load() {
        BdApi.showConfirmationModal('Library Missing', `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
          confirmText: 'Download Now',
          cancelText: 'Cancel',
          onConfirm: () => {
            require('request').get('https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js', async (error, response, body) => {
              if (error)
                return require('electron').shell.openExternal(
                  'https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js'
                )
              await new Promise((r) => require('fs').writeFile(require('path').join(BdApi.Plugins.folder, '0PluginLibrary.plugin.js'), body, r))
            })
          }
        })
      }
      start() { }
      stop() { }
    }
    : buildPlugin(global.ZeresPluginLibrary.buildPlugin(config))
})()
/*@end@*/
