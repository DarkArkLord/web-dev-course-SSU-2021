import { createTextController, ButtonsConfig } from "./textController";

export const helpController = createTextController(['Помостч', ], { buttons: ButtonsConfig.onlyBack, addCounter: false }).first;