// main.js
const { parseLinktext } = require('obsidian');

module.exports = class MyPlugin extends require('obsidian').Plugin {
    async onload() {
        console.log('Loading MyPlugin');

        // 添加命令
        this.addCommand({
            id: 'move-attachments',
            name: 'Move Attachments',
            callback: () => {
                this.moveAttachments();
            }
        });
    }

    onunload() {
        console.log('Unloading MyPlugin');
    }

    async moveAttachments() {
        const { Notice, TFile } = require('obsidian');

        const activeFile = this.app.workspace.getActiveFile();
        if (!activeFile) {
            new Notice('No active file.');
            return;
        }

        const attachmentsFolderPath = `${activeFile.parent.path}/attachments`;
        console.log(`Creating attachments folder at: ${attachmentsFolderPath}`);
        await this.app.vault.createFolder(attachmentsFolderPath).catch(() => {
            // Folder already exists
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
        const markdownLinkRegex = /!\[\[([^\]]+)\]\]/g;
        let match;
        while ((match = markdownLinkRegex.exec(content)) !== null) {
            let attachmentPath = match[1];
            attachmentPaths.push(attachmentPath);
        }
        return attachmentPaths;
    }

    getAttachment(attachmentName, app) {
        const file_path = parseLinktext(attachmentName.replace(/(\.\/)|(\.\.\/)+/g, "")).path;
        let attachmentFile = app.vault.getAbstractFileByPath(file_path);
        if (!attachmentFile) {
            attachmentFile = app.metadataCache.getFirstLinkpathDest(file_path, file_path);
        }
        return attachmentFile;
    }
};
