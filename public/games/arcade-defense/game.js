(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const overlay = document.getElementById('overlay');
  const title = document.getElementById('overlay-title');
  const copy = document.getElementById('overlay-copy');
  const startButton = document.getElementById('start-button');
  const scoreNode = document.getElementById('score');
  const highScoreNode = document.getElementById('high-score');
  const waveNode = document.getElementById('wave');
  const livesNode = document.getElementById('lives');
  const fuelGauge = document.querySelector('.fuel-gauge');
  const fuelFill = document.getElementById('fuel-fill');
  const movementKeys = document.querySelectorAll('[data-move-key]');
  const fireIndicator = document.querySelector('.space-key');
  const W = canvas.width, H = canvas.height;
  // Tune these values to change the game's feel without editing its logic.
  const TUNING = {
    // Gas meter: seconds per wave, color thresholds, and low-fuel blink style.
    fuelDuration: 100,
    fuelWarningPercent: 50,
    fuelBlinkPercent: 20,
    fuelBlinkInterval: 0.55,
    fuelBlinkOpacity: 0.15,
    fuelColorFull: '#6fffe9',
    fuelColorWarning: '#ffd166',
    fuelColorLow: '#ff384f',
    // Player ship horizontal speed, in pixels per second.
    playerSpeed: 300,
    // Player projectile size in px and vertical travel speed in px/sec.
    playerProjectileWidth: 10,
    playerProjectileHeight: 26,
    playerProjectileSpeed: 460,
    // Elimination particle lifetime in seconds, icon dimensions in px, and bounce scale.
    eliminationAnimationDuration: 0.125,
    eliminationIconWidth: 34,
    eliminationIconHeight: 30,
    eliminationBounceScale: 0.25,
    // Delay between player shots, in seconds.
    playerFireCooldown: 0.75,
    // Enemy projectile size in px; speed and per-wave increase/cap are px/sec.
    enemyProjectileWidth: 14,
    enemyProjectileHeight: 24,
    enemyProjectileSpeed: 165,
    enemyProjectileSpeedPerWave: 8,
    enemyProjectileSpeedCap: 310,
    // Horizontal formation speed in px/sec, with per-wave increase and cap.
    enemyBaseSpeed: 34,
    enemySpeedPerWave: 6,
    enemySpeedCap: 108,
    // Diving enemy speed in px/sec, with per-wave increase and cap.
    enemyDiveSpeed: 110,
    enemyDiveSpeedPerWave: 8,
    enemyDiveSpeedCap: 250,
    // Time between dive attempts, in seconds; decreases by wave to a floor.
    enemyDiveInterval: 3.2,
    enemyDiveIntervalDecrease: 0.14,
    enemyDiveIntervalFloor: 0.85,
    // Maximum number of enemies that can dive at the same time.
    enemyMaxDivers: 3,
    // Dive path width in px and time per zigzag leg in seconds.
    enemyZigzagWidth: 60,
    enemyZigzagPeriod: 1.2,
    enemyZigzagPeriodDecrease: 0.045,
    enemyZigzagPeriodFloor: 0.55,
    enemyZigzagWidthPerWave: 4,
    enemyZigzagWidthCap: 96,
    // How quickly a diver's center tracks the player, in px/sec.
    enemyDiveTracking: 60,
    // Small pre-dive hop: duration in seconds and height in px.
    enemyPreDiveBounceDuration: 0.32,
    enemyPreDiveBounceHeight: 12,
    // Ship firing animation duration and horizontal/vertical scale amounts.
    shotSquashDuration: 0.16,
    shotSquashX: 0.72,
    shotStretchY: 1.3,
    // Maximum ship lean in degrees and damage flash duration in milliseconds.
    shipMaxTiltDegrees: 15,
    healthGlowDurationMs: 250,
    // Player invulnerability duration after a hit, in seconds.
    playerInvulnerability: 1.5,
    // Time between enemy shots, in seconds; decreases by wave to a floor.
    enemyFireInterval: 1.8,
    enemyFireIntervalDecrease: 0.04,
    enemyFireIntervalFloor: 0.7,
    // Special pacing overrides for the early waves, measured in seconds.
    waveOneEnemyFireDelay: 2.4,
    waveOneEnemyFireInterval: 2.5,
    waveOneFirstDiveDelay: 7.5,
    waveTwoFirstDiveDelay: 4.5,
    waveEntryDuration: 0.48,
    waveEntryRowDelay: 0.12,
    waveEntryColumnDelay: 0.035,
    waveEntryStartScale: 0.32,
    waveEntryGrayAmount: 0.45,
  };
  const sprites = {};
  const spritePaths = {
    player: 'Textures/player_sprite.png', playerShot: 'Textures/player_projectile.png',
    enemyShot: 'Textures/enemy_projectile.png', elimination: 'Textures/elimination_icon.png',
    enemies: ['Textures/enemy_ship_a.png','Textures/enemy_ship_b.png','Textures/enemy_ship_c.png','Textures/enemy_ship_d.png']
  };
  const load = (key, path) => { const image = new Image(); image.src = path; sprites[key] = image; };
  load('player', spritePaths.player); load('playerShot', spritePaths.playerShot); load('enemyShot', spritePaths.enemyShot);
  load('elimination', spritePaths.elimination);
  spritePaths.enemies.forEach((path, i) => load(`enemy${i}`, path));

  const HIGH_SCORE_KEY = 'arcade-defense-high-score';
  function readHighScore() {
    try { return Number(window.localStorage.getItem(HIGH_SCORE_KEY)) || 0; }
    catch { return 0; }
  }
  function saveHighScore() {
    if (score <= highScore) return;
    highScore = score;
    try { window.localStorage.setItem(HIGH_SCORE_KEY, String(highScore)); }
    catch { /* The current session still shows the score if storage is unavailable. */ }
  }
  let highScore = readHighScore();
  highScoreNode.textContent = String(highScore).padStart(6,'0');
  let state = 'title', score = 0, lives = 3, wave = 1, fuelRemaining = TUNING.fuelDuration, player, enemies, shots, enemyShots, eliminationEffects = [];
  let direction = 1, enemySpeed = 48, lastTime = 0, fireCooldown = 0, enemyFireCooldown = 0, invulnerable = 0;
  let formationX = 0, diveCooldown = 0;
  const keys = new Set();
  const stars = Array.from({length: 75}, (_, i) => ({x:(i*137+31)%W,y:(i*79+17)%H,r:i%5===0?1.5:1}));

  function newWave() {
    keys.clear(); syncMovementIndicators();
    enemies = [];
    const cols = wave===1 ? 4 : Math.min(11,4+wave);
    const rows = wave===1 ? 3 : Math.min(5,3+Math.floor((wave-2)/2));
    const gapX = 54, gapY = 48, startX = (W - (cols - 1) * gapX) / 2;
    for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
      const homeX = startX+col*gapX, homeY = 80+row*gapY;
      const enemy={x:homeX,y:-30,homeX,homeY,w:34,h:30,row,col,alive:true,mode:'formation',tilt:0,shotPulse:0};
      beginSlotEntry(enemy,row*TUNING.waveEntryRowDelay+col*TUNING.waveEntryColumnDelay,homeX);
      enemies.push(enemy);
    }
    direction = 1;
    enemySpeed = Math.min(TUNING.enemySpeedCap,TUNING.enemyBaseSpeed+(wave-1)*TUNING.enemySpeedPerWave);
    shots = []; enemyShots = [];
    formationX = 0;
    enemyFireCooldown = wave===1?TUNING.waveOneEnemyFireDelay:1.1;
    diveCooldown = wave===1?TUNING.waveOneFirstDiveDelay:wave===2?TUNING.waveTwoFirstDiveDelay:TUNING.enemyDiveInterval;
    state = 'waveIntro';
  }
  function resetGame() {
    keys.clear(); syncMovementIndicators();
    eliminationEffects = [];
    score = 0; lives = 3; wave = 1; fuelRemaining = TUNING.fuelDuration; player = {x:W/2-24,y:H-68,w:48,h:42,tilt:0,shotPulse:0};
    fireCooldown = 0; invulnerable = 0; newWave(); updateHud();
    overlay.classList.add('hidden'); lastTime = performance.now();
  }
  function updateHud() {
    saveHighScore();
    scoreNode.textContent = String(score).padStart(6,'0');
    highScoreNode.textContent = String(highScore).padStart(6,'0');
    waveNode.textContent = String(wave).padStart(2,'0');
    livesNode.replaceChildren(...Array.from({length:lives},()=>{const icon=document.createElement('img');icon.src='Textures/player_sprite.png';icon.alt='';return icon;}));
    livesNode.setAttribute('aria-label', `${lives} ${lives===1?'life':'lives'}`);
    updateFuelHud();
  }
  function updateFuelHud() {
    const percent = Math.max(0, fuelRemaining/TUNING.fuelDuration*100);
    fuelFill.style.width = `${percent}%`;
    const color = percent <= TUNING.fuelBlinkPercent ? TUNING.fuelColorLow : percent <= TUNING.fuelWarningPercent ? TUNING.fuelColorWarning : TUNING.fuelColorFull;
    fuelFill.style.backgroundColor = color;
    fuelGauge.style.setProperty('--fuel-blink-duration', `${TUNING.fuelBlinkInterval}s`);
    fuelGauge.style.setProperty('--fuel-blink-opacity', String(TUNING.fuelBlinkOpacity));
    fuelGauge.style.setProperty('--fuel-blink-color', TUNING.fuelColorLow);
    fuelGauge.classList.toggle('low-fuel', percent <= TUNING.fuelBlinkPercent);
    fuelGauge.setAttribute('aria-valuenow', String(Math.ceil(percent)));
  }
  function hit(a,b) { return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y; }
  function endGame(reason='invaders') {
    state='over'; title.textContent='GAME OVER';
    copy.textContent=reason==='fuel'
      ? `The gas ran out. Final score: ${String(score).padStart(6,'0')}.`
      : `Final score: ${String(score).padStart(6,'0')}. The invasion got through.`;
    startButton.textContent='PLAY AGAIN'; overlay.classList.remove('hidden');
  }
  function startNextWave() {
    wave++; fuelRemaining = TUNING.fuelDuration; updateHud(); newWave();
  }
  function damagePlayer() {
    if (invulnerable > 0) return;
    lives--; updateHud();
    livesNode.classList.remove('damage-flash');
    void livesNode.offsetWidth;
    livesNode.style.setProperty('--health-glow-duration', `${TUNING.healthGlowDurationMs}ms`);
    livesNode.classList.add('damage-flash');
    invulnerable = TUNING.playerInvulnerability;
    if (lives <= 0) endGame();
  }
  function updateWaveIntro(dt) {
    let hasEnteringEnemies=false;
    for (const enemy of enemies) {
      if (!enemy.alive || enemy.mode!=='entering') continue;
      hasEnteringEnemies=true;
      updateSlotEntry(enemy,dt);
    }
    if (!hasEnteringEnemies || enemies.every(enemy=>!enemy.alive || enemy.mode==='formation')) state='playing';
  }
  function beginSlotEntry(enemy,delay,startX,startY=-enemy.h) {
    enemy.mode='entering';
    enemy.entryElapsed=0;
    enemy.entryDelay=delay;
    enemy.entryStartX=startX;
    enemy.entryStartY=startY;
    enemy.entryScale=TUNING.waveEntryStartScale;
    enemy.x=startX;
    enemy.y=enemy.entryStartY;
  }
  function updateSlotEntry(enemy,dt) {
    enemy.entryDelay=Math.max(0,enemy.entryDelay-dt);
    if (enemy.entryDelay>0) return;
    enemy.entryElapsed+=dt;
    const progress=Math.min(1,enemy.entryElapsed/TUNING.waveEntryDuration);
    const easeOut=1-Math.pow(1-progress,3);
    const targetX=enemy.homeX+formationX;
    enemy.x=enemy.entryStartX+(targetX-enemy.entryStartX)*easeOut;
    enemy.y=enemy.entryStartY+(enemy.homeY-enemy.entryStartY)*easeOut;
    enemy.entryScale=TUNING.waveEntryStartScale+(1-TUNING.waveEntryStartScale)*easeOut;
    if (progress>=1) {
      enemy.x=targetX; enemy.y=enemy.homeY; enemy.entryScale=1; enemy.mode='formation';
    }
  }
  function update(dt) {
    for (const effect of eliminationEffects) effect.elapsed += dt;
    eliminationEffects = eliminationEffects.filter(effect => effect.elapsed < effect.duration);
    if (state==='waveIntro') { updateWaveIntro(dt); return; }
    if (state !== 'playing') return;
    fuelRemaining = Math.max(0, fuelRemaining-dt);
    updateFuelHud();
    if (fuelRemaining<=0) { endGame('fuel'); return; }
    const previousPlayerX = player.x;
    if (keys.has('ArrowLeft') || keys.has('a')) player.x -= TUNING.playerSpeed * dt;
    if (keys.has('ArrowRight') || keys.has('d')) player.x += TUNING.playerSpeed * dt;
    player.x = Math.max(8,Math.min(W-player.w-8,player.x));
    const playerVelocity = dt > 0 ? (player.x-previousPlayerX)/dt : 0;
    const playerTargetTilt = Math.max(-1,Math.min(1,playerVelocity/TUNING.playerSpeed))*TUNING.shipMaxTiltDegrees;
    player.tilt += (playerTargetTilt-player.tilt)*Math.min(1,dt*12);
    player.shotPulse = Math.max(0,player.shotPulse-dt);
    fireCooldown -= dt; enemyFireCooldown -= dt; diveCooldown -= dt; invulnerable -= dt;
    if ((keys.has(' ') || keys.has('Space')) && fireCooldown <= 0) {
      const w=TUNING.playerProjectileWidth, h=TUNING.playerProjectileHeight;
      shots.push({x:player.x+player.w/2-w/2,y:player.y-h,w,h}); fireCooldown=TUNING.playerFireCooldown;
      player.shotPulse = TUNING.shotSquashDuration;
    }
    for (const shot of shots) shot.y -= TUNING.playerProjectileSpeed*dt;
    shots = shots.filter(s=>s.y+s.h>0);
    // The formation only sweeps sideways and never descends. Slots are measured
    // from every living invader, so a diver's place is kept until it returns.
    const activeEnemies = enemies.filter(enemy=>enemy.alive);
    formationX += direction*enemySpeed*dt;
    const leftEdge = Math.min(...activeEnemies.map(enemy=>enemy.homeX))+formationX;
    const rightEdge = Math.max(...activeEnemies.map(enemy=>enemy.homeX+enemy.w))+formationX;
    if (leftEdge<12 || rightEdge>W-12) {
      direction = leftEdge<12 ? 1 : -1;
      formationX += leftEdge<12 ? 12-leftEdge : W-12-rightEdge;
    }
    // Single invaders break away from the front of the formation and dive.
    const playerCenter = player.x+player.w/2;
    if (diveCooldown<=0) {
      const inFormation = activeEnemies.filter(e=>e.mode==='formation');
      const front = inFormation.filter(e=>!inFormation.some(o=>o.col===e.col && o.row>e.row));
      const maxDivers = Math.min(TUNING.enemyMaxDivers, 1+Math.floor(Math.max(0,wave-2)/3));
      if (front.length && activeEnemies.length-inFormation.length<maxDivers) {
        const diver = front[Math.floor(Math.random()*front.length)];
        diver.mode = 'windingUp'; diver.windupT = 0; diver.diveT = 0; diver.diveX = diver.x;
        diver.diveSide = playerCenter<diver.x+diver.w/2 ? -1 : 1;
      }
      const diveInterval=Math.max(TUNING.enemyDiveIntervalFloor,TUNING.enemyDiveInterval-(wave-1)*TUNING.enemyDiveIntervalDecrease);
      diveCooldown = diveInterval*(.8+Math.random()*.4);
    }
    const diveSpeed = Math.min(TUNING.enemyDiveSpeedCap,TUNING.enemyDiveSpeed+(wave-1)*TUNING.enemyDiveSpeedPerWave);
    const zigzagPeriod = Math.max(TUNING.enemyZigzagPeriodFloor,TUNING.enemyZigzagPeriod-(wave-1)*TUNING.enemyZigzagPeriodDecrease);
    const zigzagWidth = Math.min(TUNING.enemyZigzagWidthCap,TUNING.enemyZigzagWidth+(wave-1)*TUNING.enemyZigzagWidthPerWave);
    for (const enemy of activeEnemies) {
      const previousEnemyX = enemy.x;
      enemy.shotPulse = Math.max(0,enemy.shotPulse-dt);
      const slotX = enemy.homeX+formationX;
      if (enemy.mode==='formation') { enemy.x = slotX; enemy.y = enemy.homeY; }
      else if (enemy.mode==='entering' || enemy.mode==='returning') {
        updateSlotEntry(enemy,dt);
      }
      else if (enemy.mode==='windingUp') {
        enemy.x = slotX;
        enemy.windupT += dt;
        const progress = Math.min(1,enemy.windupT/TUNING.enemyPreDiveBounceDuration);
        enemy.y = enemy.homeY-Math.sin(progress*Math.PI)*TUNING.enemyPreDiveBounceHeight;
        if (progress>=1) { enemy.mode='diving'; enemy.diveT=0; enemy.diveX=enemy.x; }
      }
      else if (enemy.mode==='diving') {
        // A triangle wave gives sharp zigzag legs; its centre line drifts
        // toward the player so the dive closes in on the ship.
        enemy.diveT += dt;
        const maxDrift = TUNING.enemyDiveTracking*dt;
        enemy.diveX += Math.max(-maxDrift,Math.min(maxDrift,playerCenter-(enemy.diveX+enemy.w/2)));
        const phase = enemy.diveT/zigzagPeriod+.25;
        const zigzag = 4*Math.abs(phase-Math.floor(phase+.5))-1;
        enemy.x = Math.max(12,Math.min(W-12-enemy.w,enemy.diveX+enemy.diveSide*zigzagWidth*zigzag));
        enemy.y += diveSpeed*dt;
        // A diver that misses leaves the bottom and re-enters from the top.
        if (enemy.y>H) {
          const slotX=enemy.homeX+formationX;
          beginSlotEntry(enemy,0,slotX,-enemy.h);
        }
      }
      const enemyVelocity = dt > 0 ? (enemy.x-previousEnemyX)/dt : 0;
      const targetTilt = -Math.max(-1,Math.min(1,enemyVelocity/TUNING.enemyBaseSpeed))*TUNING.shipMaxTiltDegrees;
      enemy.tilt += (targetTilt-enemy.tilt)*Math.min(1,dt*12);
    }
    const shooters=activeEnemies.filter(e=>e.mode==='formation').sort((a,b)=>b.y-a.y);
    if (enemyFireCooldown<=0 && shooters.length) {
      const shooter=shooters[Math.floor(Math.random()*Math.min(shooters.length,Math.max(1,Math.ceil(shooters.length/5))))];
      const w=TUNING.enemyProjectileWidth, h=TUNING.enemyProjectileHeight;
      enemyShots.push({x:shooter.x+shooter.w/2-w/2,y:shooter.y+shooter.h,w,h});
      shooter.shotPulse = TUNING.shotSquashDuration;
      const fireInterval=wave===1?TUNING.waveOneEnemyFireInterval:Math.max(TUNING.enemyFireIntervalFloor,TUNING.enemyFireInterval-(wave-2)*TUNING.enemyFireIntervalDecrease);
      enemyFireCooldown=fireInterval*(.8+Math.random()*.4);
    }
    const enemyProjectileSpeed=Math.min(TUNING.enemyProjectileSpeedCap,TUNING.enemyProjectileSpeed+(wave-1)*TUNING.enemyProjectileSpeedPerWave);
    for (const shot of enemyShots) shot.y += enemyProjectileSpeed*dt;
    enemyShots=enemyShots.filter(s=>s.y<H+20);
    for (const shot of shots) for (const enemy of enemies) if(enemy.alive && hit(shot,enemy)) {
      eliminateEnemy(enemy); shot.y=-100; score += (5-enemy.row)*10; updateHud(); break;
    }
    shots=shots.filter(s=>s.y>-50);
    for (const shot of enemyShots) if(hit(shot,player)) { shot.y=H+100; damagePlayer(); }
    // A diver that rams the ship is destroyed and costs a life.
    for (const enemy of enemies) if(enemy.alive && enemy.mode==='diving' && invulnerable<=0 && hit(enemy,player)) { eliminateEnemy(enemy); damagePlayer(); }
    enemyShots=enemyShots.filter(s=>s.y<H+20);
    if (state!=='playing') return;
    if (enemies.every(e=>!e.alive)) startNextWave();
  }
  function draw() {
    ctx.fillStyle='#030611'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#a7c7ff'; for(const star of stars){ctx.globalAlpha=.35+(star.x%7)/12;ctx.fillRect(star.x,star.y,star.r,star.r);} ctx.globalAlpha=1;
    ctx.strokeStyle='#18243b';ctx.beginPath();ctx.moveTo(0,H-22);ctx.lineTo(W,H-22);ctx.stroke();
    if (state==='playing' || state==='waveIntro') {
      enemies.forEach(e=>{if(e.alive) drawShip(sprites[`enemy${e.row%4}`],e,e.w,e.h,'#ff668f');});
      shots.forEach(s=>drawSprite(sprites.playerShot,s.x,s.y,s.w,s.h,'#6fffe9'));
      enemyShots.forEach(s=>drawSprite(sprites.enemyShot,s.x,s.y,s.w,s.h,'#ff5b9f'));
      if(invulnerable<=0 || Math.floor(performance.now()/100)%2===0) drawShip(sprites.player,player,player.w,player.h,'#6fffe9');
    } else {
      // A quiet preview on the title screen establishes the look before play.
      for(let i=0;i<4;i++)drawSprite(sprites[`enemy${i}`],W/2-95+i*48,178,34,30,'#ff668f');
      drawSprite(sprites.player,W/2-24,H-112,48,42,'#6fffe9');
    }
    for (const effect of eliminationEffects) {
      const progress = Math.min(1,effect.elapsed/effect.duration);
      const bounce = Math.sin(progress*Math.PI);
      const opacity = 1-progress;
      const scale = 1+bounce*TUNING.eliminationBounceScale;
      const w=TUNING.eliminationIconWidth*scale, h=TUNING.eliminationIconHeight*scale;
      ctx.save();
      ctx.globalAlpha=opacity;
      ctx.filter='brightness(0) saturate(100%) invert(14%) sepia(97%) saturate(7480%) hue-rotate(1deg) brightness(100%) contrast(110%)';
      // Skip the effect until its asset is ready, avoiding a placeholder square.
      if (sprites.elimination.complete && sprites.elimination.naturalWidth) {
        drawSprite(sprites.elimination,effect.x-w/2,effect.y-h/2,w,h,'#ffffff');
      }
      ctx.restore();
    }
    requestAnimationFrame(draw);
  }
  function eliminateEnemy(enemy) {
    enemy.alive=false;
    eliminationEffects.push({
      x:enemy.x+enemy.w/2,
      y:enemy.y+enemy.h/2,
      elapsed:0,
      duration:TUNING.eliminationAnimationDuration,
    });
  }
  function drawSprite(image,x,y,w,h,color) {
    if(image && image.complete && image.naturalWidth) ctx.drawImage(image,x,y,w,h);
    else {ctx.fillStyle=color;ctx.fillRect(x,y,w,h);}
  }
  function drawShip(image,ship,w,h,color) {
    const progress=ship.shotPulse>0?1-ship.shotPulse/TUNING.shotSquashDuration:0;
    const pulse=ship.shotPulse>0?Math.sin(Math.PI*progress):0;
    const scaleX=1-(1-TUNING.shotSquashX)*pulse;
    const scaleY=1+(TUNING.shotStretchY-1)*pulse;
    ctx.save();
    ctx.translate(ship.x+w/2,ship.y+h/2);
    const facingTilt=ship.shotPulse>0?0:(ship.tilt||0);
    ctx.rotate(facingTilt*Math.PI/180);
    const entryScale=ship.entryScale??1;
    ctx.scale(scaleX*entryScale,scaleY*entryScale);
    const entryProgress=Math.max(0,Math.min(1,(1-entryScale)/(1-TUNING.waveEntryStartScale)));
    ctx.filter=`grayscale(${entryProgress*TUNING.waveEntryGrayAmount})`;
    drawSprite(image,-w/2,-h/2,w,h,color);
    ctx.restore();
  }
  function syncMovementIndicators() {
    const movingLeft = keys.has('ArrowLeft') || keys.has('a');
    const movingRight = keys.has('ArrowRight') || keys.has('d');
    movementKeys.forEach(key => {
      const active = key.dataset.moveKey === 'left' ? movingLeft : movingRight;
      key.classList.toggle('is-active', active);
    });
    fireIndicator.classList.toggle('is-active', keys.has(' ') || keys.has('Space'));
  }
  function isSpaceKey(event) {
    return event.code === 'Space' || event.key === ' ' || event.key === 'Spacebar';
  }
  function loop(time) { const dt=Math.min((time-lastTime)/1000,.04);lastTime=time;update(dt);requestAnimationFrame(loop); }
  startButton.addEventListener('click',resetGame);
  window.addEventListener('keydown',e=>{
    const spacePressed=isSpaceKey(e);
    if(state==='waveIntro') {
      if(['ArrowLeft','ArrowRight','a','A','d','D'].includes(e.key)||spacePressed)e.preventDefault();
      return;
    }
    if(state!=='playing') {
      if(e.key==='Enter'||spacePressed){e.preventDefault();resetGame();}
      return;
    }
    const key=spacePressed?' ':e.key.length===1?e.key.toLowerCase():e.key;
    if(['ArrowLeft','ArrowRight',' ','Space','a','d'].includes(key)){e.preventDefault();keys.add(key);syncMovementIndicators();}
  });
  window.addEventListener('keyup',e=>{
    const key=isSpaceKey(e)?' ':e.key.length===1?e.key.toLowerCase():e.key;
    keys.delete(key);syncMovementIndicators();
  });
  window.addEventListener('blur',()=>{keys.clear();syncMovementIndicators();});
  draw(); lastTime=performance.now(); requestAnimationFrame(loop);
})();
