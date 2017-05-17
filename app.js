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
	
	var calculateIncome = function(type){
		var sum = 0;
		data.allItems[type].forEach(function(cur){
			sum += cur.value;
		});
		data.totals[type] = sum;
	};
	
	var data = {
		allItems: {
			inc: [],
			exp: []
		},
		totals: {
			exp: 0,
			inc: 0	
		},
		budget: 0,
		percentage: 0
	}
	return{
		addItem: function(type, des, value){
			var newItem, ID;
			
			//create new ID
			if(data.allItems[type].length > 0){
				//assigning last element + 1 to ID
				ID = data.allItems[type][data.allItems[type].length-1].id + 1;
			}
			else{
				ID = 0;
			}
			
			//create new item based on inc or exp
			if(type === 'exp'){
			newItem = new Expense(ID, des, value);
			}else if(type === 'inc'){
				newItem = new Income(ID, des, value);
			}
			
			// add item based on inc or exp
			data.allItems[type].push(newItem);
			
			//return new item
			return newItem;
		},
		deleteItem: function(type, id){
			
			var ids, index;
			
			ids = data.allItems[type].map(function(current){
				return current.id;
			});
			index = ids.indexOf(id);
			
			if(index !== -1){
				data.allItems[type].splice(index, 1);	
			}
			
		},
		budgetCalcultor: function(){
			//1 Calculate total incomes and expenses
			calculateIncome('inc');
			calculateIncome('exp');
			//2.Calculate budget by inc-exp
			data.budget = data.totals.inc - data.totals.exp;
			
			//3. Percentage of expense from total income
			if(data.totals.inc > 0){
			data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			}else{
				data.percentage = -1;
			}
		},
		getBudget: function(){
			return{
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
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
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expenseContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		expPercentageLabel:'.budget__expenses--percentage',
		container: '.container'
	}
	return{
		getInput: function(){
			return{
			type: document.querySelector(DOMStrings.inputType).value,
			description: document.querySelector(DOMStrings.inputDescription).value,
			value: parseFloat(document.querySelector(DOMStrings.inputValue).value)	
			};	
		},
		addListItem: function(obj, type)
		{
			var html, newHtml, element;
			//create html string with place-holder
			
			if(type === 'inc'){
				
				element = DOMStrings.incomeContainer;
			html =  '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div></div>'
			}
			else if(type === 'exp'){
				
				element = DOMStrings.expenseContainer;
			html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div><div class="right clearfix">      <div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete">      					<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div> </div>'
			}
			
			
			//replace the place-holder in the dom
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			console.log(obj.id+obj.description+obj.value+ " UICtrl ");
			newHtml = newHtml.replace('%value%', obj.value);
			
			//insert html into dom
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
			
		},
		displayBudget: function(obj){
			document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
			document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
			document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;
			if(obj.percentage > 0){
			document.querySelector(DOMStrings.expPercentageLabel).textContent = obj.percentage+'%';
			}else{
				document.querySelector(DOMStrings.expPercentageLabel).textContent = '--';
			}
		},
		deleteListItem: function(selectorId){
			var ele = document.getElementById(selectorId);
			console.log(selectorId+" from deleteList item")
			ele.parentNode.removeChild(ele);
		},
		clearFields: function(){
			var fields, fieldsArr;
			
			fields = document.querySelectorAll(DOMStrings.inputDescription+ ","+ DOMStrings.inputValue);
			fieldsArr = Array.prototype.slice.call(fields);
			fieldsArr.forEach(function(current, index, array){
				current.value = "";
			});
			fieldsArr[0].focus();
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
		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
}
	var updateBudget = function(){
		//1. Calculate budget
		budgetCtrl.budgetCalcultor();
		
		
		//2.update the budget and return
			var budget = budgetCtrl.getBudget();
		//3.Return the budget on UI
		UICtrl.displayBudget(budget);
		console.log(budget);
	}
	
	var ctrlAddItem = function(){
	
		
		var input, newItem;
	//1.Get the input from the fields
		 input = UICtrl.getInput();
		
	if(input.description != "" && !isNaN(input.value) && input.value > 0){
		
	
	//2.Add the Item to budget ctrl
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);
		console.log(input.value+'from controllerApp');
	//3.update budget in UI
		UICtrl.addListItem(newItem, input.type);
	//4. Clear the fields
		UICtrl.clearFields();
	//5.calculate the total budget
		updateBudget();
	//6.Displaythe Calculated budget in UI
		
	}
	};
	
	
	var ctrlDeleteItem = function(event){
		var itemId, splitId;
		itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
		
		if(itemId){
			splitId = itemId.split('-');
			type = splitId[0];
			ID = parseInt(splitId[1]);
			
			//1. Delete the item from data structure
			budgetCtrl.deleteItem(type, ID);
			//2. Delete the item from the UI
			UICtrl.deleteListItem(itemId);
			console.log(itemId+" fromctrlDelete")
			
			//3. update and show new budget
			
			updateBudget();
		}
	}
	
	return{
		init: function(){
			console.log('Application Started');
			UICtrl.displayBudget({budget: 0.00, totalInc: 0.00, totalExp: 0.00, percentage: -1});
			return setupEventListeners();
		}
	}
})(budgetController, UIController);


controller.init();