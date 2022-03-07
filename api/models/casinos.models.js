const Boom = require("@hapi/boom");

const connection = require("../db/psql/connection");

const columnSelection = ["id", "name", "location", "created_at", "updated_at", "deleted_at"];

exports.fetchAllCasinos = async ({sort_by, order, casino_id}) => {
    const casinos = await connection
        .select(columnSelection)
        .from("casinos")
        .where({deleted_at: null})
        .modify(builder => {
            if (sort_by && order) builder.orderBy(sort_by, order);
            if (casino_id) builder.where({id: casino_id});
        });
    return casinos;
};

exports.fetchCasino = async ({id}, name) => {
    const [casino] = await connection
        .select(columnSelection)
        .from("casinos")
        .where({deleted_at: null})
        .modify(builder => {
            if (id) builder.where({id});
            if (name) builder.where({name});
        });
    if (!casino && id) return Promise.reject(Boom.notFound(`"${id}" could not be found`));
    return casino;
};

exports.removeCasino = async ({id}) => {
    await connection.from("casinos").where({id}).update({deleted_at: new Date().toISOString()});
};

exports.addCasino = async body => {
    const [casino] = await connection
        .from("casinos")
        .insert({...body, created_at: new Date().toISOString()})
        .returning(columnSelection);
    return casino;
};
