import { Image, setColor, setLineWidth } from 'love.graphics';
import { Entity } from '../bliss/Entity';
import { input } from '../bliss/Input';
import { main } from '../bliss/Main';

export class Dialogue extends Entity {
    private fullDialogue: string[] = [
        'Okay okay okay, this time it"s for real, no more excuses, no more putting it off.',
        'I"ve been thinking about it for literally forever and every single time I back out at the last second.',
        'But not today, no sir, today is the day, today is the dawn of girlmode.',
        'Like, imagine me, actually doing it, actually committing, not just hovering on the edge.',
        'I"m talking hair, clothes, voice practice, the whole thing, all in, full send.',
        'Last time I said I was gonna start, I got distracted reorganizing my Steam library, which, okay, important, but not THAT important.',
        'And then the time before that I spent like three hours tweaking my dotfiles because "aesthetic matters,” which is true, but still.',
        'No more side quests. No more procrastination disguised as productivity.',
        'Step one: clothes. I literally already have the cute hoodie, the skirt, the socks, the whole package.',
        'They"re just sitting there in my closet like "hey girl, when you gonna wear us?” and I"m like "soon!!”',
        'Well, soon is now. Today is the soon that future me kept promising.',
        'Step two: hair. I have like twenty tabs open about styling tips and somehow ended up watching tutorials about heatless curls at 3 AM.',
        'I don"t even have the right hair length yet, but still, manifesting it is important, right?',
        'Step three: voice training. Ugh, the bane of my existence.',
        'Every time I try I sound like a YouTuber doing a bad anime impression.',
        'But practice makes perfect, and perfect makes girlmode unstoppable.',
        'And don"t even get me started on makeup. That"s like the final boss.',
        'I bought eyeliner once and then just stared at it for six months like it was a cursed artifact.',
        'But if I can figure out Vim, I can figure out eyeliner. Same principle, right?',
        'And like, socially, that"s the scary part.',
        'The "what if everyone stares” part, the "what if they know” part.',
        'But then again, who cares? If they stare, it means I"m dazzling.',
        'If they know, it means I"m visible. That"s the point, isn"t it?',
        'I"m tired of being invisible, tired of being half-me.',
        'So yeah, today I"m doing it. No maybes, no "a`ter one more episode,” no "tomorrow for sure.”',
        'I"m walking out the door in girlmode, and the world is just gonna have to deal with it.',
        'Because honestly, I"ve dealt with enough of myself not doing it.',
        'This time it"s real. This time it"s happening. This time it"s girlmode o"clock.',
        'And if I chicken out, well, I"m writing this down so future me can laugh at past me.',
        'But no. Not this time. This time, future me is gonna thank me.',
        'Future me is gonna look back and say, "that was the day everything changed.”',
        'Girlmode unlocked. Achievement: lifelong dream finally attempted.',
        'Okay okay, I"m hyping myself up too much, I should just breathe.',
        'But if I stop hyping, I"ll hesitate, and if I hesitate, I"ll spiral, and if I spiral, I"ll end up watching tier lists of anime openings instead of leaving the house.',
        'So no spiraling. Only forward momentum. Girlmode momentum.',
        'That"s the plan. That"s THE plan. Today is the day. Today is girlmode.',
    ];

    public portrait: Image;
    public currentText: string = '';
    public dialogueidx: number = 0;

    constructor() {
        super(0, 0);
        this.nextDialogue();
        this.portrait = love.graphics.newImage('assets/images/player1.png');
    }

    nextDialogue() {
        let idx = 0;
        this.timer.every(0.01, () => {
            this.currentText = this.fullDialogue[this.dialogueidx].slice(0, idx);
            idx++;
            if (idx > this.fullDialogue[this.dialogueidx].length) return false;
        });
    }
    override update(dt: number): void {
        super.update(dt);
        if (input.pressed('fire2') && this.dialogueidx < this.fullDialogue.length - 1) {
            this.nextDialogue();
            this.dialogueidx++;
        }
    }

    override render(): void {
        const font = love.graphics.getFont();
        const percent = font!.getWidth(this.fullDialogue[this.dialogueidx]) / main.width;
        const height = font!.getHeight();

        setColor(0, 0, 0);
        love.graphics.rectangle('fill', 0, 0, main.width, math.max(height * math.ceil(percent), 64 + 20));
        setLineWidth(2);
        setColor(1, 1, 1);
        love.graphics.draw(this.portrait, 4, 4);
        love.graphics.rectangle('line', 0, 0, main.width, math.max(height * math.ceil(percent), 64 + 20));

        // print('lenght: ', this.fullDialogue[this.dialogueidx].length);
        // let limit = this.fullDialogue[this.dialogueidx].length / percent;
        // if (percent < 1) limit = 9999;
        // print(limit);
        // limit : 0.8 => 20% greater than the width so we calcualte

        love.graphics.printf(this.currentText, 64 + 10, 10, main.width - 20 - 64, 'left');
    }
}
