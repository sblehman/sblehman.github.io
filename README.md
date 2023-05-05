# Using FDA Food Enformcement Dataset from Kaggle to Make a Choropleth Map

(Link to youtube here)

---
# Documentation
## Design Process:
The dataset I used for my project is the [FDA Food Enforcement 2008-2022](https://www.kaggle.com/datasets/chiyucheng/fda-food-enforcement-20082022![image](https://user-images.githubusercontent.com/91152548/236498964-f89bf21d-7c12-43ff-8a9f-5a2740997cee.png)
) dataset from Kaggle. The first steps to designing my choropleth visualization was understanding the data. This was done with python, with the data_cleaning.ipynb (link to file here). Here is where I decided which information to use from the original dataset, [combined.csv](./data/combined.csv) and aggregated the chosen information for the final visualization. I then cleaned and aggregated this data to make the [final_data.csv](./data/final_data.csv).

The original source of the data along with some descriptions of the fields can be found [here](https://open.fda.gov/apis/food/enforcement/searchable-fields/). After considering my options, here are the variables I decided to use for the final visualization:
- state and country:
	- The state, and country where the recalling firm is located
- classification:
	- Numerical designation (I, II, or III) that is assigned by FDA to a particular product recall that indicates the relative degree of health hazard.
		1. Class I = Dangerous or defective products that predictably could cause serious health problems or death. Examples include: food found to contain botulinum toxin, food with undeclared allergens, a label mix-up on a lifesaving drug, or a defective artificial heart valve.
		2. Class II = Products that might cause a temporary health problem, or pose only a slight threat of a serious nature. Example: a drug that is under-strength but that is not used to treat life-threatening situations.
		3. Class III = Products that are unlikely to cause any adverse health reaction, but that violate FDA labeling or manufacturing laws. Examples include: a minor container defect and lack of English labeling in a retail food.
- reason for recall (simplified):
	- Information describing how the product is defective and violates the FD&C Act or related statutes.
	- This field was simplified by the creator of the Kaggle dataset, which is what I ultimately used.

With these fields, I cleaned and aggregated the data:
- country: Only information from United States was used
- state: The field in which I grouped the data to
- classification: 
	- With all of the classifications for the recalls in a state, I took the average to make "ave_class"
- reason for recall:
	- I took the most frequent recall reason in each state to make "top_recall"
	- Additionally, I made a new field by taking the count of recalls in each state to make "recall_count"
	
Finally, to make the choropleth map I needed a GeoJson file, which was found [here](https://www.kaggle.com/datasets/pompelmo/usa-states-geojson) on Kaggle and can be found in the us-states.json (link to file).

## Rationale of design choices:

In my attempt of using d3, my goal was to have the color encodings represent the ave_class for each state. Whenever the user interacts with the map, the state that they hover over would display the additional information, which is the top_recall and recall_count.

This however did not work out as I hoped it would, so to have some sort of visualization, I utilized python code to generate html files with the interactions. This was done with the [plotly](https://pypi.org/project/plotly/) package. The code that was used to generate the visualization and html files can be found in the [choropleth_visualizations.ipynb](./data/choropleth_visualizations.ipynb). 

With the plotly package, I was able to make multiple visualizations to create the final website. For both the Average Classification and Total Number of Recalls maps, I used a continuous scale for the visual encoding. Using a discrete scale for the colors would not provide easily interpretable visualizations since there would be too many colors on the maps. 

Although the classifications are technically ordinal data that could be visualized with a discrete color scale, because of the aggregation done in the previous step a continuous scale was used with a range of 1 to 3 for the final Average Classification map. 

The initial range that was used for the Total Number of Recalls map was the minimum and maximum of the recall_count; however, this made it hard to tell a difference in the colors of the intermediate values because of the extreme outliers. To mitigate this, I changed the range to the first and third quartiles so that the colors were scaled better.

[Using range min to max recall_count](./data/images/recal_count_first_attempt.png)

[Using range q1 to q3 recall_count](./data/images/recall_count_final.png)

For the Top Reason for Recall map, I used a discrete color scale because it allows a good visualization for the nominal data. You can see the top reason for recall by state, and also see what other states have the same, or different most frequently occurring recall.

## Information Learned from Visualizations

(add more pictures and conlusions)
