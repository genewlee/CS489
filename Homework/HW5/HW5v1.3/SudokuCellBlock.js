
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
