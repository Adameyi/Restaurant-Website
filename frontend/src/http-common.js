import axios from "axios";

export default axios.create({

    // With Server:
    // http://localhost:5000/api/v1/restaurants/
    
    // Serverless:
    baseURL: "https://ap-southeast-2.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/restaurant-reviews-zroty/service/restaurants/incoming_webhook/", 
    //Default headers for requests.
    headers: {
        "Content-type" : "application/json"
    }
});