
// Constructor function for a SudokuCell. You may assume that numValues is always
// equal to 9. It exists only to allow for flexibility to support other types of Sudoku
// puzzles that have potentially more or fewer possible values per cell. (Ex: There are
// large 16x16 Sudoku puzzles that support 16 possible values per cell). Initialize the
// cell such that all values in the range [1,9] are listed as possibilities for this cell.
function SudokuCell(numPossibleValues)
{
	this.possibleValues = [];
	if (numPossibleValues === null || numPossibleValues === undefined) {
		numPossibleValues = 9;
	}
	for (var i = 1; i <= numPossibleValues; i++) {
		this.possibleValues.push(i);
	}
	
	// Read/write numerical value property that represents the finalized value for the cell.
	// When getting the value, if isFinalized is false, then the return value is undefined.
	// Otherwise the finalized value for the cell is returned. When setting, all other
	// possibilities are removed from the cell and it becomes a cell with just one possible value.
	Object.defineProperty(this, "finalizedValue", {
		enumerable: true, 
		get: function () {
			if (this.isFinalized == false) {
				return undefined;
			}
			return this.possibleValues[0];
		}, 
		set: function (value) {
			this.possibleValues = [value];
		}
	});


	// Read-only bool property that is true only if the cell has been narrowed down to 1
	// possible value. When the cell is in the finalized state it becomes immutable.
	Object.defineProperty(this, "isFinalized", {
		enumerable: true, 
		get: function () {
			if (this.possibleValues.length == 1) {
				Object.freeze(this);
				return true;
			}
			return false;
		},
		// writable false by default
	});
}
 
// Returns true if the cell contains the specified value as a possibility, false otherwise.
SudokuCell.prototype.containsPossibility = function(value)
{
	return possibleValues.includes(value);
}

// Gets a sorted array of numbers representing possible values for this cell.
SudokuCell.prototype.getPossibilities = function ()
{
	return this.possibleValues.sort();
}

// Removes a value from the list of possible values for this cell. This is OK to call even if
// the value is not currently in the list of possible values for this cell.
// If the cell is finalized, then no action is taken, even if the value is equal to the
// finalized value in the cell.
// Returns true if the value WAS a possibility in this cell and now it is not.
// Returns false in all other cases.
SudokuCell.prototype.removePossibility = function(value)
{
	var index = this.possibleValues.indexOf(value);
	if (index > -1) {
    	this.possibleValues.splice(index, 1);
    	return true;
    }
    return false;
}

// Utility function that calls removePossibility for each value in arrOfValues.
SudokuCell.prototype.removePossibilities = function(arrOfValues)
{
	for (var i = 0; i < arrOfValues.length; i++) {
		this.removePossibility(arrOfValues[i]);
	}
}

// Returns the string version of the array built by getPossibilities.
SudokuCell.prototype.toString = function()
{
	var possibilities = this.getPossibilities();
	var str = "";
	for (var i = 0; i < possibilities.length; i++) {
		str += possibilities[i].toString();
	}
	return str;
}