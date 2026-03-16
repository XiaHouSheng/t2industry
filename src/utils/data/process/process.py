import json
from pathlib import Path
import os
#数据来源为endfield-lab 中的data.json文件
#icon来源于endfield-lab 中的icons.webp文件夹
print()
base_dir = Path(__file__).parent.resolve()

output_path = os.path.join(base_dir, "output")
input_path = os.path.join(base_dir, "data.json")

json_file = open(input_path, "r", encoding= "utf-8")
data_json = json.load(json_file)

input_icon = data_json["icons"]
input_item = data_json["items"]
input_recipe = data_json["recipes"]

output_icon = {}
output_item = {}
output_machine = []
output_material = []
output_recipe = {}

#process-icon
for icon in input_icon:
    icon_id = icon["id"]
    output_icon[icon_id] = icon
#process-item
for item in input_item:
    item_id = item["id"]
    output_item[item_id] = item
#process-machine / process-material
for item in input_item:
    target_category = item["category"]
    if target_category == "machine":
        output_machine.append(item)
        output_recipe[item["id"]] = {}
    if target_category == "material":
        output_material.append(item)
#process-recipe
for target_recipe in input_recipe:
    producer = target_recipe["producers"][0]
    target_output_id = target_recipe["id"]
    output_recipe[producer][target_output_id] = target_recipe

save_config = {
    "icon": output_icon,
    "item": output_item,
    "machine": output_machine,
    "material": output_material,
    "recipe": output_recipe
}

for filename in save_config.keys():
    output_file_path = os.path.join(base_dir, "output", "{}.json".format(filename))
    output_file_pre = json.dumps(save_config[filename],ensure_ascii= False, indent= 2)
    output_file = open(output_file_path, "w", encoding= "utf-8")
    output_file.write(output_file_pre)
    output_file.close()
    print("[ProcessData] 配置文件处理：{}.json 处理完毕！".format(filename))