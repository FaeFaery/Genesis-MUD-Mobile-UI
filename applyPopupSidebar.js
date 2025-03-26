// Self-executing function 
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
                style.textContent = '#magicmap-canvas{display:relative;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;background:#000;width:100%;height:100%;opacity:.9}#magicmap-img{object-fit:cover}#popup-buttons{position:absolute;user-select:none;top:6px;right:0;z-index:1;display:flex;flex-direction:column;background-color:rgba(0,0,0,.3)}#popupnav-container{position:absolute;user-select:none;top:0;right:0;display:flex;padding:10px;flex-direction:row;gap:5px}#popupnav-container .map-icon, #popupnav-container .chat-icon-container{margin-right:5px}#mobile-nav{position:absolute;top:100px;left:100px;display:flex;flex-direction:column}.popup-map{width:300px;height:300px;position:relative;border:1px solid #fff;background:#000;opacity:.9}.popup-chat{width:300px;height:100px;position:relative;overflow:hidden;border:1px solid #fff;background-color:rgba(0,0,0,.9)}.chat-content{height:calc(100% - 10px);width:100%;color:#d0d0d0;font-family:Source Code Pro,sans-serif;overflow-y:scroll;overflow-x:hidden;word-wrap:break-word;white-space:normal;overflow-wrap:break-word;font-size:14px;padding-right:10px;padding-left:10px;padding-top:10px;box-sizing:content-box}.resizable .resizers{width:100%;height:100%;box-sizing:border-box}.resizable .resizers .resizer{width:15px;height:15px;border-radius:50%;position:absolute}.resizable .resizers .resizer.top-left{left:-5px;top:-5px;cursor:nwse-resize}.resizable .resizers .resizer.top-right{right:-5px;top:-5px;cursor:nesw-resize}.resizable .resizers .resizer.bottom-left{left:-5px;bottom:-5px;cursor:nesw-resize}.resizable .resizers .resizer.bottom-right{right:-5px;bottom:-5px;cursor:nwse-resize}.exit-icon{cursor:pointer;user-select:none;width:30px;height:30px;color:#fff;font-size:30px;margin-bottom:-3px;font-variation-settings:\'FILL\' 0,\'wght\' 400,\'GRAD\' 0,\'opsz\' 24}.map-icon{cursor:pointer;display:block;user-select:none;color:#fff;font-size:20px;font-variation-settings:\'FILL\' 1,\'wght\' 300,\'GRAD\' 0,\'opsz\' 24}.center-icon{cursor:pointer;width:30px;height:30px;color:#fff;font-size:30px;font-variation-settings:\'FILL\' 0,\'wght\' 350,\'GRAD\' 0,\'opsz\' 24}.chat-icon{cursor:pointer;width:30px;height:30px;color:#fff;font-size:30px;font-variation-settings:\'FILL\' 1,\'wght\' 250,\'GRAD\' 0,\'opsz\' 24}.zoom-icon {cursor: pointer;width: 30px;height: 30px;color: #fff;font-size: 30px;font-variation-settings: \'FILL\' 0, \'wght\' 250, \'GRAD\' 0, \'opsz\' 24}.settings-icon{cursor: pointer;color: #999999;font-size: 30px;margin-right: 3px;user-select: none;font-variation-settings: \'FILL\' 1, \'wght\' 250, \'GRAD\' 0, \'opsz\' 24}.chat-icon-container{position:relative;display:inline-block}.chat-badge{font-family:Source Code Pro,sans-serif;position:absolute;top:-5px;right:2px;background-color:red;color:#fff;border-radius:50%;width:15px;height:15px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;padding:0;line-height:1;box-sizing:border-box;text-align:center}.new-message-divider{position:relative;justify-content:center;padding-left:0;padding-right:0;box-sizing:border-box;padding-top:5px;width:calc(100% - 20px);margin-left:0;margin-right:0;display:flex;align-items:center;font-size:8px;font-weight:bold;text-transform:uppercase;color:#fff;font-family:Arial,sans-serif;color:white;user-select:none}.new-message-divider::before,.new-message-divider::after{content:"";flex-grow:0.7;height:1px;background:rgba(255,255,255,0.1);margin:0 8px}.new-message-divider>span{background-color:#ff2d2d;padding:4px 10px;border-radius:8px}#scroll-to-bottom{position:absolute;bottom:0;right:50%;padding:5px 10px;background:rgba(0,0,0,.5);color:#fff;border:none;border-radius:50%;cursor:pointer;-webkit-box-shadow:none;animation:bobbing 1s ease-in-out infinite}@keyframes bobbing{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}.zoom-controls{user-select:none;display:none;z-index:1;flex-direction:column;align-items:center;position:absolute;left:10px;top: 50%;transform: translateY(-50%);padding:5px 1px;background-color:rgba(255,255,255,.1);border-radius:4px}.zoom-slider{width:30px;height:100px;margin:10px 0}.zoom-btn{width:20px;height:20px;color:rgba(255,255,255);border-radius:4px;background-color:rgba(245,245,245,.3);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center}.popup-settings{position:absolute;border:1px solid #fff;background:#000;font-family:Source Code Pro,sans-serif;top:50%;left:50%;transform:translate(-50%,50%);font-size:14px;color:#d0d0d0;height:fit-content;width:340px;padding:10px;box-sizing:border-box;display:none;flex-direction:column;justify-content:space-between;}.popup-settings .sections-container{flex:1;}.popup-settings .section{margin-bottom:8px;}.popup-settings .section-title{user-select:none;font-weight:bold;border-bottom:1px solid #444;padding-bottom:2px;margin-bottom:4px;color:#fff;font-size:13px;}.popup-settings .input-rows{display:flex;flex-wrap:wrap;margin:0 -3px;}.popup-settings .input-group{width:50%;padding:0 3px;box-sizing:border-box;margin-bottom:4px;}.popup-settings label{user-select:none;display:block;margin-bottom:2px;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}.popup-settings input{width:100%;background:#222;border:1px solid #444;color:#d0d0d0;padding:2px 4px;font-family:Source Code Pro,sans-serif;font-size:11px;outline:none;box-sizing:border-box;height:22px;}.popup-settings input:focus{border-color:#666;}.popup-settings .button-row{user-select:none;display:flex;justify-content:space-between;padding-top:5px;border-top:1px solid #333;}.popup-settings .left-buttons,.popup-settings .right-buttons{display:flex;gap:5px;}.popup-settings button{background:#333;border:1px solid #555;color:#d0d0d0;padding:3px 3px;cursor:pointer;font-family:Source Code Pro,sans-serif;font-size:11px;transition:all 0.2s;min-width:48px;touch-action:manipulation;}.popup-settings #cancel-button{background:#8B0000;border-color:#5A002C;}.popup-settings #save-button{background:#006400;border-color:#06402B;}.popup-settings input[type="color"]{height:22px;padding:0;}.popup-settings .invalid {border: 2px solid red;}.popup-settings .error-message {color: red;font-size: 0.5em;margin-top: 5px;}';
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
                container.style.zIndex = "0";
                container.style.position = "relative";

                // Use innerHTML once for better performance
                container.innerHTML = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" /><div id="popupnav-container"><span class="settings-icon material-symbols-outlined">settings</span><span class='map-icon material-symbols-outlined'>explore</span><div class='chat-icon-container'><span class='chat-icon material-symbols-outlined'>chat_bubble</span></div></div><div id="mobile-nav"><div class='resizable popup-map'><div id="popup-buttons"><span class='exit-icon material-symbols-outlined'>close</span><span class='center-icon material-symbols-outlined'>center_focus_strong</span><div class='chat-icon-container'><span class='chat-icon material-symbols-outlined'>chat_bubble</span></div><span class="zoom-icon material-symbols-outlined">zoom_in</span></div><div class="zoom-controls"><button id="zoom-in" class="zoom-btn">+</button><input type="range" id="zoom-slider" class="zoom-slider" min="100" max="250" value="100" style="writing-mode: vertical-lr; direction: rtl"><button id="zoom-out" class="zoom-btn">−</button></div><div class='resizers'><canvas id='magicmap-canvas'></canvas><div class='resizer top-left'></div><div class='resizer top-right'></div><div class='resizer bottom-left'></div><div class='resizer bottom-right'></div></div></div><div class='resizable popup-chat'><div id="popup-buttons"><span class='exit-icon material-symbols-outlined' style="padding-top: 5px;">close</span><span class='map-icon material-symbols-outlined'>explore</span></div><div class='resizers'><div class='chat-content'></div><div class='resizer bottom-left'></div><div class='resizer bottom-right'></div></div></div></div><div class="popup-settings"><div class="sections-container"><div class="section"><div class="section-title">Map Settings</div><div class="input-rows"><div class="input-group"><label for="map-width">Width</label><input type="text" id="map-width" min="340"></div><div class="input-group"><label for="map-height" min="180">Height</label><input type="text" id="map-height"></div><div class="input-group"><label for="default-zoom">Default Zoom</label><input type="number" id="default-zoom" step="0.1" min="1" max="2.5"></div><div class="input-group"><label for="position-color">Position Color</label><input type="color" id="position-color"></div></div></div><div class="section"><div class="section-title">Chat Settings</div><div class="input-rows"><div class="input-group"><label for="text-size">Text Size</label><input type="text" id="text-size"></div><div class="input-group"><label for="chat-length">Chat Length</label><input type="text" id="chat-length" min="70"></div></div></div><div class="section"><div class="section-title">Popup Dimensions</div><div class="input-rows"><div class="input-group"><label for="position-x">Position X</label><input type="text" id="position-x" value="0px"></div><div class="input-group"><label for="position-y">Position Y</label><input type="text" id="position-y" value="0px"></div></div></div></div><div class="button-row"><div class="left-buttons"><button id="reset-button">Reset</button><button id="current-styling-button">Current Styles</button><button id="apply-button">Apply</button></div><div class="right-buttons"><button id="cancel-button">Cancel</button><button id="save-button">Save</button></div></div></div>`;

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

                        // Handle player position (colored X)
                        const prevLineWidth = elements.mapContext.measureText(utils.decodeHTML(contents[i - 1])).width;

                        elements.mapContext.fillStyle = window.positionColor;
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

                // Remove justOpened class with a small delay
                setTimeout(() => {
                    elements.chatContent.classList.remove("justOpened");
                }, 100);
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
                if (elements.map.style.display === "none") $(".map-icon:visible")[0].click();
                if (elements.chat.style.display === "none") $(".chat-icon:visible")[0].click();
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

                    // Grab updated element information
                    const chat = document.querySelector(".popup-chat"),
                        map = document.querySelector(".popup-map"),
                        mobileNav = document.getElementById("mobile-nav");

                    // Minimum size based on element type
                    const minHeight = element.classList.contains('popup-map') ? 180 : 70;
                    const maxHeight = element.classList.contains('popup-map') ? window.innerHeight - (parseInt(getComputedStyle(chat).height) + parseInt(getComputedStyle(chat).top)) : window.innerHeight - (parseInt(getComputedStyle(map).height) + parseInt(getComputedStyle(map).top));
                    const maxWidth = window.innerWidth - parseInt(getComputedStyle(mobileNav).left);

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
                    if (newWidth >= 340 && newWidth <= maxWidth) {
                        $('.resizable').width(newWidth);
                        if (container) container.style.left = `${newX}px`;
                        elements.mapCanvas.width = newWidth * 2;
                        elements.mapCanvas.style.width = `${newWidth}px`;
                        state.needsRedraw = true;
                    }

                    // Apply height constraints
                    if (newHeight >= minHeight && newHeight <= maxHeight) {
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
            },

            makeDraggable: function(selector) {
                const element = document.querySelector(selector);
                let offsetX = 0,
                    offsetY = 0,
                    isDragging = false;

                element.addEventListener("mousedown", (e) => {
                    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

                    isDragging = true;
                    offsetX = e.clientX - element.offsetLeft;
                    offsetY = e.clientY - element.offsetTop;
                    element.style.cursor = "grabbing";
                });

                document.addEventListener("mousemove", (e) => {
                    if (!isDragging) return;
                    element.style.left = `${e.clientX - offsetX}px`;
                    element.style.top = `${e.clientY - offsetY}px`;
                });

                document.addEventListener("mouseup", () => {
                    isDragging = false;
                    element.style.cursor = "grab";
                });
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

                        setTimeout(() => {
                            divider.scrollIntoView({
                                behavior: 'instant',
                                block: 'start'
                            });
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

        // Settings functions
        const settingsControls = {
            reset: function() {
                // Map Settings
                document.querySelector('.popup-settings #default-zoom').value = window.defaultZoom;
                document.querySelector('.popup-settings #map-width').value = window.mapWidth;
                document.querySelector('.popup-settings #map-height').value = window.mapHeight;
                document.querySelector('.popup-settings #position-color').value = window.positionColor;

                // Chat Settings
                document.querySelector('.popup-settings #text-size').value = window.chatTextSize;
                document.querySelector('.popup-settings #chat-length').value = window.chatLength;

                // Popup Dimensions
                document.querySelector('.popup-settings #position-x').value = window.mobileNavLeft;
                document.querySelector('.popup-settings #position-y').value = window.mobileNavTop;
            },
            update: function() {
                const map = document.querySelector('.popup-map');
                const chat = document.querySelector('.popup-chat');
                const chatContent = document.querySelector('.chat-content');
                const mobileNav = document.getElementById('mobile-nav');
                const zoom = document.getElementById("zoom-slider");

                // Map Settings - would update according to .popup-map elements
                document.querySelector('.popup-settings #default-zoom').value = zoom.value / 100;
                document.querySelector('.popup-settings #map-width').value = map.clientWidth;
                document.querySelector('.popup-settings #map-height').value = map.clientHeight;
                document.querySelector('.popup-settings #position-color').value = window.positionColor;

                // Chat Settings - would update according to .chat-content and .popup-chat
                document.querySelector('.popup-settings #text-size').value = parseInt(getComputedStyle(chatContent).fontSize) || 0;
                document.querySelector('.popup-settings #chat-length').value = chat.clientHeight;

                // Popup Dimensions - would update according to #mobile-nav
                document.querySelector('.popup-settings #position-x').value = parseInt(getComputedStyle(mobileNav).left) || 0;
                document.querySelector('.popup-settings #position-y').value = parseInt(getComputedStyle(mobileNav).top) || 0;
            },
            apply: function() {
                if (!settingsControls.validate()) return;

                const map = document.querySelector('.popup-map');
                const chat = document.querySelector('.popup-chat');
                const chatContent = document.querySelector('.chat-content');
                const canvas = document.getElementById('magicmap-canvas');
                const mobileNav = document.getElementById('mobile-nav');
                const zoom = document.getElementById("zoom-slider");

                // Map Settings - would update according to .popup-map elements
                zoom.value = document.querySelector('.popup-settings #default-zoom').value * 100;
                map.style.width = `${document.querySelector('.popup-settings #map-width').value}px`;
                chat.style.width = `${document.querySelector('.popup-settings #map-width').value}px`;
                map.style.height = `${document.querySelector('.popup-settings #map-height').value}px`;
                window.positionColor = document.querySelector('.popup-settings #position-color').value;
                canvas.width = document.querySelector('.popup-settings #map-width').value * 2;
                canvas.style.width = `${document.querySelector('.popup-settings #map-width').value}px`;
                canvas.height = document.querySelector('.popup-settings #map-height').value * 2;
                canvas.style.height = `${document.querySelector('.popup-settings #map-height').value}px`;
                state.needsRedraw = true;

                // Chat Settings - would update according to .chat-content and .popup-chat
                chatContent.style.fontSize = `${document.querySelector('.popup-settings #text-size').value}px`;
                chat.style.height = `${document.querySelector('.popup-settings #chat-length').value}px`;

                // Popup Dimensions - would update according to #mobile-nav
                mobileNav.style.left = `${document.querySelector('.popup-settings #position-x').value}px`;
                mobileNav.style.top = `${document.querySelector('.popup-settings #position-y').value}px`;

                // Redefine max values
                document.querySelector('.popup-settings #map-width').max = window.innerWidth - (parseInt(getComputedStyle(mobileNav).left) || 0);
                document.querySelector('.popup-settings #map-height').max = window.innerHeight - ((parseInt(getComputedStyle(chat).height) || 0) + (parseInt(getComputedStyle(chat).top) || 0));
                document.querySelector('.popup-settings #chat-length').max = window.innerHeight - ((parseInt(getComputedStyle(map).height) || 0) + (parseInt(getComputedStyle(map).top) || 0));
            },
            validate: function() {
                // Validation function to check against max values
                const validationRules = {
                    'default-zoom': {
                        element: document.querySelector('.popup-settings #default-zoom'),
                        validate: (value) => {
                            const max = 2.5;
                            const min = 1;
                            return value >= min && value <= max;
                        }
                    },
                    'map-width': {
                        element: document.querySelector('.popup-settings #map-width'),
                        validate: (value) => {
                            const element = document.querySelector('.popup-settings #map-width');
                            const max = parseInt(element.max);
                            const min = 340;
                            return value >= min && value <= max;
                        }
                    },
                    'map-height': {
                        element: document.querySelector('.popup-settings #map-height'),
                        validate: (value) => {
                            const element = document.querySelector('.popup-settings #map-height');
                            const max = parseInt(element.max);
                            const min = 180;
                            return value >= min && value <= max;
                        }
                    },
                    'chat-length': {
                        element: document.querySelector('.popup-settings #chat-length'),
                        validate: (value) => {
                            const element = document.querySelector('.popup-settings #chat-length');
                            const max = parseInt(element.max);
                            const min = 70;
                            return value >= min && value <= max;
                        }
                    }
                };

                // Perform validation
                let isValid = true;
                const errors = [];

                // Clear any previous error states
                $(".popup-settings .invalid").removeClass("invalid")
                $(".popup-settings .error-message").remove();

                Object.keys(validationRules).forEach(key => {
                    const rule = validationRules[key];
                    const value = parseFloat(rule.element.value);

                    if (!rule.validate(value)) {
                        isValid = false;
                        errors.push({
                            element: rule.element,
                            message: `Value must be between ${rule.element.min} and ${rule.element.max}`
                        });
                    }
                });

                // Handle validation results
                if (!isValid) {
                    // Highlight invalid fields
                    errors.forEach(error => {
                        error.element.classList.add('invalid');
                        let errorMsg = error.element.nextElementSibling;
                        if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                            errorMsg = document.createElement('div');
                            errorMsg.classList.add('error-message');
                            error.element.parentNode.insertBefore(errorMsg, error.element.nextSibling);
                        }
                        errorMsg.textContent = error.message;
                    });

                    return false;
                }

                return true;
            },
            save: function() {
                if (!settingsControls.validate()) return;

                // Collect current settings from input fields
                const mapSettings = {
                    defaultZoom: document.querySelector('.popup-settings #default-zoom').value,
                    mapWidth: document.querySelector('.popup-settings #map-width').value,
                    mapHeight: document.querySelector('.popup-settings #map-height').value,
                    positionColor: document.querySelector('.popup-settings #position-color').value
                };

                const chatSettings = {
                    chatTextSize: document.querySelector('.popup-settings #text-size').value,
                    chatLength: document.querySelector('.popup-settings #chat-length').value
                };

                const popupDimensions = {
                    mobileNavLeft: document.querySelector('.popup-settings #position-x').value,
                    mobileNavTop: document.querySelector('.popup-settings #position-y').value
                };

                // Custom JSON stringify to preserve formatting in <applypops> alias
                const formatSettings = (obj) => {
                    const entries = Object.entries(obj);
                    const formattedLines = entries.map(([key, value]) => {
                        // Convert value to appropriate string representation
                        const formattedValue = typeof value === 'string' ? `'${value}'` : value;
                        return `    ${key}: ${formattedValue},`;
                    });

                    return '{\n' + formattedLines.join('\n') + '\n}';
                };

                // Combine all settings into a single object
                const allSettings = {
                    ...mapSettings,
                    ...chatSettings,
                    ...popupDimensions
                };

                // Apply values to styling
                settingsControls.apply();

                // Save map settings as window variable
                window.defaultZoom = allSettings.defaultZoom;
                window.mapWidth = allSettings.mapWidth;
                window.mapHeight = allSettings.mapHeight;
                window.positionColor = allSettings.positionColor;

                // Save chat settings as window variable
                window.chatTextSize = allSettings.chatTextSize;
                window.chatLength = allSettings.chatLength;

                // Save popup dimensions as window variable
                window.mobileNavLeft = allSettings.mobileNavLeft;
                window.mobileNavTop = allSettings.mobileNavTop;

                uiControls.toggleSettings();

                // Simulate the process of editing the alias
                $("#opensettings").click();
                $('a[href*="#aliases"]').click();
                $("div:contains('applypops')").click();
                $("button:contains('Edit')").click();

                // Get the CodeMirror instance
                const cm = $('.CodeMirror')[0].CodeMirror;
                const doc = cm.getDoc();

                // Find the line to replace or add settings
                let settingsLineFound = false;
                for (let i = 0; i < doc.lineCount(); i++) {
                    const line = doc.getLine(i);
                    if (line.includes('// USER SETTINGS START')) {
                        // Find the end of settings block
                        let j;
                        for (j = i + 1; j < doc.lineCount(); j++) {
                            const nextLine = doc.getLine(j);
                            if (nextLine.includes('// USER SETTINGS END')) {
                                // Replace the entire block
                                doc.replaceRange(`// USER SETTINGS START\nconst userSettings = ${formatSettings(allSettings)};\n// USER SETTINGS END`, {
                                    line: i,
                                    ch: 1
                                }, {
                                    line: j,
                                    ch: nextLine.length
                                });
                                settingsLineFound = true;
                                break;
                            }
                        }
                        break;
                    }
                }

                // If no existing settings block found, add a new one (just in case)
                if (!settingsLineFound) {
                    const lineEnd = {
                        line: 1,
                        ch: 1
                    };

                    doc.replaceRange(`\n\n// USER SETTINGS START\nconst userSettings = ${formatSettings(allSettings)};\n// USER SETTINGS END`,
                        lineEnd
                    );
                }

                // Save the changes, add imperceptible delay to close settings to properly set zIndex on the popups
                $("button:contains('Save')").click();
                setTimeout(() => $("#closesettings").click(), 100);
            }
        };

        // Initialize everything
        function initialize() {
            // Cache DOM elements
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

            // Make resizable and draggable elements
            uiControls.makeResizableDiv('.popup-map');
            uiControls.makeResizableDiv('.popup-chat');
            uiControls.makeDraggable('.popup-settings');

            // Initialize event listeners
            initializeEventListeners();

            // Set up initial layout based on defaults
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
            // Apply default dimensions
            elements.mobileNav.style.top = `${window.mobileNavTop}px`;
            elements.mobileNav.style.left = `${window.mobileNavLeft}px`;
            elements.map.style.width = `${window.mapWidth}px`;
            elements.chat.style.width = `${window.mapWidth}px`;
            elements.map.style.height = `${window.mapHeight}px`;
            elements.chat.style.height = `${window.chatLength}px`;

            // Set canvas sizes (both displayed and actual)
            elements.mapCanvas.style.height = `${elements.map.offsetHeight - 2}px`;
            elements.mapCanvas.style.width = `${elements.map.offsetWidth - 2}px`;
            elements.mapCanvas.height = elements.map.offsetHeight * 2;
            elements.mapCanvas.width = elements.map.offsetWidth * 2;

            // Initialize settings values, has to be done after all default stylings are applied
            elements.zoomSlider.value = window.defaultZoom * 100;
            state.cameraZoom = window.defaultZoom;
            document.querySelector('.popup-settings #position-color').value = window.positionColor;
            document.querySelector('.popup-settings #default-zoom').value = window.defaultZoom;
            document.querySelector('.popup-settings #map-width').max = window.innerWidth - (parseInt(getComputedStyle(elements.mobileNav).left) || 0);
            document.querySelector('.popup-settings #map-height').max = window.innerHeight - ((parseInt(getComputedStyle(elements.chat).height) || 0) + (parseInt(getComputedStyle(elements.chat).top) || 0));
            document.querySelector('.popup-settings #chat-length').max = window.innerHeight - ((parseInt(getComputedStyle(elements.map).height) || 0) + (parseInt(getComputedStyle(elements.map).top) || 0));
            settingsControls.update();

            // Hide chat and map initially, apply default styling
            elements.chat.style.display = "none";
            elements.map.style.display = "none";
            elements.chatContent.style.fontSize = `${window.chatTextSize}px`;
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
            $('#popupnav-container .settings-icon').on("click", uiControls.toggleSettings);
            $('.popup-map .exit-icon').on("click", uiControls.closeMap);
            $('.center-icon').on("click", mapRendering.centerPlayer);
            $('.popup-chat .exit-icon').on("click", uiControls.closeChat);
            $('.chat-content').on("scroll", eventHandlers.chatScroll);
            $("#opensettings, #closesettings").on("click", function() {
                let mobilePopupUI = document.getElementById("mobileNav-wrapper");
                mobilePopupUI.style.zIndex = (mobilePopupUI.style.zIndex === "0") ? "-1" : "0";
            });

            // Apply settings events
            document.querySelector('.popup-settings #reset-button').addEventListener('click', settingsControls.reset);
            document.querySelector('.popup-settings #current-styling-button').addEventListener('click', settingsControls.update);
            document.querySelector('.popup-settings #apply-button').addEventListener('click', settingsControls.apply);
            document.querySelector('.popup-settings #save-button').addEventListener('click', settingsControls.save);
            document.querySelector('.popup-settings #cancel-button').addEventListener('click', function() {
                document.querySelector('.popup-settings').style.display = "none";
            });

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
