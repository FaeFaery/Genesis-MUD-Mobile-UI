function injectMinifiedCSS() {
    const style = document.createElement('style');
    style.textContent = '#magicmap-canvas{display:relative;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;background:#000;width:100%;height:100%;opacity:.9}#magicmap-img{object-fit:cover}#popup-buttons{position:absolute;user-select:none;top:6px;right:0;z-index:1;display:flex;flex-direction:column;background-color:rgba(0,0,0,.3)}#popupnav-container{position:absolute;user-select:none;top:0;left:0;display:flex;padding:10px;flex-direction:row;background-color:rgba(0,0,0,.1);gap:5px}#popupnav-container>*{margin-right:5px}#mobile-nav{position:absolute;top:100px;left:100px;display:flex;flex-direction:column}.popup-map{width:300px;height:300px;display:none;position:relative;border:1px solid #fff}.popup-chat{width:300px;height:100px;display:none;position:relative;overflow:hidden;border:1px solid #fff;background-color:rgba(0,0,0,.9)}.chat-content{height:100%;width:100%;color:#d0d0d0;font-family:Source Code Pro,sans-serif;overflow-y:scroll;font-size:14px;margin-left:5px;padding-right:10px;box-sizing:content-box}.resizable .resizers{width:100%;height:100%;box-sizing:border-box}.resizable .resizers .resizer{width:15px;height:15px;border-radius:50%;position:absolute}.resizable .resizers .resizer.top-left{left:-5px;top:-5px;cursor:nwse-resize}.resizable .resizers .resizer.top-right{right:-5px;top:-5px;cursor:nesw-resize}.resizable .resizers .resizer.bottom-left{left:-5px;bottom:-5px;cursor:nesw-resize}.resizable .resizers .resizer.bottom-right{right:-5px;bottom:-5px;cursor:nwse-resize}.exit-icon{cursor:pointer;user-select:none;width:30px;height:30px;color:#fff;font-size:30px;margin-bottom:-3px;font-variation-settings:\'FILL\' 0,\'wght\' 400,\'GRAD\' 0,\'opsz\' 24}.map-icon{cursor:pointer;display:block;user-select:none;color:#fff;font-size:20px;font-variation-settings:\'FILL\' 0,\'wght\' 300,\'GRAD\' 0,\'opsz\' 24}.center-icon{cursor:pointer;width:30px;height:30px;color:#fff;font-size:30px;font-variation-settings:\'FILL\' 0,\'wght\' 350,\'GRAD\' 0,\'opsz\' 24}.chat-icon{cursor:pointer;width:30px;height:30px;color:#fff;font-size:30px;font-variation-settings:\'FILL\' 0,\'wght\' 250,\'GRAD\' 0,\'opsz\' 24}.chat-icon-container{position:relative;display:inline-block}.chat-badge{font-family:Source Code Pro,sans-serif;position:absolute;top:-5px;right:2px;background-color:red;color:#fff;border-radius:50%;width:15px;height:15px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;padding:0;line-height:1;box-sizing:border-box;text-align:center}.new-message-divider{text-align:center;font-size:12px;color:#888;background:rgba(200,200,200,.3);padding:3px 0;margin:5px 0;transition:opacity 1s ease-out}#scroll-to-bottom{position:absolute;bottom:0;right:50%;padding:5px 10px;background:rgba(0,0,0,.5);color:#fff;border:none;border-radius:50%;cursor:pointer;animation:bobbing 1s ease-in-out infinite}@keyframes bobbing{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}.zoom-controls{user-select:none;display:flex;z-index:1;flex-direction:column;align-items:center;position:absolute;left:10px;top:9px;padding:5px 1px;background-color:rgba(255,255,255,.1);border-radius:4px}.zoom-slider{width:30px;height:100px;margin:10px 0;-webkit-appearance:slider-vertical;writing-mode:bt-lr}.zoom-btn{width:20px;height:20px;color:rgba(255,255,255);border-radius:4px;background-color:rgba(245,245,245,.3);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center}';
    document.head.appendChild(style);
}

