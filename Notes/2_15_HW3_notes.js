// in class HW3

function Set489(compareFunction)
{
	BST.call(this, compareFunction);
}

Set489.prototype = Object.create(BST.prototype);

Set489.prototype.add = function (value) 
{
	var node = BST.prototype.addNode.call(this, value);

	this.add(value);
}

var mySet = new Set489(null);
mySet.add(42);