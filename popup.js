document.addEventListener('DOMContentLoaded', function () {
  const toggleExtension = document.getElementById('toggleExtension');
  const toggleStreamVods = document.getElementById('toggleStreamVods');
  const toggleScheduledStreams = document.getElementById('toggleScheduledStreams');
  const toggleWatchedVideos = document.getElementById('toggleWatchedVideos');

  toggleExtension.addEventListener('change', function () {
    // Save the enable/disable state of the extension
    chrome.storage.sync.set({ 'isEnabled': toggleExtension.checked });
  });

  toggleStreamVods.addEventListener('change', function () {
    // Save the enable/disable state of the stream vods feature
    chrome.storage.sync.set({ 'isEnabledStreamVods': toggleStreamVods.checked });
  });

  toggleScheduledStreams.addEventListener('change', function () {
    // Save the enable/disable state of the scheduled streams feature
    chrome.storage.sync.set({ 'isEnabledScheduledStreams': toggleScheduledStreams.checked });
  });

  toggleWatchedVideos.addEventListener('change', function () {
    // Save the enable/disable state of the watched videos feature
    chrome.storage.sync.set({ 'isEnabledWatchedVideos': toggleWatchedVideos.checked });
  });

  // Fetches the state of the checkboxes when the user opens the extension
  chrome.storage.sync.get(['isEnabled', 'isEnabledStreamVods', 'isEnabledScheduledStreams', 'isEnabledWatchedVideos'], function (data) {
    // This conditional is used so that the state of the checkboxes is checked after the user installs the extension, while
    // still allowing the user to check/uncheck the checkboxes themselves
    toggleExtension.checked = data.isEnabled !== false;
    toggleStreamVods.checked = data.isEnabledStreamVods !== false;
    toggleScheduledStreams.checked = data.isEnabledScheduledStreams !== false;
    toggleWatchedVideos.checked = data.isEnabledWatchedVideos !== false;
  });
});
