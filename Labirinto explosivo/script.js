const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const TILE = 40, COLS = 13, ROWS = 11;
const EMPTY=0,WALL=1,BLOCK=2,POWERUP=3;

let currentLevel = 1;

const levels = [
  { enemies: 2, blockChance: 0.5 },
  { enemies: 3, blockChance: 0.6 },
  { enemies: 4, blockChance: 0.7 },
  { enemies: 5, blockChance: 0.75 }
];

const COLORS = {
  grass: '#3a8c3a', wall: '#888', block: '#a05020', blockDark: '#7a3a10',
  explosion: '#ff8c00', explosionCenter: '#ffdd00',
  player: '#3366ff', playerBody: '#5588ff',
  enemy1: '#cc2222', enemy2: '#cc8800', enemy3: '#8822cc',
  powerBomb: '#ffcc00', powerFire: '#ff4400',
  border: '#555'
};

let state = { lives: 3, score: 0, phase: 'playing', msgTimer: 0, msg: '' };
let player, bombs, explosions, enemies, powerups;
let map, inputKeys = {}, lastMove = 0, bombCount = 0, maxBombs = 1, fireRange = 1;
let animTick = 0;
let lastBomb =0;  // Adicionado para controlar o cooldown da bomba

function initMap() {
  map = [];
  for(let r=0;r<ROWS;r++){
    map[r]=[];
    for(let c=0;c<COLS;c++){
      if(r===0||r===ROWS-1||c===0||c===COLS-1) map[r][c]=WALL;
      else if(r%2===0&&c%2===0) map[r][c]=WALL;
      else map[r][c]=EMPTY;
    }
  }
  const safe = [{r:1,c:1},{r:1,c:2},{r:2,c:1}];
  for(let r=1;r<ROWS-1;r++){
    for(let c=1;c<COLS-1;c++){
      if(map[r][c]===EMPTY){
        const isSafe = safe.some(s=>s.r===r&&s.c===c);
        const levelData = levels[currentLevel - 1] || levels[levels.length - 1];

if(!isSafe && Math.random() < levelData.blockChance) {
  map[r][c] = BLOCK;
}
      }
    }
  }
}

function initGame() {
  initMap();
  player = {r:1,c:1,x:1,y:1,alive:true,invincible:0,dir:0};
  bombs = [];
  explosions = [];
  enemies = [];
  powerups = [];
  bombCount = 0;
  const levelData = levels[currentLevel - 1] || levels[levels.length - 1];

const possibleSpawns = [
  {r:1,c:11},{r:9,c:11},{r:9,c:1},{r:5,c:6},
  {r:3,c:9},{r:7,c:3},{r:3,c:3},{r:7,c:9}
];

for (let i = 0; i < levelData.enemies; i++) {
  const p = possibleSpawns[i];

  enemies.push({
    r:p.r,c:p.c,x:p.r,y:p.c,alive:true,
    color:[COLORS.enemy1,COLORS.enemy2,COLORS.enemy3,COLORS.enemy1][i%4],
    dir:Math.floor(Math.random()*4),
    moveTimer:0,
    type:i
  });
}

// ✅ FECHA A FUNÇÃO AQUI
updateHUD();
}

function updateHUD(){
  document.getElementById('lives').textContent = state.lives;
  document.getElementById('bombs').textContent = maxBombs - bombCount;
  document.getElementById('power').textContent = fireRange;
  document.getElementById('score').textContent = state.score;
  document.getElementById('level').textContent = currentLevel;
}

function canMove(r,c){
  if(r<0||r>=ROWS||c<0||c>=COLS) return false;
  if(map[r][c]===WALL||map[r][c]===BLOCK) return false;
  if(bombs.some(b=>b.r===r&&b.c===c)) return false;
  return true;
}

function placeBomb(){
  if(bombCount>=maxBombs) return;
  const {r,c} = player;
  if(bombs.some(b=>b.r===r&&b.c===c)) return;
  bombs.push({r,c,timer:150,range:fireRange});
  bombCount++;
  updateHUD();
}

