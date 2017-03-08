
// Constructs an immutable collection of cells. Here "immutable" means that no cells
// can be added to or removed from the collection after instantiation. However, note
// that it is a collection of SudokuCell objects, and each such object is mutable.
// Makes a deep copy of the passed array.
function SudokuCellCollection(arrOfCells)
{
	// TODO: MAKE IMMUTABLE
	this.m_coll = [];
	for (var i = 0; i < arrOfCells.length; i++) {
		var newCell = new SudokuCell();
		newCell.possibleValues = arrOfCells[i].getPossibilities();
		this.m_coll[i] = newCell;
	}

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
	this.m_coll.includes(cell);
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
	for (var i = 0; i < this.length; i++) { 
		if (this.m_coll[i].toString() !== cell.toString()) {
			var newCell = new SudokuCell();
			newCell.possibleValues = this.m_coll[i].getPossibilities();
			coll.push(newCell)
		}
	}

	return coll;
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
	for (var cell of this.m_coll) {
		if (!otherCellCollection.contains(cell)) {
			coll.push(cell);
		}
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