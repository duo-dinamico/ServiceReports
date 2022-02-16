const bcrypt = require("bcryptjs");

const {casinosData, departmentsData, machinesData, servicesData, usersData} = require("../data");
const salt = bcrypt.genSaltSync();
const hash = bcrypt.hashSync("testuserpassword", salt);

exports.seed = async knex => {
    await knex.migrate.rollback();
    await knex.migrate.latest();
    await knex.insert(usersData).into("users");
    await knex
        .insert({
            name: "user test login",
            username: "testuserlogin",
            password: hash,
        })
        .into("users");
    await knex.insert(casinosData).into("casinos");
    await knex.insert(departmentsData).into("departments");
    await knex.insert(machinesData).into("machines");
    return knex.insert(servicesData).into("services");
};
