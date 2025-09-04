import { trace } from '../../libraries/inspect';
import { DialogueConditions, DialogueEntry, DialogueScript } from './Interfaces';

type GameState = any;

export const evaluateCondition = (expr: string | undefined, context: GameState): boolean => {
    // 1. Normalize operators to Lua syntax
    if (expr == undefined) return true;

    let luaExpr;
    [luaExpr] = string.gsub(expr, '&&', ' and ');
    [luaExpr] = string.gsub(luaExpr, '%|%|', ' or ');
    [luaExpr] = string.gsub(luaExpr, '!=', '~= ');
    [luaExpr] = string.gsub(luaExpr, '!%s', 'not ');
    [luaExpr] = string.gsub(luaExpr, '==%s*true', '== true');
    [luaExpr] = string.gsub(luaExpr, '==%s*false', '== false');

    // 2. Find identifiers (variables)
    for (const [varName] of string.gmatch(expr, '[%a_][%w_]*')) {
        if (!(varName in context) && varName !== 'true' && varName !== 'false') {
            // Replace unknown variable with false
            const pattern = varName;
            [luaExpr] = string.gsub(luaExpr, pattern, 'false');
        }
    }

    // 2. Replace variable names with context lookups
    for (const [key, value] of pairs(context)) {
        const pattern = key.toString(); // word boundary
        if (type(value) === 'string') {
            [luaExpr] = string.gsub(luaExpr, pattern, `"${value}"`);
        } else {
            [luaExpr] = string.gsub(luaExpr, pattern, tostring(value as any));
        }
    }

    // 3. Build Lua function to evaluate expression
    const tmpFile = love.filesystem.write('condition.lua', 'return ' + luaExpr);
    const [fn] = love.filesystem.load('condition.lua');
    if (!fn) return false;

    const [ok, result] = pcall(fn);
    if (!ok) return false;

    return result || false;
};

const parseGoto = (s: string | undefined) => {
    if (s === undefined) return;
    const [parts] = string.match(s, '%-%>%s*(.+)$');

    const result = new LuaTable();

    if (parts !== undefined) {
        // result.gotos = new LuaTable();
        // result.condition

        for (const [gotostr] of string.gmatch(parts, '[^;]+')) {
            const [cond, id] = string.match(gotostr, '!?(.-)!%s*#([%w_]+)');
            if (id !== undefined) {
                //@ts-expect-error
                result.condition = cond !== '' ? cond : null;
                //@ts-expect-error
                result.true = id;
            } else {
                const [simpleId] = string.match(gotostr, '#([%w_]+)');
                if (simpleId !== '') {
                    //@ts-expect-error
                    result.default = simpleId;
                } else {
                    //@ts-expect-error
                    result.true = simpleId;
                }
            }
        }
    }

    return result;
};

const parseEffects = (s: string | undefined): { name: string; args: string } | undefined => {
    if (s === undefined) return;

    const [inside] = string.match(s, '{(.-)}');
    const effects = new LuaTable();
    if (inside === undefined) return;

    for (let [fx] of string.gmatch(inside, '[^,]+')) {
        [fx] = string.match(fx, '^%s*(.-)%s*$');

        const [name, args] = string.match(fx, '^(%S+)%s*(.*)$');
        if (name) {
            //@ts-expect-error
            table.insert(effects, { name, args });
        }
    }

    // if (inside !== undefined) {
    //     for (const [name, args] of string.gmatch(inside, '(%w+)%s*%((.-)%)')) {
    //         //@ts-expect-error
    //         table.insert(results, { name, args });
    //     }
    // }

    //@ts-expect-error
    return effects;
};

const parseText = (s: string | undefined) => {
    if (s === undefined) return;
    const [beforegoto] = string.match(s, '^(.-)%-%>');
    let text = '';
    if (beforegoto !== undefined && beforegoto !== '') {
        [text] = string.match(beforegoto, ':(.*)$');
    } else {
        [text] = string.match(s, ':(.*)$');
    }
    // const [text] = string.gsub(s, '%-%>%s*#([%w_]+)%s*$', '');
    if (text !== undefined) return text.trim();
};

const parseSpeakers = (s: string | undefined) => {
    if (s === undefined) return;

    const [content] = string.match(s, '%((.-)%)');
    if (content === undefined) return;

    const values: string[] = [];
    let current: string | undefined;

    for (const [v] of string.gmatch(content, '[^,]+')) {
        let value = v.trim();
        if (value.endsWith('*')) {
            value = value.slice(0, -1).trim();
            current = value;
        }
        if (value !== '') {
            values.push(value);
        }
    }

    if (values.length === 1) {
        return { left: values[0], current };
    } else if (values.length === 2) {
        return { left: values[0], right: values[1], current };
    } else {
        return { current };
    }
};
// const parseSpeakers = (s: string | undefined) => {
//     if (s === undefined) return;
//     const [content] = string.match(s, '%((.-)%)');
//     if (content === undefined) return;

//     // const values = { left: undefined, right: undefined };
//     const values = [];
//     for (const [v] of string.gmatch(content, '[^,]+')) {
//         const value = v.trim();
//         if (value !== '') {
//             values.push(value);
//         }
//     }

//     if (values.length == 1) {
//         return { left: values[0] };
//     } else if (values.length == 2) {
//         return { left: values[0], right: values[1] };
//     } else {
//         return {};
//     }
// };

