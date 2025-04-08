const priceOutput = document.querySelector("#currentPriceRange");
const minPrice = document.querySelector("#minPrice");
const maxPrice = document.querySelector("#maxPrice");
const allergens = ["Milk", "Eggs", "Fish", "Crustacean Shellfish", "Tree Nuts", "Peanuts", "Wheat", "Soybeans", "Sesame"];


function setAlergens()
{
    const exclude = document.querySelector(".exclude");
    allergens.forEach(allergen => {
        const html = allergenTemplate(allergen);
        exclude.insertAdjacentHTML("beforeend", html)});
}
function allergenTemplate(allergen)
{
    return `<input type="checkbox" name="exclude" id="${allergen}" class="exclude">
               <label for="${allergen}">${allergen}</label>`
}
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
    
    if (checkboxesInclude.length > 0) {
        let includesArray = [];
        checkboxesInclude.forEach(checkbox => {
            includesArray.push(checkbox.id);
        });
        urlParams.append('include', includesArray.join(','));
    }    
    
    if (checkboxesExclude.length > 0) {
        let excludesArray = [];
        checkboxesExclude.forEach(checkbox => {
            excludesArray.push(checkbox.id);
        });
        urlParams.append('exclude', excludesArray.join(','));
    }
    
    // Construct the URL with the parameters
    let url = "recipe.html" + '?' + urlParams.toString();
    window.location.href = url; // Navigate to the updated URL with parameters
}

function set_macro_info()
{
    const carbs = document.querySelector("#carbsAmount");
    const proteins = document.querySelector("#proteinsAmount");
    const fats = document.querySelector("#fatsAmount");

    const carbslider = document.querySelector("#carbs");
    const proteinslider = document.querySelector("#proteins");
    const fatslider = document.querySelector("#fats");

    carbs.innerText = carbslider.value;
    proteins.innerText = proteinslider.value;
    fats.innerText = fatslider.value;
}

document.querySelectorAll(".macros > input").forEach(input => input.addEventListener("input", set_macro_info));
document.querySelectorAll(".apply").forEach(button => button.addEventListener('click', submit));
setAlergens();
