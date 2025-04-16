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

const init = async () => {
    await client.connect();
    console.log("connected to database");

    createTables();
    console.log("tables created ");

    const [Brayden, Chuck, Sandi, Buffalo, Senro, Burritos, Alexander] = await Promise.all([
        createCustomer("Brayden"),
        createCustomer("Chuck"),
        createCustomer("Sandi"),
        createRestaurant("Hungry Buffalo"),
        createRestaurant("Senro"),
        createRestaurant("Buritto Factory"),
        createRestaurant("Alexander's"),
    ]);
    console.log("customers and restaurants created");

    console.log(await fetchCustomers());
    console.log(await fetchRestaurants());

    const [res1] = await Promise.all([
        createReservation({
            date: "04/25/2025",
            customer_id: Brayden.id,
            restaurant_id: Buffalo.id,
            party_count: "10",
        }),
        createReservation({
            date: "11/11/2025",
            customer_id: Chuck.id,
            restaurant_id: Alexander.id,
            party_count: "58",
        }),
    ]);
    console.log("reservations created");

    console.log(await fetchReservations());

    await destroyReservation(res1.id, Sandi.id);
    console.log("deleted reservation");

    console.log(await fetchReservations());

    await client.end();
};

init();
