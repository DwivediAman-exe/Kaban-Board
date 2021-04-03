const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];


// Drag Functionality
let draggedItem;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
	listArrays= [backlogListArray, progressListArray, completeListArray, onHoldListArray];
	const arraryNames = ['backlog', 'progress', 'complete', 'onHold'];
	arraryNames.forEach((arrayName, index) => {
		localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
	}); 

  // localStorage.setItem('backlogItems', JSON.stringify(backlogListArray));
  // localStorage.setItem('progressItems', JSON.stringify(progressListArray));
  // localStorage.setItem('completeItems', JSON.stringify(completeListArray));
  // localStorage.setItem('onHoldItems', JSON.stringify(onHoldListArray));
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // console.log('columnEl:', columnEl);
  // console.log('column:', column);
  // console.log('item:', item);
  // console.log('index:', index);
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
	listEl.draggable = true;
	listEl.setAttribute('ondragstart','drag(event)');
	//Append
	columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
	if(!updatedOnLoad) {
		getSavedColumns();
	}

  // Backlog Column
	backlogList.textContent = '';
	backlogListArray.forEach( (backlogitem, index) => {
		createItemEl(backlogList, 0, backlogitem, index);
	});

  // Progress Column
	progressList.textContent = '';
	progressListArray.forEach( (progressitem, index) => {
		createItemEl(progressList, 0, progressitem, index);
	});
	
  // Complete Column
  completeList.textContent = '';
	completeListArray.forEach( (completeitem, index) => {
		createItemEl(completeList, 0, completeitem, index);
	});

  // On Hold Column
  onHoldList.textContent = '';
	onHoldListArray.forEach( (onHolditem, index) => {
		createItemEl(onHoldList, 0, onHolditem, index);
	});
  // Run getSavedColumns only once, Update Local Storage
	updatedOnLoad= true;
	updateSavedColumns();
}

// Add to column list, Reset textbox
function addToColumn(column) {
	const itemText = addItems[column].textContent;
	const selectedArray = listArrays[column];
	selectedArray.push(itemText);
	addItems[column].textContent = '';
	updateDOM();
}

// show Add item input box
function showInputBox(column) {
	addBtns[column].style.visibility = "hidden";
	saveItemBtns[column].style.display = "flex";
	addItemContainers[column].style.display = "flex";
}

//hide Input box
function hideInputBox(column) {
	addBtns[column].style.visibility = "visible";
	saveItemBtns[column].style.display = "none";
	addItemContainers[column].style.display = "none";
	addToColumn(column);
}

// Allows array to reflect drag and drop
function rebuiltArrays() {
	backlogListArray = [];
	for(let i=0;i<backlogList.children.length;i++) {
		backlogListArray.push(backlogList.children[i].textContent);
	}

	progressListArray = [];
	for(let i=0;i<progressList.children.length;i++) {
		progressListArray.push(progressList.children[i].textContent);
	}

	completeListArray = [];
	for(let i=0;i<completeList.children.length;i++) {
		completeListArray.push(completeList.children[i].textContent);
	}

	onHoldListArray = [];
	for(let i=0;i<onHoldList.children.length;i++) {
		onHoldListArray.push(onHoldList.children[i].textContent);
	}
	updateDOM();
}

// when item starts dragging
function drag(e) {
	draggedItem = e.target;
	console.log(draggedItem);
}

// columns allows item to be dropped
function allowDrop(e) {
	e.preventDefault();
}

// when Item enters a column area
function dragEnter(column) {
	listColumns[column].classList.add('over');
	currentColumn = column;
}

// dropping item in a column
function drop(e) {
	e.preventDefault();

	// Remove bg color and padding
	listColumns.forEach( (column) => {
		column.classList.remove('over');
	});

	// add item to column
	const parent = listColumns[currentColumn];
	parent.appendChild(draggedItem);
	rebuiltArrays();
}

// onLoad
updateDOM();