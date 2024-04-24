const vscode = require('vscode')
const { LanguageClient } = require("vscode-languageclient/node")

const registrationId = "websocket-text-relay"

let client = null

const docSelectorFromActiveFiles = (activeFiles) => {
  return activeFiles.map((file) => {
    return { scheme: 'file', path: file }
  })
}

const updateRegistrations = (client, activeFiles) => {
  const registerOptions = {
    syncKind: 1,
    documentSelector: docSelectorFromActiveFiles(activeFiles)
  }
  const optionsWrapper = { id: registrationId, registerOptions }
  const feature = client.getFeature("textDocument/didChange")
  feature.unregister(registrationId)
  feature.register(optionsWrapper)
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log(`${registrationId} extension is active.`)

  const serverModule = context.asAbsolutePath('server.js')
  const config = vscode.workspace.getConfiguration('websocketTextRelay')
  const allowNetworkAccess = config.get('allowNetworkAccess')
  const allowedHosts = config.get('allowedHosts')
  const serverCommand = config.get("developer.serverCommand")
  const serverCommandArgs = config.get("developer.serverCommandArgs")

  const serverOptions = {
    command: `node`,
    args: [serverModule]
  }

  if (serverCommand.length > 0) {
    serverOptions.command = serverCommand
    serverOptions.args = serverCommandArgs
  }

  let clientOptions = {
    synchronize: {
      textDocumentSync: 1
    },
    initializationOptions: {
      allowNetworkAccess,
      allowedHosts
    }
  }

  client = new LanguageClient(
    registrationId,
    registrationId,
    serverOptions,
    clientOptions
  )

  client.start()

  const updateOpenFiles = () => {
    const files = []
    vscode.workspace.textDocuments.forEach(d => {
      if (d.uri.scheme !== "file") { return }
      files.push(d.fileName)
    })
    client.sendNotification("wtr/update-open-files", { files })
  }

  let openDisposable = vscode.workspace.onDidOpenTextDocument(updateOpenFiles)
  let closeDisposable = vscode.workspace.onDidCloseTextDocument(updateOpenFiles)

  let onNotificationDisposable = client.onNotification("wtr/update-active-files", ({ files }) => {
    updateRegistrations(client, files)
  })

  context.subscriptions.push(openDisposable, closeDisposable, onNotificationDisposable)
}

function deactivate() {
  if (!client) { return }
  return client.stop()
}

module.exports = {
  activate,
  deactivate
}
