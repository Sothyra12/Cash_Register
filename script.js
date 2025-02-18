const cashInput = document.getElementById("cash");
const changeDueElement = document.getElementById("change-due");
const purchaseBtn = document.getElementById("purchase-btn");

const price = 19.5;
const denomValues = {
  "PENNY": 0.01, "NICKEL": 0.05, "DIME": 0.1, "QUARTER": 0.25,
  "ONE": 1, "FIVE": 5, "TEN": 10, "TWENTY": 20, "ONE HUNDRED": 100
};
const cid = [
  ["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0],
  ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]
];

const calculateChangeDue = () => {
  const cash = +cashInput.value;
  let changeDue = cash - price;
  if (changeDue < 0) return alert("Insufficient funds");

  const change = [...cid].reverse().reduce((acc, [denoName, amountAvailable]) => {
    const denomValue = denomValues[denoName];
    if (changeDue >= denomValue && amountAvailable > 0) {
      const amountToReturn = Math.min(Math.floor(changeDue / denomValue), Math.floor(amountAvailable / denomValue));
      if (amountToReturn > 0) {
        acc.push({ denoName, amount: amountToReturn * denomValue });
        changeDue -= amountToReturn * denomValue;
        changeDue = parseFloat(changeDue.toFixed(2)); // Precision fix
      }
    }
    return acc;
  }, []);

  if (changeDue > 0) return changeDueElement.innerText = "Status: INSUFFICIENT_FUNDS";

  const totalCID = cid.reduce((acc, [, amount]) => acc + amount, 0);
  if (Math.abs(cash - price - totalCID) < 0.001) {
    return changeDueElement.innerText = `Status: CLOSED ${cid.filter(([_, amount]) => amount > 0).map(([denoName, amount]) => `${denoName}: $${amount.toFixed(2)}`).join(' ')}`;
  }

  changeDueElement.innerText = `Status: OPEN ${change.sort((a, b) => denomValues[b.denoName] - denomValues[a.denoName]).map(({ denoName, amount }) => `${denoName}: $${amount.toFixed(2)}`).join(' ')}`;
};

purchaseBtn.addEventListener("click", () => {
  const cash = +cashInput.value;
  if (cash < price) {
    return alert("Customer does not have enough money to purchase the item");
  }
  changeDueElement.textContent = cash === price ? "No change due - customer paid with exact cash" : "";
  if (cash > price) calculateChangeDue();
});