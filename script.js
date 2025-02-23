
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

const getDenominationValue = (name) => {
  switch (name) {
    case "PENNY": return 0.01;
    case "NICKEL": return 0.05;
    case "DIME": return 0.1;
    case "QUARTER": return 0.25;
    case "ONE": return 1;
    case "FIVE": return 5;
    case "TEN": return 10;
    case "TWENTY": return 20;
    case "ONE HUNDRED": return 100;
    default: return 0;
  }
};

const updateCashInDrawer = () => {
  remainingCash.innerHTML = `${cid
    .map(
      ([denoName, amountAvailable]) =>
      `<b>${denoName}</b>: $${amountAvailable.toFixed(2)}`
    )
    .join("<br>")}`;
};

const calculateChangeDue = () => {
  let price = parseFloat(itemPrice.value);
  let cash = parseFloat(cashInput.value);
  let changeDue = parseFloat((cash - price).toFixed(2));

  let totalCID = parseFloat(
    cid.reduce((acc, [_, amount]) => acc + amount, 0).toFixed(2)
  );

  if (changeDue > totalCID) {
    return (changeDueElement.innerText = "Status: INSUFFICIENT_FUNDS");
  }

  let changeArr = [];
  let reversedCID = [...cid].reverse();
  for (let [denoName, denoAmountAvailable] of reversedCID) {
    let denoValue = getDenominationValue(denoName);
    let denoAmountToReturn = 0;

    while (changeDue >= denoValue && denoAmountAvailable > 0) {
      denoAmountToReturn += denoValue;
      denoAmountAvailable -= denoValue;
      changeDue -= denoValue;
      changeDue = Math.round(changeDue * 100) / 100; // 🔹 Fix floating-point issues
    }
    if (denoAmountToReturn > 0) {
      changeArr.push([denoName, parseFloat(denoAmountToReturn.toFixed(2))]);
    }
  }

  if (changeDue > 0) {
    return (changeDueElement.innerText = "Status: INSUFFICIENT_FUNDS"); // 🔹 Updated message for clarity
  }

  // 🔹 Update cash in drawer by subtracting given change
  cid = cid.map(([denoName, amount]) => {
    let changeGiven = changeArr.find(([name]) => name === denoName)?.[1] || 0;
    return [denoName, parseFloat((amount - changeGiven).toFixed(2))];
  });

  updateCashInDrawer(); // 🔹 Update cash in drawer display

  let updatedTotalCID = parseFloat(
    cid.reduce((acc, [_, amount]) => acc + amount, 0).toFixed(2)
  );

  if (updatedTotalCID === 0) {
    // 🔹 Changed condition to check if drawer is empty
    return (changeDueElement.innerText = `\n Status: CLOSED \n
        ${changeArr
          .map(
            ([denoName, amountAvailable]) =>
              `${denoName}: $${amountAvailable.toFixed(2)}`
          )
          .join("\n")}\n`);
  }

  changeDueElement.innerText = `\n Status: OPEN \n
    ${changeArr
      .map(
        ([denoName, amountAvailable]) =>
          `${denoName}: $${amountAvailable.toFixed(2)}`
      )
      .join("\n")}\n`;
};

window.onload = updateCashInDrawer; // 🔹 Update cash in drawer display on page load

purchaseBtn.addEventListener("click", () => {
  let cash = parseFloat(cashInput.value);
  let price = parseFloat(itemPrice.value);
  if (cash < price) {
    return alert("Customer does not have enough money to purchase the item");
  } else if (cash === price) {
    return (changeDueElement.innerText =
      "No change due - customer paid with exact cash");
  } else {
    calculateChangeDue();
  }
});