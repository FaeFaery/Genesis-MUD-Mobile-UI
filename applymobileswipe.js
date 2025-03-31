// Configuration variables
const SWIPE_CONFIG = {
    THRESHOLD: 50,                 // Reduced threshold for easier detection
    DIAGONAL_ANGLE_THRESHOLD: 25,  // Angle threshold for diagonal swipes
    MULTI_TOUCH_TIME: 300,         // Max time between touches for multi-touch detection
    SCROLLBAR_WIDTH: 30,           // Width of scrollbar area
    PREDICTION_SIZE: 40,           // Size of the prediction indicator
    ANIMATION_DURATION: 100        // ms for swipe animation
};

// State tracking
let touchState = {
    startX: 0,
    startY: 0,
    startTime: 0,
    direction: "",
    isCancelled: false,
    touchCount: 0,
    lastTouchTime: 0
};

let predictionIndicator = null;

// Arrow symbols for different directions
const DIRECTION_ARROWS = {
    "n": "↑", "s": "↓", "e": "→", "w": "←",
    "ne": "↗", "nw": "↖", "se": "↘", "sw": "↙",
    "u": "⇧", "d": "⇩"
};

// Create visual feedback element
function createPredictionIndicator() {
    if (predictionIndicator) removePredictionIndicator();
    
    predictionIndicator = document.createElement("div");
    Object.assign(predictionIndicator.style, {
        position: "fixed",            // Changed to fixed for better positioning
        width: `${SWIPE_CONFIG.PREDICTION_SIZE}px`,
        height: `${SWIPE_CONFIG.PREDICTION_SIZE}px`,
        background: "rgba(0, 0, 0, 0.5)",  // Semi-transparent background
        borderRadius: "50%",                // Circular indicator
        pointerEvents: "none",
        transition: `all ${SWIPE_CONFIG.ANIMATION_DURATION}ms ease-out`,
        fontSize: "30px",
        textAlign: "center",
        lineHeight: `${SWIPE_CONFIG.PREDICTION_SIZE}px`,
        color: "white",
        zIndex: "9999",                     // Ensure it's above other elements
        opacity: "0.8"
    });
    
    document.body.appendChild(predictionIndicator);
}

// Update the indicator position and direction
function updatePredictionIndicator(x, y, direction) {
    if (!predictionIndicator) return;
    
    const halfSize = SWIPE_CONFIG.PREDICTION_SIZE / 2;
    predictionIndicator.style.transform = `translate(${x - halfSize}px, ${y - halfSize}px)`;
    predictionIndicator.innerText = DIRECTION_ARROWS[direction] || "";
    
    // Add visual feedback based on direction
    if (direction) {
        predictionIndicator.style.opacity = "1";
        predictionIndicator.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.7)";
    } else {
        predictionIndicator.style.opacity = "0.5";
        predictionIndicator.style.boxShadow = "none";
    }
}

// Remove the indicator
function removePredictionIndicator() {
    if (predictionIndicator) {
        document.body.removeChild(predictionIndicator);
        predictionIndicator = null;
    }
}

// Handle the start of a touch event
function handleTouchStart(event) {
    // Skip if in settings menu or map popup
    if ($("#settingscontent").is(":visible") || $(event.target).closest(".popup-map").length) {
        return;
    }
    
    const now = Date.now();
    
    // Track multi-touch with timing
    if (now - touchState.lastTouchTime < SWIPE_CONFIG.MULTI_TOUCH_TIME) {
        touchState.touchCount++;
    } else {
        touchState.touchCount = 1;
    }
    
    touchState.lastTouchTime = now;
    touchState.startTime = now;
    touchState.startX = event.touches[0].clientX;
    touchState.startY = event.touches[0].clientY;
    touchState.isCancelled = false;
    touchState.direction = "";
    
    createPredictionIndicator();
    updatePredictionIndicator(touchState.startX, touchState.startY, "");
}

