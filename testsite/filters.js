const priceOutput = document.querySelector("#currentPriceRange");
const minPrice = document.querySelector("#minPrice");
const maxPrice = document.querySelector("#maxPrice");

function setPriceRange() {
    console.log("called");
    if (maxPrice.value !== minPrice.value) {
        maxPrice.min = minPrice.value;
        minPrice.max = maxPrice.value;
    }
    priceOutput.innerText = `${minPrice.value} - ${maxPrice.value}`;
}

minPrice.addEventListener("input", setPriceRange);
maxPrice.addEventListener("input", setPriceRange);