function explodeBomb(bomb){
  bombCount--;
  const {r,c,range} = bomb;
  const exps = [{r,c,type:'center',timer:50}];
  const dirs = [[0,1,'h'],[0,-1,'h'],[1,0,'v'],[-1,0,'v']];
  dirs.forEach(([dr,dc,axis])=>{
    for(let i=1;i<=range;i++){
      const nr=r+dr*i, nc=c+dc*i;
      if(nr<0||nr>=ROWS||nc<0||nc>=COLS||map[nr][nc]===WALL) break;
      if(map[nr][nc]===BLOCK){
        map[nr][nc]=EMPTY;
        exps.push({r:nr,c:nc,type:'block',timer:40});
        maybeSpawnPowerup(nr,nc);
        break;
      }
      exps.push({r:nr,c:nc,type:axis,timer:50});
    }
  });
  explosions.push(...exps);
  // Corrigido: marcar a bomba como explodida para não explodir novamente
  bomb.exploded = true;
  bombs.forEach(b=>{ if(exps.some(e=>e.r===b.r&&e.c===b.c) && !b.exploded) { b.timer=1; } });
  updateHUD();
}

function maybeSpawnPowerup(r,c){
  if(Math.random()<0.25){
    const type = Math.random()<0.5 ? 'bomb':'fire';
    powerups.push({r,c,type,timer:300});
  }
}

let enemyMoveTimer = 0;
function updateEnemies(){
  enemyMoveTimer++;
  if(enemyMoveTimer<25) return;
  enemyMoveTimer=0;
  enemies.forEach(e=>{
    if(!e.alive) return;
    const dirs=[[0,1],[0,-1],[1,0],[-1,0]];
    let moved=false;
    for(let attempt=0;attempt<4;attempt++){
      const idx=(e.dir+attempt)%4;
      const [dr,dc]=dirs[idx];
      const nr=e.r+dr, nc=e.c+dc;
      if(canMove(nr,nc)&&!explosions.some(ex=>ex.r===nr&&ex.c===nc)){
        e.r=nr; e.c=nc; moved=true;
        if(attempt>0) e.dir=idx;
        break;
      }
    }
    if(!moved) e.dir=(e.dir+1+Math.floor(Math.random()*3))%4;
  });
}

function checkCollisions(){
  if(!player.alive) return;
  if(player.invincible>0){ player.invincible--; return; }
  const {r,c}=player;
  if(explosions.some(e=>e.r===r&&e.c===c)){
    playerHit();
  }
  enemies.forEach(e=>{
    if(e.alive&&e.r===r&&e.c===c) playerHit();
  });
  powerups.forEach((p,i)=>{
    if(p.r===r&&p.c===c){
      if(p.type==='bomb') maxBombs=Math.min(maxBombs+1,5);
      else fireRange=Math.min(fireRange+1,6);
      powerups.splice(i,1);
      state.score+=100;
      updateHUD();
    }
  });
  explosions.forEach(ex=>{
    enemies.forEach(e=>{
      if(e.alive&&e.r===ex.r&&e.c===ex.c){
        e.alive=false;
        state.score+=200;
        updateHUD();
      }
    });
  });
}

function playerHit(){
  state.lives--;
  player.invincible=120;
  updateHUD();
  if(state.lives<=0){
    state.phase='dead';
    showMsg('GAME OVER! Pressione R para recomeçar');
  }
}

function checkWin(){
  if(enemies.filter(e=>e.alive).length===0 && state.phase==='playing'){
    currentLevel++;

    if(currentLevel > levels.length){
      state.phase='win';
      showMsg('🏆 VOCÊ ZEROU O JOGO! Pressione R');
    } else {
      state.phase='next';
      showMsg(`FASE ${currentLevel}! Pressione ENTER`);
    }
  }
}

function showMsg(m){ document.getElementById('msg').textContent=m; }

