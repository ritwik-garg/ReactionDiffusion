const { app, BrowserWindow } = require('electron')
  
let win
  
function createWindow () {
    win = new BrowserWindow({ width: 200, height: 200, useContentSize: true })
    win.loadFile(__dirname + '/index.html')
    win.on('closed', () => {
      win = null
    })
}
  
app.on('ready', createWindow)
  
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
})
  
app.on('activate', () => {
    if (win === null) {
      createWindow()
    }
})