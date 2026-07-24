import { MapData, MapId, Skill, Equipment, InventoryItem, Quest, JobCategory } from '../types';

export const MAPS: Record<MapId, MapData> = {
  henesys: {
    id: 'henesys',
    name: '헤네시스 (Henesys)',
    bgType: 'henesys',
    bgMusicTempo: 400,
    bgMusicScale: [261.63, 293.66, 329.63, 392.00, 440.00],
    width: 1600,
    height: 700,
    platforms: [
      // Ground
      { x1: 0, y1: 620, x2: 1600, y2: 620 },
      // Elevated Hills / Shelves
      { x1: 150, y1: 500, x2: 450, y2: 500 },
      { x1: 520, y1: 420, x2: 880, y2: 420 },
      { x1: 950, y1: 480, x2: 1300, y2: 480 },
      { x1: 250, y1: 320, x2: 580, y2: 320 },
      { x1: 1100, y1: 340, x2: 1450, y2: 340 },
    ],
    ladders: [
      { x: 300, y1: 320, y2: 500 },
      { x: 700, y1: 420, y2: 620 },
      { x: 1200, y1: 340, y2: 480 },
      { x: 1050, y1: 480, y2: 620 },
    ],
    portals: [
      { x: 60, y: 620, targetMap: 'ellinia', targetX: 1450, targetY: 620, label: '엘리니아 가는길' },
      { x: 1520, y: 620, targetMap: 'perion', targetX: 80, targetY: 620, label: '페리온 가는길' },
      { x: 750, y: 420, targetMap: 'mushmom_hill', targetX: 100, targetY: 580, label: '머쉬맘의 오솔길' },
    ],
    npcs: [
      {
        id: 'npc_mai',
        name: '마이 (Mai)',
        x: 200,
        y: 620,
        role: 'quest',
        questId: 'quest_mai_training',
        dialog: [
          '안녕! 빅토리아 아일랜드에 온 걸 환영해!',
          '초보자라면 먼저 주황버섯과 슬라임을 잡아서 실력을 쌓아봐!'
        ],
        color: '#e57373'
      },
      {
        id: 'npc_stan',
        name: '장로 스탄 (Chief Stan)',
        x: 600,
        y: 620,
        role: 'shop',
        dialog: [
          '허허, 헤네시스의 장로 스탄이라네.',
          '마을을 위협하는 몬스터들을 퇴치해주면 큰 보상을 주겠네!',
          '필요한 포션이나 장비가 있다면 둘러보게나.'
        ],
        color: '#8d6e63'
      },
      {
        id: 'npc_athena',
        name: '헬레나 (Athena Pierce)',
        x: 1200,
        y: 340,
        role: 'job',
        dialog: [
          '궁수의 길을 걸어가겠는가? 긴 사거리와 치명적인 관통 사격을 다루지.',
          '레벨 10 이상이라면 궁수로 전직시켜 줄 수 있다네.'
        ],
        color: '#81c784'
      }
    ],
    monsterTypes: ['snail', 'slime', 'orange_mushroom', 'ribbon_pig'],
    maxMonsters: 10,
  },

  ellinia: {
    id: 'ellinia',
    name: '엘리니아 (Ellinia)',
    bgType: 'ellinia',
    bgMusicTempo: 450,
    bgMusicScale: [220.00, 261.63, 293.66, 329.63, 392.00],
    width: 1500,
    height: 800,
    platforms: [
      // Ground
      { x1: 0, y1: 720, x2: 1500, y2: 720 },
      // Tree branches
      { x1: 100, y1: 580, x2: 450, y2: 580 },
      { x1: 500, y1: 480, x2: 850, y2: 480 },
      { x1: 900, y1: 580, x2: 1350, y2: 580 },
      { x1: 200, y1: 360, x2: 600, y2: 360 },
      { x1: 700, y1: 260, x2: 1200, y2: 260 },
    ],
    ladders: [
      { x: 300, y1: 360, y2: 580 },
      { x: 750, y1: 260, y2: 480 },
      { x: 1100, y1: 260, y2: 580 },
      { x: 400, y1: 580, y2: 720 },
      { x: 1000, y1: 580, y2: 720 },
    ],
    portals: [
      { x: 1450, y: 720, targetMap: 'henesys', targetX: 80, targetY: 620, label: '헤네시스 가는길' },
      { x: 80, y: 720, targetMap: 'kerning', targetX: 1350, targetY: 620, label: '커닝시티 가는길' },
    ],
    npcs: [
      {
        id: 'npc_grendel',
        name: '하인즈 (Grendel the Really Old)',
        x: 800,
        y: 260,
        role: 'job',
        dialog: [
          '마법의 정수를 깨달았는가?',
          '마법사는 레벨 8부터 전직할 수 있다네. 에너지볼트와 매직클로를 연마하게나!'
        ],
        color: '#64b5f6'
      }
    ],
    monsterTypes: ['slime', 'green_mushroom', 'horn_mushroom'],
    maxMonsters: 12,
  },

  perion: {
    id: 'perion',
    name: '페리온 (Perion)',
    bgType: 'perion',
    bgMusicTempo: 380,
    bgMusicScale: [196.00, 220.00, 246.94, 293.66, 329.63],
    width: 1500,
    height: 700,
    platforms: [
      { x1: 0, y1: 620, x2: 1500, y2: 620 },
      { x1: 100, y1: 480, x2: 500, y2: 480 },
      { x1: 600, y1: 380, x2: 1000, y2: 380 },
      { x1: 1100, y1: 480, x2: 1400, y2: 480 },
      { x1: 250, y1: 280, x2: 750, y2: 280 },
    ],
    ladders: [
      { x: 300, y1: 280, y2: 480 },
      { x: 800, y1: 380, y2: 620 },
      { x: 1250, y1: 480, y2: 620 },
    ],
    portals: [
      { x: 60, y: 620, targetMap: 'henesys', targetX: 1450, targetY: 620, label: '헤네시스 가는길' },
      { x: 1440, y: 620, targetMap: 'kerning', targetX: 80, targetY: 620, label: '커닝시티 가는길' },
    ],
    npcs: [
      {
        id: 'npc_dances_with_balrog',
        name: '주먹쥐고 일어서 (Dances with Balrog)',
        x: 500,
        y: 280,
        role: 'job',
        dialog: [
          '강인한 육체와 파괴력을 원하는가? 전사의 길은 고되고 숭고하다!',
          '레벨 10 이상이라면 파워스트라이크와 슬래시블러스트를 전수해주지!'
        ],
        color: '#ff8a65'
      }
    ],
    monsterTypes: ['ribbon_pig', 'wild_boar', 'drake'],
    maxMonsters: 10,
  },

  kerning: {
    id: 'kerning',
    name: '커닝시티 (Kerning City)',
    bgType: 'kerning',
    bgMusicTempo: 420,
    bgMusicScale: [220.00, 246.94, 261.63, 293.66, 329.63],
    width: 1500,
    height: 700,
    platforms: [
      { x1: 0, y1: 620, x2: 1500, y2: 620 },
      { x1: 150, y1: 480, x2: 550, y2: 480 },
      { x1: 650, y1: 400, x2: 1050, y2: 400 },
      { x1: 1100, y1: 480, x2: 1400, y2: 480 },
      { x1: 300, y1: 280, x2: 800, y2: 280 },
    ],
    ladders: [
      { x: 350, y1: 280, y2: 480 },
      { x: 850, y1: 400, y2: 620 },
      { x: 1250, y1: 480, y2: 620 },
    ],
    portals: [
      { x: 60, y: 620, targetMap: 'perion', targetX: 1400, targetY: 620, label: '페리온 가는길' },
      { x: 1420, y: 620, targetMap: 'ellinia', targetX: 100, targetY: 720, label: '엘리니아 가는길' },
    ],
    npcs: [
      {
        id: 'npc_dark_lord',
        name: '다크로드 (Dark Lord)',
        x: 550,
        y: 280,
        role: 'job',
        dialog: [
          '어둠 속에서 은밀하고 빠르게 적을 제압하고 싶은가?',
          '레벨 10 도적 전직: 표창 투척 럭키세븐과 기동력 최고봉 헤이스트를 배워라!'
        ],
        color: '#ba68c8'
      },
      {
        id: 'npc_nella',
        name: '넬라 (Nella)',
        x: 350,
        y: 480,
        role: 'quest',
        questId: 'quest_nella_favor',
        dialog: [
          '커닝시티 공사장 근처의 와일드보어가 골칫거리예요.',
          '와일드보어를 소탕해주시면 은혜를 잊지 않을게요!'
        ],
        color: '#4db6ac'
      }
    ],
    monsterTypes: ['slime', 'green_mushroom', 'wild_boar'],
    maxMonsters: 10,
  },

  mushmom_hill: {
    id: 'mushmom_hill',
    name: '머쉬맘의 오솔길 (Mushmom Hill)',
    bgType: 'mushmom_hill',
    bgMusicTempo: 350,
    bgMusicScale: [174.61, 196.00, 220.00, 261.63],
    width: 1400,
    height: 700,
    platforms: [
      { x1: 0, y1: 580, x2: 1400, y2: 580 },
      { x1: 200, y1: 420, x2: 600, y2: 420 },
      { x1: 750, y1: 420, x2: 1150, y2: 420 },
      { x1: 450, y1: 260, x2: 900, y2: 260 },
    ],
    ladders: [
      { x: 400, y1: 260, y2: 420 },
      { x: 800, y1: 420, y2: 580 },
    ],
    portals: [
      { x: 80, y: 580, targetMap: 'henesys', targetX: 750, targetY: 420, label: '헤네시스 복귀' },
    ],
    npcs: [],
    monsterTypes: ['orange_mushroom', 'mushmom'],
    maxMonsters: 5,
  }
};

