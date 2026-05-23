(function () {
  const STORAGE_KEY = "smartBusCustomer";
  const SESSION_KEY = "smartBusSignedIn";
  const PROFILE_UPDATED_EVENT = "profileupdated";

  const DEFAULT_CUSTOMER = {
    name: "D Man",
    membership: "Smart Commuter",
    avatar: ""
  };

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function loadStoredCustomer() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved
        ? { ...DEFAULT_CUSTOMER, ...JSON.parse(saved) }
        : { ...DEFAULT_CUSTOMER };
    } catch (error) {
      return { ...DEFAULT_CUSTOMER };
    }
  }

  function isSignedIn() {
    return localStorage.getItem(SESSION_KEY) === "true" || sessionStorage.getItem(SESSION_KEY) === "true";
  }

  function getViewModel() {
    const signedIn = isSignedIn();

    if (!signedIn) {
      return {
        name: "Sign up",
        membership: "Create commuter profile",
        signedIn: false,
        avatar: ""
      };
    }

    const customer = loadStoredCustomer();
    return {
      name: customer.name || "Commuter",
      membership: customer.membership || "Smart Commuter",
      signedIn: true,
      avatar: customer.avatar || ""
    };
  }

  function profilePageUrl() {
    const path = window.location.pathname.replace(/\\/g, "/");
    if (path.includes("/profile/")) return "profile.html";
    if (path.includes("/maps/") || path.includes("/alerts/")) {
      return "../profile/profile.html";
    }
    return "./profile/profile.html";
  }

  function avatarMarkup(view) {
    return view.avatar
      ? `<img src="${escapeHtml(view.avatar)}" alt="${escapeHtml(view.name)}" />`
      : '<i class="fas fa-user-astronaut"></i>';
  }

  function bindSidebarNavigation(block) {
    if (block.dataset.profileBound === "true") return;

    block.dataset.profileBound = "true";
    block.classList.add("sidebar-user-link");
    block.setAttribute("role", "button");
    block.setAttribute("tabindex", "0");

    const goToProfile = () => {
      const url = profilePageUrl();
      window.location.href = block.dataset.profileSignedIn === "true" ? url : `${url}?auth=signup`;
    };

    block.addEventListener("click", goToProfile);

    block.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      goToProfile();
    });
  }

  function syncProfileUI() {
    const view = getViewModel();

    document.querySelectorAll(".sidebar-user").forEach(block => {
      block.classList.toggle("sidebar-user-guest", !view.signedIn);
      block.dataset.profileSignedIn = view.signedIn ? "true" : "false";
      block.setAttribute("aria-label", view.signedIn ? "Open profile" : "Sign up");
      block.innerHTML = `
        <div class="sidebar-avatar">${avatarMarkup(view)}</div>
        <div class="sidebar-user-info">
          <p>${escapeHtml(view.name)}</p>
          <span>${escapeHtml(view.membership)}</span>
        </div>
      `;
      bindSidebarNavigation(block);
    });

    document.querySelectorAll("[data-profile-name]").forEach(element => {
      element.textContent = view.name;
    });

    document.querySelectorAll("[data-profile-membership]").forEach(element => {
      element.textContent = view.membership;
    });

    document.querySelectorAll("[data-profile-avatar]").forEach(element => {
      element.innerHTML = avatarMarkup(view);
    });

    document.querySelectorAll("[data-profile-link]").forEach(element => {
      element.setAttribute("href", profilePageUrl());
    });
  }

  function notifyUpdated() {
    syncProfileUI();
    window.dispatchEvent(new CustomEvent(PROFILE_UPDATED_EVENT));
  }

  function initProfileSync() {
    syncProfileUI();
    window.addEventListener("pageshow", syncProfileUI);
    window.addEventListener(PROFILE_UPDATED_EVENT, syncProfileUI);
    window.addEventListener("storage", event => {
      if (event.key === STORAGE_KEY || event.key === SESSION_KEY) {
        syncProfileUI();
      }
    });
  }

  window.ProfileSync = {
    STORAGE_KEY,
    SESSION_KEY,
    PROFILE_UPDATED_EVENT,
    getViewModel,
    isSignedIn,
    loadStoredCustomer,
    sync: syncProfileUI,
    notifyUpdated,
    init: initProfileSync
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProfileSync);
  } else {
    initProfileSync();
  }
})();
