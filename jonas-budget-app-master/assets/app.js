BudgetController = (function () {
	var Expenses = function (id, des, val) {
		this.id = id;
		this.des = des;
		this.val = val;
		this.percentage = -1;
	}
	var Income = function (id, des, val) {
		this.id = id;
		this.des = des;
		this.val = val;
	}

	Expenses.prototype.calcPercentage = function (totalINCOME) {
		if (totalINCOME > 0) {
			this.percentage = Math.round((this.val / totalINCOME) * 100)
		} else {
			this.percentage = -1;
		}
	}

	Expenses.prototype.getPercentage = function () {
		return this.percentage;
	}
	var calculateTotal = function (type) {
		var sum = 0;
		data.allItems[type].forEach(function (cur) {
			sum += cur.val;
		})
		data.total[type] = sum;
	}

	var data = {
		allItems: {
			expenses: [],
			income: []
		},
		total: {
			expenses: 0,
			income: 0
		},
		budget: 0,
		percentage: -1
	}

	return {
		getData: function (type, des, val) {
			let newItem;
			let ID;
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
				console.log(ID);
			}
			else {
				ID = 0
			}
			if (type === 'expenses') {
				newItem = new Expenses(ID, des, val)
			} else {
				newItem = new Income(ID, des, val)
			}

			data.allItems[type].push(newItem);
			return newItem;
		},
		calculateBudget: function () {
			calculateTotal(`expenses`);
			calculateTotal('income');
			data.budget = data.total.income - data.total.expenses;
			console.log(data.total.income);
			if (data.total.income > 0) {
				data.percentage = Math.round(
					(data.total.expenses / data.total.income) * 100
				);

			} else {
				data.percentage = -1;
			}
			console.log(data.percentage)
		},
		calculatePercentages: function () {
			data.allItems.expenses.forEach(function (cur) {
				cur.calcPercentage(data.total.income);
			})
		},
		getPercentages: function () {
			var allPerc = data.allItems.expenses.map(function (cur) {
				return cur.getPercentage();
			})
			return allPerc
		},
		getBudget: function () {
			return {
				budget: data.budget,
				totalIncome: data.total.income,
				totalExpenses: data.total.expenses,
				percentage: data.percentage
			}
		},
		deleteItem: function (type, id) {
			let ids = data.allItems[type].map((value) => {
				return value.id;
			})

			let index = ids.indexOf(id)
			if (index !== -1) {
				data.allItems[type].splice(index, 1);
			}
		},
		testing: function () {
			return data
		}
	};

})()



