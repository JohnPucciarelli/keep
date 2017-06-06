'use strict'
const ipc = require('electron').ipcRenderer

const platform = process.platform;

function isKeep () {
  return window.location.hostname === 'keep.google.com'
}

function injectCss (rule) {
  document.styleSheets[0].insertRule(rule, 0)
}

function handleDOMLoaded () {
  if (!isKeep()) return

  if (platform === 'darwin' || platform === 'linux') {
    injectCss(`
      #ognwrapper {
        -webkit-app-region: drag;
      }
    `)

    injectCss(`
      #ognwrapper form,
      #ognwrapper [role="menu"],
      #ognwrapper [role="button"] {
        -webkit-app-region: no-drag;
      }
    `)
  }

  injectCss(`
    ::-webkit-scrollbar {
      display: none !important;
    }
  `)

  injectCss(`
    #ognwrapper .gb_1d {
      display: none !important;
    }
  `)
}

function handleClick (event) {
  const node = event.target

  if (node.nodeName === 'A' && node.target === '_blank') {
    event.preventDefault()
    ipc.send('clicklink', node.href)
  }
}

function handleNavigate (event, hash) {
  window.location.hash = hash
}

window.addEventListener('DOMContentLoaded', handleDOMLoaded, false)
window.addEventListener('click', handleClick, false)
ipc.on('navigate', handleNavigate)
