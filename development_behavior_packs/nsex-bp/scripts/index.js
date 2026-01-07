import { world } from "@minecraft/server";

world.beforeEvents.chatSend.subscribe((evt) => {
    evt.message.cancel = true;
    //test
})