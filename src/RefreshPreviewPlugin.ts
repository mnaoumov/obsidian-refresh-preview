import { Plugin } from "obsidian";
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
}
