 // Variables para almacenar ingresos, gastos y presupuestos
 let incomes = [];
 let expenses = [];
 let budgets = [];

 // Función para guardar datos en el almacenamiento local
 function saveData() {
     localStorage.setItem('incomes', JSON.stringify(incomes));
     localStorage.setItem('expenses', JSON.stringify(expenses));
     localStorage.setItem('budgets', JSON.stringify(budgets));
 }

 // Función para cargar datos del almacenamiento local
 function loadData() {
     const savedIncomes = localStorage.getItem('incomes');
     const savedExpenses = localStorage.getItem('expenses');
     const savedBudgets = localStorage.getItem('budgets');

     if (savedIncomes) {
         incomes = JSON.parse(savedIncomes);
     }

     if (savedExpenses) {
         expenses = JSON.parse(savedExpenses);
     }

     if (savedBudgets) {
         budgets = JSON.parse(savedBudgets);
     }

     updateBudget();
     updateList('incomeList', incomes);
     updateList('expenseList', expenses);
     updateList('budgetList', budgets);
 }

 // Función para agregar ingresos
 function addIncome() {
     const description = document.getElementById('incomeDescription').value;
     const amount = parseFloat(document.getElementById('incomeAmount').value);

     if (description && !isNaN(amount) && amount > 0) {
         incomes.push({ description, amount });
         updateBudget();
         updateList('incomeList', incomes);
         resetInput('incomeDescription', 'incomeAmount');
         saveData(); // Guardar datos después de agregar ingreso
     } else {
         alert('Ingresa una descripción válida y un monto positivo.');
     }
 }

 // Función para agregar gastos
 function addExpense() {
     const description = document.getElementById('expenseDescription').value;
     const amount = parseFloat(document.getElementById('expenseAmount').value);

     if (description && !isNaN(amount) && amount > 0) {
         expenses.push({ description, amount });
         updateBudget();
         updateList('expenseList', expenses);
         resetInput('expenseDescription', 'expenseAmount');
         saveData(); // Guardar datos después de agregar gasto
     } else {
         alert('Ingresa una descripción válida y un monto positivo.');
     }
 }

 // Función para agregar presupuestos
 function addBudget() {
     const description = document.getElementById('budgetDescription').value;
     const amount = parseFloat(document.getElementById('budgetAmount').value);

     if (description && !isNaN(amount) && amount > 0) {
         budgets.push({ description, amount });
         updateBudget();
         updateList('budgetList', budgets);
         resetInput('budgetDescription', 'budgetAmount');
         saveData(); // Guardar datos después de agregar presupuesto
     } else {
         alert('Ingresa una descripción válida y un monto positivo.');
     }
 }

 // Función para actualizar el presupuesto
 function updateBudget() {
     const totalIncome = calculateTotal(incomes);
     const totalExpense = calculateTotal(expenses);
     const monthlyBudget = calculateTotal(budgets);
     const annualBudget = monthlyBudget * 12;
     const balance = totalIncome - totalExpense;

     document.getElementById('totalIncome').textContent = formatNumber(totalIncome);
     document.getElementById('totalExpense').textContent = formatNumber(totalExpense);
     document.getElementById('monthlyBudget').textContent = formatNumber(monthlyBudget);
     document.getElementById('annualBudget').textContent = formatNumber(annualBudget);
     document.getElementById('balance').textContent = formatNumber(balance);
 }

 // Función para actualizar la lista de ingresos, gastos o presupuestos
 function updateList(listId, items) {
     const listElement = document.getElementById(listId);
     listElement.innerHTML = '';

     items.forEach((item, index) => {
         const listItem = document.createElement('li');
         listItem.innerHTML = `${item.description}: $${formatNumber(item.amount)}`;
         
         // Agregar botones para modificar y borrar
         const editButton = document.createElement('button');
         editButton.textContent = 'Modificar';
         editButton.onclick = () => editItem(listId, index);

         const deleteButton = document.createElement('button');
         deleteButton.textContent = 'Borrar';
         deleteButton.onclick = () => deleteItem(listId, index);

         listItem.appendChild(editButton);
         listItem.appendChild(deleteButton);

         listElement.appendChild(listItem);
     });
 }

 // Función para editar un elemento de la lista
 function editItem(listId, index) {
     const newList = getListFromArrayName(listId);
     const item = newList[index];

     const newDescription = prompt('Ingrese la nueva descripción:', item.description);
     const newAmount = parseFloat(prompt('Ingrese el nuevo monto:', item.amount));

     if (newDescription && !isNaN(newAmount) && newAmount > 0) {
         newList[index] = { description: newDescription, amount: newAmount };
         updateBudget();
         updateList(listId, newList);
         saveData(); // Guardar datos después de editar
     } else {
         alert('Entrada inválida. La descripción debe ser no vacía y el monto debe ser un número positivo.');
     }
 }

 // Función para borrar un elemento de la lista
 function deleteItem(listId, index) {
     const newList = getListFromArrayName(listId);
     newList.splice(index, 1);
     updateBudget();
     updateList(listId, newList);
     saveData(); // Guardar datos después de borrar
 }

 // Función para obtener la lista correspondiente a un nombre de array
 function getListFromArrayName(listId) {
     switch (listId) {
         case 'incomeList':
             return incomes;
         case 'expenseList':
             return expenses;
         case 'budgetList':
             return budgets;
         default:
             return [];
     }
 }

 // Función para calcular el total de ingresos, gastos o presupuestos
 function calculateTotal(items) {
     return items.reduce((total, item) => total + item.amount, 0);
 }

 // Función para formatear números con comas
 function formatNumber(number) {
     return number.toLocaleString('es-ES', { style: 'currency', currency: 'USD' });
 }

 // Función para resetear los campos de entrada
 function resetInput(descriptionId, amountId) {
     document.getElementById(descriptionId).value = '';
     document.getElementById(amountId).value = '';
 }

 // Llamamos a loadData al cargar la página para cargar los datos guardados
 loadData();


