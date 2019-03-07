
'use strict'
const fs = require('fs')
const path = require('path')
const { BrowserWindow } = require('electron')
const shell = require('shelljs')
const { exec } = require('child_process')
const os = require('os')
const StaticVariable = require('./conf')
const confPath = path.join(os.homedir(), '/' + StaticVariable.dirName + '/' + StaticVariable.configName)
const shellPath = path.join(os.homedir(), '/' + StaticVariable.dirName + '/' + StaticVariable.shellName)
module.exports = {
  edit: function (menuItem, browserWindow, event) {
    let mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    })
    mainWindow.loadFile('index.html')

    mainWindow.on('closed', function () {
      mainWindow = null
    })
  },
  connect: function (menuItem) {
    let conf = JSON.parse(fs.readFileSync(confPath, 'utf8'))
    let username, host, password, port
    username = conf[menuItem.sublabel][menuItem.label]['username']
    host = conf[menuItem.sublabel][menuItem.label]['host']
    password = conf[menuItem.sublabel][menuItem.label]['password']
    port = conf[menuItem.sublabel][menuItem.label]['port']
    shell.chmod('+x', shellPath)
    shell.sed('-i', /set sshHost.*/, `set sshHost "${username}@${host}"`, shellPath)
    shell.sed('-i', /set password.*/, `set password "${password}"`, shellPath)
    shell.sed('-i', /set port.*/, `set port  ${port}`, shellPath)
    module.exports.openTab('sh -c ' + shellPath)
  },

  openTab: function openTab (cmd) {
    if (os.platform() !== 'darwin') {
      throw new Error('No support for this operating system but feel free to fork the repo and add it :)')
    }
    let open = ['osascript -e \'tell application "Terminal" to activate\' ',
      '-e \'tell application "Terminal" to do script',
      '"', cmd, '"',
      'in selected tab of the front window\''].join('')
    exec(open)
  }

}
