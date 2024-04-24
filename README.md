# websocket-text-relay-vscode

websocket-text-relay-vscode is a vscode extension designed to enhance your live coding experience by leveraging the power of WebSockets and the Language Server Protocol (LSP).
This tool watches for changes to your files and seamlessly relays these updates to the frontend client.
With websocket-text-relay-vscode, you can see your code changes reflected live, without the need to save or refresh your browser.

This repo contains just the vscode client. The server implementation can be found in the [websocket-text-relay repo](https://github.com/niels4/websocket-text-relay)

## Install Extension

Search for "websocket-text-relay" in the vscode extension marketplace or checkout the repo and generate the vsix file yourself using [vsce](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#vsce)

## Usage

Verify the plugin is working by viewing the status UI hosted at [http://localhost:38378](http://localhost:38378)

After installation, continue with step 2 in the [websocket-text-relay README](https://github.com/niels4/websocket-text-relay)
to connect your editor to a front end client and see your updates rendered as you type.

## settings

### allowNetworkAccess

By default, the http and websocket server will only accept incoming connections from your local machine. If you
wish to allow network access you must set the `websocketTextRelay.allowNetworkAccess` setting to true.

### allowedHosts

By default, the http and websocket server will only accept connections where the hostname is `localhost`. If you wish
to allow other hosts to connect to the websocket server, you must explicitly allow them using the `websocketTextRelay.allowedHosts` setting.

### developer

You can override the command used to start the language server using the `websocketTextRelay.developer.serverCommand` and `websocketTextRelay.developer.serverCommandArgs` settings. This is useful for local
development and debugging the application using the chrome debugger. See the [develoeprs guide](https://github.com/niels4/websocket-text-relay/blob/main/docs/dev-getting-started.md) for more information.

## License

websocket-text-relay-vscode is released under the [MIT License](LICENSE).
