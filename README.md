# graphamerator

http://picklenerd.com/math/graphamerator/

Drawing graphs is fun!  Writing TikZ for them is not!  graphamerator will allow you to create colorful graphs the fun way, by moving stuff around.  It will also allow you to input an adjacency matrix for when you want to move stuff around without having to create 60 vertices.  Then you just press a button and get TikZ code without having to write anything.  Eventually, it'll even do 3D graphs.  

This is currently undergoing a complete redesign and rewrite, since the original incarnation was basically my WebGL tutorial.  That includes moving over to ES2015 because it's just that time.  I'll also be using three.js instead of rolling my own WebGL code.  The original plan was for this to primarily be an algebra tool, but I realized how silly that is when all of the algebra functions can be spun off into standalone tools that output an adjacency matrix.