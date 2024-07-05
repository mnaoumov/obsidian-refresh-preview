import {
  MarkdownView,
  Plugin,
  setIcon
} from "obsidian";

export default class RefreshPreviewPlugin extends Plugin {
  public override onload(): void {
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

  private onLayoutReady(): void {
    this.addRefreshPreviewButton();
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

    actionsContainer.prepend(refreshPreviewButton);

    this.register(() => {
      if (actionsContainer.contains(refreshPreviewButton)) {
        actionsContainer.removeChild(refreshPreviewButton);
      }
    });
  }
}
