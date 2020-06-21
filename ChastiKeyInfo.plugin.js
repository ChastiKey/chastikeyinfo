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

module.exports = (() => {
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
      version: '1.0.0',
      description: 'Config Settings',
      github: 'https://github.com/rileyio/chastikeyinfo'
    },
    changelog: [
      {
        title: 'New!1!!',
        items: ['Welcome to the first release of the ChastiKeyInfo Plugin', 'Added changelog']
      }
      // {
      //   title: "Bugs Squashed",
      //   type: "fixed",
      //   items: ["React errors on reload"],
      // },
      // {
      //   title: "Improvements",
      //   type: "improved",
      //   items: ["Improvements to the base plugin"],
      // },
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
        type: 'switch',
        id: 'grandOverride',
        name: 'ChastiKeyInfo Configuration',
        note: 'Make sure you configure your API Keys in the below settings.',
        value: false
      },
      {
        type: 'category',
        id: 'api',
        name: 'API Configuration',
        collapsible: true,
        shown: true,
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
      }
    ]
  }

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
        start() {}
        stop() {}
      }
    : (([Plugin, Api]) => {
        const { ReactTools, DOMTools, WebpackModules, Logger, PluginUtilities } = Api
        const req = require('request')
        const MessageClasses = {
          ...WebpackModules.getByProps('message', 'groupStart'),
          ...WebpackModules.getByProps('compact', 'cozy', 'username')
        }

        const plugin = (Plugin, Library) => {
          const css = `
          .cktag {
            position: relative;
            top: 2px;
            font-size: 12px;
            border-radius: 4px;
            font-weight: 500;
            padding: 0 4px;
            line-height: 1.5em;
            height: 18px;
            margin: 0 2px 0 0;
          }

          .cktag.verified {
            background-color: #27ae60;
            color: #fff;
          }

          .cktag.keyholder {
            background-color: #904fad;
            color: #fff;
          }

          .cktag.totalTimeLocked {
            background-color: #239cb7;
            color: #fff;
          }

          .cktag.keyholder-level-1 { background-color: #904fad; }
          .cktag.keyholder-level-2 { background-color: #a069ba; }
          .cktag.keyholder-level-3 { background-color: #b184c7; color: #333; }
          .cktag.keyholder-level-4 { background-color: #c19ed4; color: #333;}
          .cktag.keyholder-level-5 { background-color: #d1b8e1; color: #333;}
        `

          var usersCache = []

          var runningLocksCache = [
            {
              userID: 28850,
              username: 'Emma',
              discordID: '146439529824256000',
              lockGroupID: 1592178631,
              lockID: 159217863101,
              lockedBy: 'Katrina30',
              lockName: '',
              sharedLockID: '<hidden>',
              sharedLockQRCode: '<hidden>',
              sharedLockURL: '<hidden>',
              autoResetFrequencyInSeconds: 0,
              autoResetsPaused: 0,
              botChosen: 0,
              build: 198,
              cardInfoHidden: 1,
              cumulative: 0,
              discardPile: 'Freeze,Red,Green,Green,Red,YellowMinus1,GoAgain,Green,Red,Red,YellowMinus2,Red,Red,Red,YellowMinus2,Red,Red,YellowMinus2,Green,Red,YellowMinus1',
              doubleUpCards: -9,
              fixed: 0,
              freezeCards: -9,
              greenCards: -9,
              greenCardsPicked: 5,
              lockFrozen: 1,
              lockFrozenByCard: 1,
              lockFrozenByKeyholder: 0,
              logID: 1592178632,
              maximumAutoResets: 0,
              multipleGreensRequired: 1,
              noOfTimesAutoReset: 0,
              noOfTimesCardReset: 1,
              noOfTimesFullReset: 0,
              noOfTurns: 17,
              redCards: -9,
              regularity: 6,
              resetCards: -9,
              status: 'Locked',
              stickyCards: -9,
              timerHidden: 0,
              timestampExpectedUnlock: 0,
              timestampFrozenByCard: 1592450813,
              timestampFrozenByKeyholder: 1592233880,
              timestampLastAutoReset: 0,
              timestampLastCardReset: 1592321508,
              timestampLastFullReset: 0,
              timestampLastPicked: 1592450813,
              timestampLocked: 1592178631,
              timestampNextPick: -9,
              timestampRealLastPicked: 1592429091,
              totalTimeFrozen: 31418,
              trustKeyholder: 1,
              yellowCards: -9
            }
          ]

          return class ChastiKeyInfo extends Plugin {
            constructor() {
              super()
              PluginUtilities.addStyle(this.getName(), css)
            }

            // * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            // * Lifecycle Hooks
            // * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            onStart() {
              Logger.log('Started')
              this.settings = this.loadSettings(this.default)
              this.reinjectCSS()
              Logger.log(this.settings)

              if (!this.settings.api.clientID && !this.settings.api.clientSecret) {
                BdApi.showToast('Please complete the ChastiKeyInfo Plugin settings.', {
                  type: 'error',
                  timeout: 10000
                })
                return // Stop Here
              }

              // Reload: Users Cache
              if (Date.now() - 3600000 > BdApi.getData(this.getName(), 'usersCacheTimestamp') || usersCache.length <= 1) {
                BdApi.showToast('Reloading ChastiKey Users Cache', {
                  type: 'info'
                })
                this.request('post', 'https://api.chastikey.com/v0.5/userdata.php').then((res) => {
                  // Update cached variable
                  if (res.successful) {
                    // Store last fetch time to not poll too frequently
                    BdApi.saveData(this.getName(), 'usersCacheTimestamp', Date.now())
                    usersCache = res.data.users.filter((u) => u.discordID !== '').map((u) => this.reduceUser(u))
                    BdApi.showToast(`ChastiKey Users Cache Reloaded! (${usersCache.length})`, {
                      type: 'success'
                    })
                  } else {
                    BdApi.showToast('ChastiKey Users Cache Not Reloaded!', {
                      type: 'error'
                    })
                  }
                })
              } else {
                BdApi.showToast(`ChastiKey Users Cache Already loaded! Size = ${usersCache.length}`, {
                  type: 'info'
                })
              }

              // Reload: Running Locks Cache
              if (Date.now() - 3600000 > BdApi.getData(this.getName(), 'runningLocksCacheTimestamp') || usersCache.length <= 1) {
                BdApi.showToast('Reloading ChastiKey Running Locks Cache', {
                  type: 'info'
                })
                this.request('post', 'https://api.chastikey.com/v0.5/runninglocks.php').then((res) => {
                  // Update cached variable
                  if (res.successful) {
                    // Store last fetch time to not poll too frequently
                    BdApi.saveData(this.getName(), 'runningLocksCacheTimestamp', Date.now())
                    runningLocksCache = res.data.locks.filter((u) => u.discordID !== '')
                    BdApi.showToast(`ChastiKey Running Locks Cache Reloaded! (${runningLocksCache.length})`, {
                      type: 'success'
                    })
                  } else {
                    BdApi.showToast('ChastiKey Running Locks Cache Not Reloaded!', {
                      type: 'error'
                    })
                  }
                })
              } else {
                BdApi.showToast(`ChastiKey Running Locks Cache Already loaded! Size = ${runningLocksCache.length}`, {
                  type: 'info'
                })
              }
            }

            onStop() {
              PluginUtilities.removeStyle(this.short)
              // Clear CK Tags
              this.clearTags()
              Logger.log('Stopped')
            }

            onSwitch() {
              for (const node of document.querySelectorAll(`.${MessageClasses.groupStart.split(' ')[0]}`)) this.processNode(node)
            }

            // ? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            // ? Helper Methods
            // ? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            /**
             * @name safelyGetNestedProps
             * @author Zerebos
             */
            getProps(obj, path) {
              return path.split(/\s?\.\s?/).reduce((obj, prop) => obj && obj[prop], obj)
            }

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
                username: lock.username,
                discordID: lock.discordID,
                lockGroupID: lock.lockGroupID,
                lockID: lock.lockID,
                lockedBy: lock.lockedBy,
                lockName: lock.lockName,
                sharedLockID: lock.sharedLockID,
                sharedLockQRCode: lock.sharedLockQRCode,
                sharedLockURL: lock.sharedLockURL,
                cardInfoHidden: lock.cardInfoHidden,
                cumulative: lock.cumulative,
                doubleUpCards: lock.doubleUpCards,
                fixed: lock.fixed,
                freezeCards: lock.freezeCards,
                greenCards: lock.greenCards,
                greenCardsPicked: lock.greenCardsPicked,
                lockFrozen: lock.lockFrozen,
                lockFrozenByCard: lock.lockFrozenByCard,
                lockFrozenByKeyholder: lock.lockFrozenByKeyholder,
                logID: lock.logID,
                multipleGreensRequired: lock.multipleGreensRequired,
                noOfTimesCardReset: lock.noOfTimesCardReset,
                noOfTimesFullReset: lock.noOfTimesFullReset,
                noOfTurns: lock.noOfTurns,
                redCards: lock.redCards,
                regularity: lock.regularity,
                resetCards: lock.resetCards,
                status: lock.status,
                stickyCards: lock.stickyCards,
                timerHidden: lock.timerHidden,
                timestampExpectedUnlock: lock.timestampExpectedUnlock,
                timestampFrozenByCard: lock.timestampFrozenByCard,
                timestampFrozenByKeyholder: lock.timestampFrozenByKeyholder,
                timestampLastCardReset: lock.timestampLastCardReset,
                timestampLastFullReset: lock.timestampLastFullReset,
                timestampLastPicked: lock.timestampLastPicked,
                timestampLocked: lock.timestampLocked,
                timestampNextPick: lock.timestampNextPick,
                timestampRealLastPicked: lock.timestampRealLastPicked,
                totalTimeFrozen: lock.totalTimeFrozen,
                trustKeyholder: lock.trustKeyholder,
                yellowCards: lock.yellowCards
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
              const panel = this.buildSettingsPanel()
              // panel.append(
              //   this.buildSetting({
              //     type: "switch",
              //     id: "otherOverride",
              //     name: "A second override?!",
              //     note: "wtf is happening here",
              //     value: true,
              //     onChange: (value) => (this.settings["otherOverride"] = value),
              //   })
              // );
              return panel.getElement()
            }

            observer({ addedNodes }) {
              for (const node of addedNodes.values()) {
                if (!node) continue
                if (node.classList && node.classList.contains(MessageClasses.groupStart.split(' ')[0])) {
                  this.processNode(node)
                }
              }
            }

            processNode(node) {
              // Skip if already rendered on this node
              if (node.querySelectorAll('.cktag').length) {
                // Logger.log('Skip as something is already here!')
                return
              }

              // Prepare items to append
              var toAppend = []

              const instance = ReactTools.getReactInstance(node)
              if (!instance) return

              const props = this.getProps(instance, 'memoizedProps.children.0.props.children.1.props')

              if (!props || !this.getProps(props, 'message')) return

              // Get Message Author for the ID to check if they're cached
              const {
                message: { author }
              } = props

              // Is user cached and has a discord id?
              const user = this.getUser(author.id)
              if (!user) return // Stop here

              // Logger.log(`isVerified = ${true} :: username: ${user.username},`)

              // Look for user in running locks
              const runningLocks = this.getLocks(author.id)
              const hasRunningLock = runningLocks.length > 0

              // Get Username element to append to
              const username = node.querySelector(`.${MessageClasses.username.split(' ')[0]}`)

              // When verified
              const verifiedTag = this.createTag('✓ CK Verified', 'verified')
              verifiedTag.classList.add('before')
              toAppend.push(verifiedTag)

              // Cumulative Time Locked
              if (user.totalNoOfCompletedLocks !== 0 && (user.mainRole !== 'Lockee' || user.mainRole !== '')) {
                const totalTimeLocked = this.createTag(`🔒 ${user._totalTimeLocked} mo.`, 'totalTimeLocked')
                totalTimeLocked.classList.add('before')
                toAppend.push(totalTimeLocked)
              }

              // When there's an active lock, show Keyholder(s)
              if (hasRunningLock) {
                // Get an array of just keyholder names
                const keyholders = this.removeDupsFromArray(runningLocks.map((lock) => (lock.lockedBy === '' ? 'Self Locked' : lock.lockedBy)))
                keyholders.reverse()

                // When there's only <=3 KH
                // if (keyholders.length <= 3) {
                const maxKHs = keyholders.length <= 3 ? keyholders.length : 3
                for (let index = 0; index < maxKHs; index++) {
                  const kh = keyholders[index]
                  // Find the keyholder
                  const keyholderFromUsersCache = usersCache.find((u) => u.username === kh)
                  const keyholderTag = this.createTag(kh, 'keyholder')

                  // Add KH Level, if one
                  if (keyholderFromUsersCache) {
                    keyholderTag.classList.add(`keyholder-level-${keyholderFromUsersCache.keyholderLevel}`)
                  }

                  keyholderTag.classList.add('before')
                  toAppend.push(keyholderTag)
                }
              }
              // When there's >3 KH
              // else {
              // const keyholderTag = this.createTag(`Multiple Keyholders`, 'keyholder')
              // keyholderTag.classList.add('before')
              // toAppend.push(keyholderTag)
              // }
              // }

              // Append all tags
              // Logger.log(`Appending [${toAppend.length}] to username`)
              toAppend.reverse()
              toAppend.forEach((tag) => {
                username.insertAdjacentElement('afterend', tag)
              })
            }
          }
        }
        return plugin(Plugin, Api)
      })(global.ZeresPluginLibrary.buildPlugin(config))
})()
/*@end@*/
