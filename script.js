
const next = document.getElementById('Next');
const all_button = document.querySelector('.all-button');
const right = document.getElementById('right');
const tablebody = document.getElementById('tbody');
const form = document.getElementById('expenses');
const root = document.getElementById('root');
const dataReport = document.getElementById('inner-report');
let data = {};
let count = 0;
let arr = [];
let index = {};
let buttonArr = [];

const saveData = document.getElementById('save');
let category = '';
let value = '';

function removeActive(){
    all_button.childNodes.forEach((button)=>{
        button.id = ''; 
    })
}


const savedData = localStorage.getItem('localData') ? JSON.parse(localStorage.getItem('localData')) : null;
const buttonData = localStorage.getItem('buttonData') ? JSON.parse(localStorage.getItem('buttonData')) : null;

if (savedData) {
    index = savedData.index || {};
    data = savedData.data || {};
    initialize();
}


function initialize() {
    for(let [key, value] of Object.entries(index)){
        console.log("key", key);
        createButton(key);
    }

}


next.addEventListener('click', (event) => {
    const name = document.getElementById('name').value;
    if (name === "") {
        alert("Enter your name");
        return;
    }

    document.getElementById('first').style.display = 'none';
    root.style.display = 'flex';
    document.getElementById('expense-category').innerHTML = "Add category to start";
    form.style.display = 'none';

    document.getElementById('user-name').innerHTML = name;

});

document.getElementById('add').addEventListener('click', (event) => {

    let value = document.getElementById('input-add').value;
    if (value in index) {
        alert('Category already exists');
        document.getElementById('input-add').value = "";
        return;
    }

    document.getElementById('input-add').value = "";
    if (value === "") {
        alert('Category cannot be null');
        return;
    }

    index[value] = {
        count: 0,   
        credit: 0,
        debit: 0
    };

    createButton(value);

    localStorage.setItem('localData', JSON.stringify({ index, data}));

});

function createButton(value){

    const button = document.createElement('button');
    button.innerHTML = value;
    button.classList.add('left-button');
    buttonArr.push(value);
    all_button.appendChild(button);
}

all_button.addEventListener('click', (event) => {
    right.style.display = 'flex';
   
    reports.style.display = 'none';
    removeValue();

    removeActive();
    event.target.id = 'active';

    document.getElementById('total-credit').innerHTML = `Credits = ₹00.00`;
    document.getElementById('total-debits').innerHTML = `Debits = ₹00.00`;

    category = value;
    value = event.target.innerHTML;

    tablebody.innerHTML = '';
    arr = [];
    count = index[value].count;
    form.style.display = 'flex';
    document.getElementById('expense-category').innerHTML = value;

    if (value in data) {
        console.log(value);
        alreadySetExpense(data[value]);
    }

    form.removeEventListener('submit', addExpense);
    form.addEventListener('submit', addExpense);
});

function addExpense(event) {
    count++;
    event.preventDefault();
    let obj3 = {};

    const amount = document.getElementById('add-expense').value;
    document.getElementById('add-expense').value = "";
    const date = document.getElementById('expense-date').value;
    document.getElementById('expense-date').value = '';
    const remarks = document.getElementById('remarks').value;
    document.getElementById('remarks').value = '';
    const type = document.querySelector('input[name="type"]:checked').value;

    obj3['index'] = count;
    obj3['amount'] = amount;
    obj3['remark'] = remarks;
    obj3['type'] = type;
    obj3['date'] = date;

    arr.push(obj3);

    if (!data[value]) {
        data[value] = [];
    }

    index[value].count = count;
    data[value].push(obj3);

    let temp = { index, data };
    localStorage.setItem('localData', JSON.stringify(temp));

    setExpense(obj3, count);
}


function alreadySetExpense(val){
    index[value]['credit'] = 0;
    index[value]['debit'] = 0;

    val.forEach((obj, index)=>{
        setExpense(obj, index+1);
    })
}


function setExpense(obj, count){
    



        const tr = document.createElement('tr');
        tr.classList.add('table-card');


        const td1 = document.createElement('td');
        td1.innerHTML = obj['index'];
        tr.appendChild(td1);

        const td2 = document.createElement('td');
        td2.innerHTML = `₹${obj['amount']}`;
        tr.appendChild(td2);

        const td3 = document.createElement('td');
        td3.innerHTML = obj['remark'];
        tr.appendChild(td3);    

        const td4 = document.createElement('td');
        td4.innerHTML = obj['type'];
        tr.appendChild(td4);
        if(obj['type'] === 'Credit'){
            td4.classList.add('credit');
            index[value]['credit'] += Number(obj['amount']);
        }
        else{
            td4.classList.add('debit');
            index[value]['debit'] += Number(obj['amount']);
        }

        const td5 = document.createElement('td');
        td5.innerHTML = obj['date'];
        tr.appendChild(td5);

        tablebody.appendChild(tr);
        document.getElementById('total-credit').innerHTML = `Credits = ₹${index[value]['credit']}.00`;
        document.getElementById('total-debits').innerHTML = `Debits = ₹${index[value]['debit']}.00`;
    }


const reports = document.getElementById('reports');
const bar = document.getElementById('chart');
const title = document.getElementById('title');
const categoryReport = document.getElementById('all-report');
let columns = 0;

dataReport.addEventListener('click', (event) => {
    if(value === ''|| data[value].length === 0){
        alert('Please select a category');
        return;
    }
    title.innerHTML = `${value} expense report`;


    right.style.display = 'none';   
    reports.style.display = 'flex';

    columns = data[value].length + 1;
    chart.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    setbottom(data[value]);
    settop(data[value]);
    setbar(data[value]);
});