export const SKILLS: Record<string, Skill> = {
  power_strike: {
    id: 'power_strike',
    name: '파워 스트라이크',
    level: 1,
    maxLevel: 20,
    mpCost: 9,
    damagePercent: 220,
    targetCount: 1,
    hitCount: 1,
    range: 80,
    description: 'MP를 소비하여 단일 적에게 강력한 일격을 가한다.',
    reqJob: 'Warrior',
    iconColor: '#e53935'
  },
  slash_blast: {
    id: 'slash_blast',
    name: '슬래시 블러스트',
    level: 1,
    maxLevel: 20,
    mpCost: 14,
    damagePercent: 160,
    targetCount: 6,
    hitCount: 1,
    range: 120,
    description: '검기를 날려 주변의 여러 적을 동시에 공격한다.',
    reqJob: 'Warrior',
    iconColor: '#ff9800'
  },
  energy_bolt: {
    id: 'energy_bolt',
    name: '에너지 볼트',
    level: 1,
    maxLevel: 20,
    mpCost: 8,
    damagePercent: 190,
    targetCount: 1,
    hitCount: 1,
    range: 300,
    description: '마력 응축 응집체를 응축 발사하여 적을 타격한다.',
    reqJob: 'Magician',
    iconColor: '#29b6f6'
  },
  magic_claw: {
    id: 'magic_claw',
    name: '매직 클로',
    level: 1,
    maxLevel: 20,
    mpCost: 16,
    damagePercent: 140,
    targetCount: 1,
    hitCount: 2,
    range: 220,
    description: '마력 할퀴기로 원거리 적을 연속 2회 타격한다.',
    reqJob: 'Magician',
    iconColor: '#ab47bc'
  },
  arrow_blow: {
    id: 'arrow_blow',
    name: '애로우 블로우',
    level: 1,
    maxLevel: 20,
    mpCost: 10,
    damagePercent: 210,
    targetCount: 1,
    hitCount: 1,
    range: 350,
    description: '강력한 화살 한 발을 먼 거리의 적에게 발사한다.',
    reqJob: 'Archer',
    iconColor: '#66bb6a'
  },
  double_strafe: {
    id: 'double_strafe',
    name: '더블 스트레이프',
    level: 1,
    maxLevel: 20,
    mpCost: 16,
    damagePercent: 130,
    targetCount: 1,
    hitCount: 2,
    range: 350,
    description: '화살 2발을 연속으로 빠르게 사격한다.',
    reqJob: 'Archer',
    iconColor: '#9ccc65'
  },
  lucky_seven: {
    id: 'lucky_seven',
    name: '럭키 세븐',
    level: 1,
    maxLevel: 20,
    mpCost: 14,
    damagePercent: 170,
    targetCount: 1,
    hitCount: 2,
    range: 320,
    description: 'LUK 스탯에 영향을 받는 표창 2개를 연속 투척한다.',
    reqJob: 'Thief',
    iconColor: '#7e57c2'
  },
  haste: {
    id: 'haste',
    name: '헤이스트',
    level: 1,
    maxLevel: 20,
    mpCost: 15,
    damagePercent: 0,
    targetCount: 0,
    hitCount: 0,
    range: 0,
    description: '이동속도를 15초간 대폭 증가시킨다.',
    reqJob: 'Thief',
    iconColor: '#26a69a'
  }
};

