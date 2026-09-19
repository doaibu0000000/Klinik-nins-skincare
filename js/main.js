/* Klinik Nins Skincare — main.js */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  root.classList.add("js");

  /* ---- Tahun otomatis di footer ---- */
  var year = doc.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---- Header: bayangan saat scroll ---- */
  var header = doc.querySelector(".site-header");
  var onScroll = function () {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Nav mobile ---- */
  var toggle = doc.getElementById("nav-toggle");
  var nav = doc.getElementById("site-nav");
  if (toggle && nav) {
    var setNav = function (open) {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    };
    toggle.addEventListener("click", function () {
      setNav(!nav.classList.contains("open"));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setNav(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 900) setNav(false);
    });
  }

  /* ---- Reveal on scroll ---- */
  var revealEls = [].slice.call(doc.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          } else if (entry.boundingClientRect.top < 0) {
            /* elemen yang sudah dilewati (mis. lompat anchor): tampilkan langsung */
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 3, 2) * 70 + "ms";
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  /* ---- Peta: muat saat mendekat ke viewport (hemat kuota) ---- */
  var mapFrame = doc.getElementById("map-embed");
  if (mapFrame && "IntersectionObserver" in window) {
    var mapIO = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var src = mapFrame.getAttribute("data-src");
            if (src) {
              mapFrame.removeAttribute("data-src");
              mapFrame.src = src;
            }
            obs.disconnect();
          }
        });
      },
      { rootMargin: "300px" }
    );
    mapIO.observe(mapFrame.closest(".location-card") || mapFrame);
  } else if (mapFrame) {
    mapFrame.src = mapFrame.getAttribute("data-src") || "";
    mapFrame.removeAttribute("data-src");
  }

  /* ---- Sticky bar mobile: sembunyikan saat tombol WA hero terlihat, tampilkan jika sudah tidak terlihat ---- */
  var heroWaBtn = doc.getElementById("hero-wa-btn") || doc.querySelector(".hero-actions .btn-primary");
  var mobileBar = doc.querySelector(".mobile-bar");

  if (heroWaBtn && mobileBar) {
    if ("IntersectionObserver" in window) {
      var barObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              mobileBar.classList.remove("is-visible");
            } else {
              mobileBar.classList.add("is-visible");
            }
          });
        },
        {
          /* Header sticky memiliki tinggi 72px; elemen dianggap keluar layar saat melewati bawah header */
          rootMargin: "-72px 0px 0px 0px",
          threshold: 0
        }
      );
      barObserver.observe(heroWaBtn);
    } else {
      var updateMobileBar = function () {
        var rect = heroWaBtn.getBoundingClientRect();
        var inView = rect.bottom > 72 && rect.top < (window.innerHeight || doc.documentElement.clientHeight);
        if (inView) {
          mobileBar.classList.remove("is-visible");
        } else {
          mobileBar.classList.add("is-visible");
        }
      };
      window.addEventListener("scroll", updateMobileBar, { passive: true });
      window.addEventListener("resize", updateMobileBar, { passive: true });
      updateMobileBar();
    }
  }

  /* ---- Counter animasi angka rating hero (0,0 -> 5,0) ---- */
  var scoreEl = doc.getElementById("hero-badge-score");
  if (scoreEl) {
    var startScore = 0;
    var targetScore = 5.0;
    var duration = 1200;
    var startTime = null;
    var hasRunScore = false;

    var animateScore = function (timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var ease = 1 - Math.pow(1 - progress, 3);
      var current = (startScore + (targetScore - startScore) * ease).toFixed(1).replace(".", ",");
      scoreEl.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(animateScore);
      } else {
        scoreEl.textContent = "5,0";
      }
    };

    var triggerScore = function () {
      if (hasRunScore) return;
      hasRunScore = true;
      requestAnimationFrame(animateScore);
    };

    if ("IntersectionObserver" in window) {
      var badgeCard = doc.querySelector(".hero-badge");
      var badgeObs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              triggerScore();
              badgeObs.disconnect();
            }
          });
        },
        { threshold: 0.1 }
      );
      if (badgeCard) badgeObs.observe(badgeCard);
    } else {
      setTimeout(triggerScore, 400);
    }
  }

  /* ---- Galeri Desktop: Auto-Scroll Mulus & Pause HANYA Saat Kursor Pas di Atas Gambar ---- */
  var galleryTrack = doc.querySelector(".gallery-track");

  if (galleryTrack) {
    var items = [].slice.call(galleryTrack.querySelectorAll(".gallery-item"));
    var originalCount = items.length;
    var isCloned = false;
    var halfWidth = 0;
    var isImageHovered = false;
    var isDragging = false;
    var startX = 0;
    var scrollStart = 0;

    /* Pasang event listener hover khusus pada tiap kartu foto */
    var bindItemHover = function (el) {
      el.addEventListener("mouseenter", function () {
        isImageHovered = true;
      });
      el.addEventListener("mouseleave", function () {
        isImageHovered = false;
      });
    };

    items.forEach(bindItemHover);

    /* Duplikasi item untuk infinite seamless looping pada desktop */
    var setupClone = function () {
      if (window.innerWidth >= 768 && !isCloned && originalCount > 0) {
        items.forEach(function (item) {
          var clone = item.cloneNode(true);
          clone.setAttribute("aria-hidden", "true");
          bindItemHover(clone);
          galleryTrack.appendChild(clone);
        });
        isCloned = true;
        recalcWidth();
      }
    };

    var recalcWidth = function () {
      if (isCloned) {
        var currentItems = galleryTrack.querySelectorAll(".gallery-item");
        if (currentItems.length >= originalCount * 2) {
          halfWidth = currentItems[originalCount].offsetLeft - currentItems[0].offsetLeft;
        }
      }
    };

    setupClone();
    window.addEventListener("resize", function () {
      setupClone();
      recalcWidth();
    });

    /* Auto-scroll loop: hanya pause saat mouse pas berada di atas kartu gambar (.gallery-item) */
    var stepAutoScroll = function () {
      var hoveringCard = isImageHovered || (galleryTrack.querySelector(".gallery-item:hover") !== null);

      if (window.innerWidth >= 768 && !hoveringCard && !isDragging) {
        if (halfWidth > 0 && galleryTrack.scrollLeft >= halfWidth) {
          galleryTrack.scrollLeft -= halfWidth;
        } else {
          galleryTrack.scrollLeft += 0.85;
        }
      }
      requestAnimationFrame(stepAutoScroll);
    };
    requestAnimationFrame(stepAutoScroll);

    /* Drag-to-scroll dengan mouse pada desktop */
    galleryTrack.addEventListener("mousedown", function (e) {
      if (window.innerWidth < 768) return;
      isDragging = true;
      galleryTrack.classList.add("is-dragging");
      startX = e.pageX - galleryTrack.offsetLeft;
      scrollStart = galleryTrack.scrollLeft;
    });

    doc.addEventListener("mousemove", function (e) {
      if (!isDragging) return;
      e.preventDefault();
      var x = e.pageX - galleryTrack.offsetLeft;
      var walk = (x - startX) * 1.5;
      galleryTrack.scrollLeft = scrollStart - walk;
    });

    doc.addEventListener("mouseup", function () {
      if (isDragging) {
        isDragging = false;
        galleryTrack.classList.remove("is-dragging");
      }
    });
  }
})();
