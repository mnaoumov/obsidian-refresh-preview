export default class RefreshPreviewPluginSettings {
  public static load(value: unknown): RefreshPreviewPluginSettings {
    if (!value) {
      return new RefreshPreviewPluginSettings();
    }

    return value as RefreshPreviewPluginSettings;
  }

  public static clone(settings?: RefreshPreviewPluginSettings): RefreshPreviewPluginSettings {
    return Object.assign(new RefreshPreviewPluginSettings(), settings);
  }
}
