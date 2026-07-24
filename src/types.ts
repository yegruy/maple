export type JobCategory = 'Beginner' | 'Warrior' | 'Magician' | 'Archer' | 'Thief';
export type JobSubclass = 
  | ' 초보자 (Beginner)'
  | '전사 (Warrior)' | '파이터 (Fighter)' | '페이지 (Page)' | '스피어맨 (Spearman)'
  | '마법사 (Magician)' | '불/독 마법사' | '썬/콜 마법사' | '클레릭 (Cleric)'
  | '궁수 (Archer)' | '헌터 (Hunter)' | '사수 (Crossbowman)'
  | '도적 (Thief)' | '어쌔신 (Assassin)' | '시프 (Bandit)';

export type MapId = 'henesys' | 'ellinia' | 'perion' | 'kerning' | 'mushmom_hill';

export interface PlayerStats {
  str: number;
  dex: number;
  int: number;
  luk: number;
  ap: number;
  sp: number;
  level: number;
  exp: number;
  maxExp: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  mesos: number;
  job: JobCategory;
  jobTitle: string;
  jobTier: 0 | 1 | 2; // 0: Beginner, 1: 1st Job, 2: 2nd Job
}

export interface Equipment {
  id: string;
  name: string;
  type: 'weapon' | 'hat' | 'top' | 'shoes';
  atkBonus?: number;
  matkBonus?: number;
  defBonus?: number;
  hpBonus?: number;
  speedBonus?: number;
  reqLevel: number;
  reqJob?: JobCategory;
  iconColor: string;
  price: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'equip' | 'use' | 'etc';
  count: number;
  description: string;
  equipData?: Equipment;
  healHp?: number;
  healMp?: number;
  price: number;
  iconColor: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  mpCost: number;
  damagePercent: number;
  targetCount: number;
  hitCount: number;
  range: number;
  description: string;
  reqJob: JobCategory;
  iconColor: string;
}

export interface Monster {
  id: string;
  typeId: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  level: number;
  exp: number;
  mesoMin: number;
  mesoMax: number;
  atk: number;
  facing: 'left' | 'right';
  isGrounded: boolean;
  knockbackVx: number;
  invincibleTimer: number;
  isBoss?: boolean;
  color: string;
  hatColor?: string;
}

export interface DropItem {
  id: string;
  x: number;
  y: number;
  vy: number;
  type: 'meso' | 'potion' | 'equip' | 'etc';
  name: string;
  amount?: number;
  itemData?: InventoryItem;
  timer: number;
}

export interface Platform {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Ladder {
  x: number;
  y1: number;
  y2: number;
}

export interface Portal {
  x: number;
  y: number;
  targetMap: MapId;
  targetX: number;
  targetY: number;
  label: string;
}

export interface NPC {
  id: string;
  name: string;
  x: number;
  y: number;
  role: 'quest' | 'shop' | 'job';
  questId?: string;
  dialog: string[];
  color: string;
}

export interface MapData {
  id: MapId;
  name: string;
  bgType: 'henesys' | 'ellinia' | 'perion' | 'kerning' | 'mushmom_hill';
  bgMusicTempo: number;
  bgMusicScale: number[];
  width: number;
  height: number;
  platforms: Platform[];
  ladders: Ladder[];
  portals: Portal[];
  npcs: NPC[];
  monsterTypes: string[];
  maxMonsters: number;
}

export interface DamageText {
  id: string;
  x: number;
  y: number;
  damage: number;
  isCrit?: boolean;
  isPlayerHit?: boolean;
  isMiss?: boolean;
  timer: number;
  vy: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface Quest {
  id: string;
  title: string;
  npcName: string;
  reqLevel: number;
  targetMonsterId: string;
  targetCount: number;
  currentCount: number;
  rewardExp: number;
  rewardMesos: number;
  rewardItem?: InventoryItem;
  status: 'available' | 'in_progress' | 'completed';
  description: string;
}
