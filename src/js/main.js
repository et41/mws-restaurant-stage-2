let restaurants,
  neighborhoods,
  cuisines
var map
var markers = []

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  fetchNeighborhoods();
  fetchCuisines();
});



/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  map.addListener('tilesloaded', (event) => {
    loadMap();

  });
  updateRestaurants();
}

let selectedRestaurants = {};

loadMap = () => {
  let mapContainer = document.getElementById('map');
  mapContainer.style.position = 'relative';
  mapContainer.style.left = 0;
  console.log('map loaded');
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {

  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');
  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;
  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;
  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      console.log('in update', restaurants);
      //afterUpdate(restaurants);
      //console.log('restaurants in update:', selectedRestaurants);
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
  console.log('before update', selectedRestaurants);

}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';
  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}
let allRestaurants = {};
/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');
  let image = document.createElement('img');
  image.className = 'restaurant-img';

  loadImage = (restaurant, idStr) => {

  image = document.getElementById(idStr);
  image.src = DBHelper.imageUrlForRestaurant(restaurant);

  // add alt tag to images.
  image.alt = "showing restaurant is " + restaurant.name + " and cuisine type is " + restaurant.cuisine_type;
  //add srcset and sizes to make responsive images.
  image.srcset =  `images/${restaurant.id}-400small.jpg 480w,images/${restaurant.id}-600medium.jpg 600w`;
  image.sizes =  "(max-width: 600px) 60vw,(min-width: 601px) 50vw";

  }
  this.loadImage = loadImage;
  //add id to images

  image.id = 'image' + restaurant.id;
  li.append(image);
  const name = document.createElement('h2');
  name.innerHTML = restaurant.name;
  li.append(name);
  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more)

  return li
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
}

/**
 * Add observer to detect intersecting and then load images when observer activated.
 */
var io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      console.log('in observer intersecting', entry.target.id);
      let idStr = entry.target.id;
      let idNumber = idStr.replace( /^\D+/g, '');
      idNumber = Number(idNumber);
      //console.log('idNonstr:', typeof( idNumber));
      loadImage(res.restaurants[idNumber-1],idStr);
      io.unobserve(entry.target);
      }
  });
});

window.addEventListener('load', (event) => {
  let el2 = document.querySelectorAll('#restaurants-list img');
  el2.forEach(e => {
    io.observe(e);
  });

});

/**
 * Update restaurants when selected.
 */
updateSelectedRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');
  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;
  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;
  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      //console.log('in update', restaurants);
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
      afterUpdate(restaurants);
    }
  })
  //console.log('before update', selectedRestaurants);
}

afterUpdate = (x) => {
 //console.log('x:', x);
 x.forEach(a => {
  //console.log('a,image:', a);
  let restaurant = a;
  image = document.getElementById('image'+a.id);
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  // add alt tag to images.
  image.alt = "showing restaurant is " + restaurant.name + " and cuisine type is " + restaurant.cuisine_type;
  //add srcset and sizes to make responsive images.
  image.srcset =  `images/${restaurant.id}-400small.jpg 480w,images/${restaurant.id}-600medium.jpg 600w`;
  image.sizes =  "(max-width: 600px) 60vw,(min-width: 601px) 50vw";
 });
}