export const parseConditions = (s: string | undefined) => {
    if (s === undefined) return;
    const [beforeGoto] = string.match(s, '^(.-)%-%>');
    if (beforeGoto) {
        const [condition] = string.match(beforeGoto, '!(.-)!');
        return condition;
    } else {
        return string.match(s, '!(.-)!')[0];
    }
};

const parseLine = (line: string) => {};

export const parseDialogue = (filePath: string): DialogueScript => {
    const entries: DialogueScript = new LuaTable() as any;

    let state = 'lines';
    let jumpId = '';
    let currentEntry: Record<string, any> = new LuaTable() as any;
    entries['default'] = [];

    let entryId = '';

    const addEntry = (entry: any) => {
        const bucket = entryId !== '' ? (entries[entryId] ??= []) : entries['default'];
        table.insert(bucket, entry);
    };

    const handleEnd = () => {
        entryId = '';
    };

    const handleSection = (line: string) => {
        [entryId] = string.gsub(line, '#', '');
    };

    const handleQuestionStart = (speakers: any, text: string, condition: any, effects: any) => {
        currentEntry = new LuaTable();
        currentEntry.speakers = speakers;
        currentEntry.text = text;
        currentEntry.type = 'question';
        currentEntry.options = [];
        currentEntry.conditions = condition;
        currentEntry.effects = effects;
        state = 'question';
    };

    const handleQuestionEnd = () => {
        state = 'lines';
        addEntry(currentEntry);
    };

    const handleQuestionOption = (buttonText: string, condition: any, go_to: any, effects: any) => {
        table.insert(currentEntry.options, {
            text: buttonText,
            conditions: condition,
            jumpTo: go_to,
            effects: effects,
        });
    };

    const handleLine = (speakers: any, text: string, condition: any, effects: any, go_to: any) => {
        currentEntry = new LuaTable();
        currentEntry.speakers = speakers;
        currentEntry.text = text;
        currentEntry.type = text !== undefined ? 'lines' : 'pipe';
        currentEntry.conditions = condition;
        currentEntry.effects = effects;
        currentEntry.jumpTo = go_to;
        addEntry(currentEntry);
    };

    for (const line of love.filesystem.lines(filePath)) {
        const trimmed = line.trim();

        if (trimmed !== '' && !line.startsWith('//')) {
            if (trimmed === '#end') {
                handleEnd();
            } else if (line.startsWith('#')) {
                handleSection(line);
                // [entryId] = string.gsub(line, '#', '');
            } else {
                const go_to = parseGoto(line);
                const effects = parseEffects(line);
                const condition = parseConditions(line);
                const speakers = parseSpeakers(line);
                const text = parseText(line);
                const [buttonText] = string.match(line, '%[(.-)%]');

                if (line.startsWith('<question>')) {
                    handleQuestionStart(speakers, text!, condition, effects);
                } else if (line.startsWith('</question>')) {
                    handleQuestionEnd();
                } else if (state === 'question') {
                    handleQuestionOption(buttonText, condition, go_to, effects);
                } else if (state === 'lines') {
                    handleLine(speakers, text!, condition, effects, go_to);
                }
            }
        }

        // const go_to = parseGoto(line);
        // const effects = parseEffects(line);
        // const condition = parseConditions(line);
        // const speakers = parseSpeakers(line);
        // const text = parseText(line);
        // const [buttonText] = string.match(line, '%[(.-)%]');

        // if (line.trim() === '#end') {
        //     entryId = '';
        //     continue;
        // } else if (line.startsWith('#')) {
        //     [entryId] = string.gsub(line, '#', '');
        //     continue;
        // }

        // if (line.startsWith('<question>')) {
        //     currentEntry = new LuaTable();
        //     currentEntry.speakers = speakers;
        //     currentEntry.text = text;
        //     currentEntry.type = 'question';
        //     currentEntry.options = [];
        //     currentEntry.conditions = condition;
        //     currentEntry.effects = effects;
        //     state = 'question';
        //     continue;
        // }

        // if (line.startsWith('</question>')) {
        //     state = 'lines';
        //     if (entryId !== '') {
        //         if (!entries[entryId]) entries[entryId] = [];
        //         table.insert(entries[entryId], currentEntry);
        //     } else {
        //         table.insert(entries['default'], currentEntry);
        //     }
        //     continue;
        // }

        // if (state === 'question') {
        //     table.insert(currentEntry.options, {
        //         text: buttonText,
        //         conditions: condition,
        //         jumpTo: go_to,
        //         effects: effects,
        //     });
        // } else if (state === 'lines') {
        //     currentEntry = new LuaTable();
        //     currentEntry.speakers = speakers;
        //     currentEntry.text = text;
        //     currentEntry.type = text !== undefined ? 'lines' : 'pipe';
        //     currentEntry.conditions = condition;
        //     currentEntry.effects = effects;
        //     currentEntry.jumpTo = go_to;
        //     // if (currentEntry.type == 'pipe') error('teste');
        //     if (entryId !== '') {
        //         if (!entries[entryId]) entries[entryId] = [];
        //         table.insert(entries[entryId], currentEntry);
        //     } else {
        //         table.insert(entries['default'], currentEntry);
        //     }
        // }
    }

    return entries;
};