async function injectMinifiedHTML() {
    const container = document.createElement('div');
    const popupNav = document.getElementById('popupnav-container');
    if (popupNav) return;
    container.innerHTML = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" /><div id="popupnav-container"><span class='map-icon material-symbols-outlined' onclick='showMap()'>explore</span><div class='chat-icon-container' onclick='showChat()'><span class='chat-icon material-symbols-outlined'>chat_bubble</span></div></div><div id="mobile-nav"><div class='resizable popup-map'><div id="popup-buttons"><span class='exit-icon material-symbols-outlined' onclick='closeMap()'>close</span><span class='center-icon material-symbols-outlined' onclick='centerPlayer()'>center_focus_strong</span><div class='chat-icon-container' onclick='showChat()'><span class='chat-icon material-symbols-outlined'>chat_bubble</span></div></div><div class="zoom-controls"><button id="zoom-in" class="zoom-btn">+</button><input type="range" id="zoom-slider" class="zoom-slider" min="100" max="250" value="100" orient="vertical"><button id="zoom-out" class="zoom-btn">−</button></div><div class='resizers'><canvas id='magicmap-canvas'></canvas><div class='resizer top-left'></div><div class='resizer top-right'></div><div class='resizer bottom-left'></div><div class='resizer bottom-right'></div></div></div><div class='resizable popup-chat'><div id="popup-buttons"><span class='exit-icon material-symbols-outlined' onclick='closeChat()'>close</span><span class='map-icon material-symbols-outlined' onclick='showMap()'>explore</span></div><div class='resizers'><div class='chat-content'></div><div class='resizer bottom-left'></div><div class='resizer bottom-right'></div></div></div></div>`;

    document.body.appendChild(container);
}

function positionPopupNav() {
    const popupNav = document.getElementById("popup-nav-container");
    const mudOutput = document.getElementById("mudoutput");

    if (!popupNav || !mudOutput) return;

    const mudRect = mudOutput.getBoundingClientRect();

    popupNav.style.position = "absolute"; // Ensure absolute positioning
    popupNav.style.top = `${mudRect.top}px`;
    popupNav.style.left = `${mudRect.left}px`;
}

