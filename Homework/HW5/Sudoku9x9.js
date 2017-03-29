// Student name: Gene Lee
// Student ID: 11216720
// HW 5 v1.3

/********************************** SudokuCell ***************************************/

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
	return this.possibleValues.includes(value);
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
		if (!this.possibleValues[index].isFinalized) {
	    	this.possibleValues.splice(index, 1);
	    	return true;
	    }
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

/********************************** SudokuCellCollection ***************************************/

// Constructs an immutable collection of cells. Here "immutable" means that no cells
// can be added to or removed from the collection after instantiation. However, note
// that it is a collection of SudokuCell objects, and each such object is mutable.
// Makes a deep copy of the passed array.
function SudokuCellCollection(arrOfCells)
{
	// this.m_coll = [];
	// for (var i = 0; i < arrOfCells.length; i++) {
	// 	var newCell = new SudokuCell(9);
	// 	newCell.possibleValues = arrOfCells[i].getPossibilities();
	// 	this.m_coll[i] = newCell;
	// }
	
	this.m_coll = arrOfCells;
	Object.freeze(this.m_coll); // makes collection of cells immutable

	// Read-only numerical property that returns the number of cells in the collection.
	Object.defineProperty(this, "length", {
		enumerable: true,
		get: function() {
			return this.m_coll.length;
		}
	});
}

// Does a reference search for the specified cell. Returns true if it is contained within
// this collection, false if it is not.
SudokuCellCollection.prototype.containsCell = function(cell)
{
	// for (var c of this.m_coll) {
	// 	if (c.toString() == cell.toString()) {
	// 		return true;
	// 	}
	// }
	// return false;
	return this.m_coll.includes(cell);
}

// Loops through all cells in this collection and returns true if any one of them contains
// the specified value as a possibility.
SudokuCellCollection.prototype.containsPossibility = function(value)
{
	for (var i = 0; i < this.length; i++) {
		if (this.m_coll[i].containsPossibility(value)) {
			return true;
		}
	}
	return false;
}

// Counts the number of cells that satisfy the specified predicate.
// Calls the predicate function on each cell, and returns the number of times true is returned.
// Ex: If you had a cell collection named ‘coll’ you could count the number of finalized cells in
// this collection with the following statement: coll.count(function(cell) { return cell.isFinalized; })
SudokuCellCollection.prototype.count = function(predicate)
{
	this.m_coll.count(function(cell) { return cell.isFinalized; })
}

// Goes through cells in this collection and runs the functionThatTakes1CellParam
// function on each one. Starts at the specified starting index if it is provided,
// otherwise starts at index 0.
SudokuCellCollection.prototype.forEach = function(functionThatTakes1CellParam, startIndex)
{
	// for (var i = 0; i < this.length; i++) {
	// 	functionThatTakes1CellParam.apply(this.m_coll[i], startIndex === undefined ? 0 : startIndex);
	// }
	startIndex = startIndex === undefined ? 0 : startIndex;
	for (var i = startIndex; i < this.length; i++) {
		functionThatTakes1CellParam.call(this, this.m_coll[i]);
	}
}

// Builds and returns array of numerical values, one for each finalized cell value in the collection.
SudokuCellCollection.prototype.getFinalizedValues = function()
{
	var arr = [];
	for (var i = 0; i < this.length; i++) {
		arr[i] = this.m_coll.finalizedValue;
	}
	return arr;
}

// Builds an array of distinct numerical values that represents all possible values
// among all non-finalized cells. The returned array is sorted in ascending order.
SudokuCellCollection.prototype.getPossibilities = function()
{
	var possibleValues = [];

	// get an array of finalized values of each cell that has one
	for (var i = 0; i < this.length; i++) {
		if (this.m_coll[i].finalizedValue === undefined) {
			var possibilities = this.m_coll[i].getPossibilities();
			for (var j = 0; j < possibilities.length; j++) {
				if (possibleValues.indexOf(possibilities[j]) === -1) { 
					possibleValues.push(possibilities[j]); 
				}
			}
		}
	}

	return possibleValues.sort();
}

