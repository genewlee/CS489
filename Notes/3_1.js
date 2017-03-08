var f = (function() { alert(this.value); }).value=42;

 // f(); ----> Uncaught TypeError: f is not a function
 // f.value ----> undefined
 // f ----> 42

 (function() { alert(this.value); }) // is an anonymous function object


 /**************/

var f = (function() { alert(this.value); });
// this is the global object --> in this case window

f.call(f);
// this would then use f as 'this'

/***************/

var eventinfo;
var btn = document.createElement("input");
document.body.appendChild(btn);
btn.type = "button";
btn.value = "Click";
btn.onclick = function(abc) { eventinfo = abc; };
// eventinfo is mouseClick

// for onclick, if given one parameter, the eventinfo is passed in

btn.id = "mybtn";
var f2 = function(id, eventinfo) { console.log(id, eventinfo); }
// this is the same thing
// 'this' will be the btn object -> not window
btn.onclick = function(eventinfo) { f2(btn.id eventinfo); }
btn.onclick = function(eventinfo) { f2(this.id eventinfo); }


/// Midterm

// Red-black tree
/// searching and traversing
/// no adding and removing