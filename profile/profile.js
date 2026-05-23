(function () {
  const STORAGE_KEY = window.ProfileSync?.STORAGE_KEY || "smartBusCustomer";
  const SESSION_KEY = window.ProfileSync?.SESSION_KEY || "smartBusSignedIn";

  const defaultCustomer = {
    name: "D Man",
    email: "commuter@smartbus.local",
    phone: "+91 98765 43210",
    password: btoa("smartbus"),
    avatar: "",
    membership: "Smart Commuter",
    dob: "2001-08-14",
    gender: "Male",
    memberSince: "May 2026",
    emergency: "Home - +91 90000 00000"
  };

  const mobileProfile = document.getElementById("mobileProfile");
  const desktopProfile = document.getElementById("desktopProfile");
  const authModal = document.getElementById("authModal");
  const editModal = document.getElementById("editModal");
  const logoutModal = document.getElementById("logoutModal");
  const cropModal = document.getElementById("cropModal");
  const cropFrame = document.getElementById("cropFrame");
  const cropImage = document.getElementById("cropImage");
  const cropZoom = document.getElementById("cropZoom");
  const toast = document.getElementById("toast");

  let customer = loadCustomer();
  let signedIn = localStorage.getItem(SESSION_KEY) === "true";
  let draftAvatar = "";
  let cropState = {
    src: "",
    naturalWidth: 0,
    naturalHeight: 0,
    baseWidth: 0,
    baseHeight: 0,
    scale: 1,
    x: 0,
    y: 0,
    dragging: false,
    startX: 0,
    startY: 0,
    startOffsetX: 0,
    startOffsetY: 0
  };

  function loadCustomer() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultCustomer, ...JSON.parse(saved) } : { ...defaultCustomer };
    } catch (error) {
      return { ...defaultCustomer };
    }
  }

  function saveCustomer(nextCustomer) {
    customer = nextCustomer;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customer));
    if (window.ProfileSync) window.ProfileSync.notifyUpdated();
  }

  function setSignedIn(value) {
    signedIn = value;
    if (value) localStorage.setItem(SESSION_KEY, "true");
    else localStorage.removeItem(SESSION_KEY);
    if (window.ProfileSync) window.ProfileSync.notifyUpdated();
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function avatarHTML(sizeClass = "") {
    const content = signedIn && customer.avatar
      ? `<img src="${customer.avatar}" alt="${customer.name}" />`
      : '<i class="fas fa-user-astronaut"></i>';
    return `<div class="avatar ${sizeClass}">${content}</div>`;
  }

  function guestText() {
    return {
      name: "Guest commuter",
      email: "Sign in to save routes and preferences",
      phone: "Not connected",
      membership: "Guest",
      dob: "Not added",
      gender: "Not added",
      memberSince: "Not a member",
      emergency: "Not added",
      initials: "G"
    };
  }

  function viewModel() {
    return signedIn ? customer : guestText();
  }

  function heroHTML() {
    const data = viewModel();
    return `
      <section class="profile-card">
        <div class="profile-person">
          ${avatarHTML()}
          <div class="person-copy">
            <h2>${data.name}</h2>
            <p class="phone-text">${data.phone}</p>
            <span class="member-chip">Member since ${data.memberSince}</span>
          </div>
        </div>
        <div class="profile-actions">
          ${signedIn
            ? `<button class="primary-btn" data-action="edit" type="button">Edit Profile</button>
               <button class="secondary-btn" data-action="logout" type="button">Logout</button>`
            : `<button class="primary-btn" data-action="signup" type="button">Sign up</button>
               <button class="secondary-btn" data-action="signin" type="button">Sign in</button>`}
        </div>
      </section>
    `;
  }

  function detailsHTML() {
    const data = viewModel();
    const rows = [
      ["fa-envelope", "Email", data.email],
      ["fa-cake-candles", "Date of Birth", formatDob(data.dob)],
      ["fa-venus-mars", "Gender", data.gender],
      ["fa-calendar-check", "Member Since", data.memberSince],
      ["fa-shield-heart", "Emergency Contact", data.emergency]
    ];
    return `
      <h3 class="section-title">Personal Details</h3>
      <section class="info-list">
        ${rows.map(row => `
          <div class="info-row">
            <i class="fas ${row[0]}"></i>
            <div>
              <span>${row[1]}</span>
              <strong>${row[2]}</strong>
            </div>
          </div>
        `).join("")}
      </section>
    `;
  }

  function formatDob(value) {
    if (!value || value === "Not added") return "Not added";
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  function render() {
    mobileProfile.innerHTML = `
      ${heroHTML()}
      ${detailsHTML()}
    `;

    desktopProfile.innerHTML = `
      <div class="desktop-layout profile-wrap">
        ${heroHTML()}
        ${detailsHTML()}
      </div>
    `;

    if (window.ProfileSync) window.ProfileSync.sync();

    bindRenderedActions();
  }

  function bindRenderedActions() {
    document.querySelectorAll("[data-action='signup']").forEach(btn => {
      btn.addEventListener("click", () => openAuth("signup"));
    });
    document.querySelectorAll("[data-action='signin']").forEach(btn => {
      btn.addEventListener("click", () => openAuth("signin"));
    });
    document.querySelectorAll("[data-action='edit']").forEach(btn => {
      btn.addEventListener("click", openEdit);
    });
    document.querySelectorAll("[data-action='logout']").forEach(btn => {
      btn.addEventListener("click", () => logoutModal.hidden = false);
    });
  }

  function openAuth(tab) {
    authModal.hidden = false;
    setAuthTab(tab);
  }

  function setAuthTab(tab) {
    document.querySelectorAll(".auth-tab").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.authTab === tab);
    });
    document.querySelectorAll(".auth-form").forEach(form => {
      form.classList.toggle("active", form.id === `${tab}Form`);
    });
  }

  function openEdit() {
    if (!signedIn) {
      openAuth("signin");
      return;
    }

    draftAvatar = customer.avatar || "";
    document.getElementById("editName").value = customer.name || "";
    document.getElementById("editPhone").value = customer.phone || "";
    document.getElementById("editEmail").value = customer.email || "";
    document.getElementById("editDob").value = customer.dob || "";
    document.getElementById("editGender").value = customer.gender || "";
    document.getElementById("editEmergency").value = customer.emergency || "";
    renderEditAvatar();
    editModal.hidden = false;
  }

  function renderEditAvatar() {
    const preview = document.getElementById("editAvatarPreview");
    preview.innerHTML = draftAvatar ? `<img src="${draftAvatar}" alt="Profile preview" />` : '<i class="fas fa-user-astronaut"></i>';
  }

  function closeModals() {
    authModal.hidden = true;
    editModal.hidden = true;
    logoutModal.hidden = true;
    cropModal.hidden = true;
  }

  document.querySelectorAll("[data-close-modal]").forEach(btn => {
    btn.addEventListener("click", closeModals);
  });

  document.querySelectorAll(".modal-overlay").forEach(modal => {
    modal.addEventListener("click", event => {
      if (event.target !== modal) return;
      if (modal === cropModal) {
        cropModal.hidden = true;
        return;
      }
      closeModals();
    });
  });

  document.querySelectorAll(".auth-tab").forEach(btn => {
    btn.addEventListener("click", () => setAuthTab(btn.dataset.authTab));
  });

  document.getElementById("signupForm").addEventListener("submit", event => {
    event.preventDefault();
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;

    if (!name || !email || password.length < 6) {
      showToast("Please use a valid name, email, and 6 character password.");
      return;
    }

    saveCustomer({
      ...defaultCustomer,
      name,
      email,
      password: btoa(password),
      phone: "",
      avatar: "",
      dob: "",
      gender: "",
      memberSince: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      emergency: ""
    });
    setSignedIn(true);
    closeModals();
    render();
    showToast("Account created. Welcome aboard.");
  });

  document.getElementById("signinForm").addEventListener("submit", event => {
    event.preventDefault();
    const email = document.getElementById("signinEmail").value.trim();
    const password = document.getElementById("signinPassword").value;

    if (email === customer.email && btoa(password) === customer.password) {
      saveCustomer(customer);
      setSignedIn(true);
      closeModals();
      render();
      showToast("Signed in successfully.");
      return;
    }

    showToast("Email or password did not match.");
  });

  document.getElementById("editForm").addEventListener("submit", event => {
    event.preventDefault();
    saveCustomer({
      ...customer,
      avatar: draftAvatar,
      name: document.getElementById("editName").value.trim() || customer.name,
      phone: document.getElementById("editPhone").value.trim(),
      email: document.getElementById("editEmail").value.trim() || customer.email,
      dob: document.getElementById("editDob").value,
      gender: document.getElementById("editGender").value.trim(),
      emergency: document.getElementById("editEmergency").value.trim()
    });
    closeModals();
    render();
    showToast("Profile updated.");
  });

  document.getElementById("photoInput").addEventListener("change", event => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      showToast("Choose an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = loadEvent => {
      openCropper(loadEvent.target.result);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  });

  document.getElementById("removePhotoBtn").addEventListener("click", () => {
    draftAvatar = "";
    renderEditAvatar();
  });

  document.getElementById("confirmLogoutBtn").addEventListener("click", () => {
    setSignedIn(false);
    closeModals();
    render();
    showToast("Logged out.");
  });

  document.getElementById("mobileEditBtn").addEventListener("click", openEdit);
  document.getElementById("desktopEditBtn").addEventListener("click", openEdit);

  function openCropper(src) {
    cropState = {
      ...cropState,
      src,
      naturalWidth: 0,
      naturalHeight: 0,
      baseWidth: 0,
      baseHeight: 0,
      scale: 1,
      x: 0,
      y: 0,
      dragging: false
    };

    cropZoom.value = "1";
    cropModal.hidden = false;
    cropImage.onload = () => {
      requestAnimationFrame(() => {
        const frameSize = cropFrame.clientWidth;
        cropState.naturalWidth = cropImage.naturalWidth;
        cropState.naturalHeight = cropImage.naturalHeight;
        const coverScale = Math.max(frameSize / cropState.naturalWidth, frameSize / cropState.naturalHeight);
        cropState.baseWidth = cropState.naturalWidth * coverScale;
        cropState.baseHeight = cropState.naturalHeight * coverScale;
        constrainCrop();
        updateCropImage();
      });
    };
    cropImage.src = src;
  }

  function updateCropImage() {
    const width = cropState.baseWidth * cropState.scale;
    const height = cropState.baseHeight * cropState.scale;
    cropImage.style.width = `${width}px`;
    cropImage.style.height = `${height}px`;
    cropImage.style.transform = `translate(calc(-50% + ${cropState.x}px), calc(-50% + ${cropState.y}px))`;
  }

  function constrainCrop() {
    const frameSize = cropFrame.clientWidth;
    const width = cropState.baseWidth * cropState.scale;
    const height = cropState.baseHeight * cropState.scale;
    const maxX = Math.max(0, (width - frameSize) / 2);
    const maxY = Math.max(0, (height - frameSize) / 2);
    cropState.x = Math.min(maxX, Math.max(-maxX, cropState.x));
    cropState.y = Math.min(maxY, Math.max(-maxY, cropState.y));
  }

  function cropPointerPosition(event) {
    const point = event.touches ? event.touches[0] : event;
    return { x: point.clientX, y: point.clientY };
  }

  function startCropDrag(event) {
    event.preventDefault();
    const point = cropPointerPosition(event);
    cropState.dragging = true;
    cropState.startX = point.x;
    cropState.startY = point.y;
    cropState.startOffsetX = cropState.x;
    cropState.startOffsetY = cropState.y;
  }

  function moveCropDrag(event) {
    if (!cropState.dragging) return;
    event.preventDefault();
    const point = cropPointerPosition(event);
    cropState.x = cropState.startOffsetX + point.x - cropState.startX;
    cropState.y = cropState.startOffsetY + point.y - cropState.startY;
    constrainCrop();
    updateCropImage();
  }

  function endCropDrag() {
    cropState.dragging = false;
  }

  function applyCrop() {
    const outputSize = 512;
    const frameSize = cropFrame.clientWidth;
    const renderedWidth = cropState.baseWidth * cropState.scale;
    const renderedHeight = cropState.baseHeight * cropState.scale;
    const imageLeft = (frameSize - renderedWidth) / 2 + cropState.x;
    const imageTop = (frameSize - renderedHeight) / 2 + cropState.y;
    const sourceX = Math.max(0, -imageLeft * (cropState.naturalWidth / renderedWidth));
    const sourceY = Math.max(0, -imageTop * (cropState.naturalHeight / renderedHeight));
    const sourceWidth = Math.min(
      cropState.naturalWidth - sourceX,
      frameSize * (cropState.naturalWidth / renderedWidth)
    );
    const sourceHeight = Math.min(
      cropState.naturalHeight - sourceY,
      frameSize * (cropState.naturalHeight / renderedHeight)
    );
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = outputSize;
    canvas.height = outputSize;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outputSize, outputSize);
    ctx.drawImage(
      cropImage,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      outputSize,
      outputSize
    );

    draftAvatar = canvas.toDataURL("image/png");
    cropModal.hidden = true;
    renderEditAvatar();
    showToast("Photo cropped. Save profile to apply.");
  }

  cropFrame.addEventListener("mousedown", startCropDrag);
  cropFrame.addEventListener("touchstart", startCropDrag, { passive: false });
  window.addEventListener("mousemove", moveCropDrag);
  window.addEventListener("touchmove", moveCropDrag, { passive: false });
  window.addEventListener("mouseup", endCropDrag);
  window.addEventListener("touchend", endCropDrag);
  cropZoom.addEventListener("input", () => {
    cropState.scale = Number(cropZoom.value);
    constrainCrop();
    updateCropImage();
  });
  document.getElementById("applyCropBtn").addEventListener("click", applyCrop);
  document.getElementById("cancelCropBtn").addEventListener("click", () => cropModal.hidden = true);
  document.getElementById("cancelCropX").addEventListener("click", () => cropModal.hidden = true);

  // Sync profile page contents reactively when profile data changes locally or on another tab
  window.addEventListener("storage", event => {
    if (event.key === STORAGE_KEY || event.key === SESSION_KEY) {
      customer = loadCustomer();
      signedIn = localStorage.getItem(SESSION_KEY) === "true";
      render();
    }
  });

  window.addEventListener(window.ProfileSync?.PROFILE_UPDATED_EVENT || "profileupdated", () => {
    customer = loadCustomer();
    signedIn = localStorage.getItem(SESSION_KEY) === "true";
    render();
  });

  function handleInitialAuthRequest() {
    const requestedAuth = new URLSearchParams(window.location.search).get("auth");
    if (!signedIn && (requestedAuth === "signup" || requestedAuth === "signin")) {
      openAuth(requestedAuth);
    }
  }

  function bindMapLinks() {
    document.querySelectorAll("[data-map-link]").forEach(link => {
      link.addEventListener("click", () => {
        let trip = {};
        try {
          trip = JSON.parse(sessionStorage.getItem("smartBusActiveTrip")) || {};
        } catch (error) {
          trip = {};
        }

        const hasTrip = trip.bus || trip.pickup || trip.destination;
        const query = hasTrip
          ? `?bus=${encodeURIComponent(trip.bus || "")}&pickup=${encodeURIComponent(trip.pickup || "")}&destination=${encodeURIComponent(trip.destination || "")}`
          : "";

        window.location.href = `../maps/maps.html${query}`;
      });
    });
  }

  render();
  handleInitialAuthRequest();
  bindMapLinks();
})();
