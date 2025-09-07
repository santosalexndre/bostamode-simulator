! brother1Again == true ! -> #again
{ set brother1Again = true }
{ set talkedWithBrother = true }

: You see your brother is tying his shoes, ready to go to school.
: He is just a freshman but already more mature than me... already living his best life... nothing like me
: But... not for long I hope.
(you): H-hey, good morning. Um... you said you wanted something?
(you, brother*): Oh hello, well I want you to give me your opinion on these anime posters I want for my bedroom.
: wow, anime again, he is such a weeb.
: He grabs his phone and shows you an image of the entire cast of jujutsu kaisen in cool poses
: Then an image of kakashi from naruto.
: Then an image of an almost naked lady from some anime you don't recognize
-> #question1

#question1
<question> (you, brother*): So which one you think would look cooler in my room?
[ Kakashi ] -> #kakashi
[ Jujutsu Kaisen ] -> #jujutsu
! hentaiQuestion == false ! [ Hentai? Seriously? ] -> #hentai
</question>
#end

#hentai
: Why are men like this...
(you*, brother): Hentai? Seriously? Just imagine how weird would it be if someone walked into your room with that on the wall
(you, brother*): It's not hentai, it's art. And you're the only one who thinks it weird.
(you, brother*): Im sure if it was some yaoi boys you wouldn't care.
(you*, brother): W-what??
(you, brother*): Anyways, which one looks better?
: He pushes his phone closer to your face, still waiting for an answer.
{ set hentaiQuestion = true }
-> #question1
#end

#kakashi
(you*, brother): I think jujutsu kaisen is overrated garbage, there, I said it. So I'd go with the kakashi poster. Naruto is a classic.
(you, brother*): Hmm, I dont think I agree with your jujutsu take but this poster indeed looks cooler. Thanks.
#end

#jujutsu
(you*, brother): I'm not really a fan of jujutsu kaisen but aesthetically speaking I think this post looks cooler.
(you, brother*): I think I agree.
#end

(you, brother*): So... I don't wanna bother but if you're heading to the shop anyways would you mind printing this poster for me?
(you, brother*): You are literally the ONLY guy who knows what he is doing in the shop.
: ... Ouch. Wish he wouldn't misgender me every chance he gets
: ... Though, it isn't really his fault, is it?
<question> (you, brother) :...
[ Sure ] -> #sure
[ No ] -> #no
</question>

#sure
(you*, brother): yeah, sure, thats easy peazy.
(you, brother*): Ok, thanks, knew I could count on you.
#end

#no
(you*, brother): I can try but I have a lot of work to do and you know how uncle is. And I really need the money right now
(you, brother*): hmm, that's a bummer, but thanks anyway. 
#end

#again
(you, brother*): Need something?
-> #break
#end
