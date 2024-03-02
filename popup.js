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

  // Set the initial state of the extension switch and checkboxes
  chrome.storage.sync.get(['isEnabled', 'isEnabledStreamVods', 'isEnabledScheduledStreams', 'isEnabledWatchedVideos'], function (data) {
    toggleExtension.checked = data.isEnabled;
    toggleStreamVods.checked = data.isEnabledStreamVods;
    toggleScheduledStreams.checked = data.isEnabledScheduledStreams;
    toggleWatchedVideos.checked = data.isEnabledWatchedVideos;
  });
});
