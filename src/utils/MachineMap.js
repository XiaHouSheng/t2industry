export const machineDataFileMap = {
  refineryFurnace: "furnance_1",
  crusher: "grinder_1",
  accessoryMachine: "cmpt_mc_1",
  shapingMachine: "shaper_1",
  seedHarvester: "seedcol_1",
  planter: "planter_1",
  equipmentComponentMachine: "winder_1",
  fillingMachine: "filling_pd_mc_1",
  packagingMachine: "tools_asm_mc_1",
  grinder: "thickener_1",
  powerStation: "power_sta_1",
  // —— jinlong 专属 —— | 这里还没有做组件，后续直接生成
  dismantlerMachine: "dismantler_1",
  reactionPool: "mix_pool_1",
  xiraniteFurnace: "xiranite_oven_1",
  waterPump: "pump_1", //水泵需要从蓝图区域外拉，暂不添加
};

export const machineNameMap = {
  conveyerbelt: "传送带",
  refineryFurnace: "精炼炉",
  crusher: "粉碎机",
  accessoryMachine: "配件机",
  shapingMachine: "塑型机",
  seedHarvester: "采种机",
  planter: "种植机",
  equipmentComponentMachine: "装备原件机",
  fillingMachine: "罐装机",
  packagingMachine: "封装机",
  grinder: "研磨机",
  protocolStorageBox: "存储箱",
  protocolCore: "协议核心",
  warehouseDepositPort: "存货口",
  warehouseWithdrawalPort: "取货口",
  powerStation: "热能池",
  powerSupplier: "供电桩",
  // —— 武陵 专属 —— | 这里还没有做组件，后续直接生成
  dismantlerMachine: "拆解机",
  reactionPool: "反应池",
  waterPump: "水泵",
  xiraniteFurnace: "天有洪炉",
  liquidContainer: "储液罐",
};

// 反向映射：中文名称 → 英文 key（方便根据中文查英文）
export const machineKeyByCN = Object.fromEntries(
  Object.entries(machineNameMap).map(([key, name]) => [name, key]),
);

// 反向查找
export const datafileToMachine = Object.fromEntries(
  Object.entries(machineDataFileMap).map(([key, name]) => [name, key]),
);
