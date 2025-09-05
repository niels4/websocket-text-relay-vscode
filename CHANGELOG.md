# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-09-05

### Added

- New setting `websocketTextRelay.updatesPerSecond` to override the default LSP client update rate

### Changed

- Updated dependencies

## [1.1.0] - 2024-05-29

### Added

- New setting `websocketTextRelay.enabled` to enable or disable sending any text updates.
- Commands `websocketTextRelay.enable`, `websocketTextRelay.disable`, and `websocketTextRelay.toggle` to manage the `websocketTextRelay.enabled` setting.

## [1.0.0] - 2024-04-24

### Added

- Initial release of the Websocket Text Relay extension.
- Basic functionality for enabling real-time text updates via a WebSocket server.
- Configuration settings for `websocketTextRelay.allowNetworkAccess`, `websocketTextRelay.allowedHosts`, `websocketTextRelay.developer.serverCommand`, and `websocketTextRelay.developer.serverCommandArgs`.
