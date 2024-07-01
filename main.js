const { Plugin, PluginSettingTab, Setting } = require('obsidian');

module.exports = class MyPlugin extends Plugin {
    async onload() {
        console.log('Loading MyPlugin');
        await this.loadSettings();

        this.addCommand({
            id: 'collect-attachments',
            name: 'Collect Attachments',
            callback: () => {
                this.collectAttachments();
            }
        });

        this.addSettingTab(new SettingTab(this.app, this));
    }

    onunload() {
        console.log('Unloading MyPlugin');
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async collectAttachments() {
        const { Notice, TFile } = require('obsidian');

        const activeFile = this.app.workspace.getActiveFile();
        if (!activeFile) {
            new Notice('No active file.');
            return;
        }

        const attachmentsFolderPath = `${activeFile.parent.path}/${this.settings.attachmentsFolderName}`;
        console.log(`Creating attachments folder at: ${attachmentsFolderPath}`);
        await this.app.vault.createFolder(attachmentsFolderPath).catch(() => {
            console.log('Attachments folder already exists.');
        });

        const fileContent = await this.app.vault.read(activeFile);
        const attachmentPaths = this.extractAttachmentPaths(fileContent);

        console.log(`Found ${attachmentPaths.length} attachments in the file.`);
        for (const attachmentPath of attachmentPaths) {
            const attachment = this.getAttachment(attachmentPath, this.app);
            if (attachment instanceof TFile) {
                const newFilePath = `${attachmentsFolderPath}/${attachment.name}`;
                console.log(`Moving ${attachment.path} to ${newFilePath}`);
                await this.app.vault.rename(attachment, newFilePath).catch(err => {
                    console.error(`Failed to move ${attachment.path} to ${newFilePath}:`, err);
                });
            } else {
                console.warn(`Attachment not found: ${attachmentPath}`);
            }
        }

        new Notice('Attachments moved to attachments folder.');
    }

    extractAttachmentPaths(content) {
        const attachmentPaths = [];
        const extensionsRegex = this.settings.fileExtensions.join('|');
        const markdownLinkRegex = new RegExp(`\\[\\[([^\\]]+\\.(${extensionsRegex}))\\]\\]`, 'g');
        let match;
        while ((match = markdownLinkRegex.exec(content)) !== null) {
            let attachmentPath = match[1];
            attachmentPaths.push(attachmentPath);
        }
        return attachmentPaths;
    }

    getAttachment(attachmentName, app) {
        const { parseLinktext } = require('obsidian');
        const file_path = parseLinktext(attachmentName.replace(/(\.\/)|(\.\.\/)+/g, "")).path;
        let attachmentFile = app.vault.getAbstractFileByPath(file_path);
        if (!attachmentFile) {
            attachmentFile = app.metadataCache.getFirstLinkpathDest(file_path, file_path);
        }
        return attachmentFile;
    }
};

class SettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('h2', { text: 'MyPlugin Settings' });

        containerEl.createEl('h3', { text: 'Attachments Folder Name' });
        new Setting(containerEl)
            .setName('Attachments Folder Name')
            .setDesc('Folder name where attachments will be stored.')
            .addText(text => text
                .setPlaceholder('Enter folder name')
                .setValue(this.plugin.settings.attachmentsFolderName)
                .onChange(async (value) => {
                    this.plugin.settings.attachmentsFolderName = value;
                    await this.plugin.saveSettings();
                }));

        containerEl.createEl('h3', { text: 'File Extensions' });
        new Setting(containerEl)
            .setName('File Extensions')
            .setDesc('File extensions to be considered as attachments.')
            .addText(text => text
                .setPlaceholder('Enter extensions separated by commas')
                .setValue(this.plugin.settings.fileExtensions.join(', '))
                .onChange(async (value) => {
                    this.plugin.settings.fileExtensions = value.split(',').map(ext => ext.trim());
                    await this.plugin.saveSettings();
                }));
    }
};

const DEFAULT_SETTINGS = {
    attachmentsFolderName: 'attachments',
    fileExtensions: ['mp4', 'jpg', 'png']
};
