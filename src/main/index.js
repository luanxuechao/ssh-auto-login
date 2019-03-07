'use strict'

import { app, Tray, Menu } from 'electron'
import fs from 'fs'
import path from 'path'
import { connect } from './click'
import os from 'os'
import StaticVariable from './conf'
const confPath = path.join(os.homedir(), '/' + StaticVariable.dirName + '/' + StaticVariable.configName)
const shellPath = path.join(os.homedir(), '/' + StaticVariable.dirName + '/' + StaticVariable.shellName)
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let tray
function createWindow () {
  /**
   * Initial window options
   */
  isMkdir()
  let menu = setMenu()
  tray = new Tray(path.join(__static, '/icon/ssh.png'))
  const contextMenu = Menu.buildFromTemplate(menu)
  tray.setToolTip('just a ssh auto login tools')
  tray.setContextMenu(contextMenu)
}

function isMkdir () {
  if (!fs.existsSync(path.join(os.homedir(), '/' + StaticVariable.dirName))) {
    fs.mkdirSync(path.join(os.homedir(), '/' + StaticVariable.dirName))
  }
  if (!fs.existsSync(path.join(os.homedir(), '/' + StaticVariable.dirName + '/' + StaticVariable.shellName))) {
    fs.copyFileSync(path.join(__static, '/' + StaticVariable.dirName + '/' + StaticVariable.shellName), shellPath)
  }
  if (!fs.existsSync(path.join(os.homedir(), '/' + StaticVariable.dirName + '/' + StaticVariable.configName))) {
    fs.copyFileSync(path.join(__static, '/' + StaticVariable.dirName + '/' + StaticVariable.configName), confPath)
  }
}

function refresh () {
  let menu = setMenu()
  const contextMenu = Menu.buildFromTemplate(menu)
  tray.setContextMenu(contextMenu)
}
function setMenu () {
  let conf = JSON.parse(fs.readFileSync(confPath, 'utf8'))
  let menu = [
    { label: '示例连接', enabled: false, type: 'normal' },
    { label: '', type: 'separator' },
    { label: '刷新', type: 'normal', click: refresh },
    { label: '退出', type: 'normal' }
  ]
  for (let key in conf) {
    let submenu = {label: key, type: 'normal'}
    let isChildmenu = JSON.stringify(conf[key]) === '{}'
    if (isChildmenu) {
      continue
    } else {
      submenu.type = 'submenu'
      submenu.submenu = []
      for (let child in conf[key]) {
        let childMenu = {label: child, type: 'normal', sublabel: key, click: connect}
        submenu.submenu.push(childMenu)
      }
    }
    menu.splice(1, 0, submenu)
  };
  return menu
}
app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