function handleInput(){
  if(state.phase!=='playing') return;
  const now = performance.now();
  if(now-lastMove < 180) return;
  const dirs = {'ArrowUp':[-1,0],'ArrowDown':[1,0],'ArrowLeft':[0,-1],'ArrowRight':[0,1],
    'w':[-1,0],'s':[1,0],'a':[0,-1],'d':[0,1],'W':[-1,0],'S':[1,0],'A':[0,-1],'D':[0,1]};
  for(const [key,[dr,dc]] of Object.entries(dirs)){
    if(inputKeys[key]){
      const nr=player.r+dr, nc=player.c+dc;
      if(canMove(nr,nc)){ player.r=nr; player.c=nc; }
      lastMove=now;
      break;
    }
  }
  // Adicionado para colocar bomba com cooldown
  if(inputKeys[' '] && now - lastBomb > 200){
    placeBomb();
    lastBomb = now;
  }
}

function mobileMove(dc,dr){
  if(state.phase!=='playing') return;
  const nr=player.r+dr, nc=player.c+dc;
  if(canMove(nr,nc)){ player.r=nr; player.c=nc; }
}
function mobileBomb(){ if(state.phase==='playing') placeBomb(); }

function drawTile(r,c){
  const x=c*TILE, y=r*TILE;
  const t=map[r][c];
  if(t===WALL){
    ctx.fillStyle='#666';
    ctx.fillRect(x,y,TILE,TILE);
    ctx.fillStyle='#888';
    ctx.fillRect(x+2,y+2,TILE-4,TILE-4);
    ctx.fillStyle='#555';
    ctx.fillRect(x,y,TILE,2);ctx.fillRect(x,y,2,TILE);
  } else if(t===BLOCK){
    ctx.fillStyle=COLORS.block;
    ctx.fillRect(x,y,TILE,TILE);
    ctx.fillStyle=COLORS.blockDark;
    ctx.fillRect(x+2,y+2,TILE-4,TILE-4);
    ctx.fillStyle='#c06030';
    const bw=8;
    for(let bx=x+4;bx<x+TILE-4;bx+=bw){ctx.fillRect(bx,y+4,bw-1,6);}
    for(let by=y+4;by<y+TILE-4;by+=8){ctx.fillRect(x+4,by,TILE-8,6);}
  } else {
    ctx.fillStyle=COLORS.grass;
    ctx.fillRect(x,y,TILE,TILE);
    ctx.fillStyle='#358235';
    ctx.fillRect(x,y,1,TILE);ctx.fillRect(x,y,TILE,1);
  }
}

