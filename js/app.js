var NeighborhoodViewModel = function () {
    var self = this;

    self.categories = ko.observableArray([]);

    // self.neighborhood = { 
    //     name: 'Lomé',
    //     location: {
    //         lat: 6.131944, 
    //         lng: 1.222778 
    //     }
    // };

    self.neighborhood = {
        name: ko.observable('Udacity'),
        location: { 
            lat: 37.399864, 
            lng: -122.10840000000002 
        }
    };

    self.map = null;

    self.searchBoxValue = ko.observable('');

    self.query = ko.observable('');

    self.initialize = function () {
        var mapOptions = {
            disableDefaultUI: true, 
            center: self.neighborhood.location,
            zoom: 18,
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_CENTER,
                style: google.maps.ZoomControlStyle.DEFAULT
            }
        };

        self.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

        self.getCategories(function (categories) {

            categories.forEach(function (category) {
                category.isVisible = ko.observable(true);

                category.isHidden = ko.computed(function () {
                    return !category.isVisible();
                });

                category.toggleVisibility = function () {
                    this.isVisible(!category.isVisible());

                    this.places().forEach(function (place) {
                        if (place.infoWindowOpened()) {
                            place.infoWindow.close();
                            place.marker.setIcon(place.markerIcon);
                            place.infoWindowOpened(false);
                        }

                        if (place.matchesQuery()) {
                            place.marker.setVisible(!place.marker.getVisible());
                        }
                    });
                };

                category.places = ko.observableArray([]);

                category.placesMatchingQuery = ko.computed(function () {
                    var places = [];
                    category.places().forEach(function (place) {
                        place.marker.setVisible(place.matchesQuery());

                        if (place.matchesQuery()) {
                            places.push(place);
                        }
                    });

                    return places;
                });

                category.headerIcon = ko.computed(function () {
                    var icon = category.icon;
                    return icon.prefix + '44' + icon.suffix;
                });
            });

            self.categories(categories);

            self.findPlaces(self.neighborhood);

            self.activateNeighborhoodSwitch();
        });
    };

    self.activateNeighborhoodSwitch = function () {
        var input = document.getElementById('neighborhood');        
        var searchBox = new google.maps.places.SearchBox(input);

        google.maps.event.addListener(searchBox, 'places_changed', function () {
            var places = searchBox.getPlaces();

            self.searchBoxValue('');

            if (places.length === 0) {
                return;
            }

            var place = places[0];

            if (place.hasOwnProperty('geometry')) {
                var geometry = place.geometry;

                if (geometry.hasOwnProperty('location')) {
                    var location = geometry.location;

                    self.neighborhood.name(place.name);
                    self.neighborhood.location.lat = location.k;
                    self.neighborhood.location.lng =  location.D;

                    self.switchNeighborhood(self.neighborhood);
                }
            }
        });
    };


    self.switchNeighborhood = function (neighborhood) {
        self.map.panTo(neighborhood.location);
        self.findPlaces(neighborhood);
    };

    self.findPlaces = function (neighborhood) {

        var infoWindow = function (place) {
            var content = '<div class="place-info"><h4>' + place.name + '</h4>';
            
            if (place.categories.length > 0) {
                content += '<h5 class="categories-titles">' + place.categories[0].name;
                for (var i = 1; i < place.categories.length; ++i) {
                    var category = place.categories[i];
                    content += ', ' + category.pluralName;
                }
                content += '</h5>';
            }

            if (place.location.formattedAddress.length > 0) {
                content += '<br><address>';
                place.location.formattedAddress.forEach(function (address) {
                    content += address + '<br>';
                });
                content += '</address>';
            }

            content += '</div>';

            return new google.maps.InfoWindow({content: content});
        };

        apis.foursquare.getPlacesIn(neighborhood.location, function (places) {
            self.categories().forEach(function (category) {
                category.places([]);
            });

            places.forEach(function (place) {

                place.matchesQuery = ko.computed(function () {
                    var query = self.query().toLowerCase();

                    for (var i = 0; i < place.categories.length; ++i) {
                        if (place.categories[i].name.toLowerCase().search(query) != -1) {
                            return true;
                        }
                    }

                    return place.name.substring(0, query.length).toLowerCase() === query;
                });


                apis.foursquare.getPhotosOf(place, function (photos) {

                    place.photos = photos.items;

                    place.thumbnail = ko.computed(function () {
                        if (place.photos.length <= 0) {
                            return '';
                        }
                        
                        var photo = place.photos[0];

                        return photo.prefix + '100x100' + photo.suffix;
                    });

                    place.formattedCategories =  ko.computed(function () {
                        if (place.categories.length <= 0) {
                            return '';
                        }

                        var list = place.categories[0].name;
                        for (var i = 1; i < place.categories.length; ++i) {
                            list += ', ' + place.categories[i];
                        }

                        return list;
                    });

                    place.infoWindow = infoWindow(place);

                    place.infoWindowOpened = ko.observable(false);

                    place.toggleInfoWindow = function () {
                        if (this.infoWindowOpened()) {
                            place.marker.setIcon(place.markerIcon);

                            this.infoWindow.close();

                            this.infoWindowOpened(false);
                        } else {
                            self.map.panTo(this.location);

                            place.marker.setIcon(place.markerIcon.substring(0, place.markerIcon.length - 4) + '_selected.png');

                            this.infoWindow.open(self.map, this.marker);

                            this.infoWindowOpened(true);
                        }
                    };

                    self.categories().forEach(function (category) {
                        if (self.isPlaceInCategory(category, place)) {
                            place.markerIcon = markers[category.id];

                            place.marker = new google.maps.Marker({
                                map: self.map,
                                title: place.name,
                                position: {
                                    lat: place.location.lat,
                                    lng: place.location.lng
                                },
                                icon: place.markerIcon
                            });

                            category.places.push(place);
                            place.categories.push(category);
                        }
                    });

                    if (place.hasOwnProperty('marker')) {
                        google.maps.event.addListener(place.marker, 'click', function () {

                            if (!place.infoWindowOpened()) {
                                place.infoWindow.open(self.map, place.marker);

                                var icon = place.marker.getIcon();
                                
                                place.marker.setIcon(icon.substring(0, icon.length - 4) + '_selected.png');

                                place.infoWindowOpened(true);

                                document.getElementById(place.id).scrollIntoView();
                            }
                        });
                    }

                    google.maps.event.addListener(place.infoWindow, 'closeclick', function () {
                        place.marker.setIcon(place.markerIcon);
                        place.infoWindowOpened(false);
                    });
                });
            });
        });

    };

    self.isPlaceInCategory = function (category, place) {
        for (var i = 0; i < place.categories.length; ++i) {
            if (self.isSubCategoryOf(category, place.categories[i])) {
                return true;
            }
        }

        return false;
    };

    self.isSubCategoryOf = function (category, subcat) {
        if (subcat.id === category.id) {
            return true;
        }
        
        if (category.hasOwnProperty('categories')) {
            for (var i = 0; i < category.categories.length; ++i) {
                if (self.isSubCategoryOf(category.categories[i], subcat)) {
                    return true;
                }
            }
        }

        return false;
    };

    self.getCategories = function (callback) {
        var fetch = Modernizr.localstorage && localStorage.getItem('categories') === null;

        if (!fetch) {
            if (callback) {
                callback(JSON.parse(localStorage.getItem('categories')));
            }

        } else {
            apis.foursquare.getCategories(function (categories) {
                if (Modernizr.localstorage) {
                    localStorage.setItem('categories', JSON.stringify(categories));
                }

                if (callback) {
                    callback(categories);
                }
            });
        }
    };

    google.maps.event.addDomListener(window, 'load', this.initialize);
};

ko.applyBindings(new NeighborhoodViewModel("Lomé, TOGO"));