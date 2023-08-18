import http from "../http-common";

class RestaurantDataService {

    //Get all restaurants (pagination included).
    getAll(page = 0) {
        return http.get(`restaurants?page=${page}`);
    }

    //Get a restaurant specific to its ID.
    get(id) {
        return http.get(`/restaurant?id=${id}`);
    }

    //Search for restaurants via specific query + optional params.
    find (query, by = "name", page = 0) {
        return http.get(`restaurants?${by}=${query}&page=${page}`);
    }

    //Create a new review for a specified restaurant.
    createReview(data) {
        return http.post("/review-new", data);
    }

    //Update an existing review for a specified restaurant.
    updateReview(data) {
        return http.put("/review-edit", data);
    }

    //Delete a existing review for a specified restaurant.
    deleteReview(id, userId) {
        return http.delete(`/review-delete?id=${id}  `, {data:{user_id: userId}});
    }

    //Get a list of cuisines.
    getCuisines(id) {
        return http.get(`/cuisines`);
    }
 }

 export default new RestaurantDataService();