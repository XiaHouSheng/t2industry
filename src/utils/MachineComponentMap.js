import { defineAsyncComponent, markRaw } from "vue";

const createAsyncMachineComponent = (loader) =>
  markRaw(defineAsyncComponent(loader));

const machineComponentLoaders = {
  conveyerbelt: () => import("../components/simulation/ConveyerBelt.vue"),
  pipe: () => import("../components/simulation/Pipe.vue"),
  refineryFurnace: () => import("../components/simulation/RefineryFurnace.vue"),
  crusher: () => import("../components/simulation/Crusher.vue"),
  accessoryMachine: () => import("../components/simulation/AccessoryMachine.vue"),
  shapingMachine: () => import("../components/simulation/ShapingMachine.vue"),
  seedHarvester: () => import("../components/simulation/SeedHarvester.vue"),
  planter: () => import("../components/simulation/Planter.vue"),
  equipmentComponentMachine: () =>
    import("../components/simulation/EquipmentComponentMachine.vue"),
  fillingMachine: () => import("../components/simulation/FillingMachine.vue"),
  packagingMachine: () => import("../components/simulation/PackagingMachine.vue"),
  grinder: () => import("../components/simulation/Grinder.vue"),
  protocolStorageBox: () =>
    import("../components/simulation/ProtocolStorageBox.vue"),
  protocolCore: () => import("../components/simulation/ProtocolCore.vue"),
  warehouseDepositPort: () =>
    import("../components/simulation/WarehouseDepositPort.vue"),
  warehouseWithdrawalPort: () =>
    import("../components/simulation/WarehouseWithdrawalPort.vue"),
  powerStation: () => import("../components/simulation/PowerStation.vue"),
  powerSupplier: () => import("../components/simulation/PowerSupplier.vue"),
  dismantlerMachine: () =>
    import("../components/simulation/DismantlerMachine.vue"),
  reactionPool: () => import("../components/simulation/ReactionPool.vue"),
  xiraniteFurnace: () => import("../components/simulation/XiraniteFurnace.vue"),
  liquidContainer: () => import("../components/simulation/LiquidContainer.vue"),
  liquidCleaner: () => import("../components/simulation/LiquidCleaner.vue")
};

export const machineComponentMap = Object.fromEntries(
  Object.entries(machineComponentLoaders).map(([key, loader]) => [
    key,
    createAsyncMachineComponent(loader),
  ]),
);