export const INITIAL_EQUIPMENT: Equipment[] = [
  { id: 'eq_club', name: '나무 몽둥이', type: 'weapon', atkBonus: 5, reqLevel: 1, price: 100, iconColor: '#8d6e63' },
  { id: 'eq_cap', name: '갈색 고깔모자', type: 'hat', defBonus: 3, reqLevel: 1, price: 80, iconColor: '#a1887f' },
  { id: 'eq_shirt', name: '초보자 상의', type: 'top', defBonus: 5, reqLevel: 1, price: 100, iconColor: '#90caf9' },
  { id: 'eq_shoes', name: '가죽 고무신', type: 'shoes', speedBonus: 2, reqLevel: 1, price: 60, iconColor: '#bcaaa4' },
  { id: 'eq_sword', name: '쇠검', type: 'weapon', atkBonus: 22, reqLevel: 10, reqJob: 'Warrior', price: 1500, iconColor: '#b0bec5' },
  { id: 'eq_staff', name: '우드 완드', type: 'weapon', matkBonus: 28, reqLevel: 8, reqJob: 'Magician', price: 1200, iconColor: '#ce93d8' },
  { id: 'eq_bow', name: '사냥꾼의 활', type: 'weapon', atkBonus: 18, reqLevel: 10, reqJob: 'Archer', price: 1400, iconColor: '#a5d6a7' },
  { id: 'eq_claw', name: '스틸 가니어', type: 'weapon', atkBonus: 16, reqLevel: 10, reqJob: 'Thief', price: 1600, iconColor: '#b39ddb' },
];

