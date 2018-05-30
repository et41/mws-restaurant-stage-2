
let breadcrumbCounter = 0;

/**
 * Initialize Google map, called from HTML.
 */
initMap = () => {

  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: restaurant.latlng,
        scrollwheel: false
      });
      if (breadcrumbCounter == 0) {
		fillBreadcrumb();
		breadcrumbCounter++;
      }
      //fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
}

/**
  * Get Restaurant Static Map
  */
/*restaurantMap = () => {
  let restaurantLocation;
  let id = getParameterByName('id');
  DBHelper.fetchRestaurantById(id, (error, restaurant) => {
  if (error) { // Got an error!
    console.error(error);
  } else {
    self.restaurant = restaurant;
    console.log(restaurant.latlng.lat);
    restaurantLocation = `${restaurant.latlng.lat},${restaurant.latlng.lng}`;
    let marker = `markers=color:red|size:120x120|${restaurantLocation}|`;
    let srcMap = `https://maps.googleapis.com/maps/api/staticmap?center=${restaurantLocation}&zoom=17&size=1000x300&${marker}&key=AIzaSyDfPSCK0MsJDi53Kc_ZWHEE2sGS9n3RynM`;
    let mapContainer = document.getElementById('map-container');
    let mapElement = document.getElementById('map');
    console.log(srcMap,marker);
    let img = document.createElement('img');
    mapContainer.insertBefore(img, mapElement);
    img.src = srcMap;
    img.id = 'staticmap';
    }
  });
};

});*/

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
	console.log('collapsable');
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
      content.style.height = '350px';
    }
  });
}
var elementCollapsable = document.getElementById('collapsible');

elementCollapsable.addEventListener('click', () => {
  initMap();
});
