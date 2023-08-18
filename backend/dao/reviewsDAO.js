import mongodb from "mongodb";  // Import "mongodb" library properly

const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;

let reviews; // To hold "reviews" collection reference.

export default class ReviewsDAO {
    static async injectDB(conn) {
        // If "reviews" is already defined/existing, initializing it again is not necessary.
        if (reviews) {
            return; // Access the DB.
        }
        try {
            // Establish a connection to "reviews" collection in the DB
            reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews");
        } catch (e) {
            console.error(`Unable to establish collection handles in ReviewsDAO: ${e}`);
        }
    }

    static async addReview(restaurantId, user, review, date) {
        try {
            // Prepare review document to be inserted in the collection.
            const reviewDoc = {
                name: user.name,
                user_id: user._id,
                date: date,
                text: review,
                restaurant_id: new ObjectId(restaurantId),  // Convert RestaurantId into an ObjectId
            };
            // Insert review document into the "reviews" collection.
            return await reviews.insertOne(reviewDoc);
        } catch (e) {
            console.error(`Unable to post review: ${e}`);
            return { error: e };
        }
    }

    static async updateReview(reviewId, userId, text, date) {
        try {
            // Update the review using specified userId and reviewId
            const updateResponse = await reviews.updateOne(
                { _id: new ObjectId(reviewId), user_id: userId }, // Look for a review with the given IDs
                { $set: { text: text, date: date } }
            );

            return updateResponse; // Return result of update operation
        } catch (e) {
            console.error(`Unable to update review: ${e}`);
            return { error: e };
        }
    }

    static async deleteReview(reviewId, userId) {
        try {
            // Delete the review using the specified userId and reviewId
            const deleteResponse = await reviews.deleteOne(
                { _id: new ObjectId(reviewId), user_id: userId }  // Corrected the function name to "deleteOne"
            );

            return deleteResponse; // Return result of delete operation
        } catch (e) {
            console.error(`Unable to delete review: ${e}`);
            return { error: e };
        }
    }
}
