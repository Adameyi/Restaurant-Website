// This function is the webhook's request handler.
exports = async function(payload, response) {
   
    const id = payload.query.id || ""
    
    const restaurants = context.services.get("mongodb-atlas").db("sample_restaurants").collection("restaurants");
 
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
    
    return await restaurants.aggregate(pipeline).next()
    restaurant._id = restaurant._id.toString()
    
    restaurant.reviews.forEach(review => {
      review.date = new Date(review.date).toString()
      review._id = review._id.toString()
    })
    
    return restaurant;
 };
 