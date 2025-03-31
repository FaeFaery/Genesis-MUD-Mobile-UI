(() => {
  // Configuration
  const CONFIG = {
    THRESHOLD: 50,
    ANGLE_THRESHOLD: 25,
    SCROLLBAR_WIDTH: 30,
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
    isProcessed: false
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
    
    // Vibration feedback
    if (navigator.vibrate) navigator.vibrate(50);
  }

  // Handle touch start
  function onTouchStart(e) {
    // Skip if in settings or map popup
    if ($("#settingscontent").is(":visible") || $(e.target).closest(".popup-map").length) {
      return;
    }
    
    state = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      direction: "",
      isMultiTouch: e.touches.length >= 2,
      isProcessed: false
    };
    
    createIndicator();
    updateIndicator(state.startX, state.startY, "");
  }

  // Handle touch move
  function onTouchMove(e) {
    if (state.isProcessed || !e.touches.length) return;
    
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
    if (state.isProcessed) return;
    state.isProcessed = true;
    
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

  // Handle scrollbar vs. content
  function onMudOutput(e) {
    const touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
    const rect = this.getBoundingClientRect();
    const isScrollbar = touch.clientX > rect.right - CONFIG.SCROLLBAR_WIDTH;
    
    isScrollbar ? e.stopPropagation() : e.preventDefault();
  }

  // Initialize the system
  function init() {
    // Clean up existing handlers
    $(window).off(".swipeGestures");
    $("#mudoutput").off(".swipeGestures");
    
    // Apply new handlers
    $(window).on("touchstart.swipeGestures", onTouchStart);
    $(window).on("touchmove.swipeGestures", onTouchMove);
    $(window).on("touchend.swipeGestures", onTouchEnd);
    $("#mudoutput").on("touchstart.swipeGestures touchmove.swipeGestures touchend.swipeGestures", onMudOutput);
    
    console.log("Mobile swipe gestures initialized");
  }

  // Initialize
  init();
})();
