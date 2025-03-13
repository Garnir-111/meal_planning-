const priceOutput = document.querySelector("#currentPriceRange");
const minPrice = document.querySelector("#minPrice");
const maxPrice = document.querySelector("#maxPrice");

function setPriceRange()
{
    console.log("called");
    priceOutput.innerText = `${minPrice.value} - ${maxPrice.value}`;
}

minPrice.addEventListener("mouseup", setPriceRange);