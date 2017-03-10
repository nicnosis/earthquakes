# USGS Earthquake Data Viz
This is adapted from [d3noob's block](http://bl.ocks.org/d3noob/9267535) on leaflet maps with a d3 overlay.

## Data
### Source
[USGS Earthquake Feed](https://earthquake.usgs.gov/earthquakes/feed/)

### Preparation
Data is cleaned and converted to json with [csvkit](https://csvkit.readthedocs.io)

(1) Download `csv`

(2) Convert to UTF-8. Open `csv` file in SublimeText, File > Save with Encoding... UTF

(3) Strip out desired columns. I want time, latitude/longitude, magnitude, and place

```
csvcut -c 1,2,3,5,14 all_month.csv >> eq.csv
```

(4) Convert to JSON
```
csvjson eq.csv >> eq.json
```

Now data is ready to load with d3.json