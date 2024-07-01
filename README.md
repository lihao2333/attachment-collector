# AttachmentCollector Plugin for Obsidian

The AttachmentCollector plugin for Obsidian helps you manage your file attachments more efficiently by automatically moving all referenced attachments into a specified directory at the file level. This plugin is especially useful for users who handle numerous attachments and wish to keep their workspace organized.

## Installation

Follow these steps to install the AttachmentCollector plugin:

1. Navigate to your Obsidian plugins directory:

```bash
bash cd ~/.obsidian/plugins
```

2. Clone the repository:
```bash
bash git clone git@github.com:lihao2333/attachment-collector.git
```

3. In Obsidian, open `Settings` -> `Community Plugins`.

4. Click `Reload Plugins` to refresh the plugin list.

5. Find `AttachmentCollector` in the list and toggle it on to enable the plugin.

## Configuration

Once the plugin is installed and enabled, you can customize the name of the folder where attachments will be stored:

- Open the `Settings` menu in Obsidian.
- Navigate to `Plugin Options` and select `AttachmentCollector`.
- Here, you can set the `Attachments Folder Name` to your preferred directory name.

## Usage

To use the AttachmentCollector plugin:

1. Open the file from which you want to collect attachments.
2. Execute the command `Collect Attachments` by opening the command palette (`Ctrl/Cmd + P`) and typing the command name.
3. The plugin will automatically move all referenced attachments (such as images and videos) into the specified folder at the file level.

## Features

- **Automatic Organization**: Moves all referenced attachments to a specified directory, keeping your notes and attachments organized.
- **Customizable Folder Name**: Allows you to specify the name of the folder where attachments will be stored, directly from the plugin settings.
- **Support for Multiple File Types**: Automatically handles attachments with extensions like `.mp4`, `.jpg`, and `.png`.

## Support

For support, issues, or feature requests, please visit the [GitHub repository](https://github.com/lihao2333/attachment-collector) and open an issue.

