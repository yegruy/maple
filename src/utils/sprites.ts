// Canvas Procedural Pixel Art Sprite Renderer for Classic Maple RPG

import { Monster, DropItem, Ladder, Platform, Portal, JobCategory } from '../types';

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  bgType: string,
  width: number,
  height: number,
  cameraX: number,
  time: number
) {
  if (bgType === 'henesys') {
    // Henesys Sky Gradient
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#64b5f6');
    grad.addColorStop(0.6, '#e0f7fa');
    grad.addColorStop(1, '#a5d6a7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Sun & Clouds
    ctx.fillStyle = 'rgba(255, 253, 208, 0.9)';
    ctx.beginPath();
    ctx.arc(300 - cameraX * 0.1, 100, 45, 0, Math.PI * 2);
    ctx.fill();

    // Distant Hills (Parallax)
    ctx.fillStyle = '#81c784';
    ctx.beginPath();
    ctx.ellipse(200 - cameraX * 0.2, height - 120, 350, 150, 0, 0, Math.PI * 2);
    ctx.ellipse(800 - cameraX * 0.2, height - 100, 450, 180, 0, 0, Math.PI * 2);
    ctx.ellipse(1400 - cameraX * 0.2, height - 130, 400, 160, 0, 0, Math.PI * 2);
    ctx.fill();

    // Foreground Grass Hills
    ctx.fillStyle = '#4caf50';
    ctx.beginPath();
    ctx.ellipse(400 - cameraX * 0.4, height - 60, 500, 120, 0, 0, Math.PI * 2);
    ctx.ellipse(1100 - cameraX * 0.4, height - 50, 600, 140, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cute Mushroom Houses in BG
    drawMushroomHouse(ctx, 350 - cameraX * 0.3, height - 180);
    drawMushroomHouse(ctx, 1050 - cameraX * 0.3, height - 200);

  } else if (bgType === 'ellinia') {
    // Ellinia Deep Forest Night
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#0d1b2a');
    grad.addColorStop(0.7, '#1b263b');
    grad.addColorStop(1, '#2d6a4f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Parallax Giant Tree Trunks
    ctx.fillStyle = '#1e382b';
    for (let x = -100; x < width + 300; x += 300) {
      ctx.fillRect(x - cameraX * 0.2, 0, 70, height);
      // Leaves
      ctx.beginPath();
      ctx.arc(x - cameraX * 0.2 + 35, 120, 140, 0, Math.PI * 2);
      ctx.fill();
    }

    // Floating Magic Spores
    ctx.fillStyle = 'rgba(168, 230, 207, 0.6)';
    for (let i = 0; i < 20; i++) {
      const sx = (i * 90 + Math.sin(time * 0.002 + i) * 30) % width;
      const sy = (i * 45 + Math.cos(time * 0.003 + i) * 20) % height;
      ctx.beginPath();
      ctx.arc(sx - cameraX * 0.1, sy, 3 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
    }

  } else if (bgType === 'perion') {
    // Perion Sunset Canyon
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#ff7b00');
    grad.addColorStop(0.5, '#ffb703');
    grad.addColorStop(1, '#805b10');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Canyon Rock Silhouettes
    ctx.fillStyle = '#633e08';
    ctx.beginPath();
    ctx.moveTo(-100 - cameraX * 0.2, height);
    ctx.lineTo(150 - cameraX * 0.2, height - 300);
    ctx.lineTo(400 - cameraX * 0.2, height);
    ctx.lineTo(750 - cameraX * 0.2, height - 380);
    ctx.lineTo(1100 - cameraX * 0.2, height);
    ctx.lineTo(1500 - cameraX * 0.2, height - 320);
    ctx.lineTo(1800 - cameraX * 0.2, height);
    ctx.fill();

    // Wooden Totem Poles
    drawTotemPole(ctx, 220 - cameraX * 0.4, height - 180);
    drawTotemPole(ctx, 920 - cameraX * 0.4, height - 180);

  } else if (bgType === 'kerning') {
    // Kerning City Dusk Skyline
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#2b1e3a');
    grad.addColorStop(0.6, '#4a2e5d');
    grad.addColorStop(1, '#2f3e46');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // City Buildings Silhouette
    ctx.fillStyle = '#1e1b2e';
    for (let x = -50; x < width + 200; x += 180) {
      const bh = 220 + ((x * 37) % 150);
      const bw = 120;
      ctx.fillRect(x - cameraX * 0.25, height - bh, bw, bh);
      // Windows
      ctx.fillStyle = 'rgba(255, 238, 88, 0.4)';
      for (let wy = height - bh + 20; wy < height - 30; wy += 35) {
        for (let wx = x - cameraX * 0.25 + 15; wx < x - cameraX * 0.25 + bw - 20; wx += 25) {
          ctx.fillRect(wx, wy, 12, 18);
        }
      }
      ctx.fillStyle = '#1e1b2e';
    }

  } else {
    // Mushmom Hill Boss Forest
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#1c2541');
    grad.addColorStop(0.6, '#3a506b');
    grad.addColorStop(1, '#5bc0be');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Giant Mushroom Cap Silhouettes
    ctx.fillStyle = '#2c394b';
    ctx.beginPath();
    ctx.arc(300 - cameraX * 0.2, height - 100, 220, Math.PI, Math.PI * 2);
    ctx.arc(1000 - cameraX * 0.2, height - 120, 260, Math.PI, Math.PI * 2);
    ctx.fill();
  }
}

// Mushroom House BG
function drawMushroomHouse(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Stalk
  ctx.fillStyle = '#f5f5f5';
  ctx.beginPath();
  ctx.roundRect(x - 30, y, 60, 80, 10);
  ctx.fill();
  ctx.strokeStyle = '#d4d4d4';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Door
  ctx.fillStyle = '#795548';
  ctx.fillRect(x - 12, y + 40, 24, 40);

  // Cap
  ctx.fillStyle = '#e53935';
  ctx.beginPath();
  ctx.ellipse(x, y + 10, 70, 45, 0, Math.PI, Math.PI * 2);
  ctx.fill();

  // Spots
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x - 35, y - 10, 12, 0, Math.PI * 2);
  ctx.arc(x + 25, y - 15, 14, 0, Math.PI * 2);
  ctx.arc(x, y - 25, 10, 0, Math.PI * 2);
  ctx.fill();
}

// Totem Pole BG
function drawTotemPole(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(x - 15, y, 30, 120);

  // Wings
  ctx.fillStyle = '#d84315';
  ctx.fillRect(x - 45, y + 20, 30, 15);
  ctx.fillRect(x + 15, y + 20, 30, 15);

  // Eyes
  ctx.fillStyle = '#ffeb3b';
  ctx.fillRect(x - 8, y + 30, 6, 6);
  ctx.fillRect(x + 2, y + 30, 6, 6);
  ctx.fillRect(x - 8, y + 70, 6, 6);
  ctx.fillRect(x + 2, y + 70, 6, 6);
}

// Draw Platforms
export function drawPlatform(ctx: CanvasRenderingContext2D, p: Platform, bgType: string) {
  const width = p.x2 - p.x1;
  const height = 18;

  let topColor = '#66bb6a'; // Henesys
  let sideColor = '#8d6e63';

  if (bgType === 'ellinia') {
    topColor = '#81c784';
    sideColor = '#3e2723';
  } else if (bgType === 'perion') {
    topColor = '#d84315';
    sideColor = '#4e342e';
  } else if (bgType === 'kerning') {
    topColor = '#78909c';
    sideColor = '#37474f';
  } else if (bgType === 'mushmom_hill') {
    topColor = '#26a69a';
    sideColor = '#004d40';
  }

  // Grass/Wood Top
  ctx.fillStyle = topColor;
  ctx.beginPath();
  ctx.roundRect(p.x1, p.y1, width, 6, [3, 3, 0, 0]);
  ctx.fill();

  // Base Earth
  ctx.fillStyle = sideColor;
  ctx.fillRect(p.x1, p.y1 + 6, width, height - 6);

  // Edge Highlights
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(p.x1, p.y1, width, 2);
}

// Draw Ladders & Ropes
export function drawLadder(ctx: CanvasRenderingContext2D, ladder: Ladder) {
  ctx.strokeStyle = '#a1887f';
  ctx.lineWidth = 4;

  // Left & Right poles
  ctx.beginPath();
  ctx.moveTo(ladder.x - 10, ladder.y1);
  ctx.lineTo(ladder.x - 10, ladder.y2);
  ctx.moveTo(ladder.x + 10, ladder.y1);
  ctx.lineTo(ladder.x + 10, ladder.y2);
  ctx.stroke();

  // Steps
  ctx.strokeStyle = '#d7ccc8';
  ctx.lineWidth = 3;
  for (let y = ladder.y1 + 10; y < ladder.y2; y += 18) {
    ctx.beginPath();
    ctx.moveTo(ladder.x - 10, y);
    ctx.lineTo(ladder.x + 10, y);
    ctx.stroke();
  }
}

// Draw Portals
export function drawPortal(ctx: CanvasRenderingContext2D, portal: Portal, time: number) {
  const pulse = Math.sin(time * 0.005) * 4;

  // Glowing Vortex
  const grad = ctx.createRadialGradient(portal.x, portal.y - 25, 5, portal.x, portal.y - 25, 25 + pulse);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.5, '#40c4ff');
  grad.addColorStop(1, 'rgba(0, 145, 234, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(portal.x, portal.y - 25, 20 + pulse, 35 + pulse, 0, 0, Math.PI * 2);
  ctx.fill();

  // Label
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px DungGeunMo, sans-serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = '#000000';
  ctx.shadowBlur = 4;
  ctx.fillText(portal.label, portal.x, portal.y - 70);
  ctx.shadowBlur = 0;
}

// Draw Player Character
export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  facing: 'left' | 'right',
  isWalking: boolean,
  isClimbing: boolean,
  isAttacking: boolean,
  job: JobCategory,
  time: number
) {
  ctx.save();
  ctx.translate(x, y);

  if (facing === 'left') {
    ctx.scale(-1, 1);
  }

  const walkOffset = isWalking ? Math.sin(time * 0.015) * 3 : 0;
  const attackSwing = isAttacking ? 15 : 0;

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 16, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body Base
  ctx.translate(0, -22);

  // Legs / Shoes
  ctx.fillStyle = '#3e2723';
  ctx.fillRect(-8 + walkOffset, 12, 6, 10);
  ctx.fillRect(2 - walkOffset, 12, 6, 10);

  // Pants / Top
  ctx.fillStyle = job === 'Warrior' ? '#d32f2f' :
                  job === 'Magician' ? '#1976d2' :
                  job === 'Archer' ? '#388e3c' :
                  job === 'Thief' ? '#7b1fa2' : '#ffb74d';
  ctx.fillRect(-9, -2, 18, 16);

  // Head / Skin
  ctx.fillStyle = '#ffe0b2';
  ctx.beginPath();
  ctx.arc(0, -14, 13, 0, Math.PI * 2);
  ctx.fill();

  // Eyes & Smile
  ctx.fillStyle = '#212121';
  ctx.fillRect(3, -16, 3, 5); // Right eye facing forward
  ctx.fillStyle = '#e57373';
  ctx.fillRect(5, -10, 3, 2); // Blush

  // Hair
  ctx.fillStyle = job === 'Warrior' ? '#3e2723' :
                  job === 'Magician' ? '#fff59d' :
                  job === 'Archer' ? '#e65100' :
                  job === 'Thief' ? '#212121' : '#ffb74d';
  ctx.beginPath();
  ctx.arc(0, -18, 14, Math.PI, Math.PI * 2);
  ctx.fill();
  // Bangs
  ctx.fillRect(-12, -22, 10, 8);
  ctx.fillRect(2, -22, 10, 8);

  // Hat (if Warrior / Thief)
  if (job === 'Warrior') {
    ctx.fillStyle = '#b0bec5'; // Iron Helmet
    ctx.fillRect(-12, -28, 24, 8);
  } else if (job === 'Magician') {
    ctx.fillStyle = '#7e57c2'; // Wizard Hat
    ctx.beginPath();
    ctx.moveTo(-14, -22);
    ctx.lineTo(0, -42);
    ctx.lineTo(14, -22);
    ctx.fill();
  }

  // Arm & Weapon
  ctx.save();
  ctx.translate(4, 2);
  if (isAttacking) {
    ctx.rotate((attackSwing * Math.PI) / 180);
  }

  // Weapon Render
  if (job === 'Warrior') {
    // Sword
    ctx.fillStyle = '#b0bec5';
    ctx.fillRect(4, -25, 4, 30);
    ctx.fillStyle = '#795548';
    ctx.fillRect(2, 2, 8, 4);
  } else if (job === 'Magician') {
    // Staff
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(6, -30, 4, 38);
    ctx.fillStyle = '#29b6f6';
    ctx.beginPath();
    ctx.arc(8, -32, 6, 0, Math.PI * 2);
    ctx.fill();
  } else if (job === 'Archer') {
    // Bow
    ctx.strokeStyle = '#8d6e63';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(8, 0, 16, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
  } else if (job === 'Thief') {
    // Claw Arm
    ctx.fillStyle = '#9c27b0';
    ctx.fillRect(2, -4, 10, 8);
  } else {
    // Wooden Club
    ctx.fillStyle = '#a1887f';
    ctx.fillRect(4, -18, 6, 22);
  }

  ctx.restore();

  ctx.restore();
}

// Draw Monsters
export function drawMonster(ctx: CanvasRenderingContext2D, m: Monster, time: number) {
  ctx.save();
  ctx.translate(m.x, m.y);

  if (m.facing === 'right') {
    ctx.scale(-1, 1);
  }

  const bounce = Math.abs(Math.sin(time * 0.008)) * 5;

  if (m.typeId === 'snail') {
    // Red Snail
    // Shell
    ctx.fillStyle = '#e53935';
    ctx.beginPath();
    ctx.arc(0, -18 - bounce, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#b71c1c';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Body
    ctx.fillStyle = '#9ecc3b';
    ctx.beginPath();
    ctx.ellipse(-6, -8, 14, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(-14, -16, 3, 3);

  } else if (m.typeId === 'slime') {
    // Green Slime
    ctx.fillStyle = 'rgba(76, 175, 80, 0.85)';
    ctx.beginPath();
    ctx.ellipse(0, -16 + bounce * 0.5, 18 + bounce * 0.3, 16 - bounce * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2e7d32';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Smiling Eyes
    ctx.fillStyle = '#1b5e20';
    ctx.fillRect(-8, -20, 3, 5);
    ctx.fillRect(2, -20, 3, 5);
    ctx.beginPath();
    ctx.arc(-2, -12, 4, 0, Math.PI);
    ctx.stroke();

  } else if (m.typeId === 'orange_mushroom') {
    // Orange Mushroom
    // Cap
    ctx.fillStyle = '#ff9800';
    ctx.beginPath();
    ctx.ellipse(0, -26 - bounce, 22, 16, 0, Math.PI, Math.PI * 2);
    ctx.fill();

    // Stalk
    ctx.fillStyle = '#fff9c4';
    ctx.fillRect(-10, -22, 20, 22);

    // Eyes
    ctx.fillStyle = '#212121';
    ctx.fillRect(-5, -16, 3, 6);
    ctx.fillRect(3, -16, 3, 6);

  } else if (m.typeId === 'ribbon_pig') {
    // Ribbon Pig
    // Pink Pig Body
    ctx.fillStyle = '#f8bbd0';
    ctx.beginPath();
    ctx.ellipse(0, -16, 20, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Snout
    ctx.fillStyle = '#f48fb1';
    ctx.beginPath();
    ctx.ellipse(-14, -14, 6, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears & Eyes
    ctx.fillStyle = '#ad1457';
    ctx.fillRect(-8, -20, 3, 5);
    // Yellow Ribbon on rear
    ctx.fillStyle = '#fbc02d';
    ctx.fillRect(14, -20, 8, 8);

  } else if (m.typeId === 'green_mushroom') {
    // Green Mushroom
    ctx.fillStyle = '#4caf50';
    ctx.beginPath();
    ctx.ellipse(0, -28 - bounce, 24, 18, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fffde7';
    ctx.fillRect(-10, -22, 20, 22);
    ctx.fillStyle = '#000';
    ctx.fillRect(-4, -16, 3, 6);
    ctx.fillRect(3, -16, 3, 6);

  } else if (m.typeId === 'wild_boar') {
    // Wild Boar
    ctx.fillStyle = '#5d4037';
    ctx.beginPath();
    ctx.ellipse(0, -20, 26, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mane
    ctx.fillStyle = '#212121';
    ctx.fillRect(-15, -36, 20, 12);

    // Tusks
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-22, -18);
    ctx.lineTo(-28, -28);
    ctx.lineTo(-18, -20);
    ctx.fill();

  } else if (m.typeId === 'drake') {
    // Green Drake
    ctx.fillStyle = '#2e7d32';
    ctx.beginPath();
    ctx.ellipse(0, -30, 28, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly
    ctx.fillStyle = '#ffb74d';
    ctx.beginPath();
    ctx.ellipse(-8, -26, 16, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wings
    ctx.fillStyle = '#1b5e20';
    ctx.beginPath();
    ctx.moveTo(10, -40);
    ctx.lineTo(35, -55);
    ctx.lineTo(25, -25);
    ctx.fill();

  } else if (m.typeId === 'mushmom') {
    // BOSS: Mushmom
    ctx.fillStyle = '#f57c00'; // Huge Orange Cap
    ctx.beginPath();
    ctx.ellipse(0, -60 - bounce * 1.5, 65, 45, 0, Math.PI, Math.PI * 2);
    ctx.fill();

    // Stalk Body
    ctx.fillStyle = '#fff59d';
    ctx.fillRect(-35, -55, 70, 55);

    // Crown
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.moveTo(-20, -105 - bounce * 1.5);
    ctx.lineTo(-10, -90 - bounce * 1.5);
    ctx.lineTo(0, -110 - bounce * 1.5);
    ctx.lineTo(10, -90 - bounce * 1.5);
    ctx.lineTo(20, -105 - bounce * 1.5);
    ctx.lineTo(25, -85 - bounce * 1.5);
    ctx.lineTo(-25, -85 - bounce * 1.5);
    ctx.fill();

    // Cute blush cheeks & eyes
    ctx.fillStyle = '#e57373';
    ctx.beginPath();
    ctx.arc(-22, -30, 8, 0, Math.PI * 2);
    ctx.arc(22, -30, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.fillRect(-12, -40, 6, 12);
    ctx.fillRect(12, -40, 6, 12);
  }

  // HP Bar on top of monster
  if (m.hp < m.maxHp) {
    const barWidth = Math.max(30, m.width);
    const hpRatio = Math.max(0, m.hp / m.maxHp);

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(-barWidth / 2, -m.height - 18, barWidth, 6);

    ctx.fillStyle = m.isBoss ? '#f44336' : '#66bb6a';
    ctx.fillRect(-barWidth / 2, -m.height - 18, barWidth * hpRatio, 6);
  }

  ctx.restore();
}

// Draw Drop Items & Mesos
export function drawDrop(ctx: CanvasRenderingContext2D, drop: DropItem, time: number) {
  ctx.save();
  ctx.translate(drop.x, drop.y);

  const bounce = Math.sin(time * 0.01) * 3;

  if (drop.type === 'meso') {
    // Meso Coin / Sack
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(0, -8 + bounce, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ff8f00';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ff8f00';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('M', 0, -5 + bounce);

  } else if (drop.type === 'potion') {
    // Red / Blue Potion Bottle
    ctx.fillStyle = drop.name.includes('파란') ? '#2196f3' : '#f44336';
    ctx.beginPath();
    ctx.roundRect(-5, -12 + bounce, 10, 12, 3);
    ctx.fill();

    // Cork
    ctx.fillStyle = '#795548';
    ctx.fillRect(-3, -15 + bounce, 6, 3);

  } else {
    // Equipment Drop Box
    ctx.fillStyle = '#ab47bc';
    ctx.fillRect(-7, -12 + bounce, 14, 12);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('E', 0, -3 + bounce);
  }

  ctx.restore();
}

// Draw Skill Effects
export function drawSkillEffect(
  ctx: CanvasRenderingContext2D,
  skillId: string,
  px: number,
  py: number,
  facing: 'left' | 'right',
  frame: number
) {
  ctx.save();
  ctx.translate(px, py);
  if (facing === 'left') {
    ctx.scale(-1, 1);
  }

  if (skillId === 'power_strike') {
    ctx.fillStyle = `rgba(229, 57, 53, ${1 - frame / 10})`;
    ctx.beginPath();
    ctx.moveTo(10, -40);
    ctx.lineTo(70, -20);
    ctx.lineTo(20, 10);
    ctx.fill();

  } else if (skillId === 'slash_blast') {
    ctx.strokeStyle = `rgba(255, 152, 0, ${1 - frame / 12})`;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(20, -20, 45 + frame * 3, -Math.PI / 3, Math.PI / 3);
    ctx.stroke();

  } else if (skillId === 'magic_claw') {
    ctx.strokeStyle = `rgba(171, 71, 188, ${1 - frame / 10})`;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(30 + frame * 5, -50);
    ctx.lineTo(80 + frame * 5, -10);
    ctx.moveTo(40 + frame * 5, -40);
    ctx.lineTo(90 + frame * 5, 0);
    ctx.stroke();

  } else if (skillId === 'energy_bolt') {
    ctx.fillStyle = `rgba(41, 182, 246, ${1 - frame / 15})`;
    ctx.beginPath();
    ctx.arc(30 + frame * 15, -20, 14, 0, Math.PI * 2);
    ctx.fill();

  } else if (skillId === 'arrow_blow' || skillId === 'double_strafe') {
    ctx.fillStyle = '#66bb6a';
    ctx.fillRect(20 + frame * 20, -22, 25, 4);

  } else if (skillId === 'lucky_seven') {
    // Flying Ninja Star
    ctx.fillStyle = '#7e57c2';
    ctx.save();
    ctx.translate(30 + frame * 18, -20);
    ctx.rotate((frame * 45 * Math.PI) / 180);
    ctx.fillRect(-8, -8, 16, 16);
    ctx.restore();

  } else if (skillId === 'haste') {
    ctx.strokeStyle = `rgba(38, 166, 154, ${1 - frame / 15})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, -20, 25 - frame, 40 - frame, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}
