const pg = require("pg");
const uuid = require("uuid");
require("dotenv");

const client = new pg.Client(
    process.env.DATABASE_URL || "postgres://localhost/acme_reservation__db"
);

async function createTables() {

    //NEED TO FINISH RESERVATIONS TABLE
    // DATE (DATE NOTE NULL)- travel_date DATE NOT NULL?? 
    // party_count (INTEGER NOT NULL)- how? use curse

    const SQL = `
        DROP TABLE IF EXISTS customers;
        DROP TABLE IF EXISTS restaurnats;
        DROP TABLE IF EXISTS reservations;

        CREATE TABLE reservations(
            id UUID PRIMARY KEY,
            customer_id UUID REFERENCES customers(id) NOT NULL,
            restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
            
        );


        CREATE TABLE restaurants(
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );

        CREATE TABLE customers(
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );
    `;

    await client.query(SQL);
}

//working on functions! 

async function createCustomer(name) {
    const SQL = `INSERT INTO customers(id, name) VALUES($1, $2) RETURNING *`;
    const dbResponse = await client.query(SQL, [uuid.v4(), name]);
    return dbResponse.rows[0];
}

async function fetchCustomers() {
    const SQL = `SELECT * FROM customers;`;
    const dbResponse = await client.query(SQL);
    return dbResponse.rows;
}

async function createRestaurant(name) {
    const SQL = `INSERT INTO restaurants(id, name) VALUES($1, $2) RETURNING *`;
    const dbResponse = await client.query(SQL, [uuid.v4(), name]);
    return dbResponse.rows[0];
}

async function fetchRestaurants() {
    const SQL = `SELECT * FROM restaurants;`;
    const dbResponse = await client.query(SQL);
    return dbResponse.rows;
}

async function createReservation({ departure_date, user_id, place_id }) {
    const SQL = `INSERT INTO reservations(id, user_id, place_id, travel_date) VALUES($1, $2, $3, $4) RETURNING *`;
    const dbResponse = await client.query(SQL, [
        uuid.v4(),
        user_id,
        place_id,
        departure_date,
    ]);
    return dbResponse.rows[0];
}

async function fetchReservations() {
    const SQL = `SELECT * FROM reservations;`;
    const dbResponse = await client.query(SQL);
    return dbResponse.rows;
}

async function destroyReservation(id, user_id) {
    const SQL = `DELETE FROM reservations WHERE id=$1`;
    await client.query(SQL, [id, user_id]);
}

module.exports = {
    client,
    createTables,
    createCustomer,
    fetchCustomers,
    createRestaurant,
    fetchRestaurants,
    createReservation,
    fetchReservations,
    destroyReservation,
};
