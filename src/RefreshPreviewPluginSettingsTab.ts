import { PluginSettingTab } from "obsidian";
import type RefreshPreviewPlugin from "./RefreshPreviewPlugin.ts";

export default class RefreshPreviewPluginSettingsTab extends PluginSettingTab {
  public override plugin: RefreshPreviewPlugin;

  public constructor(plugin: RefreshPreviewPlugin) {
    super(plugin.app, plugin);
    this.plugin = plugin;
  }

  public override display(): void {
    this.containerEl.empty();
    this.containerEl.createEl("h2", { text: "Refresh Preview" });

    const settings = this.plugin.settings;
  }
}
