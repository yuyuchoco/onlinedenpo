document.addEventListener('DOMContentLoaded', () => {
    const scene = document.getElementById('scene');
    const book = document.getElementById('book');
    const cover = document.getElementById('cover');
    const honbunText = document.getElementById('honbun-text');
    const textContainer = document.getElementById('text-container');
    const openBtn = document.getElementById('open-btn');
    const fontSwitcher = document.getElementById('font-switcher');
    const fontSelect = document.getElementById('font-select');
    const urlParams = new URLSearchParams(window.location.search);
    const showFontSample = urlParams.get('font_sample') === 'true';
    const fontOptions = new Set(['mincho', 'rodin', 'gyosho', 'modern', 'elegant']);
    const fontQueryValue = urlParams.get('font');
    const initialFont = fontOptions.has(fontQueryValue) ? fontQueryValue : 'rodin';
    const isIOSDevice = /iPad|iPhone|iPod/.test(window.navigator.userAgent) ||
        (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);

    // Fetch the text from Honbun.txt (with cache busting)
    const cacheBuster = new Date().getTime();
    fetch('Honbun.txt?v=' + cacheBuster)
        .then(response => {
            if (!response.ok) {
                throw new Error('ファイルの読み込みに失敗しました');
            }
            return response.text();
        })
        .then(text => {
            // Apply text and preserve newlines using HTML br tags
            // Add the image at the end of the text
            honbunText.innerHTML = text.replace(/\n/g, '<br>') + 
                                   '<div class="profile-image-column"><div class="profile-image-wrapper"><img src="makihiroki.jpg" alt="牧 宏樹" class="profile-image" onload="window.dispatchEvent(new Event(\'resize\'))"></div></div>';
            
            // Artificial delay to show the loading screen
            setTimeout(() => {
                calculateScrollBounds();
                finishLoading();
            }, 1000);
        })
        .catch(error => {
            console.error(error);
            honbunText.innerHTML = "メッセージの読み込みに失敗しました。<br>エラー: " + error.message;
            setTimeout(() => {
                finishLoading();
            }, 1000);
        });

    function finishLoading() {
        scene.classList.add('visible');
    }

    function applyFont(fontKey) {
        document.body.classList.remove('font-mincho', 'font-rodin', 'font-gyosho', 'font-modern', 'font-elegant');
        document.body.classList.add(`font-${fontKey}`);
        if (fontSelect) {
            fontSelect.value = fontKey;
        }
    }

    // --- SMOOTH SCROLLING (Hardware Accelerated WebGL equivalent) ---
    let isOpen = false;
    let autoScrolling = false;
    
    // Position state
    let targetX = 0;       // target position we want to scroll to
    let currentX = 0;      // actual visual position mapped to CSS transform
    
    // Bounds
    let maxScroll = 0;
    
    // Interaction state
    let isDragging = false;
    let hasDraggedDuringGesture = false;
    let startMouseX = 0;
    let startTargetX = 0;
    let manualSlidingEnabled = false;
    let activePointerId = null;
    let activeDragInput = null;

    function stopAutoScrollForManualInput() {
        autoScrolling = false;
    }

    function calculateScrollBounds() {
        // Japanese text reads right to left.
        // Left offset is negative when viewing.
        // We will calculate a max displacement X (positive number)
        // content that is larger than the container will create scroll room.
        maxScroll = Math.max(0, honbunText.scrollWidth - textContainer.clientWidth + 50); // 50px extra padding
    }

    window.addEventListener('resize', calculateScrollBounds);

    function renderScroll() {
        if (autoScrolling && !isDragging) {
            targetX += 0.25; // Auto-scroll speed (pixels per frame) - Halved
        }

        // Clamp targetX
        if (targetX < 0) targetX = 0;
        if (targetX > maxScroll) {
            targetX = maxScroll;
            autoScrolling = false; // reached end
        }

        // Lerp for buttery smooth physics (inertia / drag / momentum)
        currentX += (targetX - currentX) * 0.1;

        // Apply hardware accelerated transform
        // Moving the content right (positive X) reveals the left part
        honbunText.style.transform = `translate3d(${currentX}px, 0, 0)`;

        requestAnimationFrame(renderScroll);
    }
    
    // Start the render loop immediately
    renderScroll();

    // Interaction handling for custom drag
    function onDragStart(clientX, inputType = 'pointer') {
        if (!isOpen || !manualSlidingEnabled) return false;
        isDragging = true;
        activeDragInput = inputType;
        hasDraggedDuringGesture = false;
        startMouseX = clientX;
        startTargetX = targetX;
        textContainer.style.cursor = 'grabbing';
        return true;
    }

    function onDragMove(clientX) {
        if (!isDragging) return;
        const deltaX = clientX - startMouseX;

        if (!hasDraggedDuringGesture && Math.abs(deltaX) > 3) {
            hasDraggedDuringGesture = true;
            stopAutoScrollForManualInput();
        }
        
        // Pushing finger right (positive deltaX) should push content right (increase targetX)
        // This is perfectly aligned with horizontal reading physical mapping.
        targetX = startTargetX + deltaX;
    }

    function onDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        activeDragInput = null;
        textContainer.style.cursor = manualSlidingEnabled ? 'grab' : 'default';
    }

    function enableManualSliding() {
        manualSlidingEnabled = true;
        textContainer.classList.add('manual-ready');
    }

    function disableManualSliding() {
        manualSlidingEnabled = false;
        textContainer.classList.remove('manual-ready');
        textContainer.style.cursor = 'default';
    }

    function handlePointerDown(e) {
        if (isIOSDevice && e.pointerType === 'touch') return;
        if (!isOpen || !manualSlidingEnabled) return;
        activePointerId = e.pointerId;
        if (!onDragStart(e.clientX, e.pointerType || 'pointer')) {
            activePointerId = null;
            return;
        }
        if (typeof textContainer.setPointerCapture === 'function') {
            textContainer.setPointerCapture(e.pointerId);
        }
        if (e.cancelable) e.preventDefault();
    }

    function handlePointerMove(e) {
        if (isIOSDevice && e.pointerType === 'touch') return;
        if (activeDragInput && activeDragInput !== (e.pointerType || 'pointer')) return;
        if (!isDragging || activePointerId !== e.pointerId) return;
        onDragMove(e.clientX);
        if (e.cancelable) e.preventDefault();
    }

    function handlePointerUp(e) {
        if (isIOSDevice && e.pointerType === 'touch') return;
        if (activePointerId !== null && e.pointerId !== activePointerId) return;
        if (typeof textContainer.releasePointerCapture === 'function' && activePointerId !== null) {
            try {
                textContainer.releasePointerCapture(activePointerId);
            } catch (error) {
                // Safari may already have released the pointer capture.
            }
        }
        activePointerId = null;
        onDragEnd();
    }

    if (window.PointerEvent) {
        textContainer.addEventListener('pointerdown', handlePointerDown, {passive: false});
        textContainer.addEventListener('pointermove', handlePointerMove, {passive: false});
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerUp);
    }

    if (!window.PointerEvent || isIOSDevice) {
        textContainer.addEventListener('touchstart', e => {
            if (!e.touches.length) return;
            activePointerId = null;
            if (!onDragStart(e.touches[0].clientX, 'touch')) return;
            if (e.cancelable) e.preventDefault();
        }, {passive: false});

        textContainer.addEventListener('touchmove', e => {
            if (!isDragging || activeDragInput !== 'touch' || !e.touches.length) return;
            onDragMove(e.touches[0].clientX);
            if (e.cancelable) e.preventDefault();
        }, {passive: false});

        window.addEventListener('touchend', onDragEnd);
        window.addEventListener('touchcancel', onDragEnd);
    }

    if (!window.PointerEvent) {
        textContainer.addEventListener('mousedown', e => {
            onDragStart(e.clientX, 'mouse');
        });
        window.addEventListener('mousemove', e => {
            if (activeDragInput !== 'mouse') return;
            onDragMove(e.clientX);
        });
        window.addEventListener('mouseup', onDragEnd);
    }

    // Mouse wheel / trackpad scrolling
    textContainer.addEventListener('wheel', e => {
        if (!isOpen || !manualSlidingEnabled) return;
        stopAutoScrollForManualInput();
        
        // Standardize delta. Trackpads usually map vertical and horizontal scrolling
        // Both mapping down/right to an increase in targetX
        let slideDelta = e.deltaX;
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) slideDelta = e.deltaY;

        // Adjust sensibility
        targetX -= slideDelta * 1.5; 
        
        if (e.cancelable) e.preventDefault();
    }, {passive: false});

    // --- COVER OPENING ---
    cover.addEventListener('click', () => {
        if (!isOpen) {
            isOpen = true;
            disableManualSliding();
            
            // Recalculate bounds before opening just in case
            calculateScrollBounds();
            
            book.classList.add('open');
            cover.classList.add('open');
            textContainer.classList.add('show'); // Reveal after background expansion finishes
            openBtn.style.opacity = '0'; // Hide the instruction button

            // 本が開いてテキストがフェードインするアニメーション(約3.5秒)が完了した頃から自動スクロール開始
            setTimeout(() => {
                autoScrolling = true;
                enableManualSliding();
            }, 4500); 
        }
    });

    if (showFontSample && fontSwitcher && fontSelect) {
        fontSwitcher.hidden = false;
        fontSwitcher.style.display = 'flex';
        applyFont(initialFont);
        fontSelect.addEventListener('change', e => {
            applyFont(e.target.value);
            calculateScrollBounds();
        });
    } else {
        if (fontSwitcher) {
            fontSwitcher.hidden = true;
        }
        applyFont('rodin');
    }

    if (document.fonts && typeof document.fonts.ready === 'object') {
        document.fonts.ready.then(() => {
            calculateScrollBounds();
        });
    }

    disableManualSliding();
});
