/**
 * linkedin-feed.js — Dynamic LinkedIn loader with secure Vercel API proxy
 */
document.addEventListener('DOMContentLoaded', () => {
  const scroller = document.querySelector('.linkedin-feed-scroller');
  if (!scroller) return;

  // Set of 3 premium vector SVGs to cycle through for dynamic post thumbnails
  const thumbnails = [
    // Tech chart
    `<svg viewBox="0 0 130 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="130" height="80" rx="6" fill="#0f0f12"/>
      <rect width="130" height="80" rx="6" fill="rgba(0,113,227,0.04)" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>
      <path d="M20,60 L45,35 L70,45 L110,15" stroke="#0071e3" stroke-width="2" stroke-linecap="round"/>
      <path d="M20,60 L45,35 L70,45 L110,15 L110,60 L20,60 Z" fill="rgba(0,113,227,0.08)" opacity="0.4"/>
      <circle cx="110" cy="15" r="3" fill="#00b4d8"/>
    </svg>`,
    // AI brain mesh
    `<svg viewBox="0 0 130 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="130" height="80" rx="6" fill="#0f0f12"/>
      <rect width="130" height="80" rx="6" fill="rgba(0,180,216,0.04)" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>
      <circle cx="65" cy="40" r="18" stroke="rgba(0,180,216,0.2)" stroke-dasharray="2 4"/>
      <circle cx="65" cy="40" r="8" fill="#00b4d8" opacity="0.3"/>
      <line x1="30" y1="20" x2="65" y2="40" stroke="rgba(0,180,216,0.15)" stroke-width="1"/>
      <line x1="100" y1="20" x2="65" y2="40" stroke="rgba(0,180,216,0.15)" stroke-width="1"/>
      <line x1="50" y1="60" x2="65" y2="40" stroke="rgba(0,113,227,0.15)" stroke-width="1"/>
      <circle cx="30" cy="20" r="2.5" fill="#0071e3"/>
      <circle cx="100" cy="20" r="2.5" fill="#8b5cf6"/>
    </svg>`,
    // Node-Link iConnect mesh
    `<svg viewBox="0 0 130 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="130" height="80" rx="6" fill="#0f0f12"/>
      <rect width="130" height="80" rx="6" fill="rgba(139,92,246,0.04)" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>
      <circle cx="65" cy="40" r="16" fill="rgba(139,92,246,0.06)" stroke="rgba(139,92,246,0.2)" stroke-width="0.8"/>
      <text x="65" y="44" font-family="Inter,sans-serif" font-weight="900" font-size="12" fill="white" text-anchor="middle" opacity="0.2">IN</text>
      <circle cx="65" cy="20" r="2" fill="#00b4d8"/>
      <circle cx="45" cy="40" r="2" fill="#0071e3"/>
      <circle cx="85" cy="40" r="2" fill="#8b5cf6"/>
    </svg>`
  ];

  async function loadFeed() {
    try {
      const response = await fetch('/api/linkedin');
      const data = await response.json();

      if (data.success && data.posts && data.posts.length > 0) {
        // Clear static mockup cards
        scroller.innerHTML = '';

        // Dynamically build cards for only Swapnil's posts
        data.posts.forEach((post, index) => {
          const thumb = thumbnails[index % thumbnails.length];
          const card = document.createElement('a');
          card.href = post.url;
          card.target = '_blank';
          card.rel = 'noopener';
          card.className = 'feed-card';
          card.innerHTML = `
            <div class="feed-card-left">
              <div class="feed-card-profile">
                <div class="feed-avatar">
                  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="18" r="18" fill="#131317" stroke="rgba(0,113,227,0.4)" stroke-width="1"/>
                    <path d="M12 28 C12 24 14 21 18 21 C22 21 24 24 24 28" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"/>
                    <circle cx="18" cy="14" r="5" fill="#1d1d24" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
                    <rect x="15" y="12.5" width="2.5" height="2" rx="0.5" stroke="#00b4d8" stroke-width="0.5" fill="none"/>
                    <rect x="18.5" y="12.5" width="2.5" height="2" rx="0.5" stroke="#00b4d8" stroke-width="0.5" fill="none"/>
                  </svg>
                </div>
                <div class="profile-info">
                  <h5>
                    Swapnil Wable
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#0077b5" class="li-verified">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </h5>
                  <span class="time-stamp">
                    ${post.date} &middot;
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="world-icon">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                  </span>
                </div>
              </div>
              <p class="feed-post-text">${post.text}</p>
              <div class="feed-card-footer">
                <span class="reactions">
                  <span class="react-icons">
                    <span class="react-bubble bubble-like"><svg width="6" height="6" viewBox="0 0 24 24" fill="white"><path d="M2 20h2v-8H2v8zm10-7.89L11.77 14h-3.8c-.59 0-1.07.48-1.07 1.07V17c0 .28.11.53.29.71l2.58 2.58c.2.2.51.3.81.24l1.37-.27c.48-.1 1.05-.49 1.05-1.07V13.5c0-.83-.67-1.5-1.5-1.5z"/></svg></span>
                    <span class="react-bubble bubble-heart"><svg width="6" height="6" viewBox="0 0 24 24" fill="white"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></span>
                  </span>
                  ${post.reactions} Reactions
                </span>
                <span class="comments">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  ${post.comments} Comments
                </span>
              </div>
            </div>
            <div class="feed-card-right">
              ${thumb}
            </div>
          `;
          scroller.appendChild(card);
        });
      }
    } catch (e) {
      console.warn('[linkedin] API unavailable, using high-fidelity static fallbacks:', e);
    }
  }

  loadFeed();
});

// Pinned hybrid card iframe handlers
window.loadLinkedInIframe = function() {
  const preview = document.getElementById('pinnedCardPreview');
  const iframeContainer = document.getElementById('pinnedCardIframe');
  if (preview && iframeContainer) {
    preview.style.display = 'none';
    iframeContainer.style.display = 'flex';
  }
};

window.unloadLinkedInIframe = function() {
  const preview = document.getElementById('pinnedCardPreview');
  const iframeContainer = document.getElementById('pinnedCardIframe');
  if (preview && iframeContainer) {
    iframeContainer.style.display = 'none';
    preview.style.display = 'flex';
  }
};