UIController = (function () {

	let DomStrings = {
		inputType: '.add__type',
		inputDEs: '.add__description',
		inputVal: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLbl: '.budget__value',
		incomeLbl: '.budget__income--value',
		expensesLbl: '.budget__expenses--value',
		percentLbl: '.budget__expenses--percentage',
		container: '.container',
		expensePercenLAb: '.item__percentage',
		dateLbe: '.budget__title--month'
	}

	var formatText = function (val, type) {
		let valSpilt, int, dec, sign;
		val = Math.abs(val);
		val = val.toFixed(2)
		valSpilt = val.split('.')
		int = valSpilt[0]
		if (int.length > 3) {
			int = int.substring(0, int.length - 3) + ',' + int.substring(int.length - 3, int.length)
		}
		dec = valSpilt[1]
		return (type === 'expenses' ? sign = '-' : '+') + ' ' + int + '.' + dec
	}

	return {
		getInput: function () {
			return {
				type: document.querySelector(DomStrings.inputType).value,
				desCription: document.querySelector(DomStrings.inputDEs).value,
				value: parseFloat(document.querySelector(DomStrings.inputVal).value)
			}
		},
		SHAREDOM: function () {
			return DomStrings;
		},
		displayItem: function (obj, type) {
			let html, container;
			if (type === 'expenses') {
				container = DomStrings.expensesContainer;
				html = `<div class="item clearfix" id="expenses-${obj.id}">
			<div class="item__description">${obj.des}</div>
			<div class="right clearfix">
				<div class="item__value">${formatText(obj.val, type)}</div>
				<div class="item__percentage"></div>
				<div class="item__delete">
					<button class="item__delete--btn">
						<i class="ion-ios-close-outline" data-item="expenses-LH1P1CDK3O50M">
						</i>
					</button>
				</div>
			</div>
		  </div>`
			}
			else if (type === 'income') {
				container = DomStrings.incomeContainer;
				html = `<div class="item clearfix" id="income-${obj.id}">
				<div class="item__description">${obj.des}</div>
				<div class="right clearfix">
					<div class="item__value">${formatText(obj.val, type)}</div>
					<div class="item__delete">
						<button class="item__delete--btn">
							<i class="ion-ios-close-outline" data-item="income-LH1OXE95Y38SL">
							</i>
						</button>
					</div>
				</div>
			</div>`
			}
			document.querySelector(container).insertAdjacentHTML("beforeend", html);
		},
		cleaerInput: function () {
			let fields,
				resArr
			fields = document.querySelectorAll(DomStrings.inputDEs + ', ' + DomStrings.inputVal);
			resArr = Array.prototype.slice.call(fields);
			resArr.forEach(function (ele) {
				ele.value = "";
			});
			resArr[0].focus();
		},
		deleteITEMlist: function (selectorID) {
			let el = document.getElementById(selectorID)
			el.parentNode.removeChild(el)
		},
		displayBudget: function (obj) {
			var type;
			obj.budget > 0 ? type = 'income' : type = 'expenses'
			document.querySelector(DomStrings.budgetLbl).textContent = formatText(obj.budget, type)
			document.querySelector(DomStrings.incomeLbl).textContent = formatText(obj.totalIncome, 'income')
			document.querySelector(DomStrings.expensesLbl).textContent = formatText(obj.totalExpenses, 'expenses')
			let percent = document.querySelector(DomStrings.percentLbl);
			if (obj.percentage >= 0) {
				percent.textContent = obj.percentage + '%';
			} else {
				percent.textContent = '...';
			}
		},
		displayPercentages: function (percentages) {
			var fields = document.querySelectorAll(DomStrings.expensePercenLAb)


			var nodeListForEach = function (list, callback) {
				for (let i = 0; i < list.length; i++) {
					callback(list[i], i)
				}
			}

			nodeListForEach(fields, function (current, index) {
				if (percentages[index] > 0) {
					current.textContent = percentages[index] + '%';
				} else {
					current.textContent = '...'
				}
			})
		},
		displayMonth: function () {
			let date, year, month, months;
			date = new Date()
			months = [
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December'
			];
			year = date.getFullYear()
			month = date.getMonth()
			document.querySelector(DomStrings.dateLbe).textContent = months[month] + ' ' + year
		},
		changeTyped: function () {
			const inputs = document.querySelectorAll(
				DomStrings.inputType +
				', ' +
				DomStrings.inputDEs +
				', ' +
				DomStrings.inputVal
			);

			inputs.forEach(input => {
				input.classList.toggle('red-focus');
			});

			document.querySelector(DomStrings.inputBtn).classList.toggle('red');
		}
	}

})()



Controller = (function (budgetCltr, UICtlr) {

	let updateBudget = function () {
		budgetCltr.calculateBudget();
		let budget = budgetCltr.getBudget();
		UICtlr.displayBudget(budget);
	}

	let updatePERcentages = function () {

		budgetCltr.calculatePercentages();
		var percentages = budgetCltr.getPercentages();
		UICtlr.displayPercentages(percentages);
	}

	let SettingUpEvts = function () {
		let DOM = UICtlr.SHAREDOM();
		document.querySelector(DOM.inputBtn).addEventListener('click', controlatItem);
		document.addEventListener('keypress', function (e) {
			if (e.keyCode === 13 || e.which === 13) {
				controlatItem();
			}
		})
		document.querySelector(DOM.container).addEventListener('click', controlatDetele)
		document.querySelector(DOM.inputType).addEventListener('change', UICtlr.changeTyped)
	}


	let controlatItem = function () {
		let input,
			newItem;
		input = UICtlr.getInput();
		if (input.desCription !== '' && !isNaN(input.value) && input.value > 0) {
			newItem = budgetCltr.getData(input.type, input.desCription, input.value);
			UICtlr.displayItem(newItem, input.type);
			UICtlr.cleaerInput();
			updateBudget();
			updatePERcentages();
		}
	}

	var controlatDetele = function (event) {
		var ItemID, spiltID, type, ID
		ItemID = event.target.parentNode.parentNode.parentNode.parentNode.id
		if (ItemID) {
			spiltID = ItemID.split('-');
			type = spiltID[0];
			ID = parseInt(spiltID[1])
			budgetCltr.deleteItem(type, ID);
			UICtlr.deleteITEMlist(ItemID);
			updateBudget();
		}
	}

	return {
		init: function () {
			SettingUpEvts();
			UICtlr.displayMonth();
			UICtlr.displayBudget({
				budget: '+' + 0 + '.00',
				totalIncome: 0,
				totalExpenses: 0,
				percentage: -1
			})
		}
	}

})(BudgetController, UIController)


Controller.init();