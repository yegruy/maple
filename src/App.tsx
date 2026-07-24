/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { PlayerStats, InventoryItem, Equipment, Skill, Quest, MapId } from './types';
import { INITIAL_EQUIPMENT, SHOP_ITEMS, QUESTS } from './data/gameData';
import { MapleCanvas } from './components/MapleCanvas';
import { RetroUI } from './components/RetroUI';
import { TouchControls } from './components/TouchControls';

export default function App() {
  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => {
    const saved = localStorage.getItem('maple_classic_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      str: 12,
      dex: 10,
      int: 8,
      luk: 8,
      ap: 5,
      sp: 3,
      level: 1,
      exp: 0,
      maxExp: 50,
      hp: 120,
      maxHp: 120,
      mp: 60,
      maxMp: 60,
      mesos: 500,
      job: 'Beginner',
      jobTitle: '초보자 (Beginner)',
      jobTier: 0,
    };
  });

  const [currentMapId, setCurrentMapId] = useState<MapId>('henesys');

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('maple_classic_inv');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { id: 'start_pot1', name: '빨간 포션', category: 'use', count: 10, description: 'HP 50 회복', healHp: 50, price: 50, iconColor: '#ef5350' },
      { id: 'start_pot2', name: '파란 포션', category: 'use', count: 10, description: 'MP 50 회복', healMp: 50, price: 100, iconColor: '#42a5f5' },
    ];
  });

  const [equippedWeapon, setEquippedWeapon] = useState<Equipment | null>(INITIAL_EQUIPMENT[0]);
  const [activeSkill1, setActiveSkill1] = useState<Skill | null>(null);
  const [activeSkill2, setActiveSkill2] = useState<Skill | null>(null);

  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('maple_classic_quests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return QUESTS;
  });

  // Touch Input Ref for mobile D-pad
  const touchInputRef = useRef({
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
    attack: false,
    skill1: false,
    skill2: false,
    pickup: false,
  });

  // Save Progress
  useEffect(() => {
    localStorage.setItem('maple_classic_stats', JSON.stringify(playerStats));
    localStorage.setItem('maple_classic_inv', JSON.stringify(inventory));
    localStorage.setItem('maple_classic_quests', JSON.stringify(quests));
  }, [playerStats, inventory, quests]);

  // Handle Monster Killed for Quest Progress
  const handleMonsterKilled = (monsterTypeId: string) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.status !== 'completed' && q.targetMonsterId === monsterTypeId) {
          const nextCount = Math.min(q.targetCount, q.currentCount + 1);
          return { ...q, currentCount: nextCount };
        }
        return q;
      })
    );
  };

  return (
    <div className="relative w-screen h-screen bg-slate-950 flex flex-col justify-between overflow-hidden">
      {/* 2D HTML5 Canvas Game Engine */}
      <MapleCanvas
        playerStats={playerStats}
        setPlayerStats={setPlayerStats}
        currentMapId={currentMapId}
        setCurrentMapId={setCurrentMapId}
        inventory={inventory}
        setInventory={setInventory}
        equippedWeapon={equippedWeapon}
        activeSkill1={activeSkill1}
        activeSkill2={activeSkill2}
        onMonsterKilled={handleMonsterKilled}
        touchInputRef={touchInputRef}
      />

      {/* Classic Maple UI Overlays */}
      <RetroUI
        playerStats={playerStats}
        setPlayerStats={setPlayerStats}
        currentMapId={currentMapId}
        setCurrentMapId={setCurrentMapId}
        inventory={inventory}
        setInventory={setInventory}
        equippedWeapon={equippedWeapon}
        setEquippedWeapon={setEquippedWeapon}
        activeSkill1={activeSkill1}
        setActiveSkill1={setActiveSkill1}
        activeSkill2={activeSkill2}
        setActiveSkill2={setActiveSkill2}
        quests={quests}
        setQuests={setQuests}
      />

      {/* Touch D-Pad for Mobile */}
      <TouchControls touchInputRef={touchInputRef} />
    </div>
  );
}
