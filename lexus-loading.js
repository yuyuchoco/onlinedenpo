(() => {
  /* ===== 設定 ===== */
  const LOGO_SRC = window.LOADING_LOGO || "/assets/lexus_logo_white.png";
  const BG_COLOR = "#000";
  const MIN_DISPLAY = 1500; // 最低表示時間(ms)

  /* ===== CSS挿入 ===== */
  const style = document.createElement("style");
  style.textContent = `
    #lexus-loading {
      position: fixed;
      inset: 0;
      background: ${BG_COLOR};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      transition: opacity 1.6s ease;
    }
    #lexus-loading img {
      width: 180px;
      opacity: 0;
      animation: lexusFade .8s ease forwards;
    }
    #lexus-loading .line {
      margin-top: 20px;
      width: 0;
      height: 1px;
      background: #fff;
      animation: lexusLine 1.2s ease forwards;
      animation-delay: .4s;
    }
    #lexus-loading.hide {
      opacity: 0;
      pointer-events: none;
    }
    @keyframes lexusFade {
      to { opacity: 1; }
    }
    @keyframes lexusLine {
      to { width: 120px; }
    }
    @media (max-width: 600px) {
      #lexus-loading img { width: 140px; }
      @keyframes lexusLine {
        to { width: 80px; }
      }
    }
  `;
  document.head.appendChild(style);

  /* ===== HTML挿入 ===== */
  const loading = document.createElement("div");
  loading.id = "lexus-loading";
  loading.innerHTML = `
    <img src="${LOGO_SRC}" alt="LEXUS">
    <div class="line"></div>
  `;
  document.body.appendChild(loading);
  const logoImg = loading.querySelector("img");

  /* ===== 読み込み完了で消す ===== */
  const waitForWindowLoad = new Promise((resolve) => {
    if (document.readyState === "complete") {
      resolve();
      return;
    }
    window.addEventListener("load", resolve, { once: true });
  });

  const waitForLogoReady = new Promise((resolve) => {
    let resolved = false;
    const done = () => {
      if (resolved) {
        return;
      }
      resolved = true;
      resolve();
    };

    const finalizeAfterDecode = () => {
      if (typeof logoImg.decode === "function") {
        logoImg.decode().catch(() => {}).finally(done);
      } else {
        done();
      }
    };

    if (logoImg.complete) {
      if (logoImg.naturalWidth > 0) {
        finalizeAfterDecode();
      } else {
        done();
      }
      return;
    }

    logoImg.addEventListener("load", finalizeAfterDecode, { once: true });
    logoImg.addEventListener("error", done, { once: true });

    // ロゴ読み込み失敗時に永続ローディング化しないための保険
    setTimeout(done, 5000);
  });

  const waitForMinDisplay = new Promise((resolve) => {
    setTimeout(resolve, MIN_DISPLAY);
  });

  Promise.all([waitForWindowLoad, waitForLogoReady, waitForMinDisplay]).then(() => {
    requestAnimationFrame(() => {
      loading.classList.add("hide");
      setTimeout(() => loading.remove(), 800);
    });
  });
})();