export const SHOP_ITEMS: InventoryItem[] = [
  { id: 'item_red_pot', name: '빨간 포션', category: 'use', count: 1, description: 'HP 50 회복', healHp: 50, price: 50, iconColor: '#ef5350' },
  { id: 'item_blue_pot', name: '파란 포션', category: 'use', count: 1, description: 'MP 50 회복', healMp: 50, price: 100, iconColor: '#42a5f5' },
  { id: 'item_white_pot', name: '하얀 포션', category: 'use', count: 1, description: 'HP 300 회복', healHp: 300, price: 300, iconColor: '#eceff1' },
  { id: 'item_mana_elixir', name: '마나 엘릭서', category: 'use', count: 1, description: 'MP 300 회복', healMp: 300, price: 600, iconColor: '#ab47bc' },
  { id: 'item_eq_sword', name: '쇠검', category: 'equip', count: 1, description: '전사 전용 직도 (공격력+22)', price: 1500, iconColor: '#b0bec5', equipData: INITIAL_EQUIPMENT[4] },
  { id: 'item_eq_staff', name: '우드 완드', category: 'equip', count: 1, description: '마법사 전용 완드 (마력+28)', price: 1200, iconColor: '#ce93d8', equipData: INITIAL_EQUIPMENT[5] },
  { id: 'item_eq_bow', name: '사냥꾼의 활', category: 'equip', count: 1, description: '궁수 전용 활 (공격력+18)', price: 1400, iconColor: '#a5d6a7', equipData: INITIAL_EQUIPMENT[6] },
  { id: 'item_eq_claw', name: '스틸 가니어', category: 'equip', count: 1, description: '도적 전용 아대 (공격력+16)', price: 1600, iconColor: '#b39ddb', equipData: INITIAL_EQUIPMENT[7] },
];

export const QUESTS: Quest[] = [
  {
    id: 'quest_mai_training',
    title: '마이의 초보자 수련',
    npcName: '마이',
    reqLevel: 1,
    targetMonsterId: 'slime',
    targetCount: 5,
    currentCount: 0,
    rewardExp: 80,
    rewardMesos: 200,
    status: 'available',
    description: '헤네시스의 초보자 수련 교관 마이의 부탁으로 슬라임 5마리를 퇴치하자.'
  },
  {
    id: 'quest_stan_mushrooms',
    title: '장로 스탄의 버섯 퇴치',
    npcName: '장로 스탄',
    reqLevel: 5,
    targetMonsterId: 'orange_mushroom',
    targetCount: 10,
    currentCount: 0,
    rewardExp: 350,
    rewardMesos: 1000,
    status: 'available',
    description: '헤네시스 주변 산책로의 주황버섯 10마리를 퇴치하고 장로 스탄에게 보고하자.'
  },
  {
    id: 'quest_nella_favor',
    title: '커닝시티 넬라의 청소',
    npcName: '넬라',
    reqLevel: 12,
    targetMonsterId: 'wild_boar',
    targetCount: 8,
    currentCount: 0,
    rewardExp: 900,
    rewardMesos: 2500,
    status: 'available',
    description: '커닝시티 근처를 위협하는 와일드보어 8마리를 퇴치하여 평화를 찾자.'
  },
  {
    id: 'quest_mushmom_boss',
    title: '전설의 머쉬맘 토벌',
    npcName: '장로 스탄',
    reqLevel: 18,
    targetMonsterId: 'mushmom',
    targetCount: 1,
    currentCount: 0,
    rewardExp: 5000,
    rewardMesos: 10000,
    status: 'available',
    description: '머쉬맘의 오솔길에 거주하는 거대 오렌지 수장 몬스터 "머쉬맘"을 제압하라!'
  }
];
