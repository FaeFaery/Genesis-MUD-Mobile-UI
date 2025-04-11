// <3 Cleaner Aliases and Triggers Format <3 //
$("a[href='#general']").remove();
$("a[href='#triggers']").css({
    "border-left": "1px solid #999"
});
$("#settingscontent .filler").css({
    "border-bottom": "1px solid #999",
    "width": "calc(100% - 219px)",
    "margin-left": "219px"
});
$("#settingscontent .idTabs a").width('100px');
$(".tabs .content").css("position", "absolute");

function setupSelectionViews() {
    document.querySelectorAll('#aliases, #triggers').forEach(parent => {
        const selection = parent.querySelector('.selection');
        const data = parent.querySelector('.data');

        selection.style.width = "calc(100% - 1px)";
        data.style.width = "calc(100% - 1px)";
        data.style.display = "none";

        let closeIcon = parent.querySelector('.close-icon');
        if (!closeIcon) {
            closeIcon = document.createElement('span');
            closeIcon.className = 'close-icon';
            closeIcon.textContent = '✖';
            Object.assign(closeIcon.style, {
                position: 'absolute',
                top: '6px',
                right: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                display: 'none',
                zIndex: '10',
                color: '#fff',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                padding: '2px 6px',
                borderRadius: '4px',
            });

            parent.style.position = 'relative';
            parent.appendChild(closeIcon);

            closeIcon.addEventListener('click', () => {
                data.style.display = 'none';
                selection.style.display = 'block';
                closeIcon.style.display = 'none';
            });
        } else if (closeIcon.style.display !== "none") {
            closeIcon.click();
        }

        const listItems = selection.querySelectorAll('.list > div');
        listItems.forEach(item => {
            item.addEventListener('click', () => {
                selection.style.display = 'none';
                data.style.display = 'block';
                closeIcon.style.display = 'block';
            });
        });
    });
}

const observer = new MutationObserver(() => {
    setupSelectionViews();
});

document.querySelectorAll('#aliases .list, #triggers .list').forEach(list => {
    observer.observe(list, {
        childList: true
    });
});

// <3 Prevent Device From Turning Off <3 //
let wakeLock = null;
let noSleep = null;

// Load NoSleep.js from CDN
function loadNoSleep(callback) {
  const script = document.createElement('script');
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/nosleep/0.12.0/NoSleep.min.js";
  script.onload = callback;
  script.onerror = () => console.error("Failed to load NoSleep.js");
  document.head.appendChild(script);
}

// Request Wake Lock
async function requestWakeLock() {
  if ("wakeLock" in navigator) {
    try {
      wakeLock = await navigator.wakeLock.request("screen");
      wakeLock.addEventListener("release", () => {
        console.log("Wake Lock released");
      });
      console.log("Wake Lock active");
    } catch (err) {
      console.error("Wake Lock failed:", err);
      enableNoSleep(); // fallback if request fails
    }
  } else {
    enableNoSleep(); // fallback if not supported
  }
}

// Fallback using NoSleep.js
function enableNoSleep() {
  if (!noSleep) {
    loadNoSleep(() => {
      noSleep = new NoSleep();
      noSleep.enable();
      console.log("NoSleep.js enabled");
    });
  } else {
    noSleep.enable();
    console.log("NoSleep.js already loaded and enabled");
  }
}

// Trigger on first user interaction (required by most APIs)
document.addEventListener("click", () => {
  requestWakeLock();
}, { once: true });

