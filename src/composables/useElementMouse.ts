import { reactive } from "vue"

import type { Ref } from "vue"
const buttonsMap: Record<number, string> = {
    0: "left",
    1: "middle",
    2: "right"
}
export const useElementMouse = (element: Ref<HTMLElement | undefined>) => {
    const mouse = reactive({
        x: 0,
        y: 0,
        onElement: false,
        dragging: false,
        mouseButtons: {
            left: false,
            right: false,
            middle: false
        }
    });

    const allButtonsToFalse = () => {
        mouse.mouseButtons.left = false;
        mouse.mouseButtons.right = false;
        mouse.mouseButtons.middle = false;
    }

    const onmousemove = (e: MouseEvent) => {
        if(!element.value) return;
        const rect = element.value.getBoundingClientRect();

        const x = e.clientX - rect.left
        const y = e.clientY - rect.top;

        mouse.onElement = true;
        if(e.buttons) {
            allButtonsToFalse();
            if(e.buttons === 1) {
                mouse.mouseButtons.left = true;
            }
            if(e.buttons === 2) {
                mouse.mouseButtons.right = true;
            }
            if(e.buttons === 4) {
                mouse.mouseButtons.middle = true;
            }
        }
        if(mouse.mouseButtons.left) {
            console.log("mouse.mouseButtons.left", mouse.mouseButtons.left);
        }
        if((Math.abs(mouse.x - x) > 2|| Math.abs(mouse.y - y) > 2) && mouse.mouseButtons.left) {
            console.log("dragging");
            mouse.dragging = true;
        }
        mouse.x = x;
        mouse.y = y;
    }

    const onmouseleave = () => {
        mouse.x = 0;
        mouse.y = 0;
        allButtonsToFalse();
        mouse.onElement = false;
        mouse.dragging = false;
    }

    const onmousedown = (e: MouseEvent) => {
        if(!element.value) return;
        if(e.buttons) {
            allButtonsToFalse();
            if(e.buttons === 1) {
                mouse.mouseButtons.left = true;
            }
            if(e.buttons === 2) {
                mouse.mouseButtons.right = true;
            }
            if(e.buttons === 4) {
                mouse.mouseButtons.middle = true;
            }
        }
    }
    const onmouseup = (e: MouseEvent) => {
        if(!element.value) return;
        allButtonsToFalse();
        mouse.dragging = false;
        console.log("mouse.dragging", mouse.dragging);
    }
    
    return {
        mouse,
        events: {
            onmousemove,
            onmouseleave,
            onmousedown,
            onmouseup
        }
    };
}