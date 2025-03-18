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

function submit(event)
{
    event.preventDefault();
    let urlParams = new URLSearchParams();
    let checkboxesInclude = document.querySelectorAll('.include input[type="checkbox"]:checked');
    let checkboxesExclude = document.querySelectorAll('.exclude input[type="checkbox"]:checked');
    console.log(checkboxesExclude);
    
    if(checkboxesinclude.length > 0) {
        let includes = "";
        checkboxesInclude.forEach(function (checkbox) {
            includes += checkbox.id + "," // Using id as the value
        });
        urlParams.append('include', includes);
    }
    
    if(checkboxesExclude.length > 0) {
        let excludes = "";
        checkboxesExclude.forEach(checkbox => {
            excludes += checkbox.id + ",";
        });
        urlParams.append('exclude', excludes);
    }
    // Construct the URL with the parameters
    let url = "filters.html" + '?' + urlParams.toString();
    window.location.href = url; // Navigate to the updated URL with parameters
}
document.querySelector(".apply").addEventListener('click', submit);