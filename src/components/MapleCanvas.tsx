import React, { useEffect, useRef } from 'react';
import { PlayerStats, Monster, DropItem, DamageText, Particle, MapId, Skill, Equipment, InventoryItem } from '../types';
import { MAPS, SKILLS } from '../data/gameData';
import { drawBackground, drawPlatform, drawLadder, drawPortal, drawPlayer, drawMonster, drawDrop, drawSkillEffect } from '../utils/sprites';
import { soundManager } from '../utils/sound';

interface MapleCanvasProps {
  playerStats: PlayerStats;
  setPlayerStats: React.Dispatch<React.SetStateAction<PlayerStats>>;
  currentMapId: MapId;
  setCurrentMapId: (mapId: MapId) => void;
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  equippedWeapon: Equipment | null;
  activeSkill1: Skill | null;
  activeSkill2: Skill | null;
  onMonsterKilled: (monsterTypeId: string) => void;
  touchInputRef: React.MutableRefObject<{
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    jump: boolean;
    attack: boolean;
    skill1: boolean;
    skill2: boolean;
    pickup: boolean;
  }>;
}

export const MapleCanvas: React.FC<MapleCanvasProps> = ({
  playerStats,
  setPlayerStats,
  currentMapId,
  setCurrentMapId,
  inventory,
  setInventory,
  equippedWeapon,
  activeSkill1,
  activeSkill2,
  onMonsterKilled,
  touchInputRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Gameplay Refs for 60fps Loop
  const posRef = useRef({ x: 200, y: 550, vx: 0, vy: 0 });
  const playerStateRef = useRef({
    facing: 'right' as 'left' | 'right',
    isGrounded: true,
    isClimbing: false,
    isAttacking: false,
    attackTimer: 0,
    activeSkillId: null as string | null,
    skillFrame: 0,
    invincibleTimer: 0,
    hasteTimer: 0,
  });

  const monstersRef = useRef<Monster[]>([]);
  const dropsRef = useRef<DropItem[]>([]);
  const damageTextsRef = useRef<DamageText[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const keysRef = useRef<Record<string, boolean>>({});

  // Reset player position on map change
  useEffect(() => {
    const mapData = MAPS[currentMapId];
    if (mapData) {
      posRef.current.x = 150;
      posRef.current.y = mapData.platforms[0]?.y1 || 580;
      posRef.current.vx = 0;
      posRef.current.vy = 0;
      monstersRef.current = [];
      dropsRef.current = [];
      damageTextsRef.current = [];

      // Initial Spawn
      spawnMonsters(mapData.maxMonsters);
      soundManager.startBGM(currentMapId);
    }
  }, [currentMapId]);

  // Monster Spawner
  const spawnMonsters = (count: number) => {
    const mapData = MAPS[currentMapId];
    if (!mapData || mapData.monsterTypes.length === 0) return;

    for (let i = 0; i < count; i++) {
      const typeId = mapData.monsterTypes[Math.floor(Math.random() * mapData.monsterTypes.length)];
      const platform = mapData.platforms[Math.floor(Math.random() * mapData.platforms.length)];

      let maxHp = 50;
      let exp = 15;
      let atk = 10;
      let level = 5;
      let name = '슬라임';
      let isBoss = false;
      let color = '#4caf50';

      if (typeId === 'snail') {
        name = '달팽이'; level = 2; maxHp = 30; exp = 8; atk = 5; color = '#e53935';
      } else if (typeId === 'slime') {
        name = '슬라임'; level = 6; maxHp = 60; exp = 18; atk = 12; color = '#4caf50';
      } else if (typeId === 'orange_mushroom') {
        name = '주황버섯'; level = 10; maxHp = 110; exp = 30; atk = 22; color = '#ff9800';
      } else if (typeId === 'ribbon_pig') {
        name = '리본돼지'; level = 12; maxHp = 140; exp = 42; atk = 28; color = '#f8bbd0';
      } else if (typeId === 'green_mushroom') {
        name = '초록버섯'; level = 15; maxHp = 220; exp = 65; atk = 38; color = '#388e3c';
      } else if (typeId === 'wild_boar') {
        name = '와일드보어'; level = 22; maxHp = 450; exp = 120; atk = 65; color = '#5d4037';
      } else if (typeId === 'drake') {
        name = '드레이크'; level = 35; maxHp = 1200; exp = 320; atk = 120; color = '#2e7d32';
      } else if (typeId === 'mushmom') {
        name = '머쉬맘 (BOSS)'; level = 45; maxHp = 5000; exp = 1500; atk = 220; isBoss = true; color = '#f57c00';
      }

      const spawnX = platform.x1 + Math.random() * (platform.x2 - platform.x1 - 40) + 20;
      monstersRef.current.push({
        id: `m_${Date.now()}_${Math.random()}`,
        typeId,
        name,
        x: spawnX,
        y: platform.y1,
        vx: (Math.random() - 0.5) * 1.5,
        vy: 0,
        width: isBoss ? 90 : 40,
        height: isBoss ? 100 : 40,
        hp: maxHp,
        maxHp,
        level,
        exp,
        mesoMin: level * 10,
        mesoMax: level * 25,
        atk,
        facing: Math.random() > 0.5 ? 'left' : 'right',
        isGrounded: true,
        knockbackVx: 0,
        invincibleTimer: 0,
        isBoss,
        color
      });
    }
  };

  // Main Loop
  useEffect(() => {
    let animId: number;

    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;

      // Potion Hotkeys
      if (e.code === 'Digit1') {
        usePotion('hp');
      } else if (e.code === 'Digit2') {
        usePotion('mp');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const loop = () => {
      time++;
      const mapData = MAPS[currentMapId];
      if (!mapData) return;

      const keys = keysRef.current;
      const touch = touchInputRef.current;

      const inputLeft = keys['ArrowLeft'] || keys['KeyA'] || touch.left;
      const inputRight = keys['ArrowRight'] || keys['KeyD'] || touch.right;
      const inputUp = keys['ArrowUp'] || keys['KeyW'] || touch.up;
      const inputDown = keys['ArrowDown'] || keys['KeyS'] || touch.down;
      const inputJump = keys['Space'] || touch.jump;
      const inputAttack = keys['KeyX'] || touch.attack;
      const inputSkill1 = keys['KeyC'] || touch.skill1;
      const inputSkill2 = keys['KeyV'] || touch.skill2;
      const inputPickup = keys['KeyZ'] || touch.pickup;

      // Haste Speed Boost
      const isHaste = playerStateRef.current.hasteTimer > 0;
      if (isHaste) playerStateRef.current.hasteTimer--;

      const moveSpeed = (3.5 + playerStats.dex * 0.05) * (isHaste ? 1.4 : 1.0);
      const pos = posRef.current;
      const pState = playerStateRef.current;

      // Ladder Detection
      let nearLadder = mapData.ladders.find(
        (l) => Math.abs(pos.x - l.x) < 20 && pos.y >= l.y1 - 10 && pos.y <= l.y2 + 10
      );

      if (nearLadder && (inputUp || inputDown) && !pState.isClimbing) {
        pState.isClimbing = true;
        pos.x = nearLadder.x;
        pos.vx = 0;
      }

      if (pState.isClimbing) {
        pos.vy = 0;
        if (inputUp) pos.y -= 3;
        if (inputDown) pos.y += 3;
        if (inputJump) {
          pState.isClimbing = false;
          pos.vy = -9;
        }
        if (nearLadder && (pos.y < nearLadder.y1 || pos.y > nearLadder.y2)) {
          pState.isClimbing = false;
        }
      } else {
        // Horizontal Movement
        if (inputLeft) {
          pos.vx = -moveSpeed;
          pState.facing = 'left';
        } else if (inputRight) {
          pos.vx = moveSpeed;
          pState.facing = 'right';
        } else {
          pos.vx *= 0.75;
        }

        // Gravity
        pos.vy += 0.55;
        if (pos.vy > 12) pos.vy = 12;

        // Jump
        if (inputJump && pState.isGrounded) {
          pos.vy = -10.5;
          pState.isGrounded = false;
          soundManager.playJump();
        }

        // Update position
        pos.x += pos.vx;
        pos.y += pos.vy;

        // Platform Collisions
        pState.isGrounded = false;
        for (const plat of mapData.platforms) {
          if (
            pos.x >= plat.x1 - 10 &&
            pos.x <= plat.x2 + 10 &&
            pos.y >= plat.y1 - 5 &&
            pos.y <= plat.y1 + 12 &&
            pos.vy >= 0
          ) {
            pos.y = plat.y1;
            pos.vy = 0;
            pState.isGrounded = true;
            break;
          }
        }

        // Boundary Limits
        if (pos.x < 30) pos.x = 30;
        if (pos.x > mapData.width - 30) pos.x = mapData.width - 30;
        if (pos.y > mapData.height) {
          pos.y = mapData.height - 50;
          pos.vy = 0;
        }
      }

      // Portal Transport (Press Up on Portal)
      if (inputUp) {
        for (const portal of mapData.portals) {
          if (Math.abs(pos.x - portal.x) < 30 && Math.abs(pos.y - portal.y) < 30) {
            soundManager.playPortal();
            setCurrentMapId(portal.targetMap);
            pos.x = portal.targetX;
            pos.y = portal.targetY;
            break;
          }
        }
      }

      // Attack / Skill Trigger
      if (pState.attackTimer > 0) pState.attackTimer--;
      if (pState.invincibleTimer > 0) pState.invincibleTimer--;

      if (pState.attackTimer <= 0) {
        if (inputAttack) {
          executeAttack(null);
        } else if (inputSkill1 && activeSkill1) {
          executeAttack(activeSkill1);
        } else if (inputSkill2 && activeSkill2) {
          executeAttack(activeSkill2);
        }
      }

      // Pickup Items
      if (inputPickup) {
        pickupNearbyItems();
      }

      // Respawn Monsters if below max
      if (monstersRef.current.length < mapData.maxMonsters && Math.random() < 0.02) {
        spawnMonsters(1);
      }

      // Update Monsters AI & Physics
      monstersRef.current.forEach((m) => {
        if (m.invincibleTimer > 0) m.invincibleTimer--;

        // Knockback physics
        if (Math.abs(m.knockbackVx) > 0.2) {
          m.x += m.knockbackVx;
          m.knockbackVx *= 0.85;
        } else {
          m.knockbackVx = 0;
          // Random Patrol
          if (Math.random() < 0.02) {
            m.vx = (Math.random() - 0.5) * 1.5;
            m.facing = m.vx > 0 ? 'right' : 'left';
          }
          m.x += m.vx;
        }

        // Platform bounds for monster patrol
        let currentPlat = mapData.platforms.find((p) => m.x >= p.x1 && m.x <= p.x2 && Math.abs(m.y - p.y1) < 15);
        if (currentPlat) {
          if (m.x <= currentPlat.x1 + 10) {
            m.vx = Math.abs(m.vx);
            m.facing = 'right';
          } else if (m.x >= currentPlat.x2 - 10) {
            m.vx = -Math.abs(m.vx);
            m.facing = 'left';
          }
        }

        // Check Collision with Player (Monster hits Player)
        const distToPlayer = Math.hypot(m.x - pos.x, m.y - 20 - pos.y);
        if (distToPlayer < (m.width / 2 + 18) && pState.invincibleTimer <= 0) {
          // Player hurt!
          const damage = Math.max(1, Math.floor(m.atk - (playerStats.str * 0.2 + playerStats.dex * 0.1)));
          soundManager.playHurt();

          setPlayerStats((prev) => {
            const nextHp = Math.max(0, prev.hp - damage);
            return { ...prev, hp: nextHp };
          });

          pState.invincibleTimer = 45; // 0.75s invincibility
          damageTextsRef.current.push({
            id: `d_${Date.now()}`,
            x: pos.x,
            y: pos.y - 40,
            damage,
            isPlayerHit: true,
            timer: 40,
            vy: -1.2,
          });
        }
      });

      // Update Drops Decay & Floating
      dropsRef.current.forEach((drop) => {
        drop.timer++;
      });
      dropsRef.current = dropsRef.current.filter((drop) => drop.timer < 1800); // 30s decay

      // Update Damage Texts
      damageTextsRef.current.forEach((dt) => {
        dt.y += dt.vy;
        dt.timer--;
      });
      damageTextsRef.current = damageTextsRef.current.filter((dt) => dt.timer > 0);

      // Camera Follow Calculation
      const cameraX = Math.max(0, Math.min(pos.x - canvas.width / 2, mapData.width - canvas.width));
      const cameraY = Math.max(0, Math.min(pos.y - canvas.height / 2, mapData.height - canvas.height));

      // --- RENDER CANVAS ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(-cameraX, -cameraY);

      // 1. Parallax Background
      drawBackground(ctx, mapData.bgType, mapData.width, mapData.height, cameraX, time);

      // 2. Ladders & Ropes
      mapData.ladders.forEach((ladder) => drawLadder(ctx, ladder));

      // 3. Platforms
      mapData.platforms.forEach((plat) => drawPlatform(ctx, plat, mapData.bgType));

      // 4. Portals
      mapData.portals.forEach((portal) => drawPortal(ctx, portal, time));

      // 5. NPCs
      mapData.npcs.forEach((npc) => {
        ctx.fillStyle = npc.color;
        ctx.beginPath();
        ctx.roundRect(npc.x - 15, npc.y - 45, 30, 45, 6);
        ctx.fill();

        // NPC Name Tag
        ctx.fillStyle = '#ffeb3b';
        ctx.font = 'bold 11px DungGeunMo, sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 3;
        ctx.fillText(npc.name, npc.x, npc.y - 52);
        ctx.shadowBlur = 0;
      });

      // 6. Drops
      dropsRef.current.forEach((drop) => drawDrop(ctx, drop, time));

      // 7. Monsters
      monstersRef.current.forEach((m) => drawMonster(ctx, m, time));

      // 8. Player Character
      if (pState.invincibleTimer % 6 < 3) {
        drawPlayer(
          ctx,
          pos.x,
          pos.y,
          pState.facing,
          Math.abs(pos.vx) > 0.2,
          pState.isClimbing,
          pState.isAttacking,
          playerStats.job,
          time
        );
      }

      // 9. Skill Effect Overlay
      if (pState.activeSkillId && pState.skillFrame < 15) {
        pState.skillFrame++;
        drawSkillEffect(ctx, pState.activeSkillId, pos.x, pos.y, pState.facing, pState.skillFrame);
      } else {
        pState.activeSkillId = null;
      }

      // 10. Damage Skin Text Floating
      damageTextsRef.current.forEach((dt) => {
        ctx.save();
        ctx.font = 'bold 22px DungGeunMo, sans-serif';
        ctx.textAlign = 'center';

        if (dt.isPlayerHit) {
          ctx.fillStyle = '#e53935';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.strokeText(`-${dt.damage}`, dt.x, dt.y);
          ctx.fillText(`-${dt.damage}`, dt.x, dt.y);
        } else if (dt.isCrit) {
          ctx.fillStyle = '#ffeb3b';
          ctx.strokeStyle = '#d84315';
          ctx.lineWidth = 4;
          ctx.strokeText(`CRIT ${dt.damage}`, dt.x, dt.y);
          ctx.fillText(`CRIT ${dt.damage}`, dt.x, dt.y);
        } else {
          ctx.fillStyle = '#ffeb3b';
          ctx.strokeStyle = '#e65100';
          ctx.lineWidth = 3;
          ctx.strokeText(`${dt.damage}`, dt.x, dt.y);
          ctx.fillText(`${dt.damage}`, dt.x, dt.y);
        }
        ctx.restore();
      });

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentMapId, playerStats, activeSkill1, activeSkill2, equippedWeapon]);

  // Execute Attack or Skill
  const executeAttack = (skill: Skill | null) => {
    const pState = playerStateRef.current;
    const pos = posRef.current;

    pState.isAttacking = true;
    pState.attackTimer = 22; // Cooldown
    pState.skillFrame = 0;

    if (skill) {
      if (playerStats.mp < skill.mpCost) return; // Not enough MP

      // Deduct MP
      setPlayerStats((prev) => ({ ...prev, mp: prev.mp - skill.mpCost }));
      pState.activeSkillId = skill.id;
      soundManager.playSkill(skill.id);

      // Handle Buff Skills (e.g. Haste)
      if (skill.id === 'haste') {
        pState.hasteTimer = 900; // 15 seconds
        return;
      }
    } else {
      soundManager.playAttack();
    }

    const range = skill ? skill.range : 70;
    const targetCount = skill ? skill.targetCount : 1;
    const hitCount = skill ? skill.hitCount : 1;
    const damagePercent = skill ? skill.damagePercent : 100;

    const attackDir = pState.facing === 'right' ? 1 : -1;

    // Filter valid monster targets in range
    let targets = monstersRef.current.filter((m) => {
      const dx = (m.x - pos.x) * attackDir;
      const dy = Math.abs(m.y - pos.y);
      return dx > -20 && dx <= range && dy < 60;
    });

    targets = targets.slice(0, targetCount);

    targets.forEach((m) => {
      soundManager.playHit();

      for (let h = 0; h < hitCount; h++) {
        // Calculate Damage Formula
        const baseAtk = equippedWeapon?.atkBonus || 5;
        const mainStat = playerStats.job === 'Magician' ? playerStats.int :
                         playerStats.job === 'Archer' || playerStats.job === 'Thief' ? playerStats.dex + playerStats.luk : playerStats.str;

        const rawDamage = (mainStat * 2.2 + baseAtk * 1.5 + Math.random() * 15) * (damagePercent / 100);
        const isCrit = Math.random() < 0.2;
        const finalDamage = Math.floor(rawDamage * (isCrit ? 1.5 : 1.0));

        m.hp -= finalDamage;
        m.knockbackVx = attackDir * 8;
        m.invincibleTimer = 15;

        // Damage Text Effect
        damageTextsRef.current.push({
          id: `dt_${Date.now()}_${Math.random()}`,
          x: m.x + (Math.random() - 0.5) * 20,
          y: m.y - m.height / 2 - h * 18,
          damage: finalDamage,
          isCrit,
          timer: 45,
          vy: -1.5,
        });

        // Monster Death
        if (m.hp <= 0) {
          killMonster(m);
          break;
        }
      }
    });
  };

  // Kill Monster & Drop Loot
  const killMonster = (m: Monster) => {
    onMonsterKilled(m.typeId);

    // Filter out dead monster
    monstersRef.current = monstersRef.current.filter((item) => item.id !== m.id);

    // Drop Mesos
    const mesoVal = Math.floor(m.mesoMin + Math.random() * (m.mesoMax - m.mesoMin));
    dropsRef.current.push({
      id: `drop_${Date.now()}_m`,
      x: m.x,
      y: m.y - 10,
      vy: -3,
      type: 'meso',
      name: `${mesoVal} 메소`,
      amount: mesoVal,
      timer: 0,
    });

    // Drop Potions or Equip
    if (Math.random() < 0.4) {
      const isBlue = Math.random() < 0.5;
      dropsRef.current.push({
        id: `drop_${Date.now()}_p`,
        x: m.x + 15,
        y: m.y - 10,
        vy: -4,
        type: 'potion',
        name: isBlue ? '파란 포션' : '빨간 포션',
        itemData: {
          id: `item_${Date.now()}`,
          name: isBlue ? '파란 포션' : '빨간 포션',
          category: 'use',
          count: 1,
          description: isBlue ? 'MP 50 회복' : 'HP 50 회복',
          healHp: isBlue ? 0 : 50,
          healMp: isBlue ? 50 : 0,
          price: isBlue ? 100 : 50,
          iconColor: isBlue ? '#42a5f5' : '#ef5350',
        },
        timer: 0,
      });
    }

    // Award EXP
    addExp(m.exp);
  };

  // Add EXP & Handle Level Up
  const addExp = (amount: number) => {
    setPlayerStats((prev) => {
      let nextExp = prev.exp + amount;
      let nextLevel = prev.level;
      let nextMaxExp = prev.maxExp;
      let nextAp = prev.ap;
      let nextSp = prev.sp;
      let leveledUp = false;

      while (nextExp >= nextMaxExp) {
        nextExp -= nextMaxExp;
        nextLevel++;
        nextMaxExp = Math.floor(nextMaxExp * 1.35);
        nextAp += 5;
        nextSp += 3;
        leveledUp = true;
      }

      if (leveledUp) {
        soundManager.playLevelUp();
        // Fully restore HP / MP on Level Up
        const newMaxHp = prev.maxHp + 30;
        const newMaxMp = prev.maxMp + 20;
        return {
          ...prev,
          level: nextLevel,
          exp: nextExp,
          maxExp: nextMaxExp,
          hp: newMaxHp,
          maxHp: newMaxHp,
          mp: newMaxMp,
          maxMp: newMaxMp,
          ap: nextAp,
          sp: nextSp,
        };
      }

      return { ...prev, exp: nextExp };
    });
  };

  // Pickup Loot
  const pickupNearbyItems = () => {
    const pos = posRef.current;

    dropsRef.current.forEach((drop) => {
      const dist = Math.hypot(drop.x - pos.x, drop.y - pos.y);
      if (dist < 40) {
        soundManager.playPickup();

        if (drop.type === 'meso' && drop.amount) {
          setPlayerStats((prev) => ({ ...prev, mesos: prev.mesos + drop.amount! }));
        } else if (drop.itemData) {
          setInventory((prev) => {
            const existing = prev.find((i) => i.name === drop.itemData!.name);
            if (existing) {
              return prev.map((i) => (i.name === drop.itemData!.name ? { ...i, count: i.count + 1 } : i));
            } else {
              return [...prev, drop.itemData!];
            }
          });
        }
        drop.timer = 9999; // Mark collected
      }
    });

    dropsRef.current = dropsRef.current.filter((d) => d.timer < 9999);
  };

  // Use Potion Shortcut
  const usePotion = (type: 'hp' | 'mp') => {
    setInventory((prev) => {
      const potion = prev.find((i) => (type === 'hp' ? i.healHp && i.healHp > 0 : i.healMp && i.healMp > 0));
      if (!potion || potion.count <= 0) return prev;

      soundManager.playPotion();

      setPlayerStats((pStats) => {
        const nextHp = type === 'hp' ? Math.min(pStats.maxHp, pStats.hp + (potion.healHp || 0)) : pStats.hp;
        const nextMp = type === 'mp' ? Math.min(pStats.maxMp, pStats.mp + (potion.healMp || 0)) : pStats.mp;
        return { ...pStats, hp: nextHp, mp: nextMp };
      });

      return prev
        .map((i) => (i.id === potion.id ? { ...i, count: i.count - 1 } : i))
        .filter((i) => i.count > 0);
    });
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden">
      <canvas
        ref={canvasRef}
        width={960}
        height={540}
        className="w-full h-full max-w-[1280px] max-h-[720px] object-contain rounded shadow-2xl border border-amber-900/40"
      />
    </div>
  );
};
