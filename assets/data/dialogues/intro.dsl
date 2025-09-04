(you*, mom): Good morning, mom! What's for breakfast?
(you, mom*): Morning, dear. I made pancakes and eggs. Sit down.

(you*, dad): Morning, dad! Did you already read the newspaper?
(you, dad*): Of course. Same old news, but I saved the comics for you.

(you*, brother): Hey bro, you look half asleep.
(you, brother*): And you look too awake. What's your secret?

: ...I don't really feel hungry this morning.
: ...Should I tell them, or just play along?

<question> (you): What do?
[ Ask for help about the test ] -> #askHelp
[ Pretend everything's fine ] -> #pretendFine
[ Slip out quietly ] -> #slipOut
</question>

#askHelp
(you*, mom): Hey mom, could you help me review for my test later?
(you, mom*): Of course! I'll make some flashcards with you tonight.
(you*, dad): I can quiz you on history if you'd like.
: ...They really care. Maybe asking wasn't such a bad idea.

<question> (you): Who to study with?
[ Study with mom ] -> #studyMom
[ Study with dad ] -> #studyDad
</question>

#studyMom
(you*, mom): Don't worry, I'll keep it simple. We'll go over the basics.
: ...Mom always makes things easier to understand.
#end

#studyDad
(you*, dad): Get ready for some tough questions. No mercy!
: ...He looks way too excited about this.
#end

#end

#pretendFine
(you*, mom): I'm fine, don't worry about me.
(you, mom*): If you say so... but remember, you can always ask for help.
: ...Why do I always hide what I'm feeling?

#end


#slipOut
(you*, dad): Uh-I just remembered something. Be right back!
(you, dad*): Wait, your bag-!
: ...I rush out the door, heart pounding.
: ...Was that the right choice?
<question> (you): Now what?
[ Go straight to school ] -> #goSchool
[ Wander around town ] -> #wanderTown
</question>

#goSchool
: ...At least I'll be on time. Maybe I'll calm down on the way.
#end

#wanderTown
: ...The streets are quiet. I can take my time.
(you*, you): I'll just... clear my head a bit before class.
#end


(you, dad*): Big day at school today?
(you*, dad): Yeah, we've got a test. I'm a bit nervous.

(you*, mom): You'll do great, just like always. Believe in yourself.
(you, mom*): Thanks, mom. I'll try my best.
: ...No matter what path I choose, they're still here for me.

!true == true ! -> #scene_ryan
