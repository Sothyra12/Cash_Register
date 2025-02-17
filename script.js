// script.js

const cashInput = document.getElementById("cash");
const changeDueElement = document.getElementById("change-due");
const purchaseBtn = document.getElementById("purchase-btn");

let cash = 0;
let price = 1.87;
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

const checkForChangeDue = () => {
  cash = Number(cashInput.value);
  if (cash < price) {
    alert("Customer does not have enough money to purchase the item");
  } else if ((cash === price)) {
    changeDueElement.textContent =
      "No change due - customer paid with exact cash";
  } else {
    calculateChangeDue();
  }
};

const calculateChangeDue = () => {
  let changeDue = cash - price;
};

const checkCashInDrawer = () => {
  
};

purchaseBtn.addEventListener("click", () => {
  checkForChangeDue();
});
