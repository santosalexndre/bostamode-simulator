// export interface DialogueCondition {}
export type DialogueConditions = string;

export interface DialogueEffect {
    name: string;
    args: string;
}

export interface DialogueJumpTo {
    condition: DialogueConditions;
    true?: string;
    default: string;
}

export interface DialogueOption {
    conditions?: DialogueConditions;
    effects: DialogueEffect[];
    jumpTo: DialogueJumpTo;
    text: string;
}

export interface DialogueEntry {
    speakers?: { left?: string | undefined; right?: string | undefined; current: string };
    text?: string;
    options?: DialogueOption[];
    conditions?: DialogueConditions;
    effects?: DialogueEffect[];
    jumpTo?: DialogueJumpTo;
    type: 'question' | 'lines' | 'pipe';
}
export type DialogueScript = Record<string, DialogueEntry[]>;
