function hideStreamVods() {
  const oldStreams = document.querySelectorAll(
    "#content > yt-lockup-view-model > div > div > yt-lockup-metadata-view-model > div.ytLockupMetadataViewModelTextContainer > div > yt-content-metadata-view-model > div:nth-child(2) > span:nth-child(3)"
  );

  const oldStreamsLegacy = document.querySelectorAll(
    'span.inline-metadata-item.style-scope.ytd-video-meta-block'
  );

  // Removes stream vods
  oldStreams.forEach((item) => {
    const textContent = item.textContent.trim();
    if (textContent.includes('Streamed')) {
      removeVideo(item, 'streamed');
    }
  });

  // Removes stream vods (legacy method)
  oldStreamsLegacy.forEach((item) => {
    const textContent = item.textContent.trim();
    if (textContent.includes('Streamed')) {
      removeVideo(item, 'streamed');
    }
  });
}

function hideScheduledStreams() {
  const scheduledStreams = document.querySelectorAll(
    "#content > yt-lockup-view-model > div > div > yt-lockup-metadata-view-model > div.ytLockupMetadataViewModelTextContainer > div > yt-content-metadata-view-model > div:nth-child(2) > span"
  );

  const scheduledStreamsLegacy = document.querySelectorAll(
    'span.inline-metadata-item.style-scope.ytd-video-meta-block'
  );

  // Removes scheduled streams
  scheduledStreams.forEach((item) => {
    const textContent = item.textContent.trim();
    if (textContent.includes('Scheduled')) {
      removeVideo(item, 'scheduled');
    }
  });

  // Removes scheduled streams (legacy method)
  scheduledStreamsLegacy.forEach((item) => {
    const textContent = item.textContent.trim();
    if (textContent.includes('Scheduled')) {
      removeVideo(item, 'scheduled');
    }
  });
}

function hideWatchedVideos() {
  const liveStream = document.querySelectorAll(
    "#content > yt-lockup-view-model > div > div > yt-lockup-metadata-view-model > div.yt-lockup-metadata-view-model__text-container > div > yt-content-metadata-view-model > div:nth-child(2) > span"
  )

  // Makes sure the watched video isn't a livestream
  liveStream.forEach((item) => {
    const textContent = item.textContent.trim();
    if (textContent.includes('watching')) {
      return
    }
  });

  const watchedVideos = document.querySelectorAll(
    "#content > yt-lockup-view-model > div > a > yt-thumbnail-view-model > yt-thumbnail-bottom-overlay-view-model > yt-thumbnail-overlay-progress-bar-view-model > div > div"
  );

  const watchedVideosLegacy = document.querySelectorAll(
    'div#progress.style-scope.ytd-thumbnail-overlay-resume-playback-renderer'
  );

  // Removes previously watched videos
  watchedVideos.forEach((item) => {
    if (item.style.width && parseFloat(item.style.width) >= 90) {
      removeVideo(item, 'watched');
    }
  });

  // Removes previously watched videos (legacy method)
  watchedVideosLegacy.forEach((item) => {
    if (item.style.width && parseFloat(item.style.width) >= 90) {
      removeVideo(item, 'watched');
    }
  });
}

function hideHomePageClutter() {
  // Selects EVERY rich-section-renderer on the page
  const sections = document.querySelectorAll('ytd-rich-section-renderer');
  if (sections.length > 0) {
    sections.forEach(section => section.remove());
    console.log(`🧹 Removed ${sections.length} clutter sections (ads, premium offers, explore topics, etc.)`);
  }
}

function hideMostRelevant() {
  // Find all rich-section-renderers on the subscriptions page
  const sections = document.querySelectorAll('ytd-rich-section-renderer');
  
  sections.forEach(section => {
    // Look for the "#title" element ONLY inside this specific section
    const titleElement = section.querySelector('#title');
    
    // Check if it exists and its text matches "Most relevant"
    if (titleElement && titleElement.textContent.trim() === 'Most relevant') {
      section.remove();
      console.log('🧹 Removed "Most relevant" section');
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
    if (!data.isEnabled) return;

    const currentUrl = window.location.href;
    const path = window.location.pathname;

    // Hide clutter sections on Home page and Subscriptions ---
    // Runs on the main root ("/")
    if ((path === '/')) {
      chrome.storage.sync.get('isEnabledClutter', function (clutterData) {
        if (clutterData.isEnabledClutter) {
          hideHomePageClutter();
        }
      });
    }

    // --- Existing logic: Hide Stream VODs, Scheduled, Watched ---
    // Only runs on the Subscriptions page
    if (currentUrl.includes('/subscriptions')) {
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
      chrome.storage.sync.get('isEnabledMostRelevant', function (data) {
        if (data.isEnabledMostRelevant) {
          hideMostRelevant();
        }
      });
    }
  });
}

// Check if the feature flags are undefined in the storage, setting them as "true"
chrome.storage.sync.get(['isEnabled', 'isEnabledStreamVods', 'isEnabledScheduledStreams', 'isEnabledWatchedVideos', 'isEnabledClutter'], function(data) {
  if (typeof data.isEnabled === 'undefined') {
      chrome.storage.sync.set({ isEnabled: true });
  }

  if (typeof data.isEnabledStreamVods === 'undefined') {
      chrome.storage.sync.set({ isEnabledStreamVods: true });
  }

  if (typeof data.isEnabledScheduledStreams === 'undefined') {
      chrome.storage.sync.set({ isEnabledScheduledStreams: true });
  }

  if (typeof data.isEnabledWatchedVideos === 'undefined') {
      chrome.storage.sync.set({ isEnabledWatchedVideos: true });
  }

  if (typeof data.isEnabledClutter === 'undefined') {
    chrome.storage.sync.set({ isEnabledClutter: true });
  }

  if (typeof data.isEnabledMostRelevant === 'undefined') {
  chrome.storage.sync.set({ isEnabledMostRelevant: true });
}
});

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
