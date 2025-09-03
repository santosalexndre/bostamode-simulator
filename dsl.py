import re
import json

def parse_dsl(text):
    lines = text.splitlines()
    nodes = []
    maps = {}
    current_node = None
    in_map = False
    in_question = False
    current_question = None

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Map section
        if line.startswith("#map"):
            in_map = True
            continue
        if line.startswith("#endmap"):
            in_map = False
            continue
        if in_map:
            m = re.match(r"\((.*?)\)\s*=\s*{(.*)}", line)
            if m:
                maps[m.group(1)] = m.group(2).strip()
            continue

        # Question block
        if line.startswith("<Question>"):
            in_question = True
            current_question = {
                "id": None,
                "type": "choice",
                "question": "",
                "options": []
            }
            continue
        if line.startswith("</Question>"):
            in_question = False
            nodes.append(current_question)
            current_question = None
            continue

        if in_question:
            if line.startswith("["):
                # choice line
                m = re.match(r"\[(.*?)\](?:\s*->\s*(#\w+))?", line)
                if m:
                    text = m.group(1).strip()
                    goto = m.group(2)[1:] if m.group(2) else None
                    cond = None
                    if "!" in text:
                        parts = text.split("!")
                        text = parts[0].strip()
                        cond = parts[1].strip()
                    opt = {"text": text}
                    if goto:
                        opt["goto"] = goto
                    if cond:
                        opt["condition"] = cond
                    current_question["options"].append(opt)
            else:
                # question text
                sp, content = line.split("):", 1)
                current_question["question"] = content.strip()
            continue

        # Dialogue line
        m = re.match(r"\(\((.*?)\)\)(?::|\s*\*)(.*)", line)
        if m:
            speaker = m.group(1).strip()
            text = m.group(2).strip(": ").strip()
            nodes.append({
                "id": "auto_" + str(len(nodes) + 1),
                "speaker": speaker,
                "type": "lines",
                "content": [text]
            })
            continue

        # Goto
        if line.startswith("{goto"):
            target = line.split()[1].strip("}")
            nodes.append({"goto": target})
            continue

        # Conditional
        if line.startswith("!"):
            cond, text = line[1:].split(":", 1)
            nodes.append({
                "id": "auto_" + str(len(nodes) + 1),
                "type": "lines",
                "condition": cond.strip(),
                "content": [text.strip()]
            })
            continue

    return nodes


dsl = open("ClerkDialogue.dsl").read()
parsed = parse_dsl(dsl)
print(json.dumps(parsed, indent=4))

