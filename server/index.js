const {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    fetchCustomers,
    fetchRestaurants,
    createReservation,
    destroyReservation,
} = require("./db");
const express = require("express");
const morgan = require("morgan");

const server = express();
client.connect();

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`listening on port ${port}`));

server.use(morgan("dev"));
server.use(express.json());

server.get("/api/customers", async (req, res, next) => {
    try {
        const customers = await fetchCustomers();
        res.send(customers);
    } catch (error) {
        next(error);
    }
});

server.get("/api/restaurants", async (req, res, next) => {
    try {
        const restaurants = await fetchRestaurants();
        res.send(restaurants);
    } catch (error) {
        next(error);
    }
});

server.get("/api/reservations", async (req, res, next) => {
    try {
        const reservations = await fetchReservations();
        res.send(reservations);
    } catch (error) {
        next(error);
    }
});

server.post("/api/customers/:id/reservations", async (req, res, next) => {
    try {
        const reservation = await createReservation({
            // departure_date: req.body.departure_date,
            // user_id: req.params.user_id,
            // place_id: req.body.place_id,
        });
        res.send(reservation);
    } catch (error) {
        next(error);
    }
});

server.delete("/api/customers/:customer_id/reservations/:id", async (req, res, next) => {
    try {
        await destroyReservation(req.params.id, req.params.customer_id);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});

//error handling route which returns an object with an error property
server.use((err, req, res) => {
    res.status(err.status || 500).send({ error: err.message || err });
});