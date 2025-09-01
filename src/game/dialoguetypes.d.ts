import { Source } from 'love.audio';
import { Image } from 'love.graphics';

// --- Building blocks ---
export interface Line {
    type: 'line';
    text: string;
    condition?: string;
}

export interface MultiLine {
    type: 'multi';
    lines: string[];
}

export interface ChoiceOption {
    text: string;
    goto: string;
    condition?: string;
    effects?: Effect[];
}

export interface Choice {
    type: 'choice';
    question: string;
    options: ChoiceOption[];
}

export type Content = Line | MultiLine | Choice;

interface Effect {
    set?: LuaTable<string, boolean | number | string>;
    shake?: [number, number, number, string];
}
// --- Dialogue ---
export interface DialogueEntry {
    id: string;
    speaker: string;
    speakerRight: string;
    sprite: string;
    condition?: string;
    spriteRight: string;
    type: 'lines' | 'choice';
    content?: string[]; // required if type = "lines"
    question?: string; // required if type = "choice"
    options?: ChoiceOption[]; // required if type = "choice"
    goto?: string;
    effects?: Effect[];
}

// --- Scene Objects ---
export interface SceneObject {
    id: string;
    sprite: string;
    hitbox: [number, number, number, number];
    position: [number, number];
    interactable: boolean;
    dialogue: DialogueEntry[];
}

// --- Scene ---
export interface SceneData {
    id: string;
    background: string;
    effects: Effect[];
    music?: string;
    start: DialogueEntry[];
    leave: DialogueEntry[];
    objects: SceneObject[];
    dialogues?: DialogueEntry[];
}

export interface IScene {
    background: Image;
    data: SceneData;
}
