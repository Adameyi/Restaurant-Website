import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId


//Variable to store a reference to our DB collection.
let restaurants

//Class 
export default class RestaurantsDAO {

    //Establish connection to MongoDB Database via static method.
    static async injectDB(conn) {

        //If the 'restaurants' collection is already assigned, return.
        if (restaurants) {
            return
        }
        try {
            //Connect to the specified DB and assign the 'restaurants' collection from the DB to the 'restaurants' variable.
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants")
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in restaurantsDAO: ${e}`,
            )
        }
    }

    //Retrieve a list of restaurants based on the provided filters/pages/restaurants per page via static method.
    static async getRestaurants({
        filters = null,
        page = 0,
        restaurantsPerPage = 20,
    } = {}) {
        let query
        if (filters) {
            // Build the query based on th given filters.
            if ("name" in filters) { //Search by name of restaurant?
                query = { $text: { $search: filters["name"] } }
            } else if ("cuisine" in filters) { //Search by cusiine of restaurant?
                query = { "cuisine": { $eq: filters["cuisine"] } }
            } else if ("zipcode" in filters) { //Search by zipcode of restaurant?
                query = { "address.zipcode": { $eq: filters["zipcode"] } }
            }
        }

        let cursor

        try {
            //Execute the query and assign the resulting cursor to 'cursor' variable.
            cursor = await restaurants.find(query) //Find all the restaurants from the DB that go along with the query we passed in.
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            //Empty list, no restaurants.
            return { restaurantsList: [], totalNumRestaurants: 0 }
        }

        //Limit and truncate the number of restaurants per page, skip to the appropriate page.
        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)

        try {
            //Convert the cursor to an array
            const restaurantsList = await displayCursor.toArray()

            //Count the total num of matching documents.
            const totalNumRestaurants = await restaurants.countDocuments(query)

            return { restaurantsList, totalNumRestaurants }
        } catch (e) {
            console.error(
                `Unable to convert cusror to array or problem counting the documents, ${e}`,
            )
            return { restaurantsList: [], totalNumRestaurants: 0 }
        }
    }

    //Match the ID of a specific restaurant
    static async getRestaurantByID(id) {
        try {
            //Construct an aggregation pipeline to fetch restaurant details and its associated reviews.
            const pipeline = [
                {
                    $match: {
                        _id: new ObjectId(id),
                    },
                },
                {
                    $lookup: {
                        from: "reviews",
                        let:
                        {
                            id: "$_id",
                        },
                        pipeline: [
                            {
                                $match:
                                {
                                    $expr:
                                    {
                                        //Match the restauraunt ID along with its reviews.
                                        $eq: ["$restaurant_id", "$$id"],
                                    },
                                },
                            },
                            {
                                $sort:
                                {
                                    date: -1,
                                },
                            },
                        ],
                        as: "reviews",
                    },
                },
                {
                    //Include 'reviews' in the aggregation.
                    $addFields:
                    {
                        reviews: "$reviews",
                    },
                },
            ]
            // Execute the aggregation pipeline and return the result.
            return await restaurants.aggregate(pipeline).next()
        } catch (e) {
            console.error(`Something went wrong in getRestaurantByID: ${e}`)
            throw e
        }
    }

    //Static method to collect distinct cuisines from the collection
    static async getCuisines() {
        let cuisines = []
        try {
            //Retrieve distinct cuisine values within the 'cuisine' field.
            //Note: A lot of restaurants have the same cuisine, ideal to get each cuisine one time.
            cuisines = await restaurants.distinct("cuisine")
            return cuisines
        } catch (e) {
            console.error(`Unable to get cuisines, ${e}`)
            return cuisines
        }
    }
}

