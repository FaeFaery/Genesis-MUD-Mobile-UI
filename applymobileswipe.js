(() => {
  // Configuration
  const CONFIG = {
    THRESHOLD: 50,
    ANGLE_THRESHOLD: 25,
    SCROLLBAR_WIDTH: 15,
    INDICATOR_SIZE: 40
  };

  // Direction symbols
  const ARROWS = {
    n: "↑", s: "↓", e: "→", w: "←",
    ne: "↗", nw: "↖", se: "↘", sw: "↙",
    u: "⇧", d: "⇩"
  };

  // State
  let state = {
    startX: 0,
    startY: 0,
    direction: "",
    isMultiTouch: false,
    isScrolling: false
  };
  
  let indicator = null;

  // Create direction indicator
  function createIndicator() {
    if (indicator) removeIndicator();
    
    indicator = document.createElement("div");
    Object.assign(indicator.style, {
      position: "fixed",
      width: `${CONFIG.INDICATOR_SIZE}px`,
      height: `${CONFIG.INDICATOR_SIZE}px`,
      background: "rgba(0,0,0,0.5)",
      borderRadius: "50%",
      pointerEvents: "none",
      transition: "all 0.1s ease-out",
      fontSize: "30px",
      textAlign: "center",
      lineHeight: `${CONFIG.INDICATOR_SIZE}px`,
      color: "#fff",
      zIndex: "9999",
      opacity: "0.8"
    });
    
    document.body.appendChild(indicator);
    return indicator;
  }

  // Update indicator
  function updateIndicator(x, y, dir) {
    if (!indicator) return;
    
    const half = CONFIG.INDICATOR_SIZE / 2;
    indicator.style.transform = `translate(${x - half}px, ${y - half}px)`;
    indicator.textContent = ARROWS[dir] || "";
    
    if (dir) {
      indicator.style.opacity = "1";
      indicator.style.boxShadow = "0 0 10px rgba(255,255,255,0.7)";
    } else {
      indicator.style.opacity = "0.5";
      indicator.style.boxShadow = "none";
    }
  }

  // Remove indicator
  function removeIndicator() {
    if (indicator) {
      document.body.removeChild(indicator);
      indicator = null;
    }
  }

  // Get swipe direction based on angle
  function getDirection(dx, dy, isMultiTouch) {
    if (isMultiTouch) {
      return dy < 0 ? "u" : "d";
    }
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < CONFIG.THRESHOLD) return "";
    
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const t = CONFIG.ANGLE_THRESHOLD;
    
    // Optimized direction detection
    if (Math.abs(angle) <= t) return "e";
    if (Math.abs(angle) >= 180 - t) return "w";
    if (Math.abs(angle - 90) <= t) return "s";
    if (Math.abs(angle + 90) <= t) return "n";
    
    if (angle > 0 && angle < 90) return "se";
    if (angle > 90 && angle < 180) return "sw";
    if (angle < 0 && angle > -90) return "ne";
    if (angle < -90 && angle > -180) return "nw";
    
    return "";
  }

  // Send command to the game
  function sendCommand(dir) {
    // Set input and dispatch Enter key
    const input = document.getElementById('input');
    input.value = dir;
    input.focus();
    
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      which: 13,
      keyCode: 13,
      bubbles: true,
      cancelable: true
    });
    
    input.dispatchEvent(enterEvent);
    input.value = "";
    input.blur();

  }

  // Check if touch point is on the scrollbar area
  function isTouchOnScrollbar(element, clientX) {
    const rect = element.getBoundingClientRect();
    return clientX > rect.right - CONFIG.SCROLLBAR_WIDTH;
  }

  // Create and append custom scrollbar
  function createCustomScrollbar() {
    // Check if the custom scrollbar already exists
    if (document.getElementById('mudScrollbar')) return;
    
    const output = document.getElementById('mudoutput');
    if (!output) return;
    
    // Add a wrapper for positioning the scrollbar properly
    if (!output.parentElement.classList.contains('mud-scroll-container')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'mud-scroll-container';
      wrapper.style.position = 'relative';
      wrapper.style.height = '100%';
      wrapper.style.overflow = 'hidden';
      output.parentNode.insertBefore(wrapper, output);
      wrapper.appendChild(output);
    }
    
    // Create the custom scrollbar
    const scrollbar = document.createElement('div');
    scrollbar.id = 'mudScrollbar';
    Object.assign(scrollbar.style, {
      position: 'absolute',
      top: '0',
      right: '0',
      width: `${CONFIG.SCROLLBAR_WIDTH}px`,
      height: '100%',
      backgroundColor: 'rgba(200, 200, 200, 0.2)',
      zIndex: '999',
      cursor: 'pointer'
    });
    
    // Create the scrollbar thumb
    const thumb = document.createElement('div');
    thumb.id = 'mudScrollThumb';
    Object.assign(thumb.style, {
      position: 'absolute',
      top: '0',
      right: '0',
      width: '100%',
      backgroundColor: 'rgba(150, 150, 150, 0.5)',
      borderRadius: '4px',
      transition: 'opacity 0.2s'
    });
    
    scrollbar.appendChild(thumb);
    output.parentElement.appendChild(scrollbar);
    
    // Update the thumb size and position based on content
    updateScrollbarThumb();
    
    // Add event listeners for the custom scrollbar
    scrollbar.addEventListener('touchstart', onScrollbarTouchStart);
    scrollbar.addEventListener('touchmove', onScrollbarTouchMove);
    scrollbar.addEventListener('touchend', onScrollbarTouchEnd);
    
    // Make sure the output element is scrollable
    output.style.overflowY = 'auto';
    output.style.overflowX = 'hidden';
    
    // Hide native scrollbar on mobile
    output.style.scrollbarWidth = 'none'; // Firefox
    output.style.msOverflowStyle = 'none'; // IE/Edge
    
    // Hide webkit scrollbar
    const style = document.createElement('style');
    style.textContent = '#mudoutput::-webkit-scrollbar { display: none; }';
    document.head.appendChild(style);
    
    // Add scroll event listener to update thumb position
    output.addEventListener('scroll', updateScrollbarThumb);
    
    return [scrollbar, thumb];
  }
  
  // Update scrollbar thumb size and position
  function updateScrollbarThumb() {
    const output = document.getElementById('mudoutput');
    const thumb = document.getElementById('mudScrollThumb');
    if (!output || !thumb) return;
    
    const scrollRatio = output.clientHeight / output.scrollHeight;
    const thumbHeight = Math.max(scrollRatio * output.clientHeight, 15); // Minimum height 30px
    
    thumb.style.height = `${thumbHeight}px`;
    
    const scrollPercentage = output.scrollTop / (output.scrollHeight - output.clientHeight);
    const thumbTop = scrollPercentage * (output.clientHeight - thumbHeight);
    
    thumb.style.top = `${thumbTop}px`;
    
    // Show/hide thumb based on scrollability
    thumb.style.opacity = scrollRatio < 1 ? '1' : '0';
  }
  
  // Handle scroll bar touch start
  function onScrollbarTouchStart(e) {
    state.isScrolling = true;
    state.startY = e.touches[0].clientY;
    
    const output = document.getElementById('mudoutput');
    state.initialScrollTop = output.scrollTop;
    
    // Highlight the thumb while scrolling
    const thumb = document.getElementById('mudScrollThumb');
    if (thumb) thumb.style.backgroundColor = 'rgba(150, 150, 150, 0.8)';
    
    e.preventDefault();
    e.stopPropagation();
  }
  
  // Handle scroll bar touch move
  function onScrollbarTouchMove(e) {
    if (!state.isScrolling) return;
    
    const output = document.getElementById('mudoutput');
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - state.startY;
    
    // Calculate the scrolling delta (reversed for natural feeling)
    const scrollableHeight = output.scrollHeight - output.clientHeight;
    const scrollRatio = output.clientHeight / output.scrollHeight;
    const scrollDelta = deltaY / scrollRatio;
    
    // Apply the scroll (natural scrolling - drag down to scroll up)
    output.scrollTop = Math.max(0, Math.min(scrollableHeight, state.initialScrollTop - scrollDelta));
    
    updateScrollbarThumb();
    e.preventDefault();
    e.stopPropagation();
  }
  
  // Handle scroll bar touch end
  function onScrollbarTouchEnd(e) {
    state.isScrolling = false;
    
    // Return thumb to normal appearance
    const thumb = document.getElementById('mudScrollThumb');
    if (thumb) thumb.style.backgroundColor = 'rgba(150, 150, 150, 0.5)';
    
    e.preventDefault();
    e.stopPropagation();
  }

  // Handle touch start
  function onTouchStart(e) {
    // Skip if in settings or map popup
    if ($("#settingscontent").is(":visible") || $(e.target).closest(".popup-map").length) {
      return;
    }
    
    // Check if touch is on the scrollbar area
    const output = document.getElementById('mudoutput');
    if (output && isTouchOnScrollbar(output, e.touches[0].clientX)) {
      return; // Let the scrollbar handle this
    }
    
    state = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      direction: "",
      isMultiTouch: e.touches.length >= 2,
      isScrolling: false
    };
    
    createIndicator();
    updateIndicator(state.startX, state.startY, "");
  }

  // Handle touch move
  function onTouchMove(e) {
    if (!e.touches.length || state.isScrolling) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const dx = currentX - state.startX;
    const dy = currentY - state.startY;
    
    state.direction = getDirection(dx, dy, state.isMultiTouch);
    
    if (indicator) {
      indicator.style.display = state.direction ? "block" : "none";
      if (state.direction) updateIndicator(currentX, currentY, state.direction);
    }
  }

  // Handle touch end
  function onTouchEnd(e) {
    if (e.touches.length > 1) return;
    
    if (state.direction) {
      if (indicator) {
        indicator.style.transform += " scale(1.5)";
        indicator.style.opacity = "0";
        
        setTimeout(() => {
          sendCommand(state.direction);
          removeIndicator();
        }, 100);
      } else {
        sendCommand(state.direction);
      }
    } else {
      removeIndicator();
    }
  }

  // Handle mudoutput touch events
  function onMudOutput(e) {
    const touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
    const element = this;
    
    if (isTouchOnScrollbar(element, touch.clientX)) {
      // On scrollbar - pass through to scrollbar handlers
      e.stopPropagation();
    } else {
      // In content area - use for swipe gestures
      e.preventDefault();
    }
  }

  // Initialize the system
  function init() {
    // Clean up existing handlers
    $(window).off(".swipeGestures");
    $("#mudoutput").off(".swipeGestures");
    
    // Create custom scrollbar
    createCustomScrollbar();
    
    // Apply new handlers
    $(window).on("touchstart.swipeGestures", onTouchStart);
    $(window).on("touchmove.swipeGestures", onTouchMove);
    $(window).on("touchend.swipeGestures", onTouchEnd);
    $("#mudoutput").on("touchstart.swipeGestures touchmove.swipeGestures touchend.swipeGestures", onMudOutput);
    
    // Observe window resize to update scrollbar
    window.addEventListener('resize', updateScrollbarThumb);
    
    console.log("Mobile swipe gestures");
  }

  // Initialize
  init();
})();