categoryReport.addEventListener('click', (event) => {
    removeValue();
    if(Object.keys(index).length === 0){
        alert('No category added');
        return;
    }
    title.innerHTML = 'Category wise expense report';


    right.style.display = 'none';
    reports.style.display = 'flex';

    columns = (Object.keys(index).length)*2+1;
    chart.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;


    setcategory(index);
    setcategorytop(index);

});

function setbottom(data){

    data.forEach((obj, index)=>{
        const div = document.createElement('div');
        const p1 = document.createElement('p');

        p1.innerHTML = obj['date'];
        const p2 = document.createElement('p');
        p2.innerHTML = obj['remark'];

        div.appendChild(p1);
        div.appendChild(p2);

        div.classList.add('chart-card', 'remove');
        bar.appendChild(div);
        div.style.gridColumnStart = index + 2;
        div.style.gridRowStart = 12;
    })

}

function setcolor(p1, color){
        p1.style.fontWeight = 'bold';
        p1.style.fontStyle = 'italic';
        p1.style.textDecoration = 'underline';
        p1.style.fontSize = '1.2rem';
        p1.style.textDecorationThickness = '3px';
        p1.style.textDecorationSkipInk = 'none';
        p1.style.color = color;
        p1.style.textDecorationColor = color;
}

function settop(data){
    data.forEach((obj, index)=>{
        const div = document.createElement('div');
        div.classList.add('remove');
        const p1 = document.createElement('p');
        p1.innerHTML = `₹${obj['amount']}`;
        div.appendChild(p1);
        div.classList.add('chart-card');

        if(obj['type'] === 'Credit'){
            setcolor(p1, '#28A745');
        }
        else{
            setcolor(p1, '#DC3545');
        }
        bar.appendChild(div);
        div.style.gridColumnStart = index + 2;
        div.style.gridRowStart = 1;
    })
}

function setbar(data){
    data.forEach((obj, index)=>{
        const div = document.createElement('div');
        div.classList.add('chart-card','remove');
        bar.appendChild(div);
        if(obj['type'] === 'Credit'){
            div.style.backgroundColor = '#28A745';
        }
        else{
            div.style.backgroundColor = '#DC3545';
        }
        let rowend = getFirstDigit(obj['amount']);
        let rowstart = 12;

        div.style.gridColumnStart = index + 2;
        div.style.gridRow = rowstart;
        div.style.gridRowEnd = rowstart-rowend;
    })
}


function getFirstDigit(number){
    let len = getNumberLength(number);

    if(len < 5){
        return 1;
    }
    if(len > 5){
        return 10;
    }
   

    const firstChar = number.toString()[0];
   
    return parseInt(firstChar);
  }
  
  function getNumberLength(number) {
    return Math.abs(number).toString().length;
  }

  function setcategory(index){
    let i = 0;
    for(let [key, value] of Object.entries(index)){
        const div = document.createElement('div');
        div.classList.add('remove');
        const p1 = document.createElement('p');
        p1.classList.add('remove');
        p1.innerHTML = key;
        const div2 = document.createElement('div');
        div2.classList.add('remove');
        const p2 = document.createElement('p');
        p2.classList.add('remove');
        p2.innerHTML = key;

        div.appendChild(p1);
        div.classList.add('chart-card');
        bar.appendChild(div);
        div.style.gridColumnStart = i + 2;
        div.style.gridRowStart = 12;

        div2.appendChild(p2);
        div2.classList.add('chart-card');
        bar.appendChild(div);
        bar.appendChild(div2);
        div2.style.gridColumnStart = i + 3;
        div2.style.gridRowStart = 12;
        i+=2;
    }
  }

  function setcategorytop(index){
    let i = 0;
    for(let [key, value] of Object.entries(index)){
        const div = document.createElement('div');
        div.classList.add('remove');    

        const p1 = document.createElement('p');
        p1.classList.add('remove');
        p1.innerHTML = `₹${value['credit']}`;
        setcolor(p1, '#28A745');

        setcategorybar(i, value['credit'], value['debit']);

        const div2 = document.createElement('div');
        div2.classList.add('remove');
        const p2 = document.createElement('p');
        p2.classList.add('remove');
        p2.innerHTML = `₹${value['debit']}`;
        setcolor(p2, '#DC3545');
        div.appendChild(p1);
        div.classList.add('chart-card');
        bar.appendChild(div);
        div.style.gridColumnStart = i + 2;
        div.style.gridRowStart = 1;

        div2.appendChild(p2);
        div2.classList.add('chart-card');
        bar.appendChild(div2);
        div2.style.gridColumnStart = i + 3;
        div2.style.gridRowStart = 1;
        i+=2;
    }
  }

  function setcategorybar(i, num1, num2){
    
    // for(let [key, value] of Object.entries(index)){
        const div = document.createElement('div');
        const div2 = document.createElement('div');
        div2.classList.add('chart-card','remove');
        div.classList.add('chart-card','remove');

        bar.appendChild(div);
        bar.appendChild(div2);

        div.style.backgroundColor = '#28A745';
        div2.style.backgroundColor = '#DC3545';
        console.log('credit-debit', num1, num2);
        let rowend = getFirstDigit(num1);
        let rowend2 = getFirstDigit(num2);
        console.log('rowend', rowend, rowend2);
        let rowstart = 12;
       
        div.style.gridColumnStart = i + 2;
        div2.style.gridColumnStart = i + 3;
        div.style.gridRow = rowstart;
        div.style.gridRowEnd = rowstart-rowend;
        div2.style.gridRow = rowstart;
        div2.style.gridRowEnd = rowstart-rowend2;
        i+=2;
    // }
  }

  function removeValue(){
    const element1 = document.querySelectorAll('.remove');
    element1.forEach((element)=>{
        element.remove();
    })
  }