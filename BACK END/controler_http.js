
const path = require('path');
const moment = require('moment');
const {Pool} = require('pg')
const { off } = require('process');
const { start } = require('repl');
require('dotenv').config()
require('fs');
const dbase_rest= new Pool({
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_GISTING
})
dbase_rest.connect();
module.exports = {

    async getDataGistingNew(req, res) {
        const data = await dbase_rest.query(`SELECT datetime, soilmoisture_1, soilmoisture_2, soilmoisture_3, waterflow_1, waterflow_2, waterflow_3, waterflow_4, waterflow_5, waterflow_6, waterflow_7, waterflow_8, waterflow_9, waterflow_10, waterflow_11, waterflow_12, weight_1, weight_2, weight_3, weight_4, infrared_1, infrared_2, anemo, winddirect, dht, ph, suhuair, tdsmeter, raingauge, coolingsystem, uvlampu
        FROM gistingics ORDER BY datetime DESC LIMIT 100`);
    
        if (data.rowCount > 0) {
            const combinedArray = data.rows.map(row => {
                const { datetime, ...rest } = row;
                return {
                    datetime: moment(datetime).format("DD-MM-YY HH:mm:ss"),
                    ...rest,
                };
            });
    
            res.status(200);
            res.send({
                count: data.rowCount,
                result: combinedArray,
            });
    
            console.log("[REST-API] GET DATA 100");
        } else {
            res.status(404).send("No data found");
        }
    }
    
}
