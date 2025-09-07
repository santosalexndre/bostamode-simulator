! talkedWithMom == true ! -> #again

{ set talkedWithMom = true }
: You see your mom, and, unfortunatelly your dad also
: She has already made coffe and breakfast, it smells really nice.
(you): Good morning mom.
(you, mom*): Hi, morning son.
(you, dad*): Good morning. Hmph, didn't expect to see you this early in the morning, have you finally fixed your sleeping schedule?
(you*, dad): Well, I'm trying to, I'm going back to work at the printing shop, so...
(you, mom*): Oh that's really nice darling. How are you doing, you look brither today, happier.
(you*, mom): Um, yeah, I sure am happier.
(you, mom*): That's nice to hear. I was worried about you. You've been quite distant lately
(you, mom*): Btw, aren't you starting university next week? How are you planning to juggle that with the shop?
(you*, mom): Well, im going to working part time only. Uncle and I worked out a deal.
: Your mom stops for a second and squint her eyes 
(you, mom*): ...did you... do something with your hair? 
(you*, mom): Huh? Uhm, maybe?... I did switch my shampoo recently.
(you, mom*): It surely looks amazing! I bet the girls will be envious of your hair!
(you, dad*): You should cut it, it makes you look like a fa--
: Your dad was clearly about to start his daily ramble but your mom shuts him up before he can say anything.

<question> (you, mom*): Why don't you drink some coffe before you head out?
[ Take a sip ] -> #sipyes
[ No thanks ] -> #nevermind
</question>

#sipyes
(you): Uhum.
! caffeine == nill || caffeine == 0 ! -> #coffe1
! caffeine == 1 ! -> #coffe2
! caffeine == 2 ! -> #coffe3
! caffeine == 3 ! -> #coffe4
! caffeine == 4 ! -> #nevermind
#end

#coffe1
: ... You take a sip of coffe ...
{ set caffeine = 1 }
-> #break
#end

#coffe2
: ... You take another sip of coffe ...
{ set caffeine = 2 }
-> #break
#end

#coffe3
: ... You drink even more coffe ...
{ set caffeine = 3 }
-> #break
#end

#coffe4
(mother): Aren't you exageratting a bit son?
: ... Sorry!
{ set caffeine = 4 }
-> #break
#end


#nevermind
! caffeine != nil && caffeine >= 0 ! (you): No thanks, I've had enough
#end

#again
<question> : Drink more coffe?
[ Take a sip ] -> #sipyes
[ No thanks ] -> #nevermind
</question>

-> #break
#end


