const vscode = require("vscode")
const { LanguageClient } = require("vscode-languageclient/node")

const registrationId = "websocket-text-relay"
const configPrefix = "websocketTextRelay"
const enabledProperty = "enabled"

let client = null

const docSelectorFromActiveFiles = (activeFiles) => {
  return activeFiles.map((file) => {
    return { scheme: "file", path: file }
  })
}

const updateRegistrations = (client, activeFiles) => {
  const registerOptions = {
    syncKind: 1,
    documentSelector: docSelectorFromActiveFiles(activeFiles),
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

  const serverModule = context.asAbsolutePath("server.js")
  const config = vscode.workspace.getConfiguration(configPrefix)
  const allowNetworkAccess = config.get("allowNetworkAccess")
  const allowedHosts = config.get("allowedHosts")
  const serverCommand = config.get("developer.serverCommand")
  const serverCommandArgs = config.get("developer.serverCommandArgs")
  let enabled = config.get(enabledProperty)

  const serverOptions = {
    command: `node`,
    args: [serverModule],
  }

  if (serverCommand.length > 0) {
    serverOptions.command = serverCommand
    serverOptions.args = serverCommandArgs
  }

  let clientOptions = {
    synchronize: {
      textDocumentSync: 1,
    },
    initializationOptions: {
      allowNetworkAccess,
      allowedHosts,
    },
  }

  client = new LanguageClient(
    registrationId,
    registrationId,
    serverOptions,
    clientOptions
  )

  client.start()

  const updateOpenFiles = () => {
    if (!enabled) {
      return
    }
    const files = []
    vscode.workspace.textDocuments.forEach((d) => {
      if (d.uri.scheme !== "file") {
        return
      }
      files.push(d.fileName)
    })
    client.sendNotification("wtr/update-open-files", { files })
  }

  let openDisposable = vscode.workspace.onDidOpenTextDocument(updateOpenFiles)
  let closeDisposable = vscode.workspace.onDidCloseTextDocument(updateOpenFiles)

  let onNotificationDisposable = client.onNotification(
    "wtr/update-active-files",
    ({ files }) => {
      updateRegistrations(client, files)
    }
  )

  // Subscribe to configuration changes
  const configChangeListener = vscode.workspace.onDidChangeConfiguration(
    (event) => {
      if (event.affectsConfiguration(`${configPrefix}.${enabledProperty}`)) {
        enabled = vscode.workspace
          .getConfiguration()
          .get(`${configPrefix}.${enabledProperty}`)
        if (enabled) {
          updateOpenFiles()
        } else {
          client.sendNotification("wtr/update-open-files", { files: [] })
        }
      }
    }
  )

  const enableCommand = vscode.commands.registerCommand(
    "websocketTextRelay.enable",
    () => {
      vscode.workspace
        .getConfiguration()
        .update(
          `${configPrefix}.${enabledProperty}`,
          true,
          vscode.ConfigurationTarget.Global
        )
      vscode.window.showInformationMessage("Websocket Text Relay enabled")
    }
  )

  const disableCommand = vscode.commands.registerCommand(
    "websocketTextRelay.disable",
    () => {
      vscode.workspace
        .getConfiguration()
        .update(
          `${configPrefix}.${enabledProperty}`,
          false,
          vscode.ConfigurationTarget.Global
        )
      vscode.window.showInformationMessage("Websocket Text Relay disabled")
    }
  )

  const toggleCommand = vscode.commands.registerCommand(
    "websocketTextRelay.toggle",
    () => {
      const currentValue = vscode.workspace
        .getConfiguration()
        .get(`${configPrefix}.${enabledProperty}`)
      const newValue = !currentValue
      vscode.workspace
        .getConfiguration()
        .update(
          `${configPrefix}.${enabledProperty}`,
          newValue,
          vscode.ConfigurationTarget.Global
        )
      vscode.window.showInformationMessage(
        `Websocket Text Relay ${newValue ? "enabled" : "disabled"}`
      )
    }
  )

  context.subscriptions.push(
    openDisposable,
    closeDisposable,
    onNotificationDisposable,
    configChangeListener,
    enableCommand,
    disableCommand,
    toggleCommand
  )
}

function deactivate() {
  if (!client) {
    return
  }
  return client.stop()
}

module.exports = {
  activate,
  deactivate,
}
