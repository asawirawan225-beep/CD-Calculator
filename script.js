document.getElementById("calculate").addEventListener("click", function () {

    let deposit = parseFloat(document.getElementById("deposit").value);
    let rate = parseFloat(document.getElementById("rate").value);
    let years = parseFloat(document.getElementById("years").value);
    let months = parseFloat(document.getElementById("months").value) || 0;
    let compound = parseFloat(document.getElementById("compound").value);
    let currency = document.getElementById("currency").value;

    if (isNaN(deposit) || isNaN(rate) || isNaN(years)) {
        alert("Please fill in all fields.");
        return;
    }
    if (deposit <= 0 || rate <= 0 || years < 0 || months < 0) {
    alert("Please enter valid positive values.");
    return;
}

    let totalYears = years + (months / 12);

    let finalBalance = deposit * Math.pow(
        (1 + (rate / 100) / compound),
        compound * totalYears
    );

    let interestEarned = finalBalance - deposit;

    document.getElementById("finalBalance").innerHTML =
        currency + " " + finalBalance.toFixed(2);

    document.getElementById("interestEarned").innerHTML =
        currency + " " + interestEarned.toFixed(2);
        let today = new Date();

let maturityDate = new Date(today);

maturityDate.setMonth(maturityDate.getMonth() + (years * 12) + months);

document.getElementById("maturityDate").innerHTML =
    maturityDate.toLocaleDateString();
    document.getElementById("summaryText").innerHTML =
`
Initial Deposit: ${currency} ${deposit.toFixed(2)}<br>
Interest Rate: ${rate}%<br>
Investment Period: ${years} Years ${months} Months<br>
Compounding: ${compound} times/year<br>
Final Balance: ${currency} ${finalBalance.toFixed(2)}<br>
Interest Earned: ${currency} ${interestEarned.toFixed(2)}
`;

    // Interest Growth Table
    let tableBody = document.querySelector("#growthTable tbody");

    tableBody.innerHTML = "";

    for (let i = 1; i <= Math.floor(totalYears); i++) {

        let balance = deposit * Math.pow(
            (1 + (rate / 100) / compound),
            compound * i
        );

        let interest = balance - deposit;

        tableBody.innerHTML += `
        <tr>
            <td>${i}</td>
            <td>${currency} ${balance.toFixed(2)}</td>
            <td>${currency} ${interest.toFixed(2)}</td>
        </tr>
        `;
    }
   let historyList = document.getElementById("historyList");

let listItem = document.createElement("li");

listItem.innerHTML =
    "Deposit: " + currency + " " + deposit +
    " | Rate: " + rate + "%" +
    " | Years: " + totalYears +
    " | Final Balance: " + currency + " " + finalBalance.toFixed(2);

historyList.appendChild(listItem);
let history = JSON.parse(localStorage.getItem("cdHistory")) || [];

history.push(listItem.innerHTML);

localStorage.setItem("cdHistory", JSON.stringify(history));
});

document.getElementById("darkModeBtn").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
});
document.getElementById("compareBtn").addEventListener("click", function () {

    let depositA = parseFloat(document.getElementById("depositA").value);
    let rateA = parseFloat(document.getElementById("rateA").value);
    let yearsA = parseFloat(document.getElementById("yearsA").value);

    let depositB = parseFloat(document.getElementById("depositB").value);
    let rateB = parseFloat(document.getElementById("rateB").value);
    let yearsB = parseFloat(document.getElementById("yearsB").value);

    if (
        isNaN(depositA) || isNaN(rateA) || isNaN(yearsA) ||
        isNaN(depositB) || isNaN(rateB) || isNaN(yearsB)
    ) {
        alert("Please fill in all comparison fields.");
        return;
    }

    let finalA = depositA * Math.pow(1 + (rateA / 100), yearsA);
    let finalB = depositB * Math.pow(1 + (rateB / 100), yearsB);

    let result = `
        <strong>Plan A Final Balance:</strong> ${finalA.toFixed(2)} <br>
        <strong>Plan B Final Balance:</strong> ${finalB.toFixed(2)} <br><br>
    `;

    if (finalA > finalB) {
        result += "✅ Plan A gives a higher return.";
    } else if (finalB > finalA) {
        result += "✅ Plan B gives a higher return.";
    } else {
        result += "✅ Both plans give the same return.";
    }

    document.getElementById("compareResult").innerHTML = result;

});
document.getElementById("downloadPdf").addEventListener("click", function () {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("CD Calculator Report", 20, 20);

    doc.setFontSize(12);
    doc.text(
        "Final Balance: " +
        document.getElementById("finalBalance").innerText,
        20,
        40
    );

    doc.text(
        "Total Interest: " +
        document.getElementById("interestEarned").innerText,
        20,
        50
    );

    doc.save("CD_Calculator_Report.pdf");
});
window.addEventListener("load", function () {

    let history = JSON.parse(localStorage.getItem("cdHistory")) || [];

    let historyList = document.getElementById("historyList");

    history.forEach(function(item){

        let li = document.createElement("li");

        li.innerHTML = item;

        historyList.appendChild(li);

    });

});
document.getElementById("clearHistory").addEventListener("click", function () {

    localStorage.removeItem("cdHistory");

    document.getElementById("historyList").innerHTML = "";

});
document.getElementById("resetBtn").addEventListener("click", function () {

    document.getElementById("finalBalance").innerHTML = "0";
    document.getElementById("interestEarned").innerHTML = "0";
    document.getElementById("maturityDate").innerHTML = "-";

    document.querySelector("#growthTable tbody").innerHTML = "";

});
document.getElementById("downloadCSV").addEventListener("click", function () {

    let data =
`Field,Value
Final Balance,${document.getElementById("finalBalance").innerText}
Interest Earned,${document.getElementById("interestEarned").innerText}
Maturity Date,${document.getElementById("maturityDate").innerText}`;

    let blob = new Blob([data], { type: "text/csv" });

    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");

    a.href = url;
    a.download = "CD_Calculator_Report.csv";

    a.click();

    URL.revokeObjectURL(url);

});
