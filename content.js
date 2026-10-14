function getSubscriptionLockups() {
  return Array.from(document.querySelectorAll('#content yt-lockup-view-model'));
}

function getMetadataText(container) {
  if (!container) return '';

  return Array.from(container.querySelectorAll('span, yt-formatted-string'))
    .map((el) => el.textContent?.trim())
    .filter(Boolean)
    .join(' ');
}

function getLockupMetadataText(lockup) {
  const metadata = lockup.querySelector('yt-content-metadata-view-model, yt-lockup-metadata-view-model');
  return getMetadataText(metadata).toLowerCase();
}

function hideByMetadataKeyword(keyword, label) {
  getSubscriptionLockups().forEach((lockup) => {
    const textContent = getLockupMetadataText(lockup);
    if (textContent.includes(keyword.toLowerCase())) {
      removeVideo(lockup, label);
    }
  });
}

function hideStreamVods() {
  hideByMetadataKeyword('streamed', 'streamed');
}

function hideScheduledStreams() {
  hideByMetadataKeyword('scheduled', 'scheduled');
}

function getElementWidth(element) {
  if (!element) return 0;

  const styleWidth = element.style?.width;
  if (styleWidth) {
    const parsed = parseFloat(styleWidth);
    if (!Number.isNaN(parsed)) return parsed;
  }

  const computedWidth = window.getComputedStyle(element).width;
  const parsedComputed = parseFloat(computedWidth);
  return Number.isFinite(parsedComputed) ? parsedComputed : 0;
}

function hideWatchedVideos() {
  getSubscriptionLockups().forEach((lockup) => {
    const metadataText = getLockupMetadataText(lockup);

    // Skip live-content cards that are still being watched live
    if (metadataText.includes('watching')) {
      return;
    }

    const progressBar = lockup.querySelector('yt-thumbnail-overlay-progress-bar-view-model');
    const progressFill = progressBar?.querySelector('div');

    if (progressFill && getElementWidth(progressFill) >= 90) {
      removeVideo(progressFill, 'watched');
    }
  });
}

function getSectionTitle(section) {
  if (!section) return '';

  const titleElement = section.querySelector('#title, h2, h3, yt-formatted-string, .title');
  return titleElement?.textContent?.trim() || '';
}

function hideHomePageClutter() {
  const sections = document.querySelectorAll('ytd-rich-section-renderer, ytd-shelf-renderer');
  if (sections.length > 0) {
    sections.forEach((section) => section.remove());
    console.log(`🧹 Removed ${sections.length} clutter sections (ads, premium offers, explore topics, etc.)`);
  }
}

function hideMostRelevant() {
  const sections = document.querySelectorAll('ytd-rich-section-renderer, ytd-shelf-renderer');

  sections.forEach((section) => {
    const titleText = getSectionTitle(section).toLowerCase();

    if (titleText.includes('most relevant')) {
      section.remove();
      console.log('🧹 Removed "Most relevant" section');
    }
  });
}

function getTitle(item) {
  if (!item) return '';

  const titleData = item.querySelector('yt-formatted-string#video-title, ytd-rich-item-renderer yt-formatted-string#video-title');
  if (!titleData) return '';

  return titleData.getAttribute('aria-label') || titleData.textContent.trim();
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
