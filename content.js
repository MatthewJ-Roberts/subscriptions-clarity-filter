function hideStreamVods() {
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

function getTitle(item) {
  // Get the <yt-formatted-string> element
  let titleData = item.querySelector(
    'ytd-rich-item-renderer yt-formatted-string#video-title'
  );

  // Get the value of the aria-label attribute
  let title = titleData.getAttribute('aria-label');
  return title;
}

// Removes video
function removeVideo(item, message) {
  let videoItem = item.closest('ytd-rich-item-renderer');
  if (videoItem) {
    videoItem.remove();
    console.log(`Removed ${message} video: \n${getTitle(videoItem)}\n\n`);
  }
}

// Handles whether or not the extension should hide videos
function extensionHandler() {
  chrome.storage.sync.get('isEnabled', function (data) {
    if (data.isEnabled) {
      const currentUrl = window.location.href;
      // Prevents the extension from running when on any page other than Subscriptions
      if (!currentUrl.includes('/subscriptions')) {
        return;
      }
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
}

// Execute the function immediately
extensionHandler();

// Observe changes in the DOM to trigger the function when new videos are loaded (scrolling through subscriptions)
const observer = new MutationObserver(function () {
  extensionHandler();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
