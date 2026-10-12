  // ── NAV SCROLL ──
  const nav = document.getElementById('mainNav');
  const progressBar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
    // Progress bar
    const h = document.documentElement;
    const pct = (window.scrollY / (h.scrollHeight - h.clientHeight)) * 100;
    progressBar.style.width = pct + '%';
    // Parallax hero
    const hero = document.querySelector('.hero-bg');
    if (hero) hero.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }, { passive: true });

  // ── HAMBURGER ──
  function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const burger = document.getElementById('hamburger');
    menu.classList.toggle('open');
    burger.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  }
  function closeMenu() {
    const menu = document.getElementById('mobileMenu');
    const burger = document.getElementById('hamburger');
    menu.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── CURSOR GLOW ──
  const glow = document.getElementById('cursorGlow');
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive:true });

  // ── SCROLL REVEAL (all variants) ──
  const allReveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  allReveals.forEach(el => revealObs.observe(el));

  // ── SMOOTH SCROLL ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // ── IMAGE LOAD FADE ──
  document.querySelectorAll('img').forEach(img => {
    if (img.complete) img.classList.add('loaded');
    else img.addEventListener('load', () => img.classList.add('loaded'));
  });

  // ── SERVICE CARD MOUSE RIPPLE ──
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });

  // ── FLOATING PARTICLES (hero) ──
  (function spawnParticles() {
    const container = document.getElementById('particles');
    container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:1;overflow:hidden;';
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      const size = Math.random() * 3 + 1;
      p.className = 'particle';
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random()*100}%;
        top:${60 + Math.random()*40}%;
        --dur:${7 + Math.random()*8}s;
        --delay:${Math.random()*6}s;
        --travel:${-(150 + Math.random()*300)}px;
        --op:${0.15 + Math.random()*0.3};
      `;
      container.appendChild(p);
    }
  })();

  // ── LIGHTBOX ──
  const galleryImgs = Array.from(document.querySelectorAll('.gallery-img'));
  let currentIdx = 0;

  // Build lightbox DOM
  const lb = document.createElement('div');
  lb.className = 'lightbox-overlay';
  lb.innerHTML = `
    <span class="lightbox-close" id="lb-close">✕</span>
    <span class="lightbox-nav lightbox-prev" id="lb-prev">&#8592;</span>
    <img class="lightbox-img" id="lb-img" src="" alt="">
    <span class="lightbox-nav lightbox-next" id="lb-next">&#8594;</span>
    <span class="lightbox-caption" id="lb-cap"></span>
  `;
  document.body.appendChild(lb);

  function openLightbox(idx) {
    currentIdx = idx;
    const img = galleryImgs[idx];
    document.getElementById('lb-img').src = img.src;
    document.getElementById('lb-img').alt = img.alt;
    document.getElementById('lb-cap').textContent = img.dataset.caption || '';
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }
  function navigate(dir) {
    currentIdx = (currentIdx + dir + galleryImgs.length) % galleryImgs.length;
    const img = galleryImgs[currentIdx];
    const lbImg = document.getElementById('lb-img');
    lbImg.style.opacity = '0';
    setTimeout(() => {
      lbImg.src = img.src;
      document.getElementById('lb-cap').textContent = img.dataset.caption || '';
      lbImg.style.opacity = '1';
    }, 200);
  }

  galleryImgs.forEach((img, i) => img.addEventListener('click', () => openLightbox(i)));
  document.getElementById('lb-close').addEventListener('click', closeLightbox);
  document.getElementById('lb-prev').addEventListener('click', e => { e.stopPropagation(); navigate(-1); });
  document.getElementById('lb-next').addEventListener('click', e => { e.stopPropagation(); navigate(1); });
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });

  // Touch swipe for lightbox
  let touchStartX = 0;
  lb.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive:true });
  lb.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
  });

  // ── LEGAL MODALS (Impressum / Datenschutz) ──
  function openLegalModal(name) {
    const modal = document.getElementById('legal-modal-' + name);
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLegalModal(name) {
    const modal = document.getElementById('legal-modal-' + name);
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('.legal-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeLegalModal(overlay.id.replace('legal-modal-', ''));
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.legal-modal-overlay.active').forEach(overlay => {
      closeLegalModal(overlay.id.replace('legal-modal-', ''));
    });
  });

  // ── BOOKING FORM WEBHOOK SUBMIT ──
  const BOOKING_WEBHOOK_URL = 'https://n8n.app.gympilot.de/webhook/932eb15d-c8db-4710-b452-153474529884';
  const bookingForm = document.getElementById('bookingForm');
  const bookingSubmitBtn = document.getElementById('bookingSubmitBtn');
  const bookingStatus = document.getElementById('bookingStatus');

  bookingForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(bookingForm);
    const payload = {
      firstName: formData.get('firstName') || '',
      lastName: formData.get('lastName') || '',
      email: formData.get('email') || '',
      phone: formData.get('phone') || '',
      session: formData.get('session') || '',
      date: formData.get('date') || '',
      time: formData.get('time') || '',
      message: formData.get('message') || '',
      source: 'jplounge-pilates.de',
      page: window.location.href,
      submittedAt: new Date().toISOString()
    };

    bookingStatus.classList.remove('success', 'error');
    bookingStatus.style.display = 'none';
    bookingSubmitBtn.disabled = true;
    const originalBtnText = bookingSubmitBtn.textContent;
    bookingSubmitBtn.textContent = 'Wird gesendet …';

    try {
      const response = await fetch(BOOKING_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Webhook antwortete mit Status ' + response.status);
      }

      bookingStatus.textContent = 'Vielen Dank! Deine Anfrage ist eingegangen – wir melden uns in Kürze.';
      bookingStatus.classList.add('success');
      bookingStatus.style.display = 'block';
      bookingForm.reset();
    } catch (err) {
      console.error('Booking webhook error:', err);
      bookingStatus.textContent = 'Leider ist etwas schiefgelaufen. Bitte versuche es erneut oder schreib uns an info@jplounge-pilates.de.';
      bookingStatus.classList.add('error');
      bookingStatus.style.display = 'block';
    } finally {
      bookingSubmitBtn.disabled = false;
      bookingSubmitBtn.textContent = originalBtnText;
    }
  });

  // ── KURSPLAN (live Kalender, scoped IIFE gegen Namenskollisionen) ──
  (function () {
    const WEBHOOK_URL = "https://n8n.app.gympilot.de/webhook/ea56efe4-d26d-4a0c-b149-fdc20d192fe2";
    const BOOKING_WEBHOOK_URL = "https://n8n.app.gympilot.de/webhook/a9543830-164e-4ef5-b330-bbc2346e08ca";
    const DOW = ["Mo","Di","Mi","Do","Fr","Sa","So"];
    const MONTHS = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];

    // Kurse mit abweichendem Einstiegspreis: kein Streichpreis, eigener Betrag.
    // Schlüssel ohne Leer-/Sonderzeichen, Treffer auch bei Titeln wie "Core & Court – Padel".
    const SPECIAL_PRICES = {
      "corecourt": { amount: 40 }
    };

    // Kurse, bei denen zusätzlich die Padelstufe abgefragt wird.
    const PADEL_CLASSES = ["corecourt", "padel"];
    function classKey(title){ return (title || "").toLowerCase().replace(/[^a-z0-9]/g, ""); }
    function matchClass(title, keys){ const k = classKey(title); return keys.find(key => k.includes(key)); }

    let events = [];
    let cursor = new Date();
    cursor.setDate(1);
    let selectedKey = null;

    function dayKey(d){
      return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
    }

    function normalize(raw){
      let list = [];
      try{
        if(Array.isArray(raw) && raw.length && raw[0] && Array.isArray(raw[0].result)){
          list = raw[0].result;
        } else if(raw && Array.isArray(raw.result)){
          list = raw.result;
        } else if(Array.isArray(raw)){
          list = raw;
        }
      }catch(e){ list = []; }

      return list.map(item => {
        const info = item.classInformation || {};
        const instructors = (item.instructors||[]).map(i => [i.firstName,i.lastName].filter(Boolean).join(" ")).filter(Boolean);
        const start = new Date(item.startDateTime);
        const end = item.endDateTime ? new Date(item.endDateTime) : null;
        const max = item.maxParticipants ?? null;
        const booked = (item.bookedParticipants||0) + (item.additionalParticipants||0);
        const free = max != null ? Math.max(max - booked, 0) : null;
        return {
          id: item.id,
          title: info.title || "Kurs",
          category: info.category || "",
          description: info.description || "",
          start, end,
          instructors,
          location: item.location,
          max, booked, free,
          waiting: item.waitingListParticipants || 0,
          maxWaiting: item.maxWaitingListParticipants || 0,
          bookable: item.bookable !== false
        };
      }).filter(e => !isNaN(e.start));
    }

    function fmtTime(d){
      return d.toLocaleTimeString("de-DE", {hour:"2-digit", minute:"2-digit"});
    }

    async function loadEvents(){
      const statusRow = document.getElementById("kpStatusRow");
      const statusText = document.getElementById("kpStatusText");
      statusRow.className = "status-row loading";
      statusText.textContent = "Lade Termine vom Webhook…";
      try{
        const res = await fetch(WEBHOOK_URL, { headers: { "Accept": "application/json" } });
        if(!res.ok){
          const body = await res.text();
          throw new Error("HTTP " + res.status + " – " + body.slice(0,180));
        }
        const raw = await res.json();
        events = normalize(raw);
        statusRow.className = "status-row ok";
        statusText.textContent = events.length + " Termine geladen.";
      }catch(err){
        statusRow.className = "status-row err";
        const isCors = err instanceof TypeError;
        statusText.textContent = isCors
          ? "Fehler: Anfrage blockiert (vermutlich CORS – der Webhook sendet keinen Access-Control-Allow-Origin Header für Browser-Aufrufe)."
          : "Fehler beim Laden: " + err.message;
        events = [];
      }
      render();
    }

    function eventsForDay(d){
      const key = dayKey(d);
      return events.filter(e => dayKey(e.start) === key).sort((a,b)=>a.start-b.start);
    }

    function renderDayPanel(d){
      const title = document.getElementById("kpDayPanelTitle");
      const body = document.getElementById("kpDayPanelBody");
      const watermark = document.getElementById("kpDayWatermark");
      title.textContent = d.toLocaleDateString("de-DE", { weekday:"long", day:"2-digit", month:"long", year:"numeric" });
      watermark.textContent = String(d.getDate()).padStart(2,"0");
      const list = eventsForDay(d);
      if(!list.length){
        body.innerHTML = '<div class="day-empty">Keine Kurse an diesem Tag.</div>';
        return;
      }
      body.innerHTML = list.map(e => {
        const slotClass = e.free === 0 ? "full" : "free";
        const slotText = e.max != null ? (e.free + " / " + e.max + " frei") : "";
        const waitingText = e.waiting > 0 ? (e.waiting + " Warteliste") : "";
        const meta = [e.category, ...e.instructors].filter(Boolean).join(" · ");

        let btnLabel = "Buchen";
        let btnDisabled = "";
        if(!e.bookable || e.start < new Date()){
          btnLabel = "Nicht buchbar"; btnDisabled = "disabled";
        } else if(e.free === 0){
          if(e.waiting < e.maxWaiting){ btnLabel = "Warteliste"; }
          else { btnLabel = "Ausgebucht"; btnDisabled = "disabled"; }
        }

        return `<div class="event-card">
          <div class="event-time">${fmtTime(e.start)}<small>${e.end ? fmtTime(e.end) : ""}</small></div>
          <div class="event-body">
            <div class="event-title">${e.title}</div>
            <div class="event-meta">${meta || "&nbsp;"}</div>
          </div>
          <div class="event-slots">
            ${slotText ? `<span class="${slotClass}">${slotText}</span>` : ""}
            ${waitingText ? `<span class="waiting">${waitingText}</span>` : ""}
            <button class="btn-book" data-event-id="${e.id}" ${btnDisabled}>${btnLabel}</button>
          </div>
        </div>`;
      }).join("");

      body.querySelectorAll(".btn-book").forEach(btn => {
        btn.addEventListener("click", () => openBookingModal(btn.dataset.eventId));
      });
    }

    function render(){
      const grid = document.getElementById("kpCalGrid");
      const label = document.getElementById("kpMonthLabel");
      label.textContent = MONTHS[cursor.getMonth()] + " " + cursor.getFullYear();

      grid.innerHTML = "";
      grid.style.animation = "none";
      grid.offsetHeight;
      grid.style.animation = "";
      DOW.forEach(d => {
        const el = document.createElement("div");
        el.className = "cal-dow";
        el.textContent = d;
        grid.appendChild(el);
      });

      const firstOfMonth = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
      const startOffset = (firstOfMonth.getDay() + 6) % 7; // Monday = 0
      const gridStart = new Date(firstOfMonth);
      gridStart.setDate(gridStart.getDate() - startOffset);

      const today = new Date();
      const todayKey = dayKey(today);
      if(!selectedKey) selectedKey = todayKey;

      for(let i=0; i<42; i++){
        const d = new Date(gridStart);
        d.setDate(gridStart.getDate() + i);
        const key = dayKey(d);
        const cell = document.createElement("div");
        cell.className = "cal-cell";
        if(d.getMonth() !== cursor.getMonth()) cell.classList.add("other-month");
        if(key === todayKey) cell.classList.add("today");
        if(key === selectedKey) cell.classList.add("selected");
        cell.dataset.key = key;

        const dayEvents = eventsForDay(d);
        const chips = dayEvents.slice(0,3).map(e => `<div class="cell-chip">${fmtTime(e.start)} ${e.title}</div>`).join("");
        const more = dayEvents.length > 3 ? `<div class="cell-more">+${dayEvents.length-3} mehr</div>` : "";

        cell.innerHTML = `<div class="cell-date">${d.getDate()}</div>
          <div class="cell-events" data-count="${dayEvents.length ? dayEvents.length+' Kurse' : ''}">${chips}${more}</div>`;

        cell.addEventListener("click", () => {
          selectedKey = key;
          render();
          renderDayPanel(d);
        });

        grid.appendChild(cell);
      }

      const selDate = new Date(selectedKey + "T00:00:00");
      renderDayPanel(selDate);
    }

    document.getElementById("kpPrevBtn").addEventListener("click", () => {
      cursor.setMonth(cursor.getMonth()-1);
      render();
    });
    document.getElementById("kpNextBtn").addEventListener("click", () => {
      cursor.setMonth(cursor.getMonth()+1);
      render();
    });
    document.getElementById("kpTodayBtn").addEventListener("click", () => {
      cursor = new Date();
      cursor.setDate(1);
      selectedKey = dayKey(new Date());
      render();
    });

    // --- Booking modal ---
    const overlay = document.getElementById("kpBookingOverlay");
    const kpBookingForm = document.getElementById("kpBookingForm");
    const kpBookingSub = document.getElementById("kpBookingSub");
    const kpBookingDesc = document.getElementById("kpBookingDesc");
    const kpBookingPrice = document.getElementById("kpBookingPrice");
    const kpBookingMsg = document.getElementById("kpBookingMsg");
    const kpBookingSubmit = document.getElementById("kpBookingSubmit");
    const kpPadelRow = document.getElementById("kpPadelRow");
    const kpBfPadel = document.getElementById("kpBfPadel");
    let activeEvent = null;

    function renderBookingPrice(title){
      const special = SPECIAL_PRICES[matchClass(title, Object.keys(SPECIAL_PRICES))];
      if(special){
        kpBookingPrice.innerHTML = `Dein Einstieg zum Vorzugspreis: <strong>einmalig ${special.amount}&nbsp;€</strong> – ganz bequem und unkompliziert direkt vor Ort bei uns im Studio zahlbar.`;
      } else {
        kpBookingPrice.innerHTML = `Dein Einstieg: <strong>einmalig 27&nbsp;€</strong> – ganz bequem und unkompliziert direkt vor Ort bei uns im Studio zahlbar.`;
      }
    }

    function openBookingModal(eventId){
      activeEvent = events.find(e => String(e.id) === String(eventId));
      if(!activeEvent) return;
      kpBookingSub.innerHTML = `<b>${activeEvent.title}</b> &middot; ${activeEvent.start.toLocaleDateString("de-DE",{weekday:"short",day:"2-digit",month:"2-digit"})}, ${fmtTime(activeEvent.start)}–${activeEvent.end ? fmtTime(activeEvent.end) : ""} Uhr`;
      kpBookingDesc.textContent = activeEvent.description || "";
      renderBookingPrice(activeEvent.title);
      kpBookingMsg.className = "kp-form-msg";
      kpBookingMsg.textContent = "";
      kpBookingForm.reset();
      const needsPadel = !!matchClass(activeEvent.title, PADEL_CLASSES);
      kpPadelRow.style.display = needsPadel ? "block" : "none";
      kpBfPadel.required = needsPadel;
      kpBookingSubmit.disabled = false;
      kpBookingSubmit.textContent = "Verbindlich buchen";
      overlay.classList.add("active");
      document.body.style.overflow = 'hidden';
      document.getElementById("kpBfFirst").focus();
    }

    function closeBookingModal(){
      overlay.classList.remove("active");
      document.body.style.overflow = '';
      activeEvent = null;
    }

    document.getElementById("kpBookingCancel").addEventListener("click", closeBookingModal);
    overlay.addEventListener("click", (ev) => { if(ev.target === overlay) closeBookingModal(); });
    document.addEventListener("keydown", (ev) => { if(ev.key === "Escape" && overlay.classList.contains("active")) closeBookingModal(); });

    kpBookingForm.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      if(!activeEvent) return;

      const payload = {
        classId: activeEvent.id,
        classTitle: activeEvent.title,
        startDateTime: activeEvent.start.toISOString(),
        endDateTime: activeEvent.end ? activeEvent.end.toISOString() : null,
        firstName: document.getElementById("kpBfFirst").value.trim(),
        lastName: document.getElementById("kpBfLast").value.trim(),
        email: document.getElementById("kpBfEmail").value.trim(),
        phone: document.getElementById("kpBfPhone").value.trim(),
        padelLevel: kpPadelRow.style.display === "none" ? null : Number(kpBfPadel.value),
        padelLevelLabel: kpPadelRow.style.display === "none" ? null : kpBfPadel.options[kpBfPadel.selectedIndex].text
      };

      kpBookingSubmit.disabled = true;
      kpBookingSubmit.textContent = "Wird gesendet…";
      kpBookingMsg.className = "kp-form-msg";

      try{
        const res = await fetch(BOOKING_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if(!res.ok){
          const body = await res.text();
          throw new Error("HTTP " + res.status + " – " + body.slice(0,180));
        }
        kpBookingMsg.classList.add("show","ok");
        kpBookingMsg.textContent = "Anmeldung erfolgreich gesendet! Du bekommst eine Bestätigung per E-Mail.";
        kpBookingSubmit.textContent = "Gesendet";
        setTimeout(closeBookingModal, 1800);
      }catch(err){
        kpBookingMsg.classList.add("show","err");
        const isCors = err instanceof TypeError;
        kpBookingMsg.textContent = isCors
          ? "Fehler: Anfrage blockiert (Webhook nicht erreichbar oder CORS)."
          : "Fehler beim Senden: " + err.message;
        kpBookingSubmit.disabled = false;
        kpBookingSubmit.textContent = "Erneut versuchen";
      }
    });

    render();
    loadEvents();
  })();
