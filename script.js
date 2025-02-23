// script.js

const cashInput = document.getElementById("cash");
const changeDueElement = document.getElementById("change-due");
const purchaseBtn = document.getElementById("purchase-btn");

const price = 19.5;
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

// Denomination values
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
  const cash = parseFloat(cashInput.value);
  let changeDue = parseFloat((cash - price).toFixed(2));

  let totalCID = parseFloat(
    cid.reduce((acc, [_, amount]) => acc + amount, 0).toFixed(2)
  );

  if (changeDue > totalCID) {
    changeDueElement.innerText = "Status: INSUFFICIENT_FUNDS";
    return;
  }

  let changeArr = [];
  let remainingCID = [...cid].reverse();

  for (let [denoName, amountAvailable] of remainingCID) {
    let denomValue = getDenominationValue(denoName);
    let amountToReturn = 0;

    while (changeDue >= denomValue && amountAvailable > 0) {
      amountToReturn += denomValue;
      amountAvailable -= denomValue;
      changeDue -= denomValue;
      changeDue = parseFloat(changeDue.toFixed(2)); // Avoid floating-point issues
    }

    if (amountToReturn > 0) {
      changeArr.push([denoName, parseFloat(amountToReturn.toFixed(2))]);
    }
  }

  if (changeDue > 0) {
    changeDueElement.innerText = "Status: INSUFFICIENT_FUNDS";
    return;
  }

  let updatedTotalCID = parseFloat(
    cid.reduce((acc, [deno, amount]) => acc + amount, 0).toFixed(2)
  );

  if (updatedTotalCID === parseFloat((cash - price).toFixed(2))) {
    changeDueElement.innerText = `Status: CLOSED ${changeArr
      .map(([denoName, amount]) => `${denoName}: $${amount.toFixed(2)}`)
      .join(" ")}`;
    return;
  }

  changeDueElement.innerText = `Status: OPEN ${changeArr
    .map(([denoName, amount]) => `${denoName}: $${amount.toFixed(2)}`)
    .join(" ")}`;
};

purchaseBtn.addEventListener("click", () => {
  const cash = parseFloat(cashInput.value);
  if (cash < price) {
    return alert("Customer does not have enough money to purchase the item");
  }
  changeDueElement.textContent =
    cash === price ? "No change due - customer paid with exact cash" : "";
  if (cash > price) calculateChangeDue();
});