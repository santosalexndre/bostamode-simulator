// cena 2 muito hard badass
 
:the thrift shop down the street.
:it doesn't even have a sign or anything. Just a few manne fd fds fds kfdjsh fhdjf hdsjk fhdjs fhdsjkf hdsjk fhdsjk fhdjskfh djskfh djks fhdjksfh djks fhdjskfh jdskhf djkshf jdkshf dsjkfh jk hiwh un inq iquins in front of an open garage gate.

{ set confidence -= 1, shake STRONG y } ! confidence == LOW ! (you) : as soon as you feel that cold in your neck you look away and try to think of some other thing.

// idk how to make a better description
// as soon as you feel that cold tingle down your spine
// idk

! true == true ! (you): I got this.

! true == true ! -> #bro
! true == true ! -> #mom


#bro
(brother): oi caralho
(you): bom dia porra
#end

#mom
(mom): hi my male son who is male
#end

#clerkQuestion01
<question> (you): What do?
[ Ask for help ] 
[ Browse discreetly ]
[ Run ] -> #runaway
</question>
#end

(clerk): Hi, can I help you?


<question> (clerk): What are you looking for?
! confidence == high ! [ A dress. ] -> #vestido
! confidence == high ! [ outra roupa. ] -> #outra roupa
[ Dodge question. ] -> #answer02
[ Run ] -> #runaway
</question>

#answer01
(you): 
#end

#answer02
(you): oh I have not decided yet
#end

#runaway
(You): ka-chow
(clerk): what?
(none): you break into a somewhat impressive sprint for...  a linux user / someone of your type / someone who has skipped every single PE class since kindergarden
// tem uma piada boa aqui. aff.
{ set confidence -=1 } :maybe come back with someone next time?
#end
