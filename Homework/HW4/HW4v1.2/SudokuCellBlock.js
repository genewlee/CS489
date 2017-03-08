
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

	// for (var i = 0; i < needsSolvingCells.length; i++) {
	// 	var possibiliesFori = needsSolvingCells[i].getPossibilities();
	// 	for (var j = 1; j < needsSolvingCells.length; j++) {
	// 		var possibiliesForj = needsSolvingCells[j].getPossibilities();
	// 		if (!possibiliesFori.every(function(element) {
	// 			possibiliesForj.includes(element);
	// 		})) {
	// 			var blah = 2;
	// 		}
	// 	}
	// }

	// check if this block is fully solved
	var checkIsFinalized = function (cell) {
		return cell.isFinalized;
	}
	if (this.m_coll.every(checkIsFinalized)) {
		obj.solved = true;
	}

	return obj;
}