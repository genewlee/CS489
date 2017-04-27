function ObservableObject
{
	this.Observers = new Array();
	var m_name = "ABC";

	Object.defineProperty("name", {
		get: function() { return m_name; }, 
		set: function(value) {
			if (value != m_name) {
				// set
				// call func in array
			}
		}
	});

	// How to implement with closures to not expose the setter
	// There would no longer be a setter above
	this.Rename = function(newName) {
		// .. check for null, undefined, etc.
		m_name = newName;
		// if value changed -> Notify Observers
	}
}


// Question for final
// Here is the code for C++/C# -> How would you implmenent in JS

// page interactions
// DOM
//  document.getElementById(<tagName>);
//	document.createElement(<ID>);
//	parent contained . add Node
//	<container>.innerHTML -> populate in simple way
//	Object.create

// Exam topics
// concept of provided code -> what does it do?
// outcomes of code
// prototype chain !!!
// own property, enumerable property, inheritated property
// for-in loops -> iterate properties

// nodejs 
// handling requests
// asynchronous nature of callback functions 

// 2pages of notes
