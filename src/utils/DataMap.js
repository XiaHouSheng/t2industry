import recipeData from "./data/recipe.json" assert { type: "json" };
import itemData from "./data/item.json" assert { type: "json" };
import iconData from "./data/icon.json" assert { type: "json" };
import matData from "./data/material.json" assert { type: "json" };
import machineData from "./data/machine.json" assert { type: "json" };
import iconImage from "@/assets/img/icons.webp";
import { datafileToMachine } from "./MachineMap";

export const RecipeData = recipeData;
export const ItemData = itemData;
export const IconData = iconData;
export const MatData = matData;
export const MachineData = machineData;

export function gridStackDataProcess(machine) {
  const [width, height] = machine.machine.size ?? [1, 1];
  return `{"w":"${width}", "h":"${height}", "noResize":true, "id":"${
    datafileToMachine[machine.id]
  }"}`;
}

export function toSlot([itemId, count]) {
  const item = ItemData[itemId];
  return {
    itemId,
    count,
    icon: item.icon,
  };
}

export function iconStyle(iconId, cubeSize = 64) {
  const icon = IconData[iconId];
  if (!icon)
    return {
      border: "solid 1px",
    };
  const BASE_SIZE = 64;
  const scale = cubeSize / BASE_SIZE;

  // 原始 position，例如 "-128px -64px"
  const [x, y] = icon.position.split(" ").map((v) => parseFloat(v));

  return {
    backgroundImage: `url(${iconImage})`,
    backgroundColor: icon.color,

    // 只修改 position
    backgroundPosition: `${x * scale}px ${y * scale}px`,
  };
}
