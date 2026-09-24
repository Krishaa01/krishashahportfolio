(function () {
  'use strict';

  document.body.classList.add('game-page');

  var stage = document.getElementById('gameStage');
  if (!stage) return; // not on the home page

  var cloudsLayer = document.getElementById('cloudsLayer');
  var mainLayer = document.getElementById('mainLayer');
  var scrollHint = document.getElementById('scrollHint');
  var progressFill = document.getElementById('progressFill');
  if (progressFill && progressFill.parentElement) {
  progressFill.parentElement.style.display = 'none';
}
  var portalOverlay = document.getElementById('portalOverlay');
  var headerEl = document.querySelector('header');

  /* ---------------------------------------------------------------
   * Responsive scale — everything is authored at desktop scale (S=1)
   * and shrunk down for narrow viewports.
   * ------------------------------------------------------------- */
  function getScale() {
    var w = window.innerWidth;
    if (w < 560) return 0.52;
    if (w < 900) return 0.7;
    if (w < 1200) return 0.85;
    return 1;
  }
  var S = getScale();
  function px(v) { return v * S; }

  function setHeaderVar() {
    if (headerEl) {
      document.documentElement.style.setProperty('--header-h', headerEl.offsetHeight + 'px');
    }
  }
  setHeaderVar();

  /* ---------------------------------------------------------------
   * World layout (design units, scaled by S at build time)
   * ------------------------------------------------------------- */
  var GROUND_TOP = 2700;       // world "top" coordinate of the ground surface
  var CHAR_H = 130;

  var world = {
    groundTop: GROUND_TOP,
    horizontalDistance: 0,     // set once content is laid out
    climbHeight: 2000,
    verticalBuffer: 260,       // extra scroll after climb before portal fully triggers
    poleX: 0,
    poleWidth: 120,
    worldWidth: 0,
    worldHeight: 0
  };

  var trees = [];   // {x, h, variant}
  var content = []; // generic standees {x, top, w, h, img, cls}
  var icons = [];   // {x, top, w, h, img, bounced}
  var cards = [];   // {x, top, w, h, img}
  var clouds = [];  // {x, top, w, h, kind}

  function addTree(x, h, variant, yOffset) {
  trees.push({ x: x, h: h, variant: variant, yOffset: yOffset || 0 });
}
  function addContent(x, h, ratio, img, extraTop) {
    var w = h * ratio;
    var top = GROUND_TOP - h - (extraTop || 0);
    content.push({ x: x, top: top, w: w, h: h, img: img });
    return { x: x, w: w, h: h, top: top };
  }

  /* ----- lay out the horizontal journey ----- */
  addTree(40, px(200), 'light', px(90));
  addTree(140, px(150), 'dark', px(100));

  var nameSign = addContent(180, px(600), 1938 / 1353, 'game portfolio name and role page.png');

  addTree(950, px(200), 'dark', px(80));
  addTree(1050, px(230), 'light',  px(80));
  addTree(1850, px(140), 'light',  px(80));

  var aboutMe = addContent(1200, px(550), 2473 / 1353, 'game portfolio about me.png', px(1));
  var aboutContent = addContent(aboutMe.x + aboutMe.w + 30, px(420), 2047 / 1552, 'game portfolio about me content.png', px(10));

  addTree(aboutContent.x + aboutContent.w + 10, px(210), 'light',  px(80));
  addTree(aboutContent.x + aboutContent.w + 100, px(175), 'dark',  px(100));

  var stoneX = aboutContent.x + aboutContent.w + 220;
  var stone = addContent(stoneX, px(130), 870 / 518, 'game portfolio stone.png');

  addTree(stone.x + stone.w + 98, px(200), 'dark', px(90));
  addTree(stone.x + stone.w + 25, px(190), 'dark', px(80));
  addTree(stone.x + stone.w + 95, px(160), 'light', px(80));


  var skillsX = stone.x + stone.w + 400;
  var skillsSign = addContent(skillsX, px(290), 1317 / 454, 'game portfolio skills.png', px(60));

  var ICON_FILES_1 = ['game portfolio bleder.png', 'game portfolio unity.png', 'game portfolio Gdevelp.png', 'game portfolio touch designer.png', 'game portfolio gb studio.png'];
  var ICON_FILES_2 = ['game portfolio figma.png', 'game portfolio Ae.png', 'game portfolio Pr.png', 'game portfolio Id.png', 'game portfolio Ps.png'];
  var iconH = px(82);
  var iconW = iconH * (1090 / 1184);
  var iconSpacing = px(92);
  var iconStartX = skillsSign.x - 30;
  ICON_FILES_1.forEach(function (img, i) {
    icons.push({ x: iconStartX + i * iconSpacing, top: GROUND_TOP - iconH - px(10), w: iconW, h: iconH, img: img, bounced: false });
  });
  var icon2StartX = iconStartX + ICON_FILES_1.length * iconSpacing + px(60);
  ICON_FILES_2.forEach(function (img, i) {
    icons.push({ x: icon2StartX + i * iconSpacing, top: GROUND_TOP - iconH - px(10), w: iconW, h: iconH, img: img, bounced: false });
  });

  var lastIconX = icon2StartX + (ICON_FILES_2.length - 1) * iconSpacing + iconW;

  addTree(lastIconX + 160, px(200), 'light', px(80));
  addTree(lastIconX + 270, px(170), 'dark', px(100));

  var careerX = lastIconX + 480;
  var careerSign = addContent(careerX, px(600), 1681 / 908, 'game portfolio career.png', px(10));

  addTree(careerSign.x + careerSign.w - 100, px(185), 'dark', px(80));
  addTree(careerSign.x + careerSign.w + 10, px(180), 'light', px(80));

  world.poleX = careerSign.x + careerSign.w + 200;
  world.horizontalDistance = world.poleX - 60;

  /* ----- pole + experience cards (vertical climb) ----- */
  var poleWidth = px(200);
  world.poleWidth = poleWidth;
  var climbHeight = px(2000);
  world.climbHeight = climbHeight;

  var cardW = px(700);
  var cardH = cardW / (1916 / 1422);

  cards.push({
    x: world.poleX + poleWidth - 280,
    top: GROUND_TOP - px(250) - cardH,
    w: cardW, h: cardH,
    img: 'game portfolio work ample.png'
  });
  cards.push({
    x: world.poleX + 280 - cardW,
    top: GROUND_TOP - px(900) - cardH,
    w: cardW, h: cardH,
    img: 'game portfolio wokr kochi biennale.png'
  });
  cards.push({
    x: world.poleX + poleWidth - 280,
    top: GROUND_TOP - px(1550) - cardH,
    w: cardW, h: cardH,
    img: 'game prototype work mydeck.png'
  });

  var portalW = px(280);
  var portalH = portalW / (578 / 225);
  var portalClimbY = climbHeight - px(20);
  var portal = {
    x: world.poleX + poleWidth / 2 - portalW / 2,
    top: GROUND_TOP - portalClimbY - portalH,
    w: portalW, h: portalH
  };

  world.verticalDistance = climbHeight + px(300);
  world.totalPathLength = world.horizontalDistance + world.verticalDistance;

  world.worldWidth = world.poleX + poleWidth + px(400);
  world.worldHeight = GROUND_TOP + px(320);

  /* ----- clouds (parallax layer) ----- */
  var CLOUD_KIND = {
    small: { img: 'game portfolio small cloud.svg', w: 150, h: 80 },
    medium: { img: 'game portfolio medium cloud.svg', w: 250, h: 130 },
    large: { img: 'game portfolio large cloud.svg', w: 350, h: 180 }
  };
  // third value = height above the ground line (world coords grow downward,
  // so a cloud's "top" is GROUND_TOP minus this offset minus its own height)
  var cloudPlan = [
    ['small', 60, 360], ['medium', 380, 460], ['large', 780, 300], ['small', 1250, 420],
    ['medium', 1700, 260], ['small', 2100, 440], ['large', 2500, 320], ['medium', 2950, 400],
    ['small', 3400, 280], ['large', 3850, 360], ['medium', 4300, 450], ['small', 4700, 300],
    ['medium', 5050, 380]
  ];
  cloudPlan.forEach(function (c) {
    var k = CLOUD_KIND[c[0]];
    var h = k.h * S;
    clouds.push({ x: c[1] * S, top: GROUND_TOP - px(c[2]) - h, w: k.w * S, h: h, img: k.img });
  });
  // bonus label cloud near the top of the climb
  var labelCloud = {
    x: world.poleX - px(420), top: GROUND_TOP - climbHeight + px(120),
    w: CLOUD_KIND.medium.w * S, h: CLOUD_KIND.medium.h * S, img: CLOUD_KIND.medium.img, label: 'My Portfolio'
  };
  clouds.push(labelCloud);

  /* ---------------------------------------------------------------
   * Build DOM
   * ------------------------------------------------------------- */
  function el(tag, cls, styleObj) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (styleObj) Object.assign(e.style, styleObj);
    return e;
  }
  function img(src, cls) {
    var i = el('img');
    i.src = src;
    i.alt = '';
    i.draggable = false;
    return i;
  }
  function placeEl(container, cls, x, top, w, h) {
    var e = el('div', 'w-el ' + cls, {
      left: x + 'px', top: top + 'px', width: w + 'px', height: h + 'px'
    });
    container.appendChild(e);
    return e;
  }

  // grass strip
  var grassH = px(320);
  var grassRatio = 2728 / 1296;
  var grassTileW = grassH * grassRatio;
  var grass = placeEl(mainLayer, 'layer-grass', 0, GROUND_TOP - grassH + px(30), world.worldWidth, grassH);
  grass.style.zIndex = 1;
  grass.style.backgroundImage = "url('game portfolio green bg.png')";
  grass.style.backgroundSize = grassTileW + 'px ' + grassH + 'px';

  // trees
  trees.forEach(function (t) {
    var ratio = t.variant === 'dark' ? 388 / 532 : 682 / 958;
    var w = t.h * ratio;
    var e = placeEl(mainLayer, 'tree ' + t.variant, t.x, GROUND_TOP - t.h + px(6) - (t.yOffset || 0), w, t.h);
    e.style.zIndex = 2;
    e.appendChild(img(t.variant === 'dark' ? 'game portfolio tree dark.png' : 'game portfolio tree light.png'));
  });

  // ground path (drawn after trees so it sits in front)
  var groundH = px(110);
  var groundRatio = 800 / 400;
  var groundTileW = groundH * groundRatio;
  var ground = placeEl(mainLayer, 'layer-ground', 0, GROUND_TOP - px(6), world.worldWidth, groundH + px(6));
  ground.style.zIndex = 3;
  ground.style.backgroundImage = "url('game portfolio me groundd.png')";
  ground.style.backgroundSize = groundTileW + 'px ' + groundH + 'px';

  // content standees
  content.forEach(function (c) {
    var e = placeEl(mainLayer, 'sign', c.x, c.top, c.w, c.h);
    e.style.zIndex = 3;
    e.appendChild(img(c.img));
  });

  // skill icons
  icons.forEach(function (ic, i) {
    var e = placeEl(mainLayer, 'skill-icon', ic.x, ic.top, ic.w, ic.h);
    e.style.zIndex = 4;
    e.appendChild(img(ic.img));
    ic.el = e;
  });

  // pole (tiled)
  var poleLift = px(80);
  var poleTile = placeEl(mainLayer, 'pole-tile', world.poleX, GROUND_TOP - climbHeight - poleLift, poleWidth, climbHeight);
  poleTile.style.zIndex = 3;
  var poleTileH = poleWidth / (1452 / 4100);
  poleTile.style.backgroundImage = "url('game portfolio pole work.png')";
  poleTile.style.backgroundSize = poleWidth + 'px ' + poleTileH + 'px';

  // experience cards
  cards.forEach(function (c) {
    var e = placeEl(mainLayer, 'exp-card', c.x, c.top, c.w, c.h);
    e.style.zIndex = 3;
    e.appendChild(img(c.img));
  });

  // portal
  var portalEl = placeEl(mainLayer, 'portal', portal.x, portal.top, portal.w, portal.h);
  portalEl.style.zIndex = 4;
  portalEl.appendChild(img('game portfolio portal.png'));

  // clouds
  clouds.forEach(function (c) {
    var e = placeEl(cloudsLayer, 'cloud', c.x, c.top, c.w, c.h);
    e.style.animationDuration = (5 + Math.random() * 4).toFixed(2) + 's';
    e.appendChild(img(c.img));
    if (c.label) {
      var lbl = el('div', 'cloud-label');
      lbl.textContent = c.label;
      e.appendChild(lbl);
    }
  });

  // character
  var charW = px(CHAR_H), charH = px(CHAR_H);
  var character = el('div', 'char', { width: charW + 'px', height: charH + 'px' });
  character.style.backgroundSize = (10 * charW) + 'px ' + charH + 'px';
  mainLayer.appendChild(character);

  /* ---------------------------------------------------------------
   * Animation state
   * ------------------------------------------------------------- */
  var FRAMES = {
    idle: [0, 1],
    walk: [2, 3, 4, 5],
    jump: [6, 7],
    fly: [8, 9]
  };
  var frameW = charW;
  var frameTimer = 0;
  var frameIdx = 0;
  var currentState = 'idle';

  var dTarget = 0;
  var dCurrent = 0;
  var lastD = 0;
  var started = false;
  var finished = false;

  var STONE_JUMP_START = stone.x - px(140);
  var STONE_JUMP_END = stone.x + stone.w + px(110);

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function setInput(delta) {
    if (finished) return;
    if (!started && delta > 0) {
      started = true;
      scrollHint.classList.add('hidden');
    }
    dTarget = clamp(dTarget + delta, 0, world.totalPathLength);
  }

  // wheel
  stage.addEventListener('wheel', function (e) {
    e.preventDefault();
    setInput((e.deltaY + e.deltaX) * 1.35);
  }, { passive: false });

  // touch
  var touchStartY = null, touchStartX = null;
  stage.addEventListener('touchstart', function (e) {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  stage.addEventListener('touchmove', function (e) {
    if (touchStartY === null) return;
    e.preventDefault();
    var y = e.touches[0].clientY;
    var x = e.touches[0].clientX;
    var dy = touchStartY - y;
    var dx = touchStartX - x;
    setInput((dy + dx) * 2.2);
    touchStartY = y;
    touchStartX = x;
  }, { passive: false });

  // keyboard
  window.addEventListener('keydown', function (e) {
    if (!document.body.classList.contains('game-page')) return;
    if (['ArrowRight', 'ArrowDown', ' ', 'PageDown'].indexOf(e.key) !== -1) {
      e.preventDefault(); setInput(90);
    } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].indexOf(e.key) !== -1) {
      e.preventDefault(); setInput(-90);
    }
  }, { passive: false });

  /* ---------------------------------------------------------------
   * Main loop
   * ------------------------------------------------------------- */
  var lastTime = performance.now();

  function frame(now) {
    var dt = Math.min(48, now - lastTime);
    lastTime = now;

    dCurrent += (dTarget - dCurrent) * 0.14;
    if (Math.abs(dTarget - dCurrent) < 0.4) dCurrent = dTarget;

    var moving = Math.abs(dCurrent - lastD) > 0.02;
    lastD = dCurrent;

    var stageRect = stage.getBoundingClientRect();
    var stageW = stageRect.width || 1;
    var stageH = stageRect.height || 1;

    var charX, charTop, state;

    if (dCurrent <= world.horizontalDistance) {
      charX = dCurrent;
      var baseTop = GROUND_TOP - charH;

      if (dCurrent > STONE_JUMP_START && dCurrent < STONE_JUMP_END) {
        var t = (dCurrent - STONE_JUMP_START) / (STONE_JUMP_END - STONE_JUMP_START);
        var arc = Math.sin(clamp(t, 0, 1) * Math.PI) * px(110);
        charTop = baseTop - arc;
        state = 'jump';
      } else {
        charTop = baseTop;
        state = moving ? 'walk' : 'idle';
      }
    } else {
      charX = world.poleX + poleWidth * 0.55;
      var climbY = dCurrent - world.horizontalDistance;
      charTop = (GROUND_TOP - charH) - climbY;
      charX += Math.sin(climbY / 140) * px(46);
      state = 'fly';
    }

    // camera
    var camX, camY;
    var camYBase = clamp(GROUND_TOP - stageH * 0.87, 0, Math.max(0, world.worldHeight - stageH));
    if (dCurrent <= world.horizontalDistance) {
      camX = clamp(charX - stageW * 0.35, 0, Math.max(0, world.worldWidth - stageW));
      camY = camYBase;
    } else {
      camX = clamp(charX - stageW * 0.5, 0, Math.max(0, world.worldWidth - stageW));
      camY = clamp(charTop - stageH * 0.62, 0, Math.max(0, world.worldHeight - stageH));
    }

    mainLayer.style.transform = 'translate(' + (-camX) + 'px,' + (-camY) + 'px)';
    // clouds drift slower than the main scene for depth, but must share the
    // same resting point as the main camera so they don't jump on load
    var cloudY = camYBase + (camY - camYBase) * 0.35;
    cloudsLayer.style.transform = 'translate(' + (-camX * 0.3) + 'px,' + (-cloudY) + 'px)';

    character.style.left = charX + 'px';
    character.style.top = charTop + 'px';

    // frame animation
    if (state !== currentState) {
      currentState = state;
      frameIdx = 0;
      frameTimer = 0;
    }
    var list = FRAMES[state];
    var speed = state === 'walk' ? 110 : state === 'fly' ? 160 : state === 'jump' ? 140 : 260;
    frameTimer += dt;
    if (frameTimer >= speed) {
      frameTimer = 0;
      frameIdx = (frameIdx + 1) % list.length;
    }
    character.style.backgroundPosition = (-list[frameIdx] * frameW) + 'px 0px';

    // icon bounce proximity
    icons.forEach(function (ic) {
      var near = dCurrent > ic.x - px(150) && dCurrent < ic.x + px(150);
      if (near && !ic.bounced) {
        ic.bounced = true;
        ic.el.classList.add('bounce');
        setTimeout(function () { ic.el.classList.remove('bounce'); }, 600);
      } else if (!near && ic.bounced && (dCurrent < ic.x - px(220) || dCurrent > ic.x + px(220))) {
        ic.bounced = false;
      }
    });

    // progress bar
    var pct = clamp((dCurrent / world.totalPathLength) * 100, 0, 100);
    progressFill.style.width = pct + '%';

    // portal completion
    if (!finished && dTarget >= world.totalPathLength - 2) {
      finished = true;
      setTimeout(function () {
        portalOverlay.classList.add('active');
        setTimeout(function () {
          window.location.href = 'works.html';
        }, 900);
      }, 350);
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);

  window.addEventListener('resize', function () {
    setHeaderVar();
  });
})();
