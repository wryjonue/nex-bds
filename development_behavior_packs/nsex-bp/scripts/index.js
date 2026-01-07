import { world, system } from "@minecraft/server";
import * as enums from "./enums.js";

system.afterEvents.scriptEventReceive.subscribe(evt => {
    if (evt.id == "admin:check-inventory") {
        const player = world.getPlayers({name : evt.message})[0];
        if (!player) {
            console.log("Player not found!");
            return;
        }
        const inv = player.getComponent("inventory").container;
        for (let i = 0; i < 36; i++) {
            const item = inv.getItem(i);
            if (!item) continue;
            console.log(`${item.amount}x ${item.typeId.replace("minecraft:","")}`);
        }
    } else if (evt.id == "admin:js") {
        console.log(eval(evt.message))
    }
});

world.beforeEvents.chatSend.subscribe(evt => {
    evt.cancel = true;
    const player = evt.sender;
    if (evt.message.startsWith("!")) {
        system.run(() => {
            if (evt.message.startsWith("!spectator") && player.hasTag("staff")) {
                player.runCommand("gamemode spectator");
                player.runCommand("effect @s night_vision infinite 0 true");
            } else if (evt.message.startsWith("!survival") && player.hasTag("staff")) {
                player.runCommand("gamemode s");
                player.runCommand("effect @s clear");
            } else if (evt.message.startsWith("!tp") && player.hasTag("staff")) {
                player.runCommand(evt.message.substring(1));
            } else if (player.hasTag("admin")) {
                player.runCommand(evt.message.substring(1))
            } else {
                player.sendMessage(" ! §cError §7:§r You don't have permission to use this command.");
            }
        });
    } else if (!enums.Titles[player.name]) {
        world.sendMessage(`${player.name} §7:§r ${evt.message}`);
    } else {
        if (!enums.Decors[player.name]) {
            world.sendMessage(`${enums.Titles[player.name]}\n\uE20F ${player.name}\n\uE20F §7└§r ${evt.message}`)
        } else {
            world.sendMessage(`${enums.Titles[player.name]}${enums.Decors[player.name]}\n\n\uE20F §7└§r ${evt.message}`)
        }
    }
    console.log(`${player.name} : ${evt.message}`);
});