// This function is the webhook's request handler.
exports = async function(payload, response) { //async since await is used
   
 
    const {restaurantsPerPage = 20, page = 0} = payload.query;
    //Empty object initialized for filters.
    let query = {}

    //Check if the following query parameters: 'cuisine', 'zipcode', or 'name' are existing. Assign to filters accordingly (e.g., Set cuisine filter if the query has a cuisine)
    if (payload.query.cuisine) {
        query = {"cuisine": {$eq: payload.query.cuisine}}
    } else if (payload.query.zipcode) {
        query = { "address.zipcode": { $eq: payload.query.zipcode } }
    } else if (payload.query.name) {
        query = { $text: { $search: payload.query.name } }
    }
    
      const collection = context.services.get("mongodb-atlas").db("sample_restaurants").collection("restaurants")
      let restaurantsList = await collection.find(query).skip(page*restaurantsPerPage).limit(restaurantsPerPage).toArray();

      restaurantsList.forEach(restaurant => {
        restaurant._id = restaurant._id.toString();
      })


    //Prepared response object wiwth relevant data points.
    let responseData = {
        restaurants: restaurantsList,
        page: page.toString(),
        filters: {},
        entries_per_page: restaurantsPerPage.toString(),
        total_results: await collection.count(query).then(num => num.toString()),
    }

return  responseData
};