interface InspectOptions {
    depth?: number;
    newline?: string;
    indent?: string;
    process?: ProcessFunction;
}

type ProcessFunction = (item: any, path: any[]) => any;

interface Inspect {
    _VERSION: string;
    _URL: string;
    _DESCRIPTION: string;
    _LICENSE: string;
    KEY: object;
    METATABLE: object;

    (this: void, root: any, options?: InspectOptions): string;

    inspect(root: any, options?: InspectOptions): string;
}

interface Inspector {
    buf: string[];
    depth: number;
    level: number;
    ids: Map<any, number>;
    newline: string;
    indent: string;
    cycles: Map<object, number>;
    putValue(v: any): void;
    getId(v: any): string;
}

// Optional: export a const instance for convenience
export const inspect: Inspect;
declare var trace: (this: void, root: any) => void;