injectMinifiedCSS();
positionPopupNav();
injectMinifiedHTML().then(() => {
    // Cache DOM elements
    const mapCanvas = document.getElementById('magicmap-canvas');
    const mapContext = mapCanvas.getContext('2d');
    const magicMapElement = document.getElementById('magicmap');
    const zoomSlider = document.getElementById('zoom-slider');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');

    // Constants
    const LINE_HEIGHT = 21; // 10.5 * 2
    const MIN_ZOOM = 1.0;
    const MAX_ZOOM = 2.5;
    const ZOOM_INCREMENT = 0.1;
    const PAN_SENSITIVITY = 0.07;
    const MIN_SIZE = 180;
    const MAX_SIZE = 500;
    const CHAT_MIN_SIZE = 50;
    const FONT_SIZE = 15;
    const FONT_FAMILY = "Source Code Pro, sans-serif";

    // State variables
    let cameraOffset = {
        x: 0,
        y: 0
    };
    let dragStart = {
        x: 0,
        y: 0
    };
    let playerCoords = {
        x: 0,
        y: 0
    };
    let cameraZoom = 1;
    let isDragging = false;
    let drawingEnd = 0;
    let maxOffsetX = 0;
    let maxOffsetY = 0;
    let needsRedraw = true;

    // Initialize canvas
    mapCanvas.height = 600;
    mapCanvas.width = 600;
    zoomSlider.value = 100;

    // Trick source code into thinking sidebar is visible hehe
    const originalIs = $.fn.is;
    $.fn.is = function(selector) {
        if (this.attr("id") === "sidebar" && selector === ":visible") {
            return true;
        }
        return originalIs.apply(this, arguments);
    };

    // Helper functions
    function longestLine(lines) {
        return lines.reduce((longest, current) =>
            current.length > longest.length ? current : longest, "");
    }

    function requestRedraw() {
        needsRedraw = true;
    }

    // Event handling
    function getEventLocation(e) {
        if (e.touches && e.touches.length === 1) {
            const rect = mapCanvas.getBoundingClientRect();
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

    function handlePointerDown(e) {
        isDragging = true;
        const location = getEventLocation(e);
        if (location) {
            dragStart.x = location.x;
            dragStart.y = location.y;
        }
    }

    function handlePointerUp() {
        isDragging = false;
    }

    function handlePointerMove(e) {
        if (!isDragging) return;

        const location = getEventLocation(e);
        if (!location) return;

        updateCameraPosition(location);
        requestRedraw();
    }

    function updateCameraPosition(location) {
        const contents = getMapContents();
        maxOffsetX = mapContext.measureText(longestLine(contents)).width;
        maxOffsetY = drawingEnd;

        const deltaX = (location.x - dragStart.x) * PAN_SENSITIVITY;
        const deltaY = (location.y - dragStart.y) * PAN_SENSITIVITY;

        // Calculate potential new positions
        let newX = cameraOffset.x + deltaX;
        let newY = cameraOffset.y + deltaY;

        // Constrain within boundaries
        cameraOffset.x = Math.max(-maxOffsetX, Math.min(maxOffsetX, newX));
        cameraOffset.y = Math.max(-maxOffsetY, Math.min(maxOffsetY, newY));
    }

    function centerPlayer() {
        cameraOffset.x = -playerCoords.x + (mapCanvas.width / (2 * cameraZoom));
        cameraOffset.y = -playerCoords.y + (mapCanvas.height / (2 * cameraZoom));
        requestRedraw();
    }

    // Zoom controls
    function handleZoomSlider() {
        cameraZoom = parseFloat(this.value) / 100;
        requestRedraw();
    }

    function zoomIn() {
        cameraZoom = Math.min(cameraZoom + ZOOM_INCREMENT, MAX_ZOOM);
        zoomSlider.value = cameraZoom * 100;
        requestRedraw();
    }

    function zoomOut() {
        cameraZoom = Math.max(cameraZoom - ZOOM_INCREMENT, MIN_ZOOM);
        zoomSlider.value = cameraZoom * 100;
        requestRedraw();
    }

    // Map rendering
    function getMapContents() {
        if (!magicMapElement) return [];
        return magicMapElement.innerHTML
            .split(/\n|<font color="red">|<\/font>/)
            .filter(value => value.length > 0);
    }

    function draw() {
        if (!needsRedraw) {
            window.requestAnimationFrame(draw);
            return;
        }

        needsRedraw = false;
        const contents = getMapContents();

        // Clear canvas
        mapContext.setTransform(1, 0, 0, 1, 0, 0);
        mapContext.clearRect(0, 0, mapCanvas.width, mapCanvas.height);

        // Apply camera transformations
        mapContext.scale(cameraZoom, cameraZoom);
        mapContext.translate(cameraOffset.x, cameraOffset.y);

        // Set initial style
        mapContext.font = `${FONT_SIZE}px ${FONT_FAMILY}`;
        mapContext.fillStyle = "black";
        mapContext.fillRect(0, 0, mapCanvas.width, mapCanvas.height);

        // Draw text content
        drawMapContents(contents);

        window.requestAnimationFrame(draw);
    }

    function drawMapContents(contents) {
        mapContext.fillStyle = "white";

        for (let i = 0; i < contents.length; i++) {
            if (contents[i] !== 'X') {
                mapContext.fillText(contents[i], 0, LINE_HEIGHT * (i + 1));
            } else {
                // Handle player position (red X)
                const prevLineWidth = mapContext.measureText(contents[i - 1]).width;

                mapContext.fillStyle = "rgb(255, 49, 49)";
                mapContext.font = `bold ${FONT_SIZE}px ${FONT_FAMILY}`;
                mapContext.fillText(contents[i], prevLineWidth, LINE_HEIGHT * i);

                // Store player coordinates
                playerCoords.x = prevLineWidth;
                playerCoords.y = LINE_HEIGHT * i;

                // Reset style and draw remainder of line
                mapContext.font = `${FONT_SIZE}px ${FONT_FAMILY}`;
                mapContext.fillStyle = "white";

                const combinedWidth = mapContext.measureText(contents[i - 1] + contents[i]).width;
                mapContext.fillText(contents[i + 1], combinedWidth, LINE_HEIGHT * i);

                // Adjust array and index
                contents.splice(i, 2);
                i--;
            }

            drawingEnd = LINE_HEIGHT * (i + 1);
        }
    }

    // UI toggle functions
    function showMap() {
        const navButtons = document.getElementById("popupnav-container");
        const map = document.querySelector(".popup-map");

        if (navButtons) navButtons.style.display = "none";
        if (map) map.style.display = "block";

        document.querySelectorAll(".map-icon").forEach(icon => {
            icon.style.display = "none";
        });

        requestRedraw();
    }

    function closeMap() {
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
    function showChat() {
        const navButtons = document.getElementById("popupnav-container");
        const chat = document.querySelector(".popup-chat");

        if (navButtons) navButtons.style.display = "none";

        document.querySelectorAll(".chat-icon-container").forEach(icon => {
            icon.style.display = "none";
        });

        document.querySelectorAll(".chat-badge").forEach(badge => {
            badge.remove();
        });

        initChatPopup();
        addScrollToBottomButton();

        if (chat) chat.style.display = "block";
    }

    function closeChat() {
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
    function makeResizableDiv(selector) {
        const element = document.querySelector(selector);
        if (!element) return;

        const container = document.getElementById("mobile-nav");
        if (!container) return;

        const resizers = element.querySelectorAll('.resizer');
        let originalWidth, originalHeight, originalX, originalY, originalMouseX, originalMouseY;
        let activeResizer = null;

        resizers.forEach(resizer => {
            resizer.addEventListener("mousedown", initResize);
            resizer.addEventListener("touchstart", initResize, {
                passive: false
            });
        });

        function initResize(e) {
            e.preventDefault();
            activeResizer = e.target;
            originalWidth = element.offsetWidth;
            originalHeight = element.offsetHeight;
            originalX = container.offsetLeft;
            originalY = container.offsetTop;
            originalMouseX = e.pageX || e.touches[0].pageX;
            originalMouseY = e.pageY || e.touches[0].pageY;

            window.addEventListener("mousemove", resize);
            window.addEventListener("mouseup", stopResize);
            window.addEventListener("touchmove", resize, {
                passive: false
            });
            window.addEventListener("touchend", stopResize);
        }

        function resize(e) {
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
            const minSize = element.classList.contains('popup-map') ? MIN_SIZE : CHAT_MIN_SIZE;

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
            if (newWidth > minSize && newWidth < MAX_SIZE) {
                document.querySelectorAll('.resizable').forEach(popup => {
                    popup.style.width = `${newWidth}px`;
                });

                if (container) container.style.left = `${newX}px`;

                if (mapCanvas) {
                    mapCanvas.width = newWidth * 2;
                    mapCanvas.style.width = `${newWidth}px`;
                    requestRedraw();
                }
            }

            // Apply height constraints
            if (newHeight > minSize && newHeight < MAX_SIZE) {
                element.style.height = `${newHeight}px`;
                if (container) container.style.top = `${newY}px`;

                if (element.classList.contains("popup-map") && mapCanvas) {
                    mapCanvas.height = newHeight * 2;
                    mapCanvas.style.height = `${newHeight}px`;
                    requestRedraw();
                }
            }
        }

        function stopResize() {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResize);
            window.removeEventListener("touchmove", resize);
            window.removeEventListener("touchend", stopResize);
            activeResizer = null;
        }
    }

    document.querySelector(".chat-content").addEventListener("scroll", (event) => {
        const scrollButton = document.getElementById("scroll-to-bottom");
        const newMsgDivider = document.querySelector(".new-message-divider");
        const chatContent = event.target;
        const justOpened = chatContent.classList.contains("justOpened");
        const atBottom = chatContent.scrollHeight - chatContent.scrollTop <= chatContent.clientHeight + 10;
        if (scrollButton && atBottom) scrollButton.remove();
        if (newMsgDivider && atBottom && !justOpened) newMsgDivider.remove();
    });

    // Chat notifications
    function setupChatObserver() {
        const communicationElement = document.getElementById('communication');
        if (!communicationElement) return;

        const chatObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    const chatPopupVisible = document.querySelector(".popup-chat")?.style.display === 'block';

                    if (!chatPopupVisible) {
                        updateChatNotificationBadge();
                    } else {
                        const chatContentElement = document.querySelector(".chat-content");
                        if (!communicationElement || !chatContentElement) return;
                        chatContentElement.innerHTML = communicationElement.innerHTML;
                        chatContentElement.scrollTop = chatContentElement.scrollHeight;
                    }
                }
            });
        });

        chatObserver.observe(communicationElement, {
            childList: true,
            subtree: false
        });
    }

    function updateChatNotificationBadge() {
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

    function initChatPopup() {
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
    function addScrollToBottomButton() {
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
        mapCanvas.addEventListener("mousedown", handlePointerDown);
        mapCanvas.addEventListener("mouseup", handlePointerUp);
        mapCanvas.addEventListener("mousemove", handlePointerMove);
        mapCanvas.addEventListener("touchstart", handlePointerDown, {
            passive: true
        });
        mapCanvas.addEventListener("touchend", handlePointerUp);
        mapCanvas.addEventListener("touchmove", handlePointerMove, {
            passive: true
        });

        // Zoom controls
        zoomSlider.addEventListener('input', handleZoomSlider);
        zoomInBtn.addEventListener('click', zoomIn);
        zoomOutBtn.addEventListener('click', zoomOut);
    }

    // Initialize everything
    function initialize() {
        // Create resizable elements
        makeResizableDiv('.popup-map');
        makeResizableDiv('.popup-chat');

        // Initialize chat notification system
        setupChatObserver();

        // Set up event listeners
        initializeEventListeners();

        // Start the rendering loop
        requestRedraw();
        draw();
    }

    // Run initialization
    initialize();
});
