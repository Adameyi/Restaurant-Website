import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link } from "react-router-dom";

const Restaurant = props => {
  //Restaurant Initial State
  const initialRestaurantState = {
    //Default empty/null fields
    id: null,
    name: "",
    address: {},
    cuisine: "",
    reviews: []
  };

  //State to hold the current restaurant's info
  const [restaurant, setRestaurant] = useState(initialRestaurantState);

  //Function to fetch and load restauraunt data via 'ID'
  const getRestaurant = id => {
    RestaurantDataService.get(id)
      .then(response => {
        setRestaurant(response.data); //Set the fetched data to match as current restaurant
        console.log(response.data); // Log the fetched data.
      })
      .catch(e => {
        console.log(e);
      });
  };

  //Fetch restauraunt data when component mounts or whenever the ID changes.
  useEffect(() => {
    getRestaurant(props.match.params.id);
  }, [props.match.params.id]); //When this ID in this array is updated,  useEFfect() is called.

  //Function to delete the review.
  const deleteReview = (reviewId, index) => {
    RestaurantDataService.deleteReview(reviewId, props.user.id) // Fixed typo "reviewwId" to "reviewId"
      .then(response => {
        setRestaurant((prevState) => {
          const updatedReviews = prevState.reviews.slice();
          updatedReviews.splice(index, 1);
          return ({
            ...prevState,
            reviews: updatedReviews
          });
        });
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      {/* Check to see if there is a restaurant*/}
      {restaurant ? (
        <div>
          {/* Display restaurant name and details, cuisine, and address */}
          <h5>{restaurant.name}</h5>
          <p>
            <strong>Cuisine: </strong>
            {restaurant.cuisine}
            <br />
            <strong>Address: </strong>
            {restaurant.address} {/* Fix missing address */}
            <br />
          </p>

          {/* Link to add a review */}
          <Link
            to={"/restaurants/" + props.match.params.id + "/review"}
            className="btn btn-primary"
          >
            Add Review
          </Link>
          <h4>Reviews</h4>
          <div className="row">
            {/* Check condiiton to see if there are any reviews*/}
            {restaurant.reviews.length > 0 ? (
              restaurant.reviews.map((review, index) => {
                return (
                  <div className="col-lg-4 pb-1" key={index}>
                    <div className="card">
                      <div className="card-body">
                        {/* Card Text to display review details*/}
                        <p className="card-text">
                          {review.text}
                          <br />
                          <strong>User: </strong>
                          {review.name}
                          <br />
                          <strong>Date: </strong>
                          {review.date}
                        </p>

                        {/* Check if there is a user that can edit or delete the review */}
                        {props.user && props.user.id === review.user_id && (
                          <div className="row">

                            {/* Delete review button*/}
                            <a
                              onClick={() => deleteReview(review._id, index)}
                              className="btn btn-primary col-lg-5 mx-1 mb-1"
                            >
                              Delete
                            </a>

                            {/* Edit review buton */}
                            <Link
                              to={{
                                pathname:
                                  "/restaurants/" +
                                  props.match.params.id +
                                  "/review",
                                state: {
                                  currentReview: review
                                }
                              }}
                              className="btn btn-primary col-lg-5 mx-1 mb-1"
                            >
                              Edit
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              //Message display when there's no reviews.
              <div className="col-sm-4">
                <p>No reviews yet...</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        //Message display when there's no restaurants selected/specified.
        <div>
          <br />
          <p>No restaurant selected...</p>
        </div>
      )}
    </div>
  );
};

export default Restaurant;