function drawPlayer(){
  if(!player.alive) return;
  if(player.invincible>0 && Math.floor(player.invincible/6)%2===0) return;
  const x=player.c*TILE, y=player.r*TILE;
  const cx=x+TILE/2, cy=y+TILE/2;
  ctx.fillStyle='#fff';
  ctx.beginPath();ctx.arc(cx,cy-4,10,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#3366cc';
  ctx.fillRect(x+8,y+18,TILE-16,14);
  ctx.fillStyle='#224499';
  ctx.fillRect(x+8,y+28,8,8);ctx.fillRect(x+TILE-16,y+28,8,8);
  ctx.fillStyle='#ffd0a0';
  ctx.fillRect(x+5,y+20,5,8);ctx.fillRect(x+TILE-10,y+20,5,8);
  ctx.fillStyle='#222';
  ctx.beginPath();ctx.arc(cx-3,cy-6,1.5,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(cx+3,cy-6,1.5,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(cx,cy-2,2,0,Math.PI);ctx.stroke();
  ctx.fillStyle='#1a1a33';
  ctx.fillRect(cx-8,y+4,16,6);
}

function drawEnemy(e){
  if(!e.alive) return;
  const x=e.c*TILE, y=e.r*TILE;
  const cx=x+TILE/2, cy=y+TILE/2;
  const bob=Math.sin(animTick*0.1+e.c)*2;
  ctx.fillStyle=e.color;
  ctx.beginPath();ctx.arc(cx,cy-2+bob,11,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';
  ctx.beginPath();ctx.arc(cx-3,cy-4+bob,3.5,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(cx+3,cy-4+bob,3.5,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#111';
  ctx.beginPath();ctx.arc(cx-3,cy-4+bob,1.8,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(cx+3,cy-4+bob,1.8,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=e.color;
  ctx.fillRect(x+10,y+22+bob,TILE-20,10);
}

function drawBombs(){
  bombs.forEach(b=>{
    const x=b.c*TILE, y=b.r*TILE;
    const pulse=Math.sin(animTick*0.15)*2;
    ctx.fillStyle='#111';
    ctx.beginPath();ctx.arc(x+TILE/2,y+TILE/2+pulse,10,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#444';
    ctx.beginPath();ctx.arc(x+TILE/2-2,y+TILE/2-2+pulse,4,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#8c6';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(x+TILE/2+4,y+TILE/2-8+pulse);
    ctx.bezierCurveTo(x+TILE/2+10,y+TILE/2-14+pulse,x+TILE/2+12,y+TILE/2-6+pulse,x+TILE/2+8,y+TILE/2-10+pulse);
    ctx.stroke();
    const flash=b.timer<60&&Math.floor(animTick/3)%2===0;
    if(flash){ctx.strokeStyle='#f00';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x+TILE/2,y+TILE/2+pulse,11,0,Math.PI*2);ctx.stroke();}
  });
}

function drawExplosions(){
  explosions.forEach(ex=>{
    if(ex.type==='block') return;
    const x=ex.c*TILE, y=ex.r*TILE;
    const prog=1-(ex.timer/50);
    const alpha=ex.timer/50;
    ctx.globalAlpha=alpha;
    if(ex.type==='center'){
      const grad=ctx.createRadialGradient(x+TILE/2,y+TILE/2,2,x+TILE/2,y+TILE/2,TILE/2-2);
      grad.addColorStop(0,'#fff');
      grad.addColorStop(0.3,'#ffff00');
      grad.addColorStop(1,'#ff4400');
      ctx.fillStyle=grad;
      ctx.beginPath();ctx.arc(x+TILE/2,y+TILE/2,TILE/2-2,0,Math.PI*2);ctx.fill();
    } else {
      ctx.fillStyle='#ff8800';
      ctx.fillRect(x+4,y+4,TILE-8,TILE-8);
      ctx.fillStyle='#ffdd00';
      ctx.fillRect(x+8,y+8,TILE-16,TILE-16);
    }
    ctx.globalAlpha=1;
  });
}

function drawPowerups(){
  powerups.forEach(p=>{
    const x=p.c*TILE+4, y=p.r*TILE+4;
    const bob=Math.sin(animTick*0.08)*3;
    ctx.fillStyle=p.type==='bomb'?'#ffcc00':'#ff4400';
    ctx.fillRect(x,y+bob,TILE-8,TILE-8);
    ctx.fillStyle='#fff';
    ctx.font='bold 14px monospace';
    ctx.textAlign='center';
    ctx.fillText(p.type==='bomb'?'💣':'🔥',x+(TILE-8)/2,y+(TILE-8)/2+5+bob);
  });
}

function render(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) drawTile(r,c);
  drawExplosions();
  drawPowerups();
  drawBombs();
  drawPlayer();
  enemies.forEach(drawEnemy);
}

function gameLoop(){
  animTick++;
  if(state.phase==='playing'){
    handleInput();
    bombs.forEach(b=>{ b.timer--; if(b.timer<=0 && !b.exploded) explodeBomb(b); });
    bombs = bombs.filter(b=>b.timer>0);
    explosions.forEach(ex=>ex.timer--);
    explosions = explosions.filter(ex=>ex.timer>0);
    powerups.forEach(p=>p.timer--);
    powerups = powerups.filter(p=>p.timer>0);
    updateEnemies();
    checkCollisions();
    checkWin();
  }
  render();
  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown',e=>{
  inputKeys[e.key]=true;

  // 🔥 AVANÇAR FASE
  if(e.key === 'Enter' && state.phase === 'next'){
    state.phase = 'playing';
    initGame();
    document.getElementById('msg').textContent='';
  }

  // 🔄 RESET DO JOGO
  if(e.key==='r'||e.key==='R'){
    if(state.phase!=='playing'){
      currentLevel = 1; // 🔥 importante
      state={lives:3,score:0,phase:'playing',msg:''};
      maxBombs=1; fireRange=1; bombCount=0;
      document.getElementById('msg').textContent='';
      initGame();
    }
  }

  e.preventDefault();
});
document.addEventListener('keyup',e=>{ inputKeys[e.key]=false; });

initGame();
gameLoop();