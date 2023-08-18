import RestaurantsDAO from "../dao/restaurantsDAO.js"

export default class RestaurantsController {
    //Static async method to handle "Get Restaurants" API endpoint
    static async apiGetRestaurants(req, res, next) {

        //Parse the query parameters for 'page' and 'restaurantsPerPage' by checking if req.query.* exists in the URL. If it exists, convert it to an int (ParseInt), else assign a default num.
        const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt (req.query.restaurantsPerPage, 10) : 20 
        const page = req.query.page ? parseInt(req.query.page, 10): 0

        //Empty object initialized for filters.
        let filters = {}

        //Check if the following query parameters: 'cuisine', 'zipcode', or 'name' are existing. Assign to filters accordingly (e.g., Set cuisine filter if the query has a cuisine)
        if (req.query.cuisine) {
            filters.cuisine = req.query.cuisine
        } else if (req.query.zipcode) {
            filters.zipcode = req.query.zipcode
        } else if (req.query.name) {
            filters.name = req.query.name
        }

        //Call the 'getRestaurants' method of RestaurantsDAO class. Passing filters, page and restaurantsPerPage json params
        const { restaurantsList, totalNumRestaurants } = await RestaurantsDAO.getRestaurants({
            filters,
            page,
            restaurantsPerPage,
        })

        //Prepared response object wiwth relevant data points.
        let response = {
            restaurants: restaurantsList,
            page: page,
            filters: filters,
            entries_per_page: restaurantsPerPage,
            total_results: totalNumRestaurants,
        }

        //JSON response sent to the client calling the URL.
        res.json(response)
    }

    static async apiGetRestaurantById(req, res, next) {
        try {
            //Retrieve param "id" from request's URL parameters.
            let id = req.params.id || {}
                //RestaurantDAO's information via ID
                let restaurant = await RestaurantsDAO.getRestaurantByID(id)
                // Condition check on whether the restaurant exists.
                if (!restaurant) {
                    res.status(404).json({error: "Not Found"})
                    return
                }
                //Response with restauraunt info.
                res.json(restaurant)
        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }

    static async apiGetRestaurantCuisines(req, res, next) {
        try {
            //RestaurantsDAO's information of available cuisines
            let cuisines = await RestaurantsDAO.getCuisines()

            //Response with list of cuisines
            res.json(cuisines)
        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }
}

//Note: Query = after '?' of a URL, Param is URL after '/', Body is json request