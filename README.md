# electron-vue-ssh-auto-login

> 一个利用electron-vue构建的mac deskstop app，用于记录ssh 登录主机以及密码。
# 原理
 把所有用户名密码存放在~/.sshautologin/config.json,登录时，执行~/.sshautologin/sshautologin.sh下的脚本。用于登录

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


# lint all JS/Vue component files in `src/`
npm run lint

# pack to dmg
electron-installer-dmg build/sshautologin-darwin-x64/sshautologin.app sshautologin

```
---

