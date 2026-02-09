import { defineAsyncComponent, markRaw } from "vue";

export const machineComponentMap = {
  conveyerbelt: markRaw(
    defineAsyncComponent(
      () => import("../components/simulation/ConveyerBelt.vue"),
    ),
  ),

  pipe: markRaw(
    defineAsyncComponent(() => import("../components/simulation/Pipe.vue")),
  ),

  refineryFurnace: markRaw(
    defineAsyncComponent(
      () => import("../components/simulation/RefineryFurnace.vue"),
    ),
  ),

  crusher: markRaw(
    defineAsyncComponent(() => import("../components/simulation/Crusher.vue")),
  ),

  accessoryMachine: markRaw(
    defineAsyncComponent(
      () => import("../components/simulation/AccessoryMachine.vue"),
    ),
  ),

  shapingMachine: markRaw(
    defineAsyncComponent(
      () => import("../components/simulation/ShapingMachine.vue"),
    ),
  ),

  seedHarvester: markRaw(
    defineAsyncComponent(
      () => import("../components/simulation/SeedHarvester.vue"),
    ),
  ),

  planter: markRaw(
    defineAsyncComponent(() => import("../components/simulation/Planter.vue")),
  ),

  equipmentComponentMachine: markRaw(
    defineAsyncComponent(
      () => import("../components/simulation/EquipmentComponentMachine.vue"),
    ),
  ),

  fillingMachine: markRaw(
    defineAsyncComponent(
      () => import("../components/simulation/FillingMachine.vue"),
    ),
  ),

  packagingMachine: markRaw(
    defineAsyncComponent(
      () => import("../components/simulation/PackagingMachine.vue"),
    ),
  ),

  grinder: markRaw(
    defineAsyncComponent(() => import("../components/simulation/Grinder.vue")),
  ),

  protocolStorageBox: markRaw(
    defineAsyncComponent(
      () => import("../components/simulation/ProtocolStorageBox.vue"),
    ),
  ),

  protocolCore: markRaw(
    defineAsyncComponent(
      () => import("../components/simulation/ProtocolCore.vue"),
    ),
  ),

  warehouseDepositPort: markRaw(
    defineAsyncComponent(
      () => import("../components/simulation/WarehouseDepositPort.vue"),
    ),
  ),

  warehouseWithdrawalPort: markRaw(
    defineAsyncComponent(
      () => import("../components/simulation/WarehouseWithdrawalPort.vue"),
    ),
  ),

  powerStation: markRaw(
    defineAsyncComponent(
      () => import("../components/simulation/PowerStation.vue"),
    ),
  ),

  powerSupplier: markRaw(
    defineAsyncComponent(
      () => import("../components/simulation/PowerSupplier.vue"),
    ),
  ),

  dismantlerMachine: markRaw(
    defineAsyncComponent(
      () => import("../components/simulation/DismantlerMachine.vue"),
    ),
  ),

  reactionPool: markRaw(
    defineAsyncComponent(
      () => import("../components/simulation/ReactionPool.vue"),
    ),
  ),

  xiraniteFurnace: markRaw(
    defineAsyncComponent(
      () => import("../components/simulation/XiraniteFurnace.vue"),
    ),
  ),

  liquidContainer: markRaw(
    defineAsyncComponent(
      () => import("../components/simulation/LiquidContainer.vue"),
    ),
  ),
};
