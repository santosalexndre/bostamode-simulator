: As you're about to reach the shop you see your uncle's truck at the entrance. It looks like he's just arrived.
: ... Why do people even have cars? I can literally go anywhere with my bike *and* faster!
: He opens the door, but you wonder if it's actually your uncle. His sudden change in apperance surprises you--
: --Oh my god, his wife wasn't enough, now even he got plastic surgeries!
: God I hate cis people so much, they can have their gender afirming procedures like that and no one bats an eye 
: But when I--
(uncle): Oh, hello *******(You). How are you doing?

<question> (you*, uncle): Hi--
[ Comment about his apperance ] -> #comment
[ Dont comment ] -> #nocomment
</question>

#comment
(you*, uncle): Wow..so you did get surgery! You look different. For the better, I mean!
(you*, uncle): It's like you have a permanent Instagram Filter.
(you, uncle*): Ha! Thanks for noticing. Yeah, did a few touch ups here and there. My wife insisted on it. She says I look ten years younger.
(you*, uncle): Careful, or people will start to mistake you for my cousin. That'd be awkward!
(you, uncle*): And people will mistake you for a girl with that haircut of yours!
<question> (you*, uncle): ... Well
[ Thats the intention! ] -> #intetion
[ Laugh it off ] -> #laughoff
</question>
#end

#intetion
{set girlMeter += 1 }
(you*, uncle): Yeah, that's the plan!
(you, uncle*): Really? Uh... you do you then... um... it's your ass anyways, I don't care.
(you, uncle*): Uhmm... glad you're back at the shop though, you are the only competent guy around here.
#end

#laughoff
(you*, uncle): haha... who knows, maybe I just like confusing people.
(you, uncle*): Heh, fair enough. Anyway, glad you're back at the shop. I swear you're my only good employee, you know that?  
#end

#nocomment
(you*, uncle): Hi uncle, I'm doing great. What about you?
(you, uncle*): I'm good, thanks for asking. And, hey, I'm glad you're back at the shop. I swear you're my only good employee.
#end

(you*, uncle): Uhm, I dunno. I'm pretty average
(you, uncle*): Don't undersell yourself, you are a pro with the computer. That's a highly valuable skill these days.
(you*, uncle): Hm... I suppose it is. It's all I ever do anyways. If I wasn't good at it, I'd be as useful as a summer ant.

<question> (you, uncle*): Speaking of which, I've got some things for your to-do list today.
[ Ask about brother's posters ] -> #posters
[ Let him continue ] -> #dailytask
</question>

#dailytask
(you*, uncle): Yeah, sure boss, I'm getting paid for it anyways, right?
(you, uncle*): Exactly. I'll be in the back if you need me. And hey, don't let your colleagues bother you. You have to stand up for youself sometimes you know...
#end

#posters
(you*, uncle): Mind if I start the day with some posters my brother asked me to print?
(you, uncle*): Posters, huh? Let me guess... anime again? I hope it's not some half-naked ninja girl. But sure, why not. I'll be in the back if you need anything.
#end

(you*, uncle): okay, bye.
