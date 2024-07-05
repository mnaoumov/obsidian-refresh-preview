import {
  MarkdownView,
  Plugin
} from "obsidian";
import RefreshPreviewPluginSettings from "./RefreshPreviewPluginSettings.ts";
import RefreshPreviewPluginSettingsTab from "./RefreshPreviewPluginSettingsTab.ts";

export default class RefreshPreviewPlugin extends Plugin {
  private _settings!: RefreshPreviewPluginSettings;

  public get settings(): RefreshPreviewPluginSettings {
    return RefreshPreviewPluginSettings.clone(this._settings);
  }

  public override async onload(): Promise<void> {
    await this.loadSettings();
    this.addSettingTab(new RefreshPreviewPluginSettingsTab(this));
    this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));
    this.addCommand({
      id: "refresh-preview",
      name: "Refresh Preview",
      checkCallback: this.refreshPreview.bind(this),
    });
  }

  public async saveSettings(newSettings: RefreshPreviewPluginSettings): Promise<void> {
    this._settings = RefreshPreviewPluginSettings.clone(newSettings);
    await this.saveData(this._settings);
  }

  private async onLayoutReady(): Promise<void> {
  }

  private async loadSettings(): Promise<void> {
    this._settings = RefreshPreviewPluginSettings.load(await this.loadData());
  }

  private refreshPreview(checking: boolean): boolean {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (view?.getMode() !== "preview") {
      return false;
    }

    if (!checking) {
      view.previewMode.rerender(true);
    }
    return true;
  }
}
