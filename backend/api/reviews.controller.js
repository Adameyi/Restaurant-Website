import ReviewsDAO from "../dao/reviewsDAO.js"

export default class ReviewsController {
    //Method for handling HTTP POST request for implementing a new review.
    static async apiPostReview(req, res, next) {
        try {

            // Extract info from request body.
            const restaurantId = req.body.restaurant_id;
            const review = req.body.text;
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id
            };
            const date = new Date();

            // Call the ReviewDAO's addReview method to add the restaurant review to the DB.
            const ReviewResponse = await ReviewsDAO.addReview(
                restaurantId,
                userInfo,
                review,
                date,
            );

            // Success message if implementation is successful.
            res.json({ status: "success" });
        } catch (e) {
            // Error message response handler.
            res.status(500).json({ error: e.message });
        }
    }

    //Method for handling HTTP put request to update a currently existing restaurant review.
    static async apiUpdateReview(req, res, next) {
        try {
            //Extract info from request body
            const reviewId = req.body.review_id
            const text = req.body.text
            const date = new Date()

            //Call the ReviewDAO's updateReview method to update the review in the DB
            const reviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                req.body.user_id, //Param used to make sure the user that created the review is the same user thatu pdates it.
                text,
                date,

            )

            //Check for any errors during the update and respond accordingly.
            var { error } = reviewResponse
            if (error) {
                res.status(400).json({ error })
            }

            //If 0 documents were modified throughout the update, throw an error.
            if (reviewResponse.modifiedCount === 0) {
                throw new Error(
                    "unable to update review - user may not be original poster",
                )
            }
            //Success message if implementation is successful.
            res.json({ status: "success" })
        } catch (e) {
            //Error message response handler.
            res.status(500).json({ error: e.message })
        }
    }

    static async apiDeleteReview(req, res, next) {
        try {
            // Extract both review ID and user ID from the req body.
            const reviewId = req.query.id
            const userId = req.body.user_id //Simple Auth, check if the user in the req body is the same as the user before it is deleted.

            console.log(reviewId)

            //Call the Review DAO's updateReview method to delete the review in the DB
            const reviewResponse = await ReviewsDAO.deleteReview(
                reviewId,
                userId,
            )
            //Success message if implementation is successful.
            res.json({ status: "success" })
        } catch (e) {
            //Error message response handler.
            res.status(500).json({ error: e.message })
        }
    }
}