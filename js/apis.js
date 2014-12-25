var apis = {};


apis.foursquare = {
        clientId: 'GQVM3TG2JHRG53PTWCZSCQDKUKQJH34I1BUOJOLLHOSBL1Q0',

        clientSecret: 'M41YZKEES3UIG4QYWVMQ0HQIMUPD0G1YD5ZSQTYUPJLVG4DD',

        getCategories: function (successCallback, errorCallback) {
            var endpoint = 'https://api.foursquare.com/v2/venues/categories?client_id='
                + this.clientId
                + '&client_secret='
                + this.clientSecret
                + '&v=20140806&m=foursquare';

            this.get('categories', endpoint, successCallback, errorCallback);
        },

        getPlacesIn: function (neighborhood, successCallback, errorCallback) {
            var endpoint = 'https://api.foursquare.com/v2/venues/search?client_id=' + this.clientId 
                + '&client_secret=' 
                + this.clientSecret
                + '&ll=' + neighborhood.lat + ','
                + neighborhood.lng
                + '&v=20140806&m=foursquare';

            this.get('venues', endpoint, successCallback, errorCallback);
        },

        getPhotosOf: function (place, successCallback, errorCallback) {
            var endpoint = 'https://api.foursquare.com/v2/venues/' + place.id + '/photos?client_id='
                + this.clientId + '&client_secret=' + this.clientSecret + '&v=20140806&m=foursquare';

            this.get('photos', endpoint, successCallback, errorCallback);
        },

        get: function(resource, endpoint, successCallback, errorCallback) {
            $.get(endpoint)
                .done(function (data) {
                    var meta = data.meta;

                    if (meta.code === 200) {
                        if (successCallback) {
                            successCallback(data.response[resource]);
                        }

                    } else {
                        if (errorCallback) {
                            errorCallback({errorType: meta.errorType, errorDetail: meta.errorDetail});
                        }
                    }
                });
        }
    };

apis.mediawiki = {

};