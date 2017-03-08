
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
		solved: false
	}

	var finalizedValues = [];
	var needsSolvingCells = [];

	// get an array of finalized values of each cell that has one
	for (var i = 0; i < this.length; i++) {
		if (this.m_coll[i].finalizedValue !== undefined) {
			var cellsFinalizedValue = this.m_coll[i].finalizedValue;
			if (finalizedValues.indexOf(cellsFinalizedValue) === -1) { 
				finalizedValues.push(cellsFinalizedValue); 
			}
		}
		else {
			needsSolvingCells.push(this.m_coll[i]);
		}
	}

	// remove the finalized values from the possibilies array of cells that need to be solved
	for (var i = 0; i < needsSolvingCells.length; i++) {
		needsSolvingCells[i].removePossibilities(finalizedValues);
		needsSolvingCells[i].finalizedValue;
		obj.changed = true;
	}

	// The following considers where there are 2 unknowns shared between 2 cells, and then a third cell that
    // has one of those 2 possiblities and a 2nd different possibility. In this case it should be
    // solvable.
    // In this case 2 cells have it narrowed down to 2 and 4. A third cell has it narrowed down to 2,4,
    // and 5. This 3rd cell is for sure 5, given that the 2 and 4 must be in the other 2 cells. This
    // means that the attempt to solve should leave us with 2 unsolved cells instead of 3.
    // [ [6, 3, 9, [2,4], 7, [2,4,5], 1, 8, [2,4]], 2]
	if (needsSolvingCells.length == 3) {
		for (var i = 0; i < needsSolvingCells.length; i++) {
			if (needsSolvingCells[i].getPossibilities().length == 3) {
				var cellWithThreePossibles = needsSolvingCells[i];		// this is the cell that has [2,4,5]
				var possibilities = cellWithThreePossibles.getPossibilities();
				for (var j = 0; j < possibilities.length; j++) {
					if (possibilities[j] != needsSolvingCells[j].getPossibilities()[j]) { // check with cells that have the [2,4]'s
						cellWithThreePossibles.finalizedValue = possibilities[j];		  // found the "odd-one-out" (i.e. 4) -> set as the finalized value
					}
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