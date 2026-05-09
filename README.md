# websocket-text-relay-vscode

`websocket-text-relay-vscode` is a vscode extension designed to enhance your live coding experience by leveraging the power of WebSockets and the Language Server Protocol (LSP).

This tool watches for changes to your files and seamlessly relays these updates to the frontend client.
With websocket-text-relay-vscode, you can see your code changes reflected live, without the need to save or refresh your browser.

This repo contains just the vscode client. The server implementation can be found in the [websocket-text-relay repo](https://github.com/niels4/websocket-text-relay)

## Install Extension

Search for "niels4" in the vscode extension marketplace or checkout the repo and generate the vsix file yourself using [vsce](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#vsce)

## Usage

Once the plugin is installed, enable it with the `Websocket Text Relay: Toggle` command.

Verify the plugin is working by viewing the status UI hosted at [http://localhost:38378](http://localhost:38378)

Test your setup is working with a simple vanillajs app: [github.com/niels4/live-demo-vanillajs](https://github.com/niels4/live-demo-vanillajs)

```sh
git clone https://github.com/niels4/live-demo-vanillajs.git
cd live-demo-vanillajs
npx serve
```
If you use `npx serve`, the url:port will be copied to your clipboard. Just open a browser and paste the location.

Now open up vscode, enable WTR with your hotkey or the `Websocket Text Relay: Toggle` command. Start editing the h1 tag in `live-pages/main.html`. You should see the text in the header update instantly.

Open `live-pages/main.css`, edit the `hsl` values that define the color for the h1 tag. You should see the color of the header change instantly.

Visit [niels4/websocket-text-relay](https://github.com/niels4/websocket-text-relay) for more information on usage and development.

### Disable / Enable / Toggle WebSocket Text Relay

**Command:** `websocketTextRelay.<disable | enable | toggle>`

**Description:** Disables / Enables / Toggles the WebSocket text relay functionality.

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
2. Search for `Websocket Text Relay: <Disable | Enable | Toggle>`.
3. Press `Enter`.

### Keybindings

For quicker access, you can add custom keybindings for these commands. Here is an example of how to set up keybindings in your `keybindings.json` file:

```json
[
  {
    "key": "alt+w",
    "command": "websocketTextRelay.toggle",
    "when": "editorTextFocus"
  }
]
```

## settings

### allowNetworkAccess

By default, the http and websocket server will only accept incoming connections from your local machine. If you
wish to allow network access you must set the `websocketTextRelay.allowNetworkAccess` setting to true.

### allowedHosts

By default, the http and websocket server will only accept connections where the hostname is `localhost`. If you wish
to allow other hosts to connect to the websocket server, you must explicitly allow them using the `websocketTextRelay.allowedHosts` setting.

### updatesPerSecond

You can use the `websocketTextRelay.updatesPerSecond` option to override the default update rate of the LSP client.

### developer

You can override the command used to start the language server using the `websocketTextRelay.developer.serverCommand` and `websocketTextRelay.developer.serverCommandArgs` settings. This is useful for local
development and debugging the application using the chrome debugger. See the [developer's guide](https://github.com/niels4/websocket-text-relay/blob/main/docs/dev-getting-started.md) for more information.

## License

websocket-text-relay-vscode is released under the [MIT License](LICENSE).
