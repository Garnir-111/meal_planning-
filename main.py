from flask import Flask, render_template, request
import json

app = Flask(__name__)

# Grab JSON data
with open("recipes.json") as file:
    data = json.load(file)

@app.route("/", methods=["GET", "POST"])
def home():
    search_query = request.form.get("search", "").lower()
    filtered_recipes = []

    if search_query:
        for recipe in data["recipes"]:
            for ingredient in recipe["ingredients"]:
                if search_query in ingredient["name"].lower():
                    filtered_recipes.append(recipe)
                    break 

    return render_template("index.html", recipes=filtered_recipes, search_query=search_query)

if __name__ == "__main__":
    app.run(debug=True)
