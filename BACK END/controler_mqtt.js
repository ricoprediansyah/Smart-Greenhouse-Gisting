const dbase_mqtt = require('./database_config.js');
const mqtt_connect = require('./mqtt_config.js');

require('dotenv').config()

TOPIC_GISTING = process.env.TOPIC;


TS_PATH = process.env.PAYLOAD_GISTING_TS
SOILMOISTURE1_PATH = process.env.PAYLOAD_GISTING_SOILMOISTURE_1
SOILMOISTURE2_PATH = process.env.PAYLOAD_GISTING_SOILMOISTURE_2
SOILMOISTURE3_PATH = process.env.PAYLOAD_GISTING_SOILMOISTURE_3
WATERFLOW1_PATH = process.env.PAYLOAD_GISTING_WATERFLOW_1
WATERFLOW2_PATH = process.env.PAYLOAD_GISTING_WATERFLOW_2
WATERFLOW3_PATH = process.env.PAYLOAD_GISTING_WATERFLOW_3
WATERFLOW4_PATH = process.env.PAYLOAD_GISTING_WATERFLOW_4
WATERFLOW5_PATH = process.env.PAYLOAD_GISTING_WATERFLOW_5
WATERFLOW6_PATH = process.env.PAYLOAD_GISTING_WATERFLOW_6
WATERFLOW7_PATH = process.env.PAYLOAD_GISTING_WATERFLOW_7
WATERFLOW8_PATH = process.env.PAYLOAD_GISTING_WATERFLOW_8
WATERFLOW9_PATH = process.env.PAYLOAD_GISTING_WATERFLOW_9
WATERFLOW10_PATH = process.env.PAYLOAD_GISTING_WATERFLOW_10
WATERFLOW11_PATH = process.env.PAYLOAD_GISTING_WATERFLOW_11
WATERFLOW12_PATH = process.env.PAYLOAD_GISTING_WATERFLOW_12
WEIGHT1_PATH = process.env.PAYLOAD_GISTING_WEIGHT_1
WEIGHT2_PATH = process.env.PAYLOAD_GISTING_WEIGHT_2
WEIGHT3_PATH = process.env.PAYLOAD_GISTING_WEIGHT_3
WEIGHT4_PATH = process.env.PAYLOAD_GISTING_WEIGHT_4
INFRARED1_PATH = process.env.PAYLOAD_GISTING_INFRARED_1
INFRARED2_PATH = process.env.PAYLOAD_GISTING_INFRARED_2
ANEMO_PATH = process.env.PAYLOAD_GISTING_ANEMO
WINDDIRECTION_PATH = process.env.PAYLOAD_GISTING_WINDDIRECTION
DHT_PATH = process.env.PAYLOAD_GISTING_DHT
PH_PATH = process.env.PAYLOAD_GISTING_PH
SUHUAIR_PATH = process.env.PAYLOAD_GISTING_SUHUAIR
TDSMETER_PATH = process.env.PAYLOAD_GISTING_TDSMETER
RAINGAUGE_PATH = process.env.PAYLOAD_GISTING_RAINGAUGE
COOLINGSYSTEM_PATH = process.env.PAYLOAD_GISTING_COOLINGSYSTEM
UVLAMPU_PATH = process.env.PAYLOAD_GISTING_UVLAMPU


