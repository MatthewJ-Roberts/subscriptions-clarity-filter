function hideStreamVods() {
  console.log('Filtering Stream Vods:');
  const oldStreams = document.querySelectorAll(
    'span.inline-metadata-item.style-scope.ytd-video-meta-block'
  );

  // Removes stream vods
  oldStreams.forEach((item) => {
    const textContent = item.textContent.trim();
    if (textContent.includes('Streamed')) {
      removeVideo(item, 'streamed');
    }
  });
}

function hideScheduledStreams() {
  console.log('Filtering Scheduled Streams:');
  const oldStreams = document.querySelectorAll(
    'span.inline-metadata-item.style-scope.ytd-video-meta-block'
  );

  // Removes scheduled streams
  oldStreams.forEach((item) => {
    const textContent = item.textContent.trim();
    if (textContent.includes('Scheduled')) {
      removeVideo(item, 'scheduled');
    }
  });
}

function hideWatchedVideos() {
  console.log('Filtering Watched Videos:');
  const watchedVideos = document.querySelectorAll(
    'div#progress.style-scope.ytd-thumbnail-overlay-resume-playback-renderer'
  );

  // Removes previously watched videos
  watchedVideos.forEach((item) => {
    if (item.style.width && parseFloat(item.style.width) >= 90) {
      removeVideo(item, 'watched');
    }
  });
}

// Removes video
function removeVideo(item, message) {
  console.log('using new function');
  let videoItem = item.closest('ytd-rich-item-renderer');
  if (videoItem) {
    videoItem.remove();
    console.log(`Removed ${message} video: `, videoItem);
  }
}

// Execute the function immediately
chrome.storage.sync.get('isEnabled', function (data) {
  if (data.isEnabled) {
    chrome.storage.sync.get('isEnabledStreamVods', function (data) {
      if (data.isEnabledStreamVods) {
        hideStreamVods();
      }
    });
    chrome.storage.sync.get('isEnabledScheduledStreams', function (data) {
      if (data.isEnabledScheduledStreams) {
        hideScheduledStreams();
      }
    });
    chrome.storage.sync.get('isEnabledWatchedVideos', function (data) {
      if (data.isEnabledWatchedVideos) {
        hideWatchedVideos();
      }
    });
  }
});

// Observe changes in the DOM to trigger the function when new videos are loaded (scrolling through subscriptions)
const observer = new MutationObserver(function () {
  chrome.storage.sync.get('isEnabled', function (data) {
    if (data.isEnabled) {
      chrome.storage.sync.get('isEnabledStreamVods', function (data) {
        if (data.isEnabledStreamVods) {
          hideStreamVods();
        }
      });
      chrome.storage.sync.get('isEnabledScheduledStreams', function (data) {
        if (data.isEnabledScheduledStreams) {
          hideScheduledStreams();
        }
      });
      chrome.storage.sync.get('isEnabledWatchedVideos', function (data) {
        if (data.isEnabledWatchedVideos) {
          hideWatchedVideos();
        }
      });
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
