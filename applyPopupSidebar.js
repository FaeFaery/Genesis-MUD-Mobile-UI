// Wrap everything in a function that waits for both DOM and jQuery
function initMapExtension() {
    // Check if required dependencies exist
    if (typeof $ === 'undefined') {
        console.error('jQuery not found. Magic Map requires jQuery.');
        return;
    }

    function injectMinifiedCSS() {
        try {
            const style = document.createElement('style');
            style.textContent = '#magicmap-canvas{display:relative;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;background:#000;width:100%;height:100%;opacity:.9}#magicmap-img{object-fit:cover}#popup-buttons{position:absolute;user-select:none;top:6px;right:0;z-index:1;display:flex;flex-direction:column;background-color:rgba(0,0,0,.3)}#popupnav-container{position:absolute;user-select:none;top:0;left:0;display:flex;padding:10px;flex-direction:row;background-color:rgba(0,0,0,.1);gap:5px}#popupnav-container>*{margin-right:5px}#mobile-nav{position:absolute;top:100px;left:100px;display:flex;flex-direction:column}.popup-map{width:300px;height:300px;display:none;position:relative;border:1px solid #fff}.popup-chat{width:300px;height:100px;display:none;position:relative;overflow:hidden;border:1px solid #fff;background-color:rgba(0,0,0,.9)}.chat-content{height:100%;width:100%;color:#d0d0d0;font-family:Source Code Pro,sans-serif;overflow-y:scroll;font-size:14px;margin-left:5px;padding-right:10px;padding-top:10px;box-sizing:content-box}.resizable .resizers{width:100%;height:100%;box-sizing:border-box}.resizable .resizers .resizer{width:15px;height:15px;border-radius:50%;position:absolute}.resizable .resizers .resizer.top-left{left:-5px;top:-5px;cursor:nwse-resize}.resizable .resizers .resizer.top-right{right:-5px;top:-5px;cursor:nesw-resize}.resizable .resizers .resizer.bottom-left{left:-5px;bottom:-5px;cursor:nesw-resize}.resizable .resizers .resizer.bottom-right{right:-5px;bottom:-5px;cursor:nwse-resize}.exit-icon{cursor:pointer;user-select:none;width:30px;height:30px;color:#fff;font-size:30px;margin-bottom:-3px;font-variation-settings:\'FILL\' 0,\'wght\' 400,\'GRAD\' 0,\'opsz\' 24}.map-icon{cursor:pointer;display:block;user-select:none;color:#fff;font-size:20px;font-variation-settings:\'FILL\' 0,\'wght\' 300,\'GRAD\' 0,\'opsz\' 24}.center-icon{cursor:pointer;width:30px;height:30px;color:#fff;font-size:30px;font-variation-settings:\'FILL\' 0,\'wght\' 350,\'GRAD\' 0,\'opsz\' 24}.chat-icon{cursor:pointer;width:30px;height:30px;color:#fff;font-size:30px;font-variation-settings:\'FILL\' 0,\'wght\' 250,\'GRAD\' 0,\'opsz\' 24}.chat-icon-container{position:relative;display:inline-block}.chat-badge{font-family:Source Code Pro,sans-serif;position:absolute;top:-5px;right:2px;background-color:red;color:#fff;border-radius:50%;width:15px;height:15px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;padding:0;line-height:1;box-sizing:border-box;text-align:center}.new-message-divider{text-align:center;font-size:12px;color:#888;background:rgba(200,200,200,.3);padding:3px 0;margin:5px 0;transition:opacity 1s ease-out}#scroll-to-bottom{position:absolute;bottom:0;right:50%;padding:5px 10px;background:rgba(0,0,0,.5);color:#fff;border:none;border-radius:50%;cursor:pointer;animation:bobbing 1s ease-in-out infinite}@keyframes bobbing{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}.zoom-controls{user-select:none;display:flex;z-index:1;flex-direction:column;align-items:center;position:absolute;left:10px;top:9px;padding:5px 1px;background-color:rgba(255,255,255,.1);border-radius:4px}.zoom-slider{width:30px;height:100px;margin:10px 0;}.zoom-btn{width:20px;height:20px;color:rgba(255,255,255);border-radius:4px;background-color:rgba(245,245,245,.3);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center}';
            document.head.appendChild(style);
        } catch (error) {
            console.error('Failed to inject CSS:', error);
        }
    }

    function injectMinifiedHTML() {
        try {
            const container = document.createElement('div');
            container.innerHTML = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" /><div id="popupnav-container"><span class='map-icon material-symbols-outlined'>explore</span><div class='chat-icon-container'><span class='chat-icon material-symbols-outlined'>chat_bubble</span></div></div><div id="mobile-nav"><div class='resizable popup-map'><div id="popup-buttons"><span class='exit-icon material-symbols-outlined'>close</span><span class='center-icon material-symbols-outlined'>center_focus_strong</span><div class='chat-icon-container'><span class='chat-icon material-symbols-outlined'>chat_bubble</span></div></div><div class="zoom-controls"><button id="zoom-in" class="zoom-btn">+</button><input type="range" id="zoom-slider" class="zoom-slider" min="100" max="250" value="100" style="writing-mode: vertical-lr; direction: rtl"><button id="zoom-out" class="zoom-btn">−</button></div><div class='resizers'><canvas id='magicmap-canvas'></canvas><div class='resizer top-left'></div><div class='resizer top-right'></div><div class='resizer bottom-left'></div><div class='resizer bottom-right'></div></div></div><div class='resizable popup-chat'><div id="popup-buttons"><span class='exit-icon material-symbols-outlined'>close</span><span class='map-icon material-symbols-outlined'>explore</span></div><div class='resizers'><div class='chat-content'></div><div class='resizer bottom-left'></div><div class='resizer bottom-right'></div></div></div></div>`;
            document.body.appendChild(container);
        } catch (error) {
            console.error('Failed to inject HTML:', error);
        }
    }

    // Initialize DOM elements first
    injectMinifiedCSS();
    injectMinifiedHTML();

    // Set up jQuery override AFTER ensuring jQuery exists
    const originalIs = $.fn.is;
    $.fn.is = function(selector) {
        if (this.attr("id") === "sidebar" && selector === ":visible") {
            return true;
        }
        return originalIs.apply(this, arguments);
    };

    // Constants
    window.FONT_SIZE = 15;
    window.FONT_FAMILY = "Source Code Pro, sans-serif";

    // State variables
    window.cameraOffset = {
        x: 0,
        y: 0
    };
    window.dragStart = {
        x: 0,
        y: 0
    };
    window.playerCoords = {
        x: 0,
        y: 0
    };
    window.cameraZoom = 1;
    window.isDragging = false;
    window.drawingEnd = 0;
    window.maxOffsetX = 0;
    window.maxOffsetY = 0;
    window.needsRedraw = true;

    // Cache DOM elements
    window.mapCanvas = document.getElementById('magicmap-canvas');
    window.mapContext = window.mapCanvas.getContext('2d');
    window.magicMapElement = document.getElementById('magicmap');
    window.zoomSlider = document.getElementById('zoom-slider');
    window.zoomInBtn = document.getElementById('zoom-in');
    window.zoomOutBtn = document.getElementById('zoom-out');

    window.positionPopupNav = function() {
        const popupNav = document.getElementById("popupnav-container");
        const mudOutput = document.getElementById("mudoutput");

        if (!popupNav || !mudOutput) return;

        const mudRect = mudOutput.getBoundingClientRect();

        popupNav.style.top = `${mudRect.top}px`;
        popupNav.style.left = `${mudRect.left}px`;
        popupNav.style.top = `${mudRect.top}px`;
    }


    // Helper functions
    window.longestLine = function(lines) {
        return lines.reduce((longest, current) =>
            current.length > longest.length ? current : longest, "");
    }

    // Event handling
    window.getEventLocation = function(e) {
        if (e.touches && e.touches.length === 1) {
            const rect = window.mapCanvas.getBoundingClientRect();
            return {
                x: (e.touches[0].clientX - rect.left) * 2,
                y: (e.touches[0].clientY - rect.top) * 2
            };
        } else if (!e.touches) {
            return {
                x: e.offsetX * 2,
                y: e.offsetY * 2
            };
        }
        return null;
    }

    window.handlePointerDown = function(e) {
        window.isDragging = true;
        const location = window.getEventLocation(e);
        if (location) {
            window.dragStart.x = location.x;
            window.dragStart.y = location.y;
        }
    }

    window.handlePointerUp = function() {
        window.isDragging = false;
    }

    window.handlePointerMove = function(e) {
        if (!window.isDragging) return;

        const location = window.getEventLocation(e);
        if (!location) return;

        window.updateCameraPosition(location);
        window.needsRedraw = true;
    }

    window.updateCameraPosition = function(location) {
        const contents = window.getMapContents();
        window.maxOffsetX = window.mapContext.measureText(window.longestLine(contents)).width;
        window.maxOffsetY = window.drawingEnd;

        const deltaX = (location.x - window.dragStart.x) * 0.07;
        const deltaY = (location.y - window.dragStart.y) * 0.07;

        // Calculate potential new positions
        let newX = window.cameraOffset.x + deltaX;
        let newY = window.cameraOffset.y + deltaY;

        // Constrain within boundaries
        window.cameraOffset.x = Math.max(-window.maxOffsetX, Math.min(window.maxOffsetX, newX));
        window.cameraOffset.y = Math.max(-window.maxOffsetY, Math.min(window.maxOffsetY, newY));
    }

    window.centerPlayer = function() {
        window.cameraOffset.x = -window.playerCoords.x + (window.mapCanvas.width / (2 * window.cameraZoom));
        window.cameraOffset.y = -window.playerCoords.y + (window.mapCanvas.height / (2 * window.cameraZoom));
        window.needsRedraw = true;
    }

    // Zoom controls
    window.handleZoomSlider = function() {
        window.cameraZoom = parseFloat(this.value) / 100;
        window.needsRedraw = true;
    }

    window.zoomIn = function() {
        window.cameraZoom = Math.min(window.cameraZoom + 0.1, 2.5);
        window.zoomSlider.value = window.cameraZoom * 100;
        window.needsRedraw = true;
    }

    window.zoomOut = function() {
        window.cameraZoom = Math.max(window.cameraZoom - 0.1, 1.0);
        window.zoomSlider.value = window.cameraZoom * 100;
        window.needsRedraw = true;
    }

    // Map rendering
    window.getMapContents = function() {
        if (!window.magicMapElement) return [];
        return window.magicMapElement.innerHTML
            .split(/\n|<font color="red">|<\/font>/)
            .filter(value => value.length > 0);
    }

    window.draw = function() {
        if (!window.needsRedraw) {
            window.requestAnimationFrame(window.draw);
            return;
        }

        window.needsRedraw = false;
        window.storedMap = window.magicMapElement.innerHTML;
        const contents = window.getMapContents();

        // Clear canvas
        window.mapContext.setTransform(1, 0, 0, 1, 0, 0);
        window.mapContext.clearRect(0, 0, window.mapCanvas.width, window.mapCanvas.height);

        // Apply camera transformations
        window.mapContext.scale(window.cameraZoom, window.cameraZoom);
        window.mapContext.translate(window.cameraOffset.x, window.cameraOffset.y);

        // Set initial style
        window.mapContext.font = `${window.FONT_SIZE}px ${window.FONT_FAMILY}`;
        window.mapContext.fillStyle = "black";
        window.mapContext.fillRect(0, 0, window.mapCanvas.width, window.mapCanvas.height);

        // Draw text content
        window.drawMapContents(contents);

        window.requestAnimationFrame(window.draw);
    }

    window.drawMapContents = function(contents) {
        window.isPlayerSeen = false;
        window.mapContext.fillStyle = "white";

        for (let i = 0; i < contents.length; i++) {
            if (contents[i] !== 'X') {
                window.mapContext.fillText(contents[i], 0, 21 * (i + 1));
            } else {
                // Handle when there is no highlight of player position
                window.isPlayerSeen = true;

                // Handle player position (red X)
                const prevLineWidth = window.mapContext.measureText(contents[i - 1]).width;

                window.mapContext.fillStyle = "rgb(255, 49, 49)";
                window.mapContext.font = `bold ${window.FONT_SIZE}px ${window.FONT_FAMILY}`;
                window.mapContext.fillText(contents[i], prevLineWidth, 21 * i);

                // Store player coordinates
                window.playerCoords.x = prevLineWidth;
                window.playerCoords.y = 21 * i;

                // Reset style and draw remainder of line
                window.mapContext.font = `${window.FONT_SIZE}px ${window.FONT_FAMILY}`;
                window.mapContext.fillStyle = "white";

                const combinedWidth = window.mapContext.measureText(contents[i - 1] + contents[i]).width;
                window.mapContext.fillText(contents[i + 1], combinedWidth, 21 * i);

                // Adjust array and index
                contents.splice(i, 2);
                i--;
            }

            $(".center-icon").toggle(window.isPlayerSeen);
            window.drawingEnd = 21 * (i + 1);
        }
    }

    // UI toggle functions
    window.showMap = function() {
        const navButtons = document.getElementById("popupnav-container");
        const map = document.querySelector(".popup-map");

        if (navButtons) navButtons.style.display = "none";
        if (map) map.style.display = "block";

        document.querySelectorAll(".map-icon").forEach(icon => {
            icon.style.display = "none";
        });

        window.needsRedraw = true;
    }

    window.closeMap = function() {
        const navButtons = document.getElementById("popupnav-container");
        const map = document.querySelector(".popup-map");
        const chatVisible = document.querySelector(".popup-chat")?.style.display === "block";

        document.querySelectorAll(".map-icon").forEach(icon => {
            icon.style.display = "";
        });

        if (navButtons && !chatVisible) {
            navButtons.style.display = "block";
        }

        if (map) map.style.display = "none";
    }

    // Call the function when chat is opened
    window.showChat = function() {
        const navButtons = document.getElementById("popupnav-container");
        const chat = document.querySelector(".popup-chat");

        if (navButtons) navButtons.style.display = "none";

        document.querySelectorAll(".chat-icon-container").forEach(icon => {
            icon.style.display = "none";
        });

        document.querySelectorAll(".chat-badge").forEach(badge => {
            badge.remove();
        });

        window.initChatPopup();
        if (chat.scrollHeight > chat.scrollTop + chat.clientHeight) window.addScrollToBottomButton();

        if (chat) chat.style.display = "block";
    }

    window.closeChat = function() {
        const navButtons = document.getElementById("popupnav-container");
        const chat = document.querySelector(".popup-chat");
        const mapVisible = document.querySelector(".popup-map")?.style.display === "block";
        const newMsgDivider = document.querySelector(".new-message-divider");

        document.querySelectorAll(".chat-icon-container").forEach(icon => {
            icon.style.display = "";
        });

        if (navButtons && !mapVisible) {
            navButtons.style.display = "block";
        }

        if (newMsgDivider) newMsgDivider.remove();
        if (chat) chat.style.display = "none";
    }

    // Resizable functionality
    window.makeResizableDiv = function(selector) {
        const element = document.querySelector(selector);
        if (!element) return;

        const container = document.getElementById("mobile-nav");
        if (!container) return;

        const resizers = element.querySelectorAll('.resizer');
        let originalWidth, originalHeight, originalX, originalY, originalMouseX, originalMouseY;
        let activeResizer = null;

        resizers.forEach(resizer => {
            resizer.addEventListener("mousedown", window.initResize);
            resizer.addEventListener("touchstart", window.initResize, {
                passive: false
            });
        });

        window.initResize = function(e) {
            e.preventDefault();
            activeResizer = e.target;
            originalWidth = element.offsetWidth;
            originalHeight = element.offsetHeight;
            originalX = container.offsetLeft;
            originalY = container.offsetTop;
            originalMouseX = e.pageX || e.touches[0].pageX;
            originalMouseY = e.pageY || e.touches[0].pageY;

            window.addEventListener("mousemove", window.resize);
            window.addEventListener("mouseup", window.stopResize);
            window.addEventListener("touchmove", window.resize, {
                passive: false
            });
            window.addEventListener("touchend", window.stopResize);
        }

        window.resize = function(e) {
            if (!activeResizer) return;
            e.preventDefault();

            const pageX = e.pageX || e.touches[0].pageX;
            const pageY = e.pageY || e.touches[0].pageY;
            const deltaX = pageX - originalMouseX;
            const deltaY = pageY - originalMouseY;

            // Default values
            let newWidth = originalWidth;
            let newHeight = originalHeight;
            let newX = originalX;
            let newY = originalY;

            // Minimum size based on element type
            const minSize = element.classList.contains('popup-map') ? 180 : 50;

            // Calculate new dimensions based on which resizer is active
            switch (true) {
                case activeResizer.classList.contains("bottom-right"):
                    newWidth = originalWidth + deltaX;
                    newHeight = originalHeight + deltaY;
                    break;
                case activeResizer.classList.contains("bottom-left"):
                    newWidth = originalWidth - deltaX;
                    newHeight = originalHeight + deltaY;
                    newX = originalX + deltaX;
                    break;
                case activeResizer.classList.contains("top-right"):
                    newWidth = originalWidth + deltaX;
                    newHeight = originalHeight - deltaY;
                    newY = originalY + deltaY;
                    break;
                case activeResizer.classList.contains("top-left"):
                    newWidth = originalWidth - deltaX;
                    newHeight = originalHeight - deltaY;
                    newX = originalX + deltaX;
                    newY = originalY + deltaY;
                    break;
            }

            // Apply width constraints
            if (newWidth > minSize && newWidth < 500) {
                document.querySelectorAll('.resizable').forEach(popup => {
                    popup.style.width = `${newWidth}px`;
                });

                if (container) container.style.left = `${newX}px`;

                if (window.mapCanvas) {
                    window.mapCanvas.width = newWidth * 2;
                    window.mapCanvas.style.width = `${newWidth}px`;
                    window.needsRedraw = true;
                }
            }

            // Apply height constraints
            if (newHeight > minSize && newHeight < 500) {
                element.style.height = `${newHeight}px`;
                if (container) container.style.top = `${newY}px`;

                if (element.classList.contains("popup-map") && window.mapCanvas) {
                    window.mapCanvas.height = newHeight * 2;
                    window.mapCanvas.style.height = `${newHeight}px`;
                    window.needsRedraw = true;
                }
            }
        }

        window.stopResize = function() {
            window.removeEventListener("mousemove", window.resize);
            window.removeEventListener("mouseup", window.stopResize);
            window.removeEventListener("touchmove", window.resize);
            window.removeEventListener("touchend", window.stopResize);
            activeResizer = null;
        }
    }

    window.chatScroll = function() {
        const scrollButton = document.getElementById("scroll-to-bottom");
        const newMsgDivider = document.querySelector(".new-message-divider");
        const chatContent = document.querySelector(".chat-content");
        const justOpened = chatContent.classList.contains("justOpened");
        const atBottom = chatContent.scrollHeight - chatContent.scrollTop <= chatContent.clientHeight + 10;
        if (scrollButton && atBottom) scrollButton.remove();
        if (newMsgDivider && atBottom && !justOpened) newMsgDivider.remove();
    }

    // Chat notifications
    window.setupSidebarObserver = function() {
        const communicationElement = document.getElementById('communication');
        const mapElement = document.getElementById('map');
        const sidebarElement = document.getElementById('sidebar');

        const sidebarObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    const chatPopupVisible = document.querySelector(".popup-chat")?.style.display === 'block';

                    if (!chatPopupVisible) {
                        window.updateChatNotificationBadge();
                    } else {
                        const chatContentElement = document.querySelector(".chat-content");
                        if (!communicationElement || !chatContentElement) return;
                        chatContentElement.innerHTML = communicationElement.innerHTML;
                        chatContentElement.scrollTop = chatContentElement.scrollHeight;
                    } 
                    
                    window.magicMapElement = document.getElementById('magicmap');
                    if (!window.storedMap === window.magicMapElement.innerHTML) window.needsRedraw = true;
                }
            });
        });

        sidebarObserver.observe(sidebarElement, {
            childList: true,
            subtree: true
        });
    }

    window.updateChatNotificationBadge = function() {
        const communicationElement = document.getElementById('communication');
        const chatContentElement = document.querySelector(".chat-content");

        if (!communicationElement || !chatContentElement) return;

        const newMessages = communicationElement.children.length - chatContentElement.children.length;

        if (newMessages <= 0) return;

        let badge = $('.chat-badge');
        const chatIconContainer = $('.chat-icon-container');

        if (chatIconContainer.length === 0) return;

        if (badge.length === 0) {
            chatIconContainer.append('<span class="chat-badge">' + newMessages + '</span>');
        }

        badge.text(newMessages);
    }

    window.initChatPopup = function() {
        const communicationElement = document.getElementById('communication');
        const chatContentElement = document.querySelector(".chat-content");

        if (!communicationElement || !chatContentElement) return;

        // Determine where new messages start
        const oldMessageCount = chatContentElement.children.length;
        const newMessageCount = communicationElement.children.length;
        const unreadStartIndex = newMessageCount - oldMessageCount;

        chatContentElement.innerHTML = communicationElement.innerHTML;

        if (unreadStartIndex > 0) {
            // Insert a red line where new messages start
            const firstUnreadMessage = chatContentElement.children[oldMessageCount];
            if (firstUnreadMessage) {
                const divider = document.createElement("div");
                divider.classList.add("new-message-divider");
                divider.textContent = "New Messages";
                divider.onclick = function(e) {
                    e.target.remove();
                };
                firstUnreadMessage.parentNode.insertBefore(divider, firstUnreadMessage);
                chatContentElement.classList.add("justOpened");

                // Scroll to the new message divider
                setTimeout(() => {
                    divider.scrollIntoView({
                        behavior: 'instant',
                        block: 'start'
                    });
                    setTimeout(() => {
                        chatContentElement.classList.remove("justOpened");
                    }, 100);
                }, 100);

                // Remove new message marker after 10s
                setTimeout(() => {
                    if (divider) divider.remove();
                }, 10000);
            }
        }
    }

    // Scroll-to-bottom button
    window.addScrollToBottomButton = function() {
        const chatPopup = document.querySelector(".popup-chat");
        const chatContent = document.querySelector(".chat-content");
        const newMsgDivider = document.querySelector(".new-message-divider");
        if (!chatPopup) return;

        let scrollButton = document.getElementById("scroll-to-bottom");
        if (!scrollButton) {
            scrollButton = document.createElement("button");
            scrollButton.id = "scroll-to-bottom";
            scrollButton.innerText = "↓";
            scrollButton.onclick = () => {
                chatContent.scrollTop = chatContent.scrollHeight;
            };

            chatPopup.appendChild(scrollButton);
        }
    }

    // Set up event listeners
    function initializeEventListeners() {
        // Canvas events
        window.mapCanvas.addEventListener("mousedown", window.handlePointerDown);
        window.mapCanvas.addEventListener("mouseup", window.handlePointerUp);
        window.mapCanvas.addEventListener("mousemove", window.handlePointerMove);
        window.mapCanvas.addEventListener("touchstart", window.handlePointerDown, {
            passive: true
        });
        window.mapCanvas.addEventListener("touchend", window.handlePointerUp);
        window.mapCanvas.addEventListener("touchmove", window.handlePointerMove, {
            passive: true
        });

        // Zoom controls
        window.zoomSlider.addEventListener('input', window.handleZoomSlider);
        window.zoomInBtn.addEventListener('click', window.zoomIn);
        window.zoomOutBtn.addEventListener('click', window.zoomOut);

        // Popup events
        $('.map-icon').on("click", window.showMap);
        $('.chat-icon').on("click", window.showChat);
        $('.popup-map .exit-icon').on("click", window.closeMap);
        $('.center-icon').on("click", window.centerPlayer);
        $('.popup-chat .exit-icon').on("click", window.closeChat);
        $('.chat-content').on("scroll", window.chatScroll);
        const observer = new ResizeObserver(() => {
            window.positionPopupNav();
        });

        observer.observe(document.querySelector("#mudoutput"));
    }


    // Initialize everything at the end
    function initialize() {
        // Create resizable elements
        window.makeResizableDiv('.popup-map');
        window.makeResizableDiv('.popup-chat');

        // Set up event listeners
        initializeEventListeners();

        // Fix rendering of canvas based on #mudoutput
        const mudOutput = document.getElementById("mudoutput");
        const mobileNav = document.getElementById("mobile-nav");
        const mudRect = mudOutput.getBoundingClientRect();
        mobileNav.style.top = `${mudRect.top}px`;
        mobileNav.style.left = `${mudRect.left}px`;
        mobileNav.style.width = `${mudRect.offsetWidth*0.75}px`;
        mobileNav.style.height = `${mudRect.offsetHeight*0.20}px`;
        window.mapCanvas.height = mudRect.offsetHeight * 0.20 * 2;
        window.mapCanvas.width = mudRect.offsetWidth * 0.75 * 2;
        window.zoomSlider.value = 150;

        // Start the rendering loop
        window.needsRedraw = true;
        window.draw();

        // Initialize map and chat observer
        window.setupSidebarObserver();
    }

    // Start initialization AFTER everything is defined
    // Add a small delay to ensure DOM is fully ready
    setTimeout(initialize, 100);
}

// Add options to load the script
// Option 1: Wait for DOMContentLoaded
document.addEventListener('DOMContentLoaded', initMapExtension);

// Option 2: Execute immediately if document is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initMapExtension, 100);
}

