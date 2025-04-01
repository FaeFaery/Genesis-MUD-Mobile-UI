(() => {
  const CONFIG = {
    THRESHOLD: 50,
    ANGLE_THRESHOLD: 25,
    SCROLLBAR_WIDTH: 15,
    INDICATOR_SIZE: 40
  };

  const ARROWS = {
    n: "↑", s: "↓", e: "→", w: "←",
    ne: "↗", nw: "↖", se: "↘", sw: "↙",
    u: "⇧", d: "⇩"
  };

  let state = {
    startX: 0,
    startY: 0,
    direction: "",
    isMultiTouch: false,
    isScrolling: false
  };
  
  let indicator = null;
  
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

  function removeIndicator() {
    if (indicator) {
      document.body.removeChild(indicator);
      indicator = null;
    }
  }

  function getDirection(dx, dy, isMultiTouch) {
    // To detect two-finger swipe up and down
    if (isMultiTouch) {
      return dy < 0 ? "u" : "d";
    }
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < CONFIG.THRESHOLD) return "";
    
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const t = CONFIG.ANGLE_THRESHOLD;
    
    // Detect which direction
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

  // Check if touch point is valid
  function overrideTouch(e) {
    const touch = e.touches[0] || e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    if (!element) return false;
  
    // Check for exit element - allow touch events on these
    if (element.classList.contains('exit') || element.closest('.exit')) {
      return 'exit';
    }
  
    // Check for mobile-nav or resizer - prevent default behavior
    if (document.getElementById('mobile-nav')?.contains(element) ||
        element.classList.contains('resizer') || 
        element.closest('.resizer')) {
      e.preventDefault();
      e.stopPropagation();
      return true;
    }
  
    return false;
  }

  function createCustomScrollbar() {
    // Check if the custom scrollbar already exists
    if (document.getElementById('mudScrollbar')) return;
    
    const output = document.getElementById('mudoutput');
    if (!output) return;
    
    // Add a wrapper for positioning the scrollbar properly
    if (!output.parentElement.classList.contains('mud-container')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'mud-container';
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
      backgroundColor: 'rgba(200, 200, 200, 0.07)',
      zIndex: '0',
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
      backgroundColor: 'rgba(150, 150, 150, 0.4)',
      borderRadius: '4px',
      transition: 'opacity 0.2s'
    });
    
    scrollbar.appendChild(thumb);
    output.parentElement.appendChild(scrollbar);
    
    // Update the thumb size and position based on content
    updateScrollbarThumb();
  
    // Add the listeners to the scroll thumb 
    thumb.addEventListener('touchstart', onScrollbarTouchStart);
    thumb.addEventListener('touchmove', onScrollbarTouchMove);
    thumb.addEventListener('touchend', onScrollbarTouchEnd);
    
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
  
  function updateScrollbarThumb() {
    const output = document.getElementById('mudoutput');
    const thumb = document.getElementById('mudScrollThumb');
    if (!output || !thumb) return;
    
    const scrollRatio = output.clientHeight / output.scrollHeight;
    const thumbHeight = Math.max(scrollRatio * output.clientHeight, 30);
    
    thumb.style.height = `${thumbHeight}px`;
    
    const scrollPercentage = output.scrollTop / (output.scrollHeight - output.clientHeight);
    const thumbTop = scrollPercentage * (output.clientHeight - thumbHeight);
    
    thumb.style.top = `${thumbTop}px`;
    
    // Show/hide thumb based on scrollability
    thumb.style.opacity = scrollRatio < 1 ? '0.4' : '0';
  }
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
  
  function onScrollbarTouchMove(e) {
    if (!state.isScrolling) return;
    
    const output = document.getElementById('mudoutput');
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - state.startY;
    
    // Calculate delta Y
    const scrollableHeight = output.scrollHeight - output.clientHeight;
    const scrollRatio = output.clientHeight / output.scrollHeight;
    const scrollDelta = deltaY / scrollRatio;
    
    // Apply the scroll 
    output.scrollTop = Math.max(0, Math.min(scrollableHeight, state.initialScrollTop + scrollDelta));
    
    updateScrollbarThumb();
    e.preventDefault();
    e.stopPropagation();
  }
  
  function onScrollbarTouchEnd(e) {
    state.isScrolling = false;
    
    // Return thumb to normal appearance
    const thumb = document.getElementById('mudScrollThumb');
    if (thumb) thumb.style.backgroundColor = 'rgba(150, 150, 150, 0.4)';
    
    e.preventDefault();
    e.stopPropagation();
  }

  function onTouchStart(e) {
    // Don't register if in settings or popup
    if ($("#settingscontent").is(":visible") || overrideTouch(e)) {
      return;
    }
    
    // Check if touch is on the scrollbar area
    const output = document.getElementById('mudoutput');
    if (output && isTouchOnScrollbar(output, e.touches[0].clientX)) {
      return; // Let the scrollbar handle this event
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

  function onTouchMove(e) {
    if (!e.touches.length || state.isScrolling || overrideTouch(e)) return;
    
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

  function onTouchEnd(e) {
    if (e.touches.length > 1 || overrideTouch(e)) return;
    
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

  function onMudOutput(e) {
    const touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
    const element = this;
    
    if (!isTouchOnScrollbar(element, touch.clientX)) e.preventDefault();

  }

  // Initialize the system
  function init() {
    // Clean up existing handlers
    $(window).off(".swipeGestures");
    $("#mudoutput").off(".swipeGestures");
    
    // Create custom scrollbar
    createCustomScrollbar();
    $("#mudoutput").scrollTop($("#mudoutput")[0].scrollHeight);
    
    // Apply new handlers
    $(window).on("touchstart.swipeGestures", onTouchStart);
    $(window).on("touchmove.swipeGestures", onTouchMove);
    $(window).on("touchend.swipeGestures", onTouchEnd);
    $("#mudoutput").on("touchstart.swipeGestures touchmove.swipeGestures touchend.swipeGestures", onMudOutput);
    
    // Observe window resize to update scrollbar (useful for split screen)
    window.addEventListener('resize', updateScrollbarThumb);
  }

  // Initialize
  init();
})();
