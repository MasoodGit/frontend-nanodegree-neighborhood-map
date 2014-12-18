var NeighborhoodViewModel = function (neighborhood) {
    var self = this;

    self.neighborhood = null;
    self.map = null;

    self.initialize = function () {
        var mapOptions = { 
            center: { lat: 6.131944, lng: 1.222778 },
            zoom: 14
        };
        self.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        self.activateNeighborhoodSwitch();
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

            self.map.panTo(self.neighborhood);
        });

    };

    google.maps.event.addDomListener(window, 'load', this.initialize);
};

ko.applyBindings(new NeighborhoodViewModel("Lomé, TOGO"));