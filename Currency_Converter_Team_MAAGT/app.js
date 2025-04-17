const Base_URL = "https://api.exchangerate-api.com/v4/latest"; 
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const resultBox = document.querySelector(".result");


for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement('option');
        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        } else if (select.name === "to" && currCode === "PKR") {
            newOption.selected = true;
        }
        select.appendChild(newOption);
    }

    
    select.addEventListener('change', (evt) => {
        updateFlag(evt.target);
    });
}


const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode]; // Get country code from external file
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

    let img = element.parentElement.querySelector("img");
    if (img) {
        img.src = newSrc;
    }
};

// Fetch exchange rate and convert currency
btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }


    const URL = `${Base_URL}/${fromCurr.value}`;

    try {
        let response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        let data = await response.json();
        let exchangeRate = data.rates[toCurr.value];

        if (!exchangeRate) {
            throw new Error("Exchange rate not found for this currency pair.");
        }

        let convertedAmount = (amtVal * exchangeRate).toFixed(2);

    
        if (resultBox) {
            resultBox.innerText = `${amtVal} ${fromCurr.value} = ${convertedAmount} ${toCurr.value}`;
        } else {
            console.error("Error: .result element not found in HTML.");
        }
        
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        if (resultBox) {
            resultBox.innerText = "Error fetching exchange rate.";
        }
    }
});
