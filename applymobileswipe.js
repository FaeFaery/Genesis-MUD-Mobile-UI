(() => {
  const CONFIG = {
    THRESHOLD: 70,
    ANGLE_THRESHOLD: 25,
    SCROLLBAR_WIDTH: 15,
    INDICATOR_SIZE: 45
  };

  const ARROWS = {
    n:  { symbol: "↑", color: "#ff4d4d" },
    s:  { symbol: "↓", color: "#4da6ff" },
    e:  { symbol: "→", color: "#ffa64d" },
    w:  { symbol: "←", color: "#33cc33" },
    ne: { symbol: "↗", color: "#ffff66" },
    nw: { symbol: "↖", color: "#ff66cc" },
    se: { symbol: "↘", color: "#cc99ff" },
    sw: { symbol: "↙", color: "#66ffff" },
    u:  { symbol: "⇧", color: "#66ffcc" },
    d:  { symbol: "⇩", color: "#ff66ff" }
  };

  let state = {
    startX: 0,
    startY: 0,
    direction: null,
    isMultiTouch: false,
    isScrolling: false,
    disableGesture: false
  };
  
  let indicator = null;

  // Inject Google Font for arrow indicator
  const link = document.createElement('link');
  link.href = "https://fonts.googleapis.com/css2?family=B612:ital,wght@0,400;0,700;1,400;1,700&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);

  // Inject keyframe animation for arrow indicator
  const neonStyle = document.createElement('style');
  neonStyle.textContent = `@keyframes neon-arrow{from{text-shadow:0 0 10px #fff,0 0 20px #fff,0 0 30px #fff,0 0 40px var(--neon-color),0 0 70px var(--neon-color),0 0 80px var(--neon-color),0 0 100px var(--neon-color),0 0 150px var(--neon-color)}to{text-shadow:0 0 5px #fff,0 0 10px #fff,0 0 15px #fff,0 0 20px var(--neon-color),0 0 35px var(--neon-color),0 0 40px var(--neon-color),0 0 50px var(--neon-color),0 0 75px var(--neon-color)}}`;
  document.head.appendChild(neonStyle);

  document.fonts.ready.then(() => {
    document.getElementById("mudoutput").appendChild(Object.assign(document.createElement("div"), {
      textContent: "Mobile Swipe Gestures have been loaded!",
      style: "color: lime; font-weight: bold;"
    }));
  });

  // Check if touch point is valid
  function overrideTouch(e) {
    const touch = e.touches[0] || e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    if (!element) return false;
  
    // Check for mobile-nav, popup settings or resizer - prevent default behavior
    if (document.getElementById('mobile-nav')?.contains(element) ||
        document.getElementById('mudScrollbar')?.contains(element) ||
        document.querySelector('.popup-settings')?.contains(element) ||
        element.classList.contains('resizer') || 
        element.closest('.resizer') ||
        element.classList.contains('exit')) {
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
      cursor: 'pointer',
      userSelect: 'none'
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
      transition: 'opacity 0.2s',
      userSelect: 'none'
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
  }
  
  function onScrollbarTouchEnd(e) {
    state.isScrolling = false;
    
    // Return thumb to normal appearance
    const thumb = document.getElementById('mudScrollThumb');
    if (thumb) thumb.style.backgroundColor = 'rgba(150, 150, 150, 0.4)';
  }

  function createIndicator() {
    if (indicator) removeIndicator();
    
    indicator = document.createElement("div");
    Object.assign(indicator.style, {
      position: "fixed",
      width: `${CONFIG.INDICATOR_SIZE}px`,
      height: `${CONFIG.INDICATOR_SIZE}px`,
      pointerEvents: "none",
      animation: "neon-arrow 1.5s ease-in-out infinite alternate",
      fontSize: "30px",
      textAlign: "center",
      lineHeight: `${CONFIG.INDICATOR_SIZE}px`,
      color: "#fff",
      zIndex: "9999",
      opacity: "0.8",
      fontFamily: "B612",
      fontWeight: "400",
      fontStyle: "normal"
    });
    
    document.body.appendChild(indicator);
    return indicator;
  }

  function updateIndicator(x, y, dir) {
    if (!indicator) return;
  
    // Calculate offset based on direction
    const offset = CONFIG.INDICATOR_SIZE * 1.25;
    const offsetX = (dir.includes('e') ? offset : dir.includes('w') ? -offset : 0);
    const offsetY = (dir.includes('s') || dir === 'd' ? offset : 
                     dir.includes('n') || dir === 'u' ? -offset : 0);
    const arrow = ARROWS[dir] || { symbol: "", color: "white" };
  
    // Set position and appearance
    indicator.style.transform = `translate(${x - CONFIG.INDICATOR_SIZE/2 + offsetX}px, ${y - CONFIG.INDICATOR_SIZE/2 + offsetY}px)`;
    indicator.textContent = arrow.symbol;
    indicator.style.setProperty("--neon-color", info.color);

    // Set visibility
    const hasDirection = !!dir;
    indicator.style.opacity = hasDirection ? "1" : "0";
  }

  function removeIndicator() {
    if (indicator) {
      document.body.removeChild(indicator);
      indicator = null;
    }
  }

  function getDirection(dx, dy, isMultiTouch) {
    // Verify that the distance is over the threshold
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < CONFIG.THRESHOLD) return "";
    
    // To detect two-finger swipe for up and down
    if (isMultiTouch) {
      return dy < 0 ? "u" : "d";
    }
    
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
    input.click();
    
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

  function onTouchStart(e) {
    // Don't register if in settings or popup
    if ($("#settingscontent").is(":visible") || overrideTouch(e)) {
      state.disableGesture = true;
      return;
    }
    
    state = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      direction: null,
      isMultiTouch: e.touches.length >= 2,
      isScrolling: false,
      disableGesture: false
    };
    
    createIndicator();
    updateIndicator(state.startX, state.startY, "");
  }

  function onTouchMove(e) {
    if (!e.touches.length || state.isScrolling || state.disableGesture) return;
    
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
    if (e.touches.length > 1 || state.disableGesture) return;
    
    if (state.direction) {
      if (indicator) {
        sendCommand(state.direction);
        removeIndicator();
      }
    }
  }

  function onMudOutput(e) {
    const touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
    const element = this;
    
    if (!overrideTouch(e)) e.preventDefault();

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
    
    // Observe window resize to update scrollbar (useful for split screen)
    window.addEventListener('resize', updateScrollbarThumb);
  }

  // Initialize
  init();

  // Fix scroll view to move to bottom
  $("#mudoutput").scrollTop($("#mudoutput")[0].scrollHeight);
})();
