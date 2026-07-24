import React, { useState } from 'react';
import { PlayerStats, InventoryItem, Equipment, Skill, Quest, MapId } from '../types';
import { MAPS, SKILLS, SHOP_ITEMS } from '../data/gameData';
import { soundManager } from '../utils/sound';
import { Shield, Sparkles, Backpack, Scroll, Store, Volume2, VolumeX, Plus, RefreshCw } from 'lucide-react';

interface RetroUIProps {
  playerStats: PlayerStats;
  setPlayerStats: React.Dispatch<React.SetStateAction<PlayerStats>>;
  currentMapId: MapId;
  setCurrentMapId: (mapId: MapId) => void;
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  equippedWeapon: Equipment | null;
  setEquippedWeapon: (eq: Equipment | null) => void;
  activeSkill1: Skill | null;
  setActiveSkill1: (sk: Skill | null) => void;
  activeSkill2: Skill | null;
  setActiveSkill2: (sk: Skill | null) => void;
  quests: Quest[];
  setQuests: React.Dispatch<React.SetStateAction<Quest[]>>;
}

export const RetroUI: React.FC<RetroUIProps> = ({
  playerStats,
  setPlayerStats,
  currentMapId,
  setCurrentMapId,
  inventory,
  setInventory,
  equippedWeapon,
  setEquippedWeapon,
  activeSkill1,
  setActiveSkill1,
  activeSkill2,
  setActiveSkill2,
  quests,
  setQuests,
}) => {
  const [activeWindow, setActiveWindow] = useState<'stats' | 'skills' | 'inventory' | 'quests' | 'shop' | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);

  const mapData = MAPS[currentMapId];

  // Allocate AP
  const addStat = (statName: 'str' | 'dex' | 'int' | 'luk') => {
    if (playerStats.ap <= 0) return;
    setPlayerStats((prev) => ({
      ...prev,
      [statName]: prev[statName] + 1,
      ap: prev.ap - 1,
    }));
  };

  // Add Skill SP
  const upgradeSkill = (skillId: string) => {
    if (playerStats.sp <= 0) return;
    setPlayerStats((prev) => ({ ...prev, sp: prev.sp - 1 }));

    // Assign to quickslots if empty
    const sk = SKILLS[skillId];
    if (sk) {
      if (!activeSkill1) setActiveSkill1(sk);
      else if (!activeSkill2 && activeSkill1.id !== sk.id) setActiveSkill2(sk);
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  // Equip or Use Item
  const handleItemClick = (item: InventoryItem) => {
    if (item.category === 'equip' && item.equipData) {
      setEquippedWeapon(item.equipData);
      soundManager.playPickup();
    } else if (item.category === 'use') {
      soundManager.playPotion();
      setPlayerStats((prev) => ({
        ...prev,
        hp: Math.min(prev.maxHp, prev.hp + (item.healHp || 0)),
        mp: Math.min(prev.maxMp, prev.mp + (item.healMp || 0)),
      }));

      // Decrement Count
      setInventory((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, count: i.count - 1 } : i)).filter((i) => i.count > 0)
      );
    }
  };

  // Buy Shop Item
  const buyItem = (shopItem: InventoryItem) => {
    if (playerStats.mesos < shopItem.price) {
      alert('메소가 부족합니다!');
      return;
    }

    setPlayerStats((prev) => ({ ...prev, mesos: prev.mesos - shopItem.price }));
    soundManager.playPickup();

    setInventory((prev) => {
      const existing = prev.find((i) => i.name === shopItem.name);
      if (existing) {
        return prev.map((i) => (i.name === shopItem.name ? { ...i, count: i.count + 1 } : i));
      } else {
        return [...prev, { ...shopItem, id: `inv_${Date.now()}` }];
      }
    });
  };

  // Turn in Quest
  const completeQuest = (q: Quest) => {
    if (q.currentCount < q.targetCount) return;

    soundManager.playLevelUp();
    setPlayerStats((prev) => ({
      ...prev,
      exp: prev.exp + q.rewardExp,
      mesos: prev.mesos + q.rewardMesos,
    }));

    setQuests((prev) => prev.map((item) => (item.id === q.id ? { ...item, status: 'completed' } : item)));
  };

  // Job Advancement
  const advanceJob = (job: 'Warrior' | 'Magician' | 'Archer' | 'Thief') => {
    const titleMap = {
      Warrior: '전사 (Warrior)',
      Magician: '마법사 (Magician)',
      Archer: '궁수 (Archer)',
      Thief: '도적 (Thief)',
    };

    setPlayerStats((prev) => ({
      ...prev,
      job,
      jobTitle: titleMap[job],
      jobTier: 1,
      sp: prev.sp + 5,
      ap: prev.ap + 5,
    }));

    // Auto assign starter skill
    if (job === 'Warrior') setActiveSkill1(SKILLS.power_strike);
    if (job === 'Magician') setActiveSkill1(SKILLS.energy_bolt);
    if (job === 'Archer') setActiveSkill1(SKILLS.arrow_blow);
    if (job === 'Thief') setActiveSkill1(SKILLS.lucky_seven);

    setShowJobModal(false);
    soundManager.playLevelUp();
  };

  const expPercent = ((playerStats.exp / playerStats.maxExp) * 100).toFixed(2);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2 select-none font-['DungGeunMo']">
      {/* --- TOP BAR --- */}
      <div className="flex items-center justify-between pointer-events-auto">
        <div className="maple-panel px-3 py-1.5 flex items-center gap-3 border-amber-600/60 shadow-lg">
          <span className="text-amber-400 font-bold text-sm tracking-wide">
            [{mapData?.name || '헤네시스'}]
          </span>
          <span className="text-xs text-slate-300">채널 1</span>
        </div>

        {/* Action Bar & Sound */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowJobModal(true)}
            className="maple-btn px-2.5 py-1 text-xs text-amber-950 font-bold animate-pulse"
          >
            전직하기
          </button>

          <button
            onClick={() => setActiveWindow(activeWindow === 'stats' ? null : 'stats')}
            className={`maple-panel p-2 hover:bg-slate-800 text-xs flex items-center gap-1 text-amber-200 ${
              activeWindow === 'stats' ? 'border-amber-400 bg-amber-950/40' : ''
            }`}
          >
            <Shield className="w-4 h-4 text-amber-400" /> 스탯(S)
          </button>

          <button
            onClick={() => setActiveWindow(activeWindow === 'skills' ? null : 'skills')}
            className={`maple-panel p-2 hover:bg-slate-800 text-xs flex items-center gap-1 text-cyan-200 ${
              activeWindow === 'skills' ? 'border-cyan-400 bg-cyan-950/40' : ''
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" /> 스킬(K)
          </button>

          <button
            onClick={() => setActiveWindow(activeWindow === 'inventory' ? null : 'inventory')}
            className={`maple-panel p-2 hover:bg-slate-800 text-xs flex items-center gap-1 text-emerald-200 ${
              activeWindow === 'inventory' ? 'border-emerald-400 bg-emerald-950/40' : ''
            }`}
          >
            <Backpack className="w-4 h-4 text-emerald-400" /> 가방(I)
          </button>

          <button
            onClick={() => setActiveWindow(activeWindow === 'quests' ? null : 'quests')}
            className={`maple-panel p-2 hover:bg-slate-800 text-xs flex items-center gap-1 text-amber-300 ${
              activeWindow === 'quests' ? 'border-amber-400 bg-amber-950/40' : ''
            }`}
          >
            <Scroll className="w-4 h-4 text-amber-400" /> 퀘스트(Q)
          </button>

          <button
            onClick={() => setActiveWindow(activeWindow === 'shop' ? null : 'shop')}
            className={`maple-panel p-2 hover:bg-slate-800 text-xs flex items-center gap-1 text-rose-300 ${
              activeWindow === 'shop' ? 'border-rose-400 bg-rose-950/40' : ''
            }`}
          >
            <Store className="w-4 h-4 text-rose-400" /> 상점
          </button>

          <button onClick={handleToggleMute} className="maple-panel p-2 hover:bg-slate-800 text-amber-300">
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* --- FLOATING RETRO MAPLE WINDOWS --- */}
      <div className="relative flex-1 pointer-events-none my-2 flex items-center justify-center">
        {/* STATS WINDOW */}
        {activeWindow === 'stats' && (
          <div className="maple-window w-80 p-3 pointer-events-auto text-xs space-y-3 z-30">
            <div className="maple-window-header p-1.5 flex justify-between items-center rounded">
              <span>캐릭터 정보 (Ability Points)</span>
              <button onClick={() => setActiveWindow(null)} className="text-xs px-1 text-amber-100 hover:text-white">✕</button>
            </div>
            <div className="space-y-1 bg-slate-900/80 p-2 rounded border border-slate-700">
              <div className="flex justify-between text-amber-300"><span>직업:</span><span>{playerStats.jobTitle}</span></div>
              <div className="flex justify-between text-slate-200"><span>레벨:</span><span>Lv.{playerStats.level}</span></div>
              <div className="flex justify-between text-amber-400"><span>보유 AP:</span><span className="font-bold">{playerStats.ap} Points</span></div>
            </div>

            <div className="space-y-2 bg-slate-900/60 p-2.5 rounded border border-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-red-400 font-bold">STR (힘): {playerStats.str}</span>
                <button onClick={() => addStat('str')} disabled={playerStats.ap <= 0} className="maple-btn px-2 py-0.5 text-xs disabled:opacity-40">+</button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-400 font-bold">DEX (민첩): {playerStats.dex}</span>
                <button onClick={() => addStat('dex')} disabled={playerStats.ap <= 0} className="maple-btn px-2 py-0.5 text-xs disabled:opacity-40">+</button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cyan-400 font-bold">INT (지능): {playerStats.int}</span>
                <button onClick={() => addStat('int')} disabled={playerStats.ap <= 0} className="maple-btn px-2 py-0.5 text-xs disabled:opacity-40">+</button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-400 font-bold">LUK (운): {playerStats.luk}</span>
                <button onClick={() => addStat('luk')} disabled={playerStats.ap <= 0} className="maple-btn px-2 py-0.5 text-xs disabled:opacity-40">+</button>
              </div>
            </div>
          </div>
        )}

        {/* SKILLS WINDOW */}
        {activeWindow === 'skills' && (
          <div className="maple-window w-84 p-3 pointer-events-auto text-xs space-y-3 z-30">
            <div className="maple-window-header p-1.5 flex justify-between items-center rounded">
              <span>스킬 트리 (Skill Points: {playerStats.sp})</span>
              <button onClick={() => setActiveWindow(null)} className="text-xs px-1 text-amber-100 hover:text-white">✕</button>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {Object.values(SKILLS)
                .filter((sk) => sk.reqJob === playerStats.job)
                .map((sk) => (
                  <div key={sk.id} className="bg-slate-900/80 p-2 rounded border border-slate-700 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-cyan-300">{sk.name} (MP {sk.mpCost})</div>
                      <div className="text-[10px] text-slate-300">{sk.description}</div>
                    </div>
                    <button onClick={() => upgradeSkill(sk.id)} disabled={playerStats.sp <= 0} className="maple-btn px-2 py-1 text-xs shrink-0">배우기</button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* INVENTORY WINDOW */}
        {activeWindow === 'inventory' && (
          <div className="maple-window w-84 p-3 pointer-events-auto text-xs space-y-3 z-30">
            <div className="maple-window-header p-1.5 flex justify-between items-center rounded">
              <span>아이템 가방 (소지 메소: {playerStats.mesos.toLocaleString()} meso)</span>
              <button onClick={() => setActiveWindow(null)} className="text-xs px-1 text-amber-100 hover:text-white">✕</button>
            </div>
            <div className="text-amber-200 text-[11px]">장착 무기: {equippedWeapon?.name || '기본 나무 몽둥이'}</div>
            <div className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto p-1 bg-slate-900/80 rounded border border-slate-700">
              {inventory.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-600 flex flex-col items-center justify-center text-center text-[10px]"
                >
                  <div className="w-6 h-6 rounded-full my-1 flex items-center justify-center font-bold text-white" style={{ backgroundColor: item.iconColor }}>
                    {item.name[0]}
                  </div>
                  <span className="truncate w-full text-slate-200">{item.name}</span>
                  <span className="text-amber-400 font-bold">x{item.count}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* QUESTS WINDOW */}
        {activeWindow === 'quests' && (
          <div className="maple-window w-88 p-3 pointer-events-auto text-xs space-y-3 z-30">
            <div className="maple-window-header p-1.5 flex justify-between items-center rounded">
              <span>빅토리아 퀘스트목록</span>
              <button onClick={() => setActiveWindow(null)} className="text-xs px-1 text-amber-100 hover:text-white">✕</button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {quests.map((q) => (
                <div key={q.id} className="bg-slate-900/80 p-2.5 rounded border border-slate-700 space-y-1">
                  <div className="flex justify-between text-amber-300 font-bold">
                    <span>{q.title}</span>
                    <span className={q.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'}>
                      {q.status === 'completed' ? '완료' : `${q.currentCount}/${q.targetCount}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">{q.description}</p>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                    <span>보상: {q.rewardExp} EXP / {q.rewardMesos} 메소</span>
                    {q.status !== 'completed' && (
                      <button
                        onClick={() => completeQuest(q)}
                        disabled={q.currentCount < q.targetCount}
                        className="maple-btn px-2 py-0.5 text-xs disabled:opacity-40"
                      >
                        완료받기
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SHOP WINDOW */}
        {activeWindow === 'shop' && (
          <div className="maple-window w-88 p-3 pointer-events-auto text-xs space-y-3 z-30">
            <div className="maple-window-header p-1.5 flex justify-between items-center rounded">
              <span>마을 물약 & 장비 상점</span>
              <button onClick={() => setActiveWindow(null)} className="text-xs px-1 text-amber-100 hover:text-white">✕</button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {SHOP_ITEMS.map((item) => (
                <div key={item.id} className="bg-slate-900/80 p-2 rounded border border-slate-700 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-emerald-300">{item.name}</div>
                    <div className="text-[10px] text-slate-300">{item.description}</div>
                  </div>
                  <button onClick={() => buyItem(item)} className="maple-btn px-2.5 py-1 text-xs shrink-0">
                    {item.price} Meso
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* JOB ADVANCEMENT MODAL */}
        {showJobModal && (
          <div className="maple-window w-96 p-4 pointer-events-auto text-xs space-y-4 z-40">
            <div className="maple-window-header p-2 text-center text-sm rounded">
              ✨ 1차 직업 전직소 (Level 10 이상) ✨
            </div>
            <p className="text-center text-slate-200 text-[11px]">
              원하는 직업 경로를 선택하세요! 전직 시 전용 스킬 및 능력치 포인트를 획득합니다.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => advanceJob('Warrior')} className="maple-panel p-2.5 hover:bg-red-950/60 border-red-500/50 text-red-300 text-left">
                <div className="font-bold text-sm">⚔️ 전사 (Warrior)</div>
                <div className="text-[10px] text-slate-400 mt-1">강력한 체력과 파워스트라이크/슬래시블러스트</div>
              </button>
              <button onClick={() => advanceJob('Magician')} className="maple-panel p-2.5 hover:bg-blue-950/60 border-blue-500/50 text-blue-300 text-left">
                <div className="font-bold text-sm">🪄 마법사 (Magician)</div>
                <div className="text-[10px] text-slate-400 mt-1">원거리 마력 에너지볼트 & 매직클로 연화</div>
              </button>
              <button onClick={() => advanceJob('Archer')} className="maple-panel p-2.5 hover:bg-emerald-950/60 border-emerald-500/50 text-emerald-300 text-left">
                <div className="font-bold text-sm">🏹 궁수 (Archer)</div>
                <div className="text-[10px] text-slate-400 mt-1">긴 관통 사거리 애로우블로우 & 더블스트레이프</div>
              </button>
              <button onClick={() => advanceJob('Thief')} className="maple-panel p-2.5 hover:bg-purple-950/60 border-purple-500/50 text-purple-300 text-left">
                <div className="font-bold text-sm">🗡️ 도적 (Thief)</div>
                <div className="text-[10px] text-slate-400 mt-1">빛과 같은 헤이스트 속도 & 럭키세븐 표창</div>
              </button>
            </div>
            <button onClick={() => setShowJobModal(false)} className="w-full maple-btn py-1">닫기</button>
          </div>
        )}
      </div>

      {/* --- CLASSIC MAPLESTORY BOTTOM STATUS BAR --- */}
      <div className="maple-window p-2 pointer-events-auto flex flex-col md:flex-row items-center justify-between gap-2 shadow-2xl border-amber-600">
        {/* Left Character Bio */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-slate-800 border border-amber-500/60 flex items-center justify-center text-amber-400 font-bold text-sm">
            Lv.{playerStats.level}
          </div>
          <div>
            <div className="text-amber-300 font-bold text-xs">{playerStats.jobTitle}</div>
            <div className="text-[10px] text-slate-300">HP {playerStats.hp}/{playerStats.maxHp} | MP {playerStats.mp}/{playerStats.maxMp}</div>
          </div>
        </div>

        {/* Center Progress Bars (HP, MP, EXP) */}
        <div className="flex-1 w-full max-w-md space-y-1">
          {/* HP Bar */}
          <div className="w-full h-3.5 bg-slate-900 rounded border border-slate-700 relative overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-200" style={{ width: `${(playerStats.hp / playerStats.maxHp) * 100}%` }} />
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white drop-shadow">
              HP {playerStats.hp} / {playerStats.maxHp}
            </span>
          </div>

          {/* MP Bar */}
          <div className="w-full h-3.5 bg-slate-900 rounded border border-slate-700 relative overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-200" style={{ width: `${(playerStats.mp / playerStats.maxMp) * 100}%` }} />
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white drop-shadow">
              MP {playerStats.mp} / {playerStats.maxMp}
            </span>
          </div>

          {/* EXP Bar */}
          <div className="w-full h-2 bg-slate-900 rounded border border-slate-700 relative overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-all duration-200" style={{ width: `${expPercent}%` }} />
          </div>
        </div>

        {/* Quick Slots */}
        <div className="flex items-center gap-1">
          <div className="maple-panel px-2 py-1 text-center text-[10px]">
            <div className="text-amber-400 font-bold">[1] HP</div>
            <div className="text-slate-300">물약</div>
          </div>
          <div className="maple-panel px-2 py-1 text-center text-[10px]">
            <div className="text-cyan-400 font-bold">[2] MP</div>
            <div className="text-slate-300">물약</div>
          </div>
          <div className="maple-panel px-2 py-1 text-center text-[10px]">
            <div className="text-emerald-400 font-bold">[X] 공격</div>
            <div className="text-slate-300">기본</div>
          </div>
          <div className="maple-panel px-2 py-1 text-center text-[10px]">
            <div className="text-purple-400 font-bold">[C] {activeSkill1?.name || '스킬1'}</div>
            <div className="text-slate-300">스킬</div>
          </div>
        </div>
      </div>
    </div>
  );
};
