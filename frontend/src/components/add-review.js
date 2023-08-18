import React, { useState} from "react";
import RestaurantDataService from "../services/restaurant";
import { Link } from "react-router-dom";

const AddReview = props => {
  let initialReviewState = ""; //Empty until user enters a string for review.
  let editing = false;

  //Check if there's a current/existing Review passed via props.location.state.
  if (props.location.state && props.location.state.currentReview) {
    editing = true; //Set to true when editing an existing review.
    
    //Iniitalize review text.
    initialReviewState = props.location.state.currentReview.text;
  }

  //Determine whether component is in editing mode.
  const [review, setReview] = useState(initialReviewState);
  //Determine if the review is submitted or not.
  const [submitted, setSubmitted] = useState(false);

  //Store review content via setReview
  const handleInputChange = event => {
    setReview(event.target.value);
  };

  //Func to update 'review' state when user enters input field.
  const saveReview = () => {
    var data = {
      text: review,
      name: props.user.name,
      user_id: props.user.id,
      restaurant_id: props.match.params.id
    };

    //If editing avilable, update the data object.
    if (editing) {
      //Review ID to match the review being edited.
      data.review_id = props.location.state.currentReview._id;
      
      //Call API to update the review.
      RestaurantDataService.updateReview(data)
        .then(response => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      //Call API to create a new review.
      RestaurantDataService.createReview(data)
        .then(response => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
  };

  //Save the review data. Depending on the editing condition, update the existing review or create a new one if there are none.
  return (
    <div>
      {/* Check if user is logged in.*/}
      {props.user ? (
        <div className="submit-form">
          {/* Check if form submission is successful. */}
          {submitted ? (
            <div>
              <h4>You have submitted successfully!</h4>
              {/* Link back to the restaurant */}
              <Link to={"/restaurants/" + props.match.params.id} className="btn btn-success">
                Back to Restaurant
              </Link>
            </div>
          ) : (
            <div>
              <div className="form-group">
                <label htmlFor="description">
                  {editing ? "Edit" : "Create"} Review
                </label>
                {/* Review input field */}
                <input
                  type="text"
                  name="text"
                  className="form-control"
                  id="text"
                  required
                  value={review}
                  onChange={handleInputChange}
                />
              </div>
              {/* Submit button */}
              <button onClick={saveReview} className="btn btn-success">
                Submit
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>Please Log In.</div>
      )}
    </div>
  );
};

export default AddReview;
