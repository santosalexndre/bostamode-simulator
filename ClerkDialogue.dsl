
--- ClerkDialogue.dsl
#map
(you) = {
	exicted = 'assets/images/player/excited.png'
}
#endmap

((you)): Hi i'd like the dress please
((you), clerk): Which color
<Question> ((you)): Oh my which color would look the best on me, guess i should have paid attention to color theory class.
[Green] -> #answer01
[Purple] -> #answer02
[White ! money >= 300] -> #answer03
</Question>
: Yay, finally got a dress!
! checkedSaloon == false : I think i should go to the saloon now!
{goto scene2}


#begin answer01
((You), clerk) *excited*: I want the green one.
((you), clerk): there you go, have the green one
((you), clerk): thanks.
#end

#begin answer02
((You), clerk) *excited*: I want the purple one 
((you), clerk): there you go have the purple one
I think this one fits you really nicelly!
((you), clerk): T-thanks
#end

#begin answer03
((You), clerk) *excited*: I want the white one 
((you), clerk): there you go have the white one
I think this one fits you really nicelly!
((you), clerk): T-thanks
#end