// Handle touch move for dynamic feedback
function handleTouchMove(event) {
    if (event.touches.length === 0) return;
    
    const currentX = event.touches[0].clientX;
    const currentY = event.touches[0].clientY;
    
    const dx = currentX - touchState.startX;
    const dy = currentY - touchState.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Cancel if the movement is too small
    if (distance < SWIPE_CONFIG.THRESHOLD) {
        touchState.isCancelled = true;
        if (predictionIndicator) predictionIndicator.style.display = "none";
        return;
    }
    
    // Determine direction based on angle and touch count
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Handle multi-touch for up/down movement
    if (touchState.touchCount >= 2) {
        touchState.direction = dy < 0 ? "u" : "d";
    } else {
        // Single touch directions - improved angle detection
        if (Math.abs(angle) <= SWIPE_CONFIG.DIAGONAL_ANGLE_THRESHOLD) {
            touchState.direction = "e";
        } else if (Math.abs(angle) >= 180 - SWIPE_CONFIG.DIAGONAL_ANGLE_THRESHOLD) {
            touchState.direction = "w";
        } else if (Math.abs(angle - 90) <= SWIPE_CONFIG.DIAGONAL_ANGLE_THRESHOLD) {
            touchState.direction = "s";
        } else if (Math.abs(angle + 90) <= SWIPE_CONFIG.DIAGONAL_ANGLE_THRESHOLD) {
            touchState.direction = "n";
        } else if (angle > 0 && angle < 90) {
            touchState.direction = "se";
        } else if (angle > 90 && angle < 180) {
            touchState.direction = "sw";
        } else if (angle < 0 && angle > -90) {
            touchState.direction = "ne";
        } else if (angle < -90 && angle > -180) {
            touchState.direction = "nw";
        }
    }
    
    touchState.isCancelled = false;
    if (predictionIndicator) {
        predictionIndicator.style.display = "block";
        updatePredictionIndicator(currentX, currentY, touchState.direction);
    }
}

// Handle the end of a touch event
function handleTouchEnd(event) {
    // If the touch was cancelled or too short, ignore
    if (touchState.isCancelled || Date.now() - touchState.startTime < 100) {
        removePredictionIndicator();
        return;
    }
    
    // Only process if we have a valid direction
    if (touchState.direction) {
        // Add visual feedback animation before submitting command
        if (predictionIndicator) {
            predictionIndicator.style.transform += " scale(1.5)";
            predictionIndicator.style.opacity = "0";
            
            // Delay command submission for animation
            setTimeout(() => {
                sendDirectionCommand(touchState.direction);
                removePredictionIndicator();
            }, SWIPE_CONFIG.ANIMATION_DURATION);
        } else {
            sendDirectionCommand(touchState.direction);
        }
    } else {
        removePredictionIndicator();
    }
}

// Send the direction command to the game
function sendDirectionCommand(direction) {
    // Set input value
    $("#input").val(direction);
    
    // Focus and trigger enter keypress
    $("#input").focus();
    
    // Create and dispatch Enter key event
    const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        which: 13,
        keyCode: 13,
        bubbles: true,
        cancelable: true
    });
    
    document.getElementById('input').dispatchEvent(enterEvent);
    
    // Clear and blur input
    $("#input").val("");
    $("#input").blur();
    
    // Add haptic feedback if available (iOS and Android)
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

// Prevent default behavior except for scrollbar
$("#mudoutput").on("touchstart touchmove touchend", function(event) {
    const touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
    const rect = this.getBoundingClientRect();
    const isOnScrollbar = touch.clientX > rect.right - SWIPE_CONFIG.SCROLLBAR_WIDTH;
    
    if (isOnScrollbar) {
        event.stopPropagation();
    } else {
        event.preventDefault();
    }
});

// Apply event handlers with proper cleanup
function initSwipeGestures() {
    // Clean up existing handlers first
    $(window).off(".swipeDirections");
    
    // Apply new handlers
    $(window).on("touchstart.swipeDirections", handleTouchStart);
    $(window).on("touchmove.swipeDirections", handleTouchMove);
    $(window).on("touchend.swipeDirections", handleTouchEnd);
}

initSwipeGestures();
