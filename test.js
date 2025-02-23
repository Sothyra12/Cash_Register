// script.js

const cashInput = document.getElementById("cash");
const changeDueElement = document.getElementById("change-due");
const purchaseBtn = document.getElementById("purchase-btn");
const itemPrice = document.getElementById("item-price");
const remainingCash = document.getElementById("remainingCID");

let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];

// Denomination values to tell the computer how much each denomination is worth
const getDenominationValue = (name) => {
    switch (name) {
        case "PENNY":
            return 0.01;
        case "NICKEL":
            return 0.05;
        case "DIME":
            return 0.1;
        case "QUARTER":
            return 0.25;
        case "ONE":
            return 1;
        case "FIVE":
            return 5;
        case "TEN":
            return 10;
        case "TWENTY":
            return 20;
        case "ONE HUNDRED":
            return 100;
        default:
            return 0;
    }
};

const calculateChangeDue = () => {

    // use let instead of const to allow the value to be changed
    let price = parseFloat(itemPrice.value);
    let cash = parseFloat(cashInput.value);
    let changeDue = parseFloat((cash - price).toFixed(2));

    // get the total amount of cash in the drawer
    let totalCID = parseFloat(cid.reduce((acc, [_, amount]) => acc + amount, 0).toFixed(2));

    if (changeDue > totalCID) {
       return changeDueElement.innerText = "Status: INSUFFICIENT_FUNDS";
    }

    let changeArr = [];
    let reversedCID = [...cid].reverse();
    for (let [denoName, denoAmountAvailable] of reversedCID) {
        let denoValue = getDenominationValue(denoName);
        let denoAmountToReturn = 0;

        // review
        while (changeDue >= denoValue && denoAmountAvailable > 0) {
            denoAmountToReturn += denoValue;
            denoAmountAvailable -= denoValue;
            changeDue -= denoValue;
            changeDue = Number(changeDue.toFixed(2));
        }
        if (denoAmountToReturn > 0) {
            changeArr.push([denoName, parseFloat(denoAmountToReturn.toFixed(2))]);
        }
    }

    if (changeDue > 0) {
        return changeDueElement.innerText = "Status: Change already given";
    }

    // after the subtraction, get the total updated amount of cash in the drawer
    let updatedTotalCID = parseFloat(cid.reduce((acc, [_, amount]) => acc + amount,0).toFixed(2));

    if (totalCID === changeDue) {
        return changeDueElement.innerText = `\n Status: CLOSED \n
        ${changeArr.map(([denoName, amountAvailable]) => `${denoName}: $${amountAvailable.toFixed(2)}`).join("\n")}\n
        `;
    }

    if (updatedTotalCID > 0) {
        changeDueElement.innerText = `\n Status: OPEN \n
        ${changeArr.map(([denoName, amountAvailable]) => `${denoName}: $${amountAvailable.toFixed(2)}`).join("\n")}\n
        `;
    }
};

purchaseBtn.addEventListener("click", () => {
    let cash = parseFloat(cashInput.value);
    let price = parseFloat(itemPrice.value);
    if (cash < price) {
        return alert("Customer does not have enough money to purchase the item");
    } else if (cash === price) {
        return changeDueElement.innerText = "No change due - customer paid with exact cash";
    } else {
        calculateChangeDue();
    }
});