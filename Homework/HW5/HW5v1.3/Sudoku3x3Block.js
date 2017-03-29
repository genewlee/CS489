
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