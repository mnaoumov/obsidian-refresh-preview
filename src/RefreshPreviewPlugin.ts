import {
  MarkdownView,
  Plugin,
  setIcon
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
      checkCallback: this.refreshPreview.bind(this)
    });

    this.registerEvent(
      this.app.workspace.on("layout-change", () => {
        this.addRefreshPreviewButton();
      })
    );
  }

  public async saveSettings(newSettings: RefreshPreviewPluginSettings): Promise<void> {
    this._settings = RefreshPreviewPluginSettings.clone(newSettings);
    await this.saveData(this._settings);
  }

  private async onLayoutReady(): Promise<void> {
    this.addRefreshPreviewButton();
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

  private addRefreshPreviewButton(): void {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) {
      return;
    }

    const actionsContainer = view.containerEl.querySelector(".view-header .view-actions");

    if (!actionsContainer) {
      return;
    }

    let refreshPreviewButton = actionsContainer.querySelector<HTMLButtonElement>(".refresh-preview-button");

    if (view.getMode() !== "preview") {
      if (refreshPreviewButton) {
        actionsContainer.removeChild(refreshPreviewButton);
      }
      return;
    }

    if (refreshPreviewButton) {
      return;
    }

    refreshPreviewButton = createEl("button", {
      cls: "refresh-preview-button clickable-icon view-action",
      onclick: () => this.refreshPreview(false)
    });
    setIcon(refreshPreviewButton, "refresh-cw");

    actionsContainer.prepend(refreshPreviewButton)

    this.register(() => {
      if (actionsContainer.contains(refreshPreviewButton)) {
        actionsContainer.removeChild(refreshPreviewButton);
      }
    });
  }
}
