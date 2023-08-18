import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link } from "react-router-dom";

const RestaurantsList = props => {
    //State vars to manage data and user inputs
    const [restaurants, setRestaurants] = useState([]); //Holds list of Restaurants
    const [searchName, setSearchName] = useState(""); //Holds search input data for restaurant 'name'
    const [searchZip, setSearchZip] = useState(""); //Holds search input data for restaurant 'ZIP Code'
    const [searchCuisine, setSearchCuisine] = useState(""); //Golds the search input for restaurant 'cuisines'
    const [cuisines, setCuisines] = useState(["All Cuisines"]); // Initialize cuisines with an array containing "All Cuisines"

    //useEffect react hook to fetch data on component mount
    useEffect(() => {
        if (restaurants.length === 0) {
            retrieveRestaurants(); //Fetch all restaurants
        }

        //Check cuisines length to see if "All Cuisines" have been added
        if (cuisines.length === 1) {
            retrieveCuisines(); //Fetch all available cuisines
        }
    }, [restaurants, cuisines]);

    //Event handler for search input changes on name, zip, cuisine.
    const onChangeSearchName = e => {
        const searchName = e.target.value;
        setSearchName(searchName);
    }

    const onChangeSearchZip = e => {
        const searchZip = e.target.value;
        setSearchZip(searchZip);
    }

    const onChangeSearchCuisine = e => {
        const searchCuisine = e.target.value;
        setSearchCuisine(searchCuisine);
    }

    //Function to fetch all restaurants
    const retrieveRestaurants = () => {
        RestaurantDataService.getAll()
            .then(response => {
                setRestaurants(response.data.restaurants);
            })
            .catch(e => {
                console.log(e);
            });
    };

    //Function to fetch all available cuisines
    const retrieveCuisines = () => {
        RestaurantDataService.getCuisines()
            .then(response => {
                setCuisines(["All Cuisines", ...response.data]); // Concatenate arrays correctly
            })
            .catch(e => {
                console.log(e);
            });
    };

    //Function to refresh the list of restaurants
    const refreshList = () => {
        retrieveRestaurants();
    };

    //Function to search for restaurants based on the specified query and search type.
    const find = (query, by) => {
        RestaurantDataService.find(query, by)
            .then(response => {
                setRestaurants(response.data.restaurants); // Update the list of restaurants based on the search result
            }).catch(e => {
                console.log(e);
            });
    };

    //Function to initiate searches based on different criteria for 'name', 'zipcode', 'cuisine'.
    const findByName = () => {
        find(searchName, "name");
    };

    const findByZip = () => {
        find(searchZip, "zipcode");
    };

    const findByCuisine = () => {
        //If 'All Cuisines" dropdown is selected, then, refresh the list to showcase all restaurants.
        if (searchCuisine === "All Cuisines") {
            refreshList();
        } else {
            find(searchCuisine, "cuisine");
        }
    };

    //JSX component render
    return (
        <div>
            <div className="row pb-1">
                {/* Search By Name */}
                <div className="input-group col-lg">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search By Name"
                        value={searchName}
                        onChange={onChangeSearchName}
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={findByName}
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Search By ZIP */}
                <div className="input-group col-lg">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search By Zip"
                        value={searchZip}
                        onChange={onChangeSearchZip}
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={findByZip}
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Search By Cuisine */}
                <div className="input-group col-lg">
                    <select onChange={onChangeSearchCuisine}>
                        {cuisines.map(cuisine => {
                            return (
                                <option value={cuisine}> {cuisine.substr(0, 20)}</option>
                            )
                        })}
                    </select>
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={findByCuisine}
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Display a list of restaurants */}
            <div className="row">
                {restaurants.map((restaurant) => {
                    const address = `${restaurant.address.building} ${restaurant.address.street}, ${restaurant.address.zipcode}`;
                    return (
                        <div className="col-lg-4 pb-1" key={restaurant._id}> {/* Add key prop */}
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{restaurant.name}</h5>
                                    <p className="card-text">
                                        <strong>Cuisine: </strong>{restaurant.cuisine}<br />
                                        <strong>Address: </strong>{address}<br />
                                    </p>
                                    <div className="row">
                                        {/* Link to 'View Reviews'*/}
                                        <Link to={"/restaurants/" + restaurant._id} className="btn btn-primary col-lg-5 mx-1 mb-1">
                                            View Reviews
                                        </Link>

                                        {/* Link to 'View Map' */}
                                        <a target="_blank" href={"https://www.google.com/maps/place/" + address} className="btn btn-primary col-lg-5 mx-1 mb-1">
                                            View Map
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RestaurantsList;

