#BASIC FILE TO GRAB JSON DATA AND FILTER IT

from flask import Flask, render_template, request
import json

app = Flask(__name__)

#GRAB JSON DATA
with open("recipes.json") as file:
    data = json.load(file)

#DECLARE FLASK METHODS
@app.route("/", methods=["GET", "POST"])
def home():
    search_query = request.form.get("search", "").lower()
    filtered_recipes = []

    #IF QUERY MATCHES ANYTHING WITHIN THE JSON FILE, PULL IT TO THE LIST
    if search_query:
        for recipe in data["recipes"]:
            for ingredient in recipe["ingredients"]:
                if search_query in ingredient["name"].lower():
                    filtered_recipes.append(recipe)
                    break 

    #RETURN THE LIST AND RESET VARS
    return render_template("index.html", recipes=filtered_recipes, search_query=search_query)

if __name__ == "__main__":
    app.run(debug=True)
