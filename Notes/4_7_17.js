var ta = document.createElement("textArea");

document.appendChild(ta);
ta.value = "Hello";
ta.style.color = "red";

ta.innerHTML = "<b>H</b>ello"; // will nor work

// To have editable div text area
// <div contenteditable="true"></div>

// for dynamic changes
// use onInput rather than onKeyUp

// use document.execCommand for bolding and other styles



// to get the selection
// window.getSelection()
// selection object has a rangeCount (has atleast one range) and getRangeAt(index = 0) -> gets back range object

// range.startContainer and endContainer won't get the containers in between 
// ex. <big> Big <u> a|bc </u> </big><green> And...</green><red> more text <div> c|ontent </div> </red> 
// '|' = selection
// Therefore use the selection.containsNode()