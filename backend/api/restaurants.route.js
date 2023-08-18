import express from "express"
import RestaurantsCtrl from "./restaurants.controller.js"
import ReviewsCtrl from "./reviews.controller.js"



//Create an instance of Express Router
const router = express.Router()


//Defined route for reetrieving restaurants
router.route("/").get(RestaurantsCtrl.apiGetRestaurants) //GET request handler for retrieving ALL restaurants info
router.route("/:id/:id/").get(RestaurantsCtrl.apiGetRestaurantById) //GET request handler for retrieving a specific restaurant info via specified ID
router.route("/cuisines").get(RestaurantsCtrl.apiGetRestaurantCuisines) //GET request handler for retrieving ALL cuisines info

router
    .route("/review")
    .post(ReviewsCtrl.apiPostReview) //POST request handler for adding a new review.
    .put(ReviewsCtrl.apiUpdateReview) //PUT request handler for updating a currently existing review.
    .delete(ReviewsCtrl.apiDeleteReview) //DELETE request handler for removing a review.


export default router