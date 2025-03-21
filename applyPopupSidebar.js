// Self-executing function for better scoping and performance
(function() {
    // Initialize once DOM is ready
    function initMapExtension() {
        // Check for jQuery dependency
        if (typeof $ === 'undefined') {
            console.error('jQuery not found. Magic Map requires jQuery.');
            return;
        }

        // Inject minified CSS with one DOM operation
        function injectMinifiedCSS() {
            try {
                const style = document.createElement('style');
                style.textContent = '#magicmap-canvas{display:relative;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;background:#000;width:100%;height:100%;opacity:.9}#magicmap-img{object-fit:cover}#popup-buttons{position:absolute;user-select:none;top:6px;right:0;z-index:1;display:flex;flex-direction:column;background-color:rgba(0,0,0,.3)}#popupnav-container{position:absolute;user-select:none;top:0;right:0;display:flex;padding:10px;flex-direction:row;gap:5px}#popupnav-container>*{margin-right:5px}#mobile-nav{position:absolute;top:100px;left:100px;display:flex;flex-direction:column}.popup-map{width:300px;height:300px;position:relative;border:1px solid #fff;background:#000;opacity:.9}.popup-chat{width:300px;height:100px;position:relative;overflow:hidden;border:1px solid #fff;background-color:rgba(0,0,0,.9)}.chat-content{height:calc(100% - 10px);width:100%;color:#d0d0d0;font-family:Source Code Pro,sans-serif;overflow-y:scroll;overflow-x:hidden;word-wrap:break-word;white-space:normal;overflow-wrap:break-word;font-size:14px;padding-right:10px;padding-left:10px;padding-top:10px;box-sizing:content-box}.resizable .resizers{width:100%;height:100%;box-sizing:border-box}.resizable .resizers .resizer{width:15px;height:15px;border-radius:50%;position:absolute}.resizable .resizers .resizer.top-left{left:-5px;top:-5px;cursor:nwse-resize}.resizable .resizers .resizer.top-right{right:-5px;top:-5px;cursor:nesw-resize}.resizable .resizers .resizer.bottom-left{left:-5px;bottom:-5px;cursor:nesw-resize}.resizable .resizers .resizer.bottom-right{right:-5px;bottom:-5px;cursor:nwse-resize}.exit-icon{cursor:pointer;user-select:none;width:30px;height:30px;color:#fff;font-size:30px;margin-bottom:-3px;font-variation-settings:\'FILL\' 0,\'wght\' 400,\'GRAD\' 0,\'opsz\' 24}.map-icon{cursor:pointer;display:block;user-select:none;color:#fff;font-size:20px;font-variation-settings:\'FILL\' 1,\'wght\' 300,\'GRAD\' 0,\'opsz\' 24}.center-icon{cursor:pointer;width:30px;height:30px;color:#fff;font-size:30px;font-variation-settings:\'FILL\' 0,\'wght\' 350,\'GRAD\' 0,\'opsz\' 24}.chat-icon{cursor:pointer;width:30px;height:30px;color:#fff;font-size:30px;font-variation-settings:\'FILL\' 1,\'wght\' 250,\'GRAD\' 0,\'opsz\' 24}.zoom-icon {cursor: pointer;width: 30px;height: 30px;color: #fff;font-size: 30px;font-variation-settings: \'FILL\' 0, \'wght\' 250, \'GRAD\' 0, \'opsz\' 24}.settings-icon{cursor: pointer;width: 30px;height: 30px;color: #999999;font-size: 30px;position: absolute;user-select: none;top: 0;left: 0;padding: 10px;font-variation-settings: \'FILL\' 1, \'wght\' 250, \'GRAD\' 0, \'opsz\' 24}.chat-icon-container{position:relative;display:inline-block}.chat-badge{font-family:Source Code Pro,sans-serif;position:absolute;top:-5px;right:2px;background-color:red;color:#fff;border-radius:50%;width:15px;height:15px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;padding:0;line-height:1;box-sizing:border-box;text-align:center}.new-message-divider{position:relative;justify-content:center;padding-left:0;padding-right:0;box-sizing:border-box;padding-top:5px;width:calc(100% - 20px);margin-left:0;margin-right:0;display:flex;align-items:center;font-size:8px;font-weight:bold;text-transform:uppercase;color:#fff;font-family:Arial,sans-serif;color:white;user-select:none}.new-message-divider::before,.new-message-divider::after{content:"";flex-grow:0.7;height:1px;background:rgba(255,255,255,0.1);margin:0 8px}.new-message-divider>span{background-color:#ff2d2d;padding:4px 10px;border-radius:8px}#scroll-to-bottom{position:absolute;bottom:0;right:50%;padding:5px 10px;background:rgba(0,0,0,.5);color:#fff;border:none;border-radius:50%;cursor:pointer;-webkit-box-shadow:none;animation:bobbing 1s ease-in-out infinite}@keyframes bobbing{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}.zoom-controls{user-select:none;display:none;z-index:1;flex-direction:column;align-items:center;position:absolute;left:10px;top: 50%;transform: translateY(-50%);padding:5px 1px;background-color:rgba(255,255,255,.1);border-radius:4px}.zoom-slider{width:30px;height:100px;margin:10px 0}.zoom-btn{width:20px;height:20px;color:rgba(255,255,255);border-radius:4px;background-color:rgba(245,245,245,.3);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center}';
                document.head.appendChild(style);
            } catch (error) {
                console.error('Failed to inject CSS:', error);
            }
        }

        // Inject HTML using createDocumentFragment for better performance
        function injectMinifiedHTML() {
            try {
                const existingWrapper = document.getElementById("mobileNav-wrapper");
                if (existingWrapper) existingWrapper.remove();

                const container = document.createElement('div');
                container.id = "mobileNav-wrapper";

                // Use innerHTML once for better performance
                container.innerHTML = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" /><div id="popupnav-container"><span class="settings-icon material-symbols-outlined">settings</span><span class='map-icon material-symbols-outlined'>explore</span><div class='chat-icon-container'><span class='chat-icon material-symbols-outlined'>chat_bubble</span></div></div><div id="mobile-nav"><div class='resizable popup-map'><div id="popup-buttons"><span class='exit-icon material-symbols-outlined'>close</span><span class='center-icon material-symbols-outlined'>center_focus_strong</span><div class='chat-icon-container'><span class='chat-icon material-symbols-outlined'>chat_bubble</span></div><span class="zoom-icon material-symbols-outlined">zoom_in</span></div><div class="zoom-controls"><button id="zoom-in" class="zoom-btn">+</button><input type="range" id="zoom-slider" class="zoom-slider" min="100" max="250" value="100" style="writing-mode: vertical-lr; direction: rtl"><button id="zoom-out" class="zoom-btn">−</button></div><div class='resizers'><canvas id='magicmap-canvas'></canvas><div class='resizer top-left'></div><div class='resizer top-right'></div><div class='resizer bottom-left'></div><div class='resizer bottom-right'></div></div></div><div class='resizable popup-chat'><div id="popup-buttons"><span class='exit-icon material-symbols-outlined' style="padding-top: 5px;">close</span><span class='map-icon material-symbols-outlined'>explore</span></div><div class='resizers'><div class='chat-content'></div><div class='resizer bottom-left'></div><div class='resizer bottom-right'></div></div></div></div>`;

                document.body.appendChild(container);
            } catch (error) {
                console.error('Failed to inject HTML:', error);
            }
        }

        // Bypass the webclient method to prevent map updates when map isn't visible hehe :3
        const setupJQuery = () => {
            const originalIs = $.fn.is;
            $.fn.is = function(selector) {
                if (this.attr("id") === "sidebar" && selector === ":visible") {
                    return true;
                }
                return originalIs.apply(this, arguments);
            };
        };

        // Create a central state object
        const state = {
            cameraOffset: {
                x: 0,
                y: 0
            },
            dragStart: {
                x: 0,
                y: 0
            },
            playerCoords: {
                x: 0,
                y: 0
            },
            cameraZoom: 1.5,
            isDragging: false,
            playerMoved: false,
            drawingEnd: 0,
            maxOffsetX: 0,
            maxOffsetY: 0,
            needsRedraw: false,
            storedMap: null,
            isPlayerSeen: false,
            FONT_SIZE: 15,
            FONT_FAMILY: "Source Code Pro, sans-serif"
        };

        // DOM elements cache
        let elements = {};

        // Functions
        const utils = {
            // Use a single text decoder for HTML entities
            textDecoder: document.createElement("textarea"),

            decodeHTML: function(html) {
                this.textDecoder.innerHTML = html;
                return this.textDecoder.value;
            },

            // Function to find the longest line in the map for drawing canvas
            longestLine: function(lines) {
                return this.decodeHTML(
                    lines.reduce((longest, current) =>
                        this.decodeHTML(current).length > this.decodeHTML(longest).length ? current : longest, "")
                );
            },

            // Get cursor location on click/touch
            getEventLocation: function(e) {
                if (e.touches && e.touches.length === 1) {
                    const rect = elements.mapCanvas.getBoundingClientRect();
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
            },

            // Grab map contents
            // Add a space in between player highlight and new line just in case
            // Split into an array of map lines and isolate player highlight
            // Exclude any empty objects
            getMapContents: function() {
                if (!elements.magicMapElement) return [];
                const contents = elements.magicMapElement.innerHTML;
                return contents
                    .replace(/<\/font>\n/, "</font> \n")
                    .split(/\n|<font color="red">|<\/font>/)
                    .filter(value => value.length > 0);
            },

            // Ensure the map and chat buttons stay aligned to the top right of the mud log
            positionPopupNav: function() {
                const popupNav = elements.popupNav;
                const mudOutput = elements.mudOutput;
                if (!popupNav || !mudOutput) return;

                const mudRect = mudOutput.getBoundingClientRect();
                const bodyRect = document.body.getBoundingClientRect();

                if (window.innerWidth <= 768) {
                    const controls = elements.controls;
                    if (!controls) return;
                    popupNav.style.top = `${controls.offsetHeight}px`;
                    popupNav.style.right = `${bodyRect.width - mudRect.right + 5}px`;
                    return;
                }

                popupNav.style.top = `${mudRect.top - 10}px`;
                popupNav.style.right = `${bodyRect.width - mudRect.right + 5}px`;
            }
        };

        // Event Handlers, duh
        const eventHandlers = {
            handlePointerDown: function(e) {
                state.isDragging = true;
                const location = utils.getEventLocation(e);
                if (location) {
                    state.dragStart.x = location.x;
                    state.dragStart.y = location.y;
                }
            },

            handlePointerUp: function() {
                state.isDragging = false;
            },

            handlePointerMove: function(e) {
                if (!state.isDragging) return;

                const location = utils.getEventLocation(e);
                if (!location) return;

                mapRendering.updateCameraPosition(location);
                state.needsRedraw = true;
            },

            handleZoomSlider: function() {
                state.cameraZoom = parseFloat(this.value) / 100;
                state.needsRedraw = true;
            },

            zoomIn: function() {
                state.cameraZoom = Math.min(state.cameraZoom + 0.1, 2.5);
                elements.zoomSlider.value = state.cameraZoom * 100;
                state.needsRedraw = true;
            },

            zoomOut: function() {
                state.cameraZoom = Math.max(state.cameraZoom - 0.1, 1.0);
                elements.zoomSlider.value = state.cameraZoom * 100;
                state.needsRedraw = true;
            },

            chatScroll: function() {
                const scrollButton = document.getElementById("scroll-to-bottom");
                const newMsgDivider = document.querySelector(".new-message-divider");
                const chat = document.querySelector(".popup-chat");
                const chatContent = document.querySelector(".chat-content");

                if (!chat || !chatContent) return;

                const justOpened = chatContent.classList.contains("justOpened");
                const atBottom = chatContent.scrollHeight - chatContent.scrollTop <= chat.clientHeight + 10;

                if (scrollButton && atBottom) scrollButton.remove();
                if (newMsgDivider && atBottom && !justOpened) newMsgDivider.remove();
                if (!atBottom && !scrollButton) uiControls.addScrollToBottomButton();
            }
        };

        // Map drawing functions
        const mapRendering = {
            updateCameraPosition: function(location) {
                const contents = utils.getMapContents();
                state.maxOffsetX = elements.mapContext.measureText(utils.longestLine(contents)).width;
                state.maxOffsetY = state.drawingEnd;

                const deltaX = (location.x - state.dragStart.x) * 0.07;
                const deltaY = (location.y - state.dragStart.y) * 0.07;

                // Calculate potential new positions
                let newX = state.cameraOffset.x + deltaX;
                let newY = state.cameraOffset.y + deltaY;

                // Constrain within boundaries
                state.cameraOffset.x = Math.max(-state.maxOffsetX, Math.min(state.maxOffsetX, newX));
                state.cameraOffset.y = Math.max(-state.maxOffsetY, Math.min(state.maxOffsetY, newY));
            },

            centerPlayer: function() {
                state.cameraOffset.x = -state.playerCoords.x + (elements.mapCanvas.width / (2 * state.cameraZoom));
                state.cameraOffset.y = -state.playerCoords.y + (elements.mapCanvas.height / (2 * state.cameraZoom));
                state.needsRedraw = true;
            },

            draw: function() {
                if (!state.needsRedraw) {
                    requestAnimationFrame(mapRendering.draw);
                    return;
                }

                const contents = utils.getMapContents();
                const noMapText = document.getElementById("noMapPlaceholder");
                state.storedMap = contents;

                if (contents[0] === 'There is no map for this area' && !noMapText) {
                    elements.mapCanvas.style.display = "none";
                    const popupMap = elements.map;

                    // Create the text element only once
                    const noMapText = document.createElement("div");
                    noMapText.id = "noMapPlaceholder";
                    noMapText.textContent = "There is no map for this area";

                    // Apply styles with Object.assign
                    Object.assign(noMapText.style, {
                        color: "#d0d0d0",
                        fontFamily: "'Source Code Pro', sans-serif",
                        fontSize: "14px",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                        whiteSpace: "nowrap"
                    });

                    // Append to the parent
                    popupMap.appendChild(noMapText);
                    $(".center-icon").toggle(state.isPlayerSeen);
                    requestAnimationFrame(mapRendering.draw);
                    state.needsRedraw = false;
                    return;
                } else if (contents[0] === 'There is no map for this area') {
                    requestAnimationFrame(mapRendering.draw);
                    state.needsRedraw = false;
                    return;
                }

                if (noMapText) {
                    noMapText.remove();
                    elements.mapCanvas.style.display = "block";
                }

                // Clear canvas
                elements.mapContext.setTransform(1, 0, 0, 1, 0, 0);
                elements.mapContext.clearRect(0, 0, elements.mapCanvas.width, elements.mapCanvas.height);

                // Apply camera transformations
                elements.mapContext.scale(state.cameraZoom, state.cameraZoom);
                elements.mapContext.translate(state.cameraOffset.x, state.cameraOffset.y);

                // Set initial style
                elements.mapContext.font = `${state.FONT_SIZE}px ${state.FONT_FAMILY}`;
                elements.mapContext.fillStyle = "black";
                elements.mapContext.fillRect(0, 0, elements.mapCanvas.width, elements.mapCanvas.height);

                // Draw text content 
                mapRendering.drawMapContents(contents);

                requestAnimationFrame(mapRendering.draw);
                state.needsRedraw = false;

                if (state.playerMoved) {
                    mapRendering.centerPlayer();
                    state.playerMoved = false;
                }
            },

            drawMapContents: function(contents) {
                state.isPlayerSeen = false;
                elements.mapContext.fillStyle = "white";

                // Cache the decoder and reuse
                for (let i = 0; i < contents.length; i++) {
                    if (contents[i] !== 'X') {
                        elements.mapContext.fillText(utils.decodeHTML(contents[i]), 0, 21 * (i + 1));
                    } else {
                        // Handle when there is no highlight of player position
                        state.isPlayerSeen = true;

                        // Handle player position (red X)
                        const prevLineWidth = elements.mapContext.measureText(utils.decodeHTML(contents[i - 1])).width;

                        elements.mapContext.fillStyle = "rgb(255, 49, 49)";
                        elements.mapContext.font = `bold ${state.FONT_SIZE}px ${state.FONT_FAMILY}`;
                        elements.mapContext.fillText(utils.decodeHTML(contents[i]), prevLineWidth, 21 * i);

                        // Store player coordinates
                        state.playerCoords.x = prevLineWidth;
                        state.playerCoords.y = 21 * i;

                        // Reset style and draw remainder of line
                        elements.mapContext.font = `${state.FONT_SIZE}px ${state.FONT_FAMILY}`;
                        elements.mapContext.fillStyle = "white";

                        const combinedWidth = elements.mapContext.measureText(utils.decodeHTML(contents[i - 1]) + utils.decodeHTML(contents[i])).width;
                        elements.mapContext.fillText(utils.decodeHTML(contents[i + 1]), combinedWidth, 21 * i);

                        // Adjust array and index
                        contents.splice(i, 2);
                        i--;
                    }

                    state.drawingEnd = 21 * (i + 1);
                }

                // Update center icon visibility only once
                $(".center-icon").toggle(state.isPlayerSeen);
            }
        };

        // UI controls, could you have guessed?
        const uiControls = {
            showMap: function() {
                elements.popupNav.style.display = "none";
                elements.map.style.display = "block";

                document.querySelectorAll(".map-icon").forEach(icon => {
                    icon.style.display = "none";
                });
            },

            closeMap: function() {
                const chatVisible = elements.chat?.style.display === "block";

                document.querySelectorAll(".map-icon").forEach(icon => {
                    icon.style.display = "";
                });

                if (!chatVisible) {
                    elements.popupNav.style.display = "block";
                }

                elements.map.style.display = "none";
            },

            showChat: function() {
                elements.popupNav.style.display = "none";
                elements.chatContent.classList.add("justOpened");

                document.querySelectorAll(".chat-icon-container").forEach(icon => {
                    icon.style.display = "none";
                });

                document.querySelectorAll(".chat-badge").forEach(badge => {
                    badge.remove();
                });

                chatControls.initChatPopup();
                elements.chat.style.display = "block";
            },

            closeChat: function() {
                const mapVisible = elements.map?.style.display === "block";
                const newMsgDivider = document.querySelector(".new-message-divider");

                document.querySelectorAll(".chat-icon-container").forEach(icon => {
                    icon.style.display = "";
                });

                if (!mapVisible) {
                    elements.popupNav.style.display = "block";
                }

                if (newMsgDivider) newMsgDivider.remove();
                elements.chat.style.display = "none";
            },

            toggleZoom: function() {
                const zoomControls = document.querySelector(".zoom-controls");
                const toggleButton = document.querySelector(".zoom-icon");
                const isVisible = zoomControls.style.display === "flex";

                zoomControls.style.display = isVisible ? "none" : "flex";
                toggleButton.textContent = isVisible ? "zoom_in" : "zoom_out"; 
            },

            toggleSettings: function(event) {
                const settingsPopup = document.querySelector(".popup-settings");
                
                // Toggle visibility of settings popup and settings icon
                settingsPopup.style.display = (settingsPopup.style.display === "block") ? "none" : "block";
                event.target.style.display = (toggleButton.style.display === "block") ? "none" : "block"; 
            },

            makeResizableDiv: function(selector) {
                const element = document.querySelector(selector);
                if (!element) return;

                const container = elements.mobileNav;
                if (!container) return;

                const resizers = element.querySelectorAll('.resizer');
                if (resizers.length === 0) return;

                let originalWidth, originalHeight, originalX, originalY, originalMouseX, originalMouseY;
                let activeResizer = null;

                // Define handlers within the correct scope
                function initResize(e) {
                    e.preventDefault();
                    activeResizer = e.target;
                    originalWidth = element.offsetWidth;
                    originalHeight = element.offsetHeight;
                    originalX = container.offsetLeft;
                    originalY = container.offsetTop;
                    originalMouseX = e.pageX || (e.touches && e.touches[0].pageX);
                    originalMouseY = e.pageY || (e.touches && e.touches[0].pageY);

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

                    const pageX = e.pageX || (e.touches && e.touches[0].pageX);
                    const pageY = e.pageY || (e.touches && e.touches[0].pageY);

                    if (pageX === undefined || pageY === undefined) return;

                    const deltaX = pageX - originalMouseX;
                    const deltaY = pageY - originalMouseY;

                    // Default values
                    let newWidth = originalWidth;
                    let newHeight = originalHeight;
                    let newX = originalX;
                    let newY = originalY;

                    // Minimum size based on element type
                    const minHeight = element.classList.contains('popup-map') ? 180 : 70;

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
                    if (newWidth >= 340 && newWidth <= 500) {
                        $('.resizable').width(newWidth);
                        if (container) container.style.left = `${newX}px`;
                        elements.mapCanvas.width = newWidth * 2;
                        elements.mapCanvas.style.width = `${newWidth}px`;
                        state.needsRedraw = true;
                    }

                    // Apply height constraints
                    if (newHeight >= minHeight && newHeight <= 500) {
                        element.style.height = `${newHeight}px`;
                        if (container) container.style.top = `${newY}px`;

                        if (element.classList.contains("popup-map")) {
                            elements.mapCanvas.height = newHeight * 2;
                            elements.mapCanvas.style.height = `${newHeight}px`;
                            state.needsRedraw = true;
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

                // Add event listeners to each resizer
                resizers.forEach(resizer => {
                    resizer.addEventListener("mousedown", initResize);
                    resizer.addEventListener("touchstart", initResize, {
                        passive: false
                    });
                });
            },

            addScrollToBottomButton: function() {
                if (!elements.chat) return;

                let scrollButton = document.getElementById("scroll-to-bottom");
                if (scrollButton) return;

                scrollButton = document.createElement("button");
                scrollButton.id = "scroll-to-bottom";
                scrollButton.innerText = "↓";
                scrollButton.onclick = () => {
                    elements.chatContent.scrollTop = elements.chatContent.scrollHeight;
                };

                elements.chat.appendChild(scrollButton);
            }
        };

        // Chat-related functions
        const chatControls = {
            initChatPopup: function() {
                if (!elements.communication || !elements.chatContent) return;

                // Determine where new messages start
                const oldMessageCount = elements.chatContent.children.length;
                const newMessageCount = elements.communication.children.length;

                // Use the most efficient approach - replaceAll is faster than regex in modern browsers
                elements.chatContent.innerHTML = elements.communication.innerHTML.replaceAll(` class="hanging-indent"`, "");

                // Only add divider if there are unread messages and only if chat was just opened
                if (newMessageCount > oldMessageCount && elements.chatContent.classList.contains("justOpened")) {
                    const firstUnreadMessage = elements.chatContent.children[oldMessageCount];
                    if (firstUnreadMessage) {
                        const divider = document.createElement("div");
                        divider.classList.add("new-message-divider");
                        divider.innerHTML = "<span>New Messages</span>";
                        divider.onclick = function(e) {
                            document.querySelector(".new-message-divider").remove();
                        };
                        firstUnreadMessage.parentNode.insertBefore(divider, firstUnreadMessage);

                        // Use a single timeout for efficiency
                        setTimeout(() => {
                            divider.scrollIntoView({
                                behavior: 'instant',
                                block: 'start'
                            });
                            // Remove justOpened class with a small delay
                            setTimeout(() => {
                                elements.chatContent.classList.remove("justOpened");
                            }, 100);

                            // Remove new message marker after 10s
                            setTimeout(() => {
                                if (divider && divider.parentNode) divider.remove();
                            }, 10000);
                        }, 100);
                    }
                }
            },

            updateChatNotificationBadge: function() {
                if (!elements.communication || !elements.chatContent) return;

                const newMessages = elements.communication.children.length - elements.chatContent.children.length;
                if (newMessages <= 0) return;

                const chatIconContainer = $('.chat-icon-container');
                if (chatIconContainer.length === 0) return;

                let badge = $('.chat-badge');
                if (badge.length === 0) {
                    chatIconContainer.append('<span class="chat-badge">' + newMessages + '</span>');
                } else {
                    badge.text(newMessages);
                }
            }
        };

        // Observer functions
        const observers = {
            observeChildChanges: function(targetId, callback) {
                const targetNode = document.getElementById(targetId);
                if (!targetNode) return;

                // Create a single observer per target for better performance
                const observer = new MutationObserver(() => callback());

                // Observe if new elements are added or if text is changed
                observer.observe(targetNode, {
                    childList: true,
                    characterData: true
                });

                return observer;
            },

            setupObservers: function() {
                // Chat observer
                this.observeChildChanges("communication", () => {
                    const chatPopupVisible = elements.chat?.style.display === "block";

                    if (!chatPopupVisible) {
                        chatControls.updateChatNotificationBadge();
                    } else {
                        if (!elements.communication || !elements.chatContent) return;

                        chatControls.initChatPopup();
                        elements.chatContent.scrollTop = elements.chatContent.scrollHeight;
                    }
                });

                // Map observer
                this.observeChildChanges("magicmap", () => {
                    elements.magicMapElement = document.getElementById("magicmap");
                    if (!state.needsRedraw &&
                        JSON.stringify(state.storedMap) !== JSON.stringify(utils.getMapContents())) {
                        state.needsRedraw = true;
                        state.playerMoved = true;
                    }
                });
            }
        };

        // Initialize everything
        function initialize() {
            // Cache DOM elements for better performance
            elements = {
                mobileNav: document.getElementById("mobile-nav"),
                map: document.querySelector(".popup-map"),
                chat: document.querySelector(".popup-chat"),
                popupNav: document.getElementById("popupnav-container"),
                mapCanvas: document.getElementById("magicmap-canvas"),
                mapContext: document.getElementById("magicmap-canvas").getContext("2d"),
                magicMapElement: document.getElementById("magicmap"),
                chatContent: document.querySelector(".chat-content"),
                communication: document.getElementById("communication"),
                mudOutput: document.getElementById("mudoutput"),
                controls: document.getElementById("controls"),
                zoomSlider: document.getElementById("zoom-slider"),
                zoomInBtn: document.getElementById("zoom-in"),
                zoomOutBtn: document.getElementById("zoom-out")
            };

            // Make resizable elements
            uiControls.makeResizableDiv('.popup-map');
            uiControls.makeResizableDiv('.popup-chat');

            // Initialize event listeners
            initializeEventListeners();

            // Set up initial layout based on viewport
            setupLayout();

            // Start the rendering loop
            state.needsRedraw = true;
            mapRendering.draw();

            // Set up mutation observers
            observers.setupObservers();

            // Prevent page increase when resizing
            document.body.style.overflowY = "hidden";
        }

        function setupLayout() {
            // Fix rendering of everything based on #mudoutput
            const mudRect = elements.mudOutput.getBoundingClientRect();

            // Position mobile nav based on screen size
            if (window.innerWidth <= 768) {
                elements.mobileNav.style.top = `${elements.controls.offsetHeight}px`;
            } else {
                elements.mobileNav.style.top = `${mudRect.top}px`;
            }

            // Calculate optimal dimensions based on mudOutput
            const optimalWidth = Math.min(Math.max(elements.mudOutput.offsetWidth * 0.75, 340), 500);
            const mapHeight = Math.min(Math.max(elements.mudOutput.offsetHeight * 0.20, 180), 500);

            // Apply dimensions 
            elements.mobileNav.style.left = `${mudRect.left}px`;
            elements.map.style.width = `${optimalWidth}px`;
            elements.chat.style.width = `${optimalWidth}px`;
            elements.map.style.height = `${mapHeight}px`;

            // Set canvas sizes (both displayed and actual)
            elements.mapCanvas.style.height = `${elements.map.offsetHeight - 2}px`;
            elements.mapCanvas.style.width = `${elements.map.offsetWidth - 2}px`;
            elements.mapCanvas.height = elements.map.offsetHeight * 2; // Double for better resolution
            elements.mapCanvas.width = elements.map.offsetWidth * 2;

            // Hide chat and map initially
            elements.chat.style.display = "none";
            elements.map.style.display = "none";

            // Set initial zoom
            elements.zoomSlider.value = 150;
            state.cameraZoom = 1.5;
        }

        function initializeEventListeners() {
            // Canvas event listeners with passive option for touch events
            elements.mapCanvas.addEventListener("mousedown", eventHandlers.handlePointerDown);
            elements.mapCanvas.addEventListener("mouseup", eventHandlers.handlePointerUp);
            elements.mapCanvas.addEventListener("mousemove", eventHandlers.handlePointerMove);
            elements.mapCanvas.addEventListener("touchstart", eventHandlers.handlePointerDown, {
                passive: true
            });
            elements.mapCanvas.addEventListener("touchend", eventHandlers.handlePointerUp);
            elements.mapCanvas.addEventListener("touchmove", eventHandlers.handlePointerMove, {
                passive: true
            });

            // Zoom controls
            elements.zoomSlider.addEventListener('input', eventHandlers.handleZoomSlider);
            elements.zoomInBtn.addEventListener('click', eventHandlers.zoomIn);
            elements.zoomOutBtn.addEventListener('click', eventHandlers.zoomOut);

            // UI controls using event delegation where possible
            $('.map-icon').on("click", uiControls.showMap);
            $('.chat-icon').on("click", uiControls.showChat);
            $('.zoom-icon').on("click", uiControls.toggleZoom);
            $('.settings-icon').on("click", uiControls.toggleSettings);
            $('.popup-map .exit-icon').on("click", uiControls.closeMap);
            $('.center-icon').on("click", mapRendering.centerPlayer);
            $('.popup-chat .exit-icon').on("click", uiControls.closeChat);
            $('.chat-content').on("scroll", eventHandlers.chatScroll);

            // Use ResizeObserver for better performance
            const resizeObserver = new ResizeObserver(() => {
                utils.positionPopupNav();
            });

            resizeObserver.observe(elements.mudOutput);
        }

        // Inject CSS and HTML
        injectMinifiedCSS();
        injectMinifiedHTML();

        // Set up jQuery
        setupJQuery();

        // Initialize with a small delay to ensure all elements are ready
        setTimeout(initialize, 100);
    }

    setTimeout(initMapExtension, 100);
})();
