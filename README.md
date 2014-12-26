# Neighborhood Map Project

Web application which uses Foursquare API and Google Maps API to find interesting places in a neighborhood and display them on a map.

There is a live version of the app at http://ftchirou.github.io/frontend-nanodegree-neighborhood-map/

## How to run
You will need an http server in order to run the app. A little server can be started if you have python installed.

In a terminal, ```cd``` in the project directory and type

on Linux and Mac OS X

```$ python -m SimpleHTTPServer 8000```

on Windows

```$ python -m http.server 8000```

Then browse to http://127.0.0.1:8000 and Voilà!

## Usage
At the top left in the app, there is an input box. Type in the name of a neighborhood you'd like to visit (e.g. *Shinjuku Station*) and the app will switch to that neighborhood.

On the right, there is a list view showing interesting places in the neighborhood.

The places are displayed by category (e.g. food, nightlife, education, ...):

* The list of places can be filtered by the input box on top of the list. Type in a type of place (e.g. food, fast-food, bar, etc) or type directly a place name. The list will be filtered as you type to show only the places matching the query.
* Click on a category name to collapse the list of its places.
* Click on the *eye icon* next to a category name to hide its places in the list view and on the map. Click again to reveal them.
* Click on a list view item to select a place and to display the info window of that place on the map. Click again to deselect it.
* When a place is selected, if there are photos of the place available, you can click on the *Photos* link to display a slideshow of the photos.
* Click on the title of the list view (*Places*) to hide it.
