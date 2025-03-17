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
    window.mapCanvas = document.getElementById('magicmap-canvas');
    window.mapContext = window.mapCanvas.getContext('2d');
    window.magicMapElement = document.getElementById('magicmap');
    window.zoomSlider = document.getElementById('zoom-slider');
    window.zoomInBtn = document.getElementById('zoom-in');
    window.zoomOutBtn = document.getElementById('zoom-out');

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

    // Initialize canvas
    window.mapCanvas.height = 600;
    window.mapCanvas.width = 600;
    window.zoomSlider.value = 100;

    // Trick source code into thinking sidebar is visible hehe
    const originalIs = $.fn.is;
    $.fn.is = function(selector) {
        if (this.attr("id") === "sidebar" && selector === ":visible") {
            return true;
        }
        return originalIs.apply(this, arguments);
    };

    // Helper functions
    window.longestLine = function (lines) {
        return lines.reduce((longest, current) =>
            current.length > longest.length ? current : longest, "");
    }

    window.requestRedraw() = function () {
        window.needsRedraw = true;
    }

    // Event handling
    window.getEventLocation = function (e) {
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

    function handlePointerDown(e) {
        window.isDragging = true;
        const location = window.getEventLocation(e);
        if (location) {
            window.dragStart.x = location.x;
            window.dragStart.y = location.y;
        }
    }

    function handlePointerUp() {
        window.isDragging = false;
    }

    function handlePointerMove(e) {
        if (!window.isDragging) return;

        const location = window.getEventLocation(e);
        if (!location) return;

        window.updateCameraPosition(location);
        window.requestRedraw();
    }

    window.updateCameraPosition = function (location) {
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

    function centerPlayer() {
        window.cameraOffset.x = -window.playerCoords.x + (window.mapCanvas.width / (2 * window.cameraZoom));
        window.cameraOffset.y = -window.playerCoords.y + (window.mapCanvas.height / (2 * window.cameraZoom));
        window.requestRedraw();
    }

    // Zoom controls
    function handleZoomSlider() {
        window.cameraZoom = parseFloat(this.value) / 100;
        window.requestRedraw();
    }

    function zoomIn() {
        window.cameraZoom = Math.min(window.cameraZoom + 0.1, 2.5);
        window.zoomSlider.value = window.cameraZoom * 100;
        window.requestRedraw();
    }

    function zoomOut() {
        window.cameraZoom = Math.max(window.cameraZoom - 0.1, 1.0);
        window.zoomSlider.value = window.cameraZoom * 100;
        window.requestRedraw();
    }

    // Map rendering
    window.getMapContents = function () {
        if (!window.magicMapElement) return [];
        return window.magicMapElement.innerHTML
            .split(/\n|<font color="red">|<\/font>/)
            .filter(value => value.length > 0);
    }

    window.draw = function () {
        if (!window.needsRedraw) {
            window.requestAnimationFrame(window.draw);
            return;
        }

        window.needsRedraw = false;
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

    window.drawMapContents = function (contents) {
        window.mapContext.fillStyle = "white";

        for (let i = 0; i < contents.length; i++) {
            if (contents[i] !== 'X') {
                window.mapContext.fillText(contents[i], 0, 21 * (i + 1));
            } else {
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

            window.drawingEnd = 21 * (i + 1);
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

        window.requestRedraw();
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

        window.initChatPopup();
        window.addScrollToBottomButton();

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
    window.makeResizableDiv = function (selector) {
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

        window.initResize = function (e) {
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

        window.resize = function (e) {
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
                    window.requestRedraw();
                }
            }

            // Apply height constraints
            if (newHeight > minSize && newHeight < 500) {
                element.style.height = `${newHeight}px`;
                if (container) container.style.top = `${newY}px`;

                if (element.classList.contains("popup-map") && window.mapCanvas) {
                    window.mapCanvas.height = newHeight * 2;
                    window.mapCanvas.style.height = `${newHeight}px`;
                    window.requestRedraw();
                }
            }
        }

        window.stopResize = function () {
            window.removeEventListener("mousemove", window.resize);
            window.removeEventListener("mouseup", window.stopResize);
            window.removeEventListener("touchmove", window.resize);
            window.removeEventListener("touchend", window.stopResize);
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
    window.setupChatObserver = function () {
        const communicationElement = document.getElementById('communication');
        if (!communicationElement) return;

        const chatObserver = new MutationObserver(function(mutations) {
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
                }
            });
        });

        chatObserver.observe(communicationElement, {
            childList: true,
            subtree: false
        });
    }

    window.updateChatNotificationBadge = function () {
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

    window.initChatPopup = function () {
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
    window.addScrollToBottomButton = function () {
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
        window.mapCanvas.addEventListener("mousedown", handlePointerDown);
        window.mapCanvas.addEventListener("mouseup", handlePointerUp);
        window.mapCanvas.addEventListener("mousemove", handlePointerMove);
        window.mapCanvas.addEventListener("touchstart", handlePointerDown, {
            passive: true
        });
        window.mapCanvas.addEventListener("touchend", handlePointerUp);
        window.mapCanvas.addEventListener("touchmove", handlePointerMove, {
            passive: true
        });

        // Zoom controls
        window.zoomSlider.addEventListener('input', handleZoomSlider);
        window.zoomInBtn.addEventListener('click', zoomIn);
        window.zoomOutBtn.addEventListener('click', zoomOut);

        // Popup events
        $('.map-icon').on( "click", showMap());
        $('.chat-icon').on( "click", showChat());
        $('.popup-map .exit-icon').on( "click", closeMap());
        $('.center-icon').on( "click", centerPlayer());
        $('.popup-chat .exit-icon').on( "click", closeChat());
    }

    // Initialize everything
    function initialize() {
        // Create resizable elements
        window.makeResizableDiv('.popup-map');
        window.makeResizableDiv('.popup-chat');

        // Initialize chat notification system
        window.setupChatObserver();

        // Set up event listeners
        initializeEventListeners();

        // Start the rendering loop
        window.requestRedraw();
        window.draw();
    }

    // Run initialization
    initialize();
});