module.exports = {
        // MQTT HANDLING
            async incomingData(topic,message){
            if (topic === TOPIC_GISTING){
                const payload = JSON.parse(message.toString());
             
            {
                        // Save Payload to variable
                        TS = payload[TS_PATH];
                        SOILMOISTURE1 = parseFloat(payload[SOILMOISTURE1_PATH]);
                        SOILMOISTURE2 = parseFloat(payload[SOILMOISTURE2_PATH]);
                        SOILMOISTURE3 = parseFloat(payload[SOILMOISTURE3_PATH]);
                        WATERFLOW1 = parseFloat(payload[WATERFLOW1_PATH]);
                        WATERFLOW2 = parseFloat(payload[WATERFLOW2_PATH]);
                        WATERFLOW3 = parseFloat(payload[WATERFLOW3_PATH]);
                        WATERFLOW4 = parseFloat(payload[WATERFLOW4_PATH]);
                        WATERFLOW5 = parseFloat(payload[WATERFLOW5_PATH]);
                        WATERFLOW6 = parseFloat(payload[WATERFLOW6_PATH]);
                        WATERFLOW7 = parseFloat(payload[WATERFLOW7_PATH]);
                        WATERFLOW8 = parseFloat(payload[WATERFLOW8_PATH]);
                        WATERFLOW9 = parseFloat(payload[WATERFLOW9_PATH]);
                        WATERFLOW10 = parseFloat(payload[WATERFLOW10_PATH]);
                        WATERFLOW11 = parseFloat(payload[WATERFLOW11_PATH]);
                        WATERFLOW12 = parseFloat(payload[WATERFLOW12_PATH]);
                        WEIGHT1 = parseFloat(payload[WEIGHT1_PATH]);
                        WEIGHT2 = parseFloat(payload[WEIGHT2_PATH]);
                        WEIGHT3 = parseFloat(payload[WEIGHT3_PATH]);
                        WEIGHT4 = parseFloat(payload[WEIGHT4_PATH]);
                        INFRARED1 = parseFloat(payload[INFRARED1_PATH]);
                        INFRARED2 = parseFloat(payload[INFRARED2_PATH]);
                        ANEMO = parseFloat(payload[ANEMO_PATH]);
                        WINDDIRECTION = parseFloat(payload[WINDDIRECTION_PATH]);
                        DHT = parseFloat(payload[DHT_PATH]);
                        PH = parseFloat(payload[PH_PATH]);
                        SUHUAIR = parseFloat(payload[SUHUAIR_PATH]);
                        TDSMETER = parseFloat(payload[TDSMETER_PATH]);
                        RAINGAUGE = parseFloat(payload[RAINGAUGE_PATH]);
                        COOLINGSYSTEM = parseFloat(payload[COOLINGSYSTEM_PATH]);
                        UVLAMPU = parseFloat(payload[UVLAMPU_PATH]);
                       
                    }
        
                }
                const dataArray = [TS,SOILMOISTURE1, SOILMOISTURE2, SOILMOISTURE3, WATERFLOW1, WATERFLOW2, WATERFLOW3, WATERFLOW4, WATERFLOW5, WATERFLOW6, WATERFLOW7, WATERFLOW8, WATERFLOW9, WATERFLOW10, WATERFLOW11, WATERFLOW12, WEIGHT1, WEIGHT2, WEIGHT3, WEIGHT4, INFRARED1, INFRARED2, ANEMO, WINDDIRECTION, DHT, PH, SUHUAIR, TDSMETER, RAINGAUGE, COOLINGSYSTEM, UVLAMPU];
 
                const insertQuery = `INSERT INTO gistingics (datetime, soilmoisture_1, soilmoisture_2, soilmoisture_3, waterflow_1, waterflow_2, waterflow_3, waterflow_4, waterflow_5, waterflow_6, waterflow_7, waterflow_8, waterflow_9, waterflow_10, waterflow_11, waterflow_12, weight_1, weight_2, weight_3, weight_4, infrared_1, infrared_2, anemo, winddirect, dht, ph, suhuair, tdsmeter, raingauge, coolingsystem, uvlampu) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31)`;

                
                dbase_mqtt.query(insertQuery, dataArray, (err, res) => {
                    if (err) {
                        console.error('Error inserting data into the database:', err);
                    } else {
                 console.log(`DATA INSERTED TO DATABASE: Time - ${TS}, SOILMOISTURE 1 - ${SOILMOISTURE1}, SOILMOISTURE 2 - ${SOILMOISTURE2}, SOILMOISTURE 3 - ${SOILMOISTURE3}, WATERFLOW 1 - ${WATERFLOW1}, WATERFLOW 2 - ${WATERFLOW2}, WATERFLOW 3 - ${WATERFLOW3}, WATERFLOW 4 - ${WATERFLOW4}, WATERFLOW 5 - ${WATERFLOW5}, WATERFLOW 6 - ${WATERFLOW6}, WATERFLOW 7- ${WATERFLOW7}, WATERFLOW 8 - ${WATERFLOW8}, WATERFLOW 9 - ${WATERFLOW9}, WATERFLOW 10 - ${WATERFLOW10}, WATERFLOW 11 - ${WATERFLOW11}, WATERFLOW 12 - ${WATERFLOW12}, WEIGHT 1 - ${WEIGHT1}, WEIGHT 2 - ${WEIGHT2}, WEIGHT 3 - ${WEIGHT3}, WEIGHT 4 - ${WEIGHT4} INFRARED 1 - ${INFRARED1}, INFRARED 2 - ${INFRARED2}, ANEMO - ${ANEMO}, WINDDIRECTION - ${WINDDIRECTION}, DHT - ${DHT}, PH - ${PH}, SUHUAIR - ${SUHUAIR}, TDSMETER - ${TDSMETER}, RAINGAUGE - ${RAINGAUGE}, COOLINGSYSTEM - ${COOLINGSYSTEM}, UVLAMPU - ${UVLAMPU}`);
                }
            }
                )}
}
        