initIDB=(()=>("indexedDB"in window||console.log("This browser doesnt support idb"),idb.open("restaurant-app",1,function(e){switch(e.oldVersion){case 0:console.log("Creating the restaurants object store"),e.createObjectStore("restaurants",{keyPath:"id"})}})));let restaurant,res={};console.log("db helper");class DBHelper{static fetchRestaurants(e){console.log("FETCH RESTAURANT!!!!"),initIDB().then(function(t){t&&t.transaction("restaurants","readwrite").objectStore("restaurants").getAll().then(n=>{if(n.length>0){console.log("get data from db!!",n),res.restaurants=n;const t=res.restaurants;e(null,t)}else console.log("get data from server!!"),fetch("http://localhost:1337/restaurants").then(e=>e.json()).then(n=>{res.restaurants=n;const r=res.restaurants;console.log("rrestaurant in fetch event : ",r);var a=t.transaction("restaurants","readwrite").objectStore("restaurants");r.forEach(e=>{console.log("Adding item",e),a.put(e)}),a.getAll().then(t=>{console.log("data",t),e(null,r)})}).catch(t=>{e(t,null)})})})}static mapMarkerForRestaurant(e,t){return new google.maps.Marker({position:e.latlng,title:e.name,url:DBHelper.urlForRestaurant(e),map:t,animation:google.maps.Animation.DROP})}static fetchRestaurantById(e,t){DBHelper.fetchRestaurants((n,r)=>{if(n)t(n,null);else{const n=r.find(t=>t.id==e);n?t(null,n):t("Restaurant does not exist",null)}})}static fetchRestaurantByCuisine(e,t){DBHelper.fetchRestaurants((n,r)=>{if(n)t(n,null);else{const n=r.filter(t=>t.cuisine_type==e);t(null,n)}})}static fetchRestaurantByNeighborhood(e,t){DBHelper.fetchRestaurants((n,r)=>{if(n)t(n,null);else{const n=r.filter(t=>t.neighborhood==e);t(null,n)}})}static fetchRestaurantByCuisineAndNeighborhood(e,t,n){DBHelper.fetchRestaurants((r,a)=>{if(r)n(r,null);else{let r=a;"all"!=e&&(r=r.filter(t=>t.cuisine_type==e)),"all"!=t&&(r=r.filter(e=>e.neighborhood==t)),n(null,r)}})}static fetchNeighborhoods(e){DBHelper.fetchRestaurants((t,n)=>{if(t)e(t,null);else{const t=n.map((e,t)=>n[t].neighborhood),r=t.filter((e,n)=>t.indexOf(e)==n);e(null,r)}})}static fetchCuisines(e){DBHelper.fetchRestaurants((t,n)=>{if(t)e(t,null);else{const t=n.map((e,t)=>n[t].cuisine_type),r=t.filter((e,n)=>t.indexOf(e)==n);e(null,r)}})}static urlForRestaurant(e){return`./restaurant.html?id=${e.id}`}static imageUrlForRestaurant(e){return console.log("restaurant in image url",e),`/img/${e.photograph}`}}var map;"serviceWorker"in navigator||console.log("Service worker not supported"),navigator.serviceWorker.register("/sw.js").then(function(e){}).catch(function(e){console.log("Registration failed:",e)}),fetchRestaurantFromURL=(e=>{if(console.log("fetchRestaurantFromURL"),self.restaurant)return void e(null,self.restaurant);const t=getParameterByName("id");t?DBHelper.fetchRestaurantById(t,(t,n)=>{self.restaurant=n,n?(fillRestaurantHTML(),e(null,n)):console.error(t)}):(error="No restaurant id in URL",e(error,null))}),fillRestaurantHTML=((e=self.restaurant)=>{console.log("fillRestaurantHTML"),document.getElementById("restaurant-name").innerHTML=e.name,document.getElementById("restaurant-address").innerHTML=e.address;const t=document.getElementById("restaurant-img");t.alt="Showing restaurant is "+e.name+" and cuisine type is "+e.cuisine_type,t.className="restaurant-img",t.src=DBHelper.imageUrlForRestaurant(e),t.srcset=`images/${e.id}-400small.jpg 480w,images/${e.id}-600medium.jpg 600w`,t.sizes="(max-width: 600px) 80vw,(min-width: 601px) 50vw",document.getElementById("restaurant-cuisine").innerHTML=e.cuisine_type,e.operating_hours&&fillRestaurantHoursHTML(),fillReviewsHTML()}),fillRestaurantHoursHTML=((e=self.restaurant.operating_hours)=>{const t=document.getElementById("restaurant-hours");for(let n in e){const r=document.createElement("tr"),a=document.createElement("td");a.innerHTML=n,r.appendChild(a);const l=document.createElement("td");l.innerHTML=e[n],r.appendChild(l),t.appendChild(r)}}),fillReviewsHTML=((e=self.restaurant.reviews)=>{console.log("fillReviewsHTML");const t=document.getElementById("reviews-container"),n=document.createElement("h3");if(n.innerHTML="Reviews",n.setAttribute("tabindex","0"),t.appendChild(n),!e){const e=document.createElement("p");return e.innerHTML="No reviews yet!",void t.appendChild(e)}const r=document.getElementById("reviews-list");e.forEach(e=>{r.appendChild(createReviewHTML(e))}),t.appendChild(r)}),createReviewHTML=(e=>{console.log("createReviewHTML");const t=document.createElement("li"),n=document.createElement("p");n.innerHTML=e.name,n.setAttribute("id","name"+e.name),n.setAttribute("tabindex","0"),t.appendChild(n);const r=document.createElement("p");r.innerHTML=e.date,r.setAttribute("id","date"+e.name),r.setAttribute("tabindex","0"),t.appendChild(r);const a=document.createElement("p");a.innerHTML=`Rating: ${e.rating}`,a.setAttribute("id","rating"+e.name),a.setAttribute("tabindex","0"),t.appendChild(a);const l=document.createElement("p");return l.innerHTML=e.comments,t.appendChild(l),t}),fillBreadcrumb=((e=self.restaurant)=>{console.log("fillBreadcrumb:");const t=document.getElementById("breadcrumb-ol"),n=document.createElement("li");n.innerHTML=e.name,t.appendChild(n)}),getParameterByName=((e,t)=>{t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");const n=new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null}),document.addEventListener("keyup",e=>{console.log("e review: ",e);let t=e.srcElement.id;if(9==e.keyCode&&"restaurant-name"==t){document.getElementById("restaurant-container").querySelectorAll("p, td").forEach(e=>{e.setAttribute("tabindex","0")})}});let breadcrumbCounter=0;initMap=(()=>{fetchRestaurantFromURL((e,t)=>{e?console.error(e):(self.map=new google.maps.Map(document.getElementById("map"),{zoom:18,center:t.latlng,scrollwheel:!1}),0==breadcrumbCounter&&(fillBreadcrumb(),breadcrumbCounter++),DBHelper.mapMarkerForRestaurant(self.restaurant,self.map))})});var i,coll=document.getElementsByClassName("collapsible");for(i=0;i<coll.length;i++)console.log("collapsable"),coll[i].addEventListener("click",function(){this.classList.toggle("active");var e=this.nextElementSibling;"block"===e.style.display?e.style.display="none":(e.style.display="block",e.style.height="350px")});var elementCollapsable=document.getElementById("collapsible");elementCollapsable.addEventListener("click",()=>{initMap()});