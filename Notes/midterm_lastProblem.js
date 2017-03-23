MIDTERM LAST PROBLEM

function lastProblem () {
	var arr = new Array();

	for (var index = 0; index < 5; index++) {
		arr[index] = function () { alert(index); }
	}

	return arr;
}

// first solution -> DOES NOT WORK

function lastProblem () {
	var arr = new Array();

	for (var index = 0; index < 5; index++) {
		arr[index] = function () { 
			var temp = index;
			alert(temp); 
		}
	}

	return arr;
}


// second solution -> DOES NOT WORK
function lastProblem () {
	var arr = new Array();

	for (var index = 0; index < 5; index++) {
		var temp = index;
		arr[index] = function () { 
			alert(temp); 
		}
	}

	return arr;
}


// SOLUTION
// second solution -> DOES NOT WORK
function lastProblem () {
	var arr = new Array();

	for (var index = 0; index < 5; index++) {
		arr[index] = B(index);
	}

	return arr;
}

function B(index) {
	return function() { alert (index); }
}