// Student name: Gene Lee
// Student ID: 11216720

document.writeln("<script type='text/javascript' src='SudokuCell.js'></script>");
document.writeln("<script type='text/javascript' src='SudokuCellCollection.js'></script>");
document.writeln("<script type='text/javascript' src='SudokuCellBlock.js'></script>");
document.writeln("<script type='text/javascript' src='Sudoku3x3Block.js'></script>");

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
			newCell.possibleValues = this.cells81[i][j].getPossibilities(); //[this.cells81Num[i][j]];
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
	for (var coll of totalCollection) {
		var result = coll.trySolve();

		if (result.solvedCells.length > 0) {
			for (var cell of result.solvedCells) {
				var surroundingCollections = this.findCollectionsThatIncludeCell(cell);
				for (var c of surroundingCollections) {
					totalCollection.push(c);
				}
			}
		}
	}

	return this.solveBackTrack(0, 0);
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
        	//var poss = this.cells81[row][col].getPossibilities();
            this.cells81[row][col].possibleValues = [num]; // tentative 
        
            if (this.solveBackTrack(row, col).solved == true) {                
                return { solved:true };
            }

            // failed, try again    
            this.cells81[row][col].possibleValues = [];
            //this.cells81[row][col].removePossibility(num);
        }
    }

    // trigger back tracking
    return { solved:false };
}

// Returns all the columns, rows, and blocks combined
Sudoku9x9.prototype.getTotalCollection = function () 
{
	var totalCollection = [];

	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			var block = this.get3x3(i, j);
			totalCollection.push(block);
		}
	}

	for (var i = 0; i < this.cells81.length; i++) {
		var column = this.getColumn(i);
		totalCollection.push(column);
	}

	for (var i = 0; i < this.cells81.length; i++) {
		var row = this.getRow(i);
		totalCollection.push(row);
	}

	return totalCollection;
}

// Find the row, column, and block that contains this cell
Sudoku9x9.prototype.findCollectionsThatIncludeCell = function (cell)
{
	var surroundingCollections = [];
	var totalCollection = this.getTotalCollection();

	for (var coll of totalCollection) {
		if (coll.containsCell(cell)) {
			surroundingCollections.push(coll);
		}
	}

	return surroundingCollections;
}

Sudoku9x9.prototype.findNotFinalizedLocation = function(row, col)
{
	for (; row < this.cells81.length; col = 0, row++) {
		for (; col < this.cells81.length; col++) {
			if (this.cells81[row][col].getPossibilities().length != 1) { // which means that the cell is not finalized // isFinalized check makes object immutable
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
    	var possibilities = this.cells81[row][col].getPossibilities();
        if (possibilities.length == 1 && possibilities.includes(num)) {
            return false;
        }
    }

    return true;
}

Sudoku9x9.prototype.isValidCol = function(col, num) 
{
    for (var row = 0; row < 9; row++) {
    	// check to see if contains one possibility and it that possibility is the num
    	var possibilities = this.cells81[row][col].getPossibilities(); 
	    if (possibilities.length == 1 && possibilities.includes(num)) {
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
        	var possibilities = this.cells81[row + r][col + c].getPossibilities();
            if (possibilities.length == 1 && possibilities.includes(num)) {
                return false;
            }
        }
    }
 	return true;
}