// Returns a new cell collection that has all the cells that this collection has, minus the
// specified cell. (Remember that the cell collection is immutable, hence the need for it
// to build and return a new collection)
SudokuCellCollection.prototype.removeCell = function(cell)
{
	var coll = [];

	for (var thiscell of this.m_coll) {
		if (thiscell !== cell)
			coll.push(thiscell);
	}

	return  new SudokuCellCollection(coll);
}

// Builds and returns the collection of cells that are only in this collection and not in
// the other. If the otherCellCollection parameter is not a SudokuCellCollection object,
// then a reference to this collection is returned.
SudokuCellCollection.prototype.removeCells = function(otherCellCollection)
{
	if (!(otherCellCollection instanceof SudokuCellCollection)) {
		return this;
	}

	var coll = [];

	for (var cell of otherCellCollection.m_coll) {
		coll = this.removeCell(cell);
	}

	return new SudokuCellCollection(coll);
}

// Removes the value as a possibility from all cells in the collection. 
// Returns the number of cells that had the value as a possibility and had it removed.
SudokuCellCollection.prototype.removePossibility = function(value)
{
	var count = 0;
	for (var cell of this.m_coll) {
		if (cell.removePossibility(value)) { count++; }
	}
	return count;
}

/********************************** SudokuCellBlock ***************************************/

// Constructor function for a collection of cells that is either an entire row,
// an entire column, or a 3x3 box. (SudokuCellBlock inherits from SudokuCellCollection)
function SudokuCellBlock(arrOf9Values)
{
	SudokuCellCollection.call(this, arrOf9Values);
}

SudokuCellBlock.prototype = Object.create(SudokuCellCollection.prototype);

// Tries to solve this block. This function looks only at the values in the collection and
// doesn’t involve the other 8/9 of the puzzle. This is a small piece of the logic needed
// to solve an entire puzzle.
// An object is returned that gives information about the attempt at solving. This
// object has 2 properties: “changed” and “solved”, both of which are bool values. The
// “changed” property is set to true if any changes were made to any of the cells in the
// collection. This includes even just eliminating one possibility from one cell, and
// leaving it unsolved with multiple possibilities left. If the state of any cell is changed
// due to this call to trySolve, the “changed” value must be true. If no changes were
// made, then “changed” must be false. The “solved” property is set to true only if all
// cells in the collection have finalized values (meaning that this block is fully solved).

SudokuCellBlock.prototype.trySolve = function()
{
	var obj = {
		changed: false,
		solved: false,
		solvedCells: []
	}

	var cells = [];
	for (var c of this.m_coll) {
		cells.push(c);
	}

	for (var i = 0; i < cells.length; i++) {

		if (cells[i].isFinalized) {

			var needsSolvingCells = this.getUnsolvedCells(cells[i]);

			// remove possibility from finalized cell from
			// all the cells that still need to be solved
			for (var cell of needsSolvingCells) { 
				if (cell.removePossibility(cells[i].finalizedValue)) {
					if (cell.isFinalized) { // after removing possibility is this one finalized?
						cells.push(cell); // if so then, lets go through this one in the main loop

						obj.solvedCells.push(cell); // added for solve in Sudoku9x9
					}

					obj.changed = true;
				}
			}
		} 
		else { // cell that are is finalized

			var needsSolvingCells = this.getUnsolvedCells(cells[i]);
			var needsSolvingCollection = new SudokuCellCollection(needsSolvingCells);

			for (var value of cells[i].getPossibilities()) {
				if (needsSolvingCollection.containsPossibility(value) == false) {
					cells[i].finalizedValue = value;
				
					// since its finalized, lets go through this one in the main loop also
					// to remove the possibility from the other cells
					cells.push(cells[i]); 

					obj.solvedCells.push(cells[i]); // added here for solve in Sudoku9x9
					obj.changed = true;
					
					break;
				}
			}
		}
	}

	// check if this block is fully solved
	var checkIsFinalized = function (cell) {
		return cell.isFinalized;
	}
	if (this.m_coll.every(checkIsFinalized)) {
		obj.solved = true;
	}

	return obj;
}

