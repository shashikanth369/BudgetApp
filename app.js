//Budget Controller
var budgetController = (function(){
	var Expense = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	}
	
	var Income = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	}
	
	var data = {
		allItems: {
			inc: [],
			exp: []
		},
		totals: {
			exp: 0,
			inc: 0	
		}
	}
	return{
		addItem: function(type, des, value){
			var newItem, ID;
			
			//create new ID
			if(data.allItems[type].length > 0){
				ID = data.allItems[type][data.allItems[type].length-1].id + 1;
			}
			else{
				ID = 0;
			}
			
			//create new item based on inc or exp
			if(type === 'exp'){
			newItem = new Expense(type, des, value);
			}else if(type === 'inc'){
				newItem = new Income(type, des, value);
			}
			
			// add item based on inc or exp
			data.allItems[type].push(newItem);
			
			//return new item
			return newItem;
		},
		testing: function(){
			console.log(data);
		}
	}
	
})();
//UI Controller
var UIController = (function(){
	var DOMStrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn'
	}
	return{
		getInput: function(){
			return{
			type: document.querySelector(DOMStrings.inputType).value,
			description: document.querySelector(DOMStrings.inputDescription).value,
			value: document.querySelector(DOMStrings.inputValue).value	
			};	
		},
		getDomString: function(){
			return DOMStrings;
		}
	};		
})();

//Global App Controller
var controller = (function(budgetCtrl, UICtrl){
	var setupEventListeners = function(){
	var DOM = UICtrl.getDomString();
	document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
	document.addEventListener('keypress', function(event){
			if(event.keyCode === 13 || event.which === 13){
			ctrlAddItem();
	}	
});	
}
	
	
	var ctrlAddItem = function(){
	
		
		var input, newItem;
	//1.Get the input from the fields
		 input = UICtrl.getInput();
		
	
	//2.Add the Item to budgetctrl
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);
	//3.update budget in UI
	//4.calculate the total budget
	//5.Displaythe Calculated budget in UI	
	};
	
	return{
		init: function(){
			console.log('Application Started');
			return setupEventListeners();
		}
	}
})(budgetController, UIController);


controller.init();