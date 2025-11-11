/* global chrome */

let rootEl = null;
let mounted = false;

function ensureRoot() {
    if (rootEl && document.contains(rootEl)) return rootEl;
    rootEl = document.createElement("div");
    rootEl.id = "browser-pet-root";
    Object.assign(rootEl.style, {
        position: "fixed",
        left: "100px",
        top: "100px",
        zIndex: "2147483647",
        pointerEvents: "none" // parent ignores clicks; React subtree re-enables
    });
    document.documentElement.appendChild(rootEl);
    return rootEl;
}

async function mountPet() {
    if (mounted) return;
    const el = ensureRoot();
    const mod = await import(chrome.runtime.getURL("petApp.js"));
    mod.mountPet(el, { draggableEnabled: true }); // render the pet
    mounted = true;
}

async function unmountPet() {
    if (!mounted) return;
    try {
        const mod = await import(chrome.runtime.getURL("petApp.js"));
        mod.unmountPet();
    } catch {}
    if (rootEl && document.contains(rootEl)) rootEl.remove();
    rootEl = null;
    mounted = false;
}

// receive toggle from popup
chrome.runtime.onMessage.addListener((msg) => {
    if (msg?.type === "SET_PET_ENABLED") {
        msg.enabled ? mountPet() : unmountPet();
    }
});

// auto-apply saved state on each page load
chrome.storage.local.get(["petEnabled"], ({ petEnabled }) => {
    if (petEnabled) mountPet();
});