SudokuCellBlock.prototype.getUnsolvedCells = function (cell)
{
	var needsSolvingCells = [];
	for (var c of this.m_coll) {
		if (c != cell) {
			needsSolvingCells.push(c); 
		}
	}
	return needsSolvingCells;
}

/********************************** Sudoku3x3Block ***************************************/

// Constructs the 3x3 cell collection from an array of 9 values.
// Sudoku3x3CellColection inherits from SudokuCellBlock.
function Sudoku3x3Block(arrOf9Values)
{
	SudokuCellBlock.call(this, arrOf9Values);
}

Sudoku3x3Block.prototype = Object.create(SudokuCellBlock.prototype);

// Gets the possibilities within the 3x3 block that are unique to the
// specified column within the block. No values in the returned array
// will be possibilities for cells that aren't in the specified column
// within this 3x3 block. The column index must be in the range [0,2].
Sudoku3x3Block.prototype.getPossibilitiesOnlyAvailableOnColumn = function(colIndex)
{
	var col = [];
	var possibilities = []; // possible values of cells in column 

	for (var i = 0; i < 3; i++) {
		possibilities = this.m_coll[colIndex].getPossibilities();
		for (var j = 0; j < possibilities.length; j++) {
			if (col.indexOf(possibilities[j]) === -1) { col.push(possibilities[j]); }
		}
		colIndex += 3;
	}

	for (var cell of this.m_coll) {
		cell.removePossibilities(possibilities);
	}
	return col;
}

// Gets the possibilities within the 3x3 block that are unique to the
// specified row within the block. No values in the returned array will
// be possibilities for cells that aren't in the specified row within this
// 3x3 block. The row index must be in the range [0,2].
Sudoku3x3Block.prototype.getPossibilitiesOnlyAvailableOnRow = function(rowIndex)
{
	rowIndex *= 3;
	var row = [];
	var possibilities = []; // possible values of cells in row 

	for (var i = rowIndex; i < rowIndex + 3; i++) {
		possibilities = this.m_coll[i].getPossibilities();
		for (var j = 0; j < possibilities.length; j++) {
			if (row.indexOf(possibilities[j]) === -1) { row.push(possibilities[j]); }
		}
	}

	for (var cell of this.m_coll) {
		cell.removePossibilities(possibilities);
	}

	return row;
}

// Function that returns true if all cells in the specified column are
// finalized, false otherwise.
Sudoku3x3Block.prototype.isColumnFinalized = function(columnIndex)
{
	var checkIsFinalized = function (cell) {
		return cell.isFinalized;
	}

	var col = [];
	for (var i = 0; i < 3; i++) {
		col.push(this.m_coll[columnIndex]);
		columnIndex += 3;
	}

	if (col.every(checkIsFinalized)) {
		return true;
	}
	return false;
}

// Function that returns true if all cells in the specified row are
// finalized, false otherwise.
Sudoku3x3Block.prototype.isRowFinalized = function(rowIndex)
{
	var checkIsFinalized = function (cell) {
		return cell.isFinalized;
	}

	var row = [];
	rowIndex *= 3;
	for (var i = rowIndex; i < rowIndex + 3; i++) {
		row.push(this.m_coll[i]);
	}

	if (row.every(checkIsFinalized)) {
		return true;
	}
	return false;
}

// (optional, may help with debugging) Function that returns a string
// representing the contents of this 3x3 block. Example of format you
// might want: “[4, 5, 1] [9, 2, 6] [7, 6, 8]”
Sudoku3x3Block.prototype.toString = function()
{
	var str = "";
	var i = 0;
	while (i < this.length) {
		for (var j = 0; j < 3; j++) {
			str += "[";
			str += this.m_coll[i++]
		}
		str += "] ";
	}
}

/********************************** Sudoku9x9 ***************************************/

// Constructor function that initializes the member array of 81 cells. Assume that the
// arrOf81Values parameter is guaranteed to be an array with exactly 81 items. Each
// item in arrOf81Values is either a numerical value in the range [1,9] or anything else.
// If it is a number in the range [0,9], this indicates that that cell has a known, finalized
// value. If it is anything else, that means it represents a “blank” cell. Initialize the Cells
// member array appropriately based on this input.
function Sudoku9x9(arrOf81Values)
{
	// Example :
	/*[
			   __1__  __2__  __3__
			   0 1 2  3 4 5  6 7 8 	
	     |0  [ 1,2,3, 4,5,6, 7,8,9, ],
	    1|1  [ 3,2,1, 6,5,4, 9,8,7, ],
	     |2  [ 2,1,3, 4,6,5, 7,9,8, ],
	     
	     |3  [ 1,2,3, 4,5,6, 7,8,9, ],
	    2|4  [ 1,2,3, 4,5,6, 7,8,9, ],
	     |5  [ 1,2,3, 4,5,6, 7,8,9, ],
	     
	     |6  [ 1,2,3, 7,5,6, 4,8,9, ],
	    3|7  [ 1,2,3, 4,5,6, 7,8,9, ],
	     |8  [ 3,9,7, 5,4,6, 8,1,2  ],
	      							   ]*/

	this.cells81 = [];
	for (var i = 0; i < arrOf81Values.length; ) {
		var row = [];
		for (var j = 0; j < 9; j++) {
			var cell = new SudokuCell(9);
			if (arrOf81Values[i] > 0 && arrOf81Values[i] < 10) {
				cell.possibleValues = [arrOf81Values[i]];
			}
			row.push(cell);
			i++;
		}
		this.cells81.push(row);
	}
}

// Function that returns a Sudoku3x3Block for one of the 9 possible 3x3 boxes in the
// puzzle. The row and column indices will be in the range [0,2].
Sudoku9x9.prototype.get3x3 = function(rowIndex, colIndex)
{
	var threeByThree = [];
	rowIndex *= 3;
	colIndex *= 3;
	for (var i = rowIndex; i < rowIndex + 3; i++) {
		for (var j = colIndex; j < colIndex + 3; j++) {
			threeByThree.push(this.cells81[i][j]);
		}
	}
	return new Sudoku3x3Block(threeByThree);
}

// Function that returns a SudokuCellBlock containing the 9 cells from the specified
// column. The column index will be in the range [0,8].
Sudoku9x9.prototype.getColumn = function(colIndex)
{
	var col = [];
	for (var i = 0; i < 9; i++) {
		col.push(this.cells81[i][colIndex]);
	}
	return new SudokuCellBlock(col);
}

// Function that returns a SudokuCellBlock containing the 9 cells from the specified
// row. The row index will be in the range [0,8].
Sudoku9x9.prototype.getRow = function(rowIndex)
{
	return new SudokuCellBlock(this.cells81[rowIndex]);
}

// Function that returns a deep copy of the array of cell references.
Sudoku9x9.prototype.toArray = function()
{
	var arr = [];

	for (var i = 0; i < this.cells81.length; i++) {
		for (var j = 0; j < this.cells81[i].length; j++) {
			var newCell = new SudokuCell();
			newCell.possibleValues = this.cells81[i][j].getPossibilities();
			arr.push(newCell);
		}
	}

	return arr;
}

// Function that solves
Sudoku9x9.prototype.solve = function() 
{
	var totalCollection = this.getTotalCollection();

	// trySolve all the collections first
	for (var i = 0; i < totalCollection.length; i++) {
		var coll = totalCollection[i];

		var result = coll.trySolve();

		if (result.solvedCells.length > 0) {
			for (var cell of result.solvedCells) {
				var surroundingCollections = this.findCollectionsThatIncludeCell(cell, totalCollection);
				for (var c of surroundingCollections) {
					totalCollection.push(c);
				}
			}
		}
	}

	// After trying to solve all that we can, solve for the remaining cells using following algorithm
	return this.solveBackTrack(0, 0); // start at cell [0,0]
	//return {solved:false}
}

// Backtracking Algorithm
Sudoku9x9.prototype.solveBackTrack = function(row, col) 
{
    var cell = this.findNotFinalizedLocation(row, col);
    var row = cell[0];
    var col = cell[1];

    // base case  
    if (row == -1) {
        return { solved:true };
    }

    for (var num = 1; num <= 9; num++) {

        if ( this.HasNoConflicts(row, col, num) ) {   
        	var poss = this.cells81[row][col].getPossibilities();
            this.cells81[row][col].possibleValues = [num]; // tentative 
        
            if (this.solveBackTrack(row, col).solved == true) {                
                return { solved:true };
            }

            // failed, try again    
            this.cells81[row][col].possibleValues = poss;
        }
    }

    // trigger back tracking
    return { solved:false };
}

// Returns all the columns, rows, and blocks combined
Sudoku9x9.prototype.getTotalCollection = function () 
{
	var totalCollection = [];

	for (var i = 0; i < this.cells81.length; i++) {
		var column = this.getColumn(i);
		totalCollection.push(column);
		
		var row = this.getRow(i);
		totalCollection.push(row);
	}

	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			var block = this.get3x3(i, j);
			totalCollection.push(block);
		}
	}

	return totalCollection;
}

// Find the row, column, and block that contains this cell
Sudoku9x9.prototype.findCollectionsThatIncludeCell = function (cell, collections)
{
	var surroundingCollections = [];
	
	for (var collection of collections) {
		if (collection.containsCell(cell))
			surroundingCollections.push(collection);
	}

	return surroundingCollections;
}

Sudoku9x9.prototype.findNotFinalizedLocation = function(row, col)
{
	for (; row < this.cells81.length; col = 0, row++) {
		for (; col < this.cells81.length; col++) {
			if (this.cells81[row][col].possibleValues.length != 1) { // which means that the cell is not finalized // isFinalized check makes object immutable
	            return [row, col];
	        }
		}
	}
	return [-1, -1];
}

Sudoku9x9.prototype.HasNoConflicts = function(row, col, num) 
{
    return this.isValidRow(row, num) && this.isValidCol(col, num) && this.isValidBlock(row, col, num);
}

Sudoku9x9.prototype.isValidRow = function(row, num) 
{
    for (var col = 0; col < 9; col++) {
    	// check to see if contains one possibility and it that possibility is the num
     	var length = this.cells81[row][col].possibleValues.length;
     	if (length == 1 && this.cells81[row][col].containsPossibility(num)) {
     		return false;
     	}
    }
    return true;
}

Sudoku9x9.prototype.isValidCol = function(col, num) 
{
    for (var row = 0; row < 9; row++) {
    	// check to see if contains one possibility and it that possibility is the num
	    var length = this.cells81[row][col].possibleValues.length;
     	if (length == 1 && this.cells81[row][col].containsPossibility(num)) {
     		return false;
     	}
	}
    return true;    
}

Sudoku9x9.prototype.isValidBlock = function(row, col, num) 
{
    row = Math.floor(row / 3) * 3;
	col = Math.floor(col / 3) * 3;

    for (var r = 0; r < 3; r++){
        for (var c = 0; c < 3; c++){
        	// check to see if contains one possibility and it that possibility is the num
	        var length = this.cells81[row + r][col + c].possibleValues.length;
	     	if (length == 1 && this.cells81[row + r][col + c].containsPossibility(num)) {
	     		return false;
	     	}
        }
    }
 	return true;
}
