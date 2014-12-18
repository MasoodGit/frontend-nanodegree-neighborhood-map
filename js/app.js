var NeighborhoodViewModel = function (neighborhood) {
    var self = this;

    self.categories = ko.observableArray([]);
    self.places = ko.observableArray([]);
    self.markers = ko.observableArray([]);

    self.neighborhood = { lat: 6.131944, lng: 1.222778 };
    self.map = null;

    self.initialize = function () {
        var mapOptions = {
            disableDefaultUI: true, 
            center: self.neighborhood,
            zoom: 16
        };

        self.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

        self.getCategories(function () {
            self.findPlaces(self.neighborhood);

            self.activateNeighborhoodSwitch();
        });
    };

    self.activateNeighborhoodSwitch = function () {
        var input = document.getElementById('neighborhood');        
        var searchBox = new google.maps.places.SearchBox(input);

        google.maps.event.addListener(searchBox, 'places_changed', function () {
            var places = searchBox.getPlaces();

            if (places.length === 0) {
                return;
            }

            var place = places[0];
            var location = place.geometry.location;

            self.neighborhood = { lat: location.k, lng: location.D };

            self.switchNeighborhood(self.neighborhood);
        });
    };


    self.switchNeighborhood = function (neighborhood) {
        self.map.panTo(neighborhood);
        self.findPlaces(neighborhood);
    };

    self.findPlaces = function (neighborhood) {

        var infoWindow = function (place) {
            var content = '<div class="place-info"><h4>' + place.name + '</h4>';
            
            if (place.categories.length > 0) {
                content += '<h5 class="categories">' + place.categories[0].pluralName;
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

        apis.foursquare.getPlacesNear(neighborhood, function (places) {
            self.places(places);

            console.log(self.places());

            self.markers([]);
            self.places().forEach(function (place) {
                var marker = new google.maps.Marker({
                    map: self.map,
                    title: place.name,
                    position: {
                        lat: place.location.lat,
                        lng: place.location.lng
                    }
                });

                google.maps.event.addListener(marker, 'click', function () {
                    infoWindow(place).open(self.map, marker);
                });

                self.markers().push(marker);
            });
        });

    };

    self.getCategories = function (callback) {
        apis.foursquare.getCategories(function (categories) {
            self.categories(categories);
        
            console.log(self.categories());

            if (callback) {
                callback();
            }
        });
    };

    google.maps.event.addDomListener(window, 'load', this.initialize);
};

ko.applyBindings(new NeighborhoodViewModel("Lomé, TOGO"));