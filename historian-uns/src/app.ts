/*
 * AMRC InfluxDB UNS Historian
 * Copyright "2023" AMRC
 */
import {ServiceClient, UUIDs} from "@amrc-factoryplus/service-client";
import MQTTClient from "./mqttclient.js";
import pretty from "pino-pretty";
import pino from "pino";

let dotenv: any = null;
try {
    dotenv = await import ('dotenv')
} catch (e) {
}

const stream = pretty({
    colorize: true
})

dotenv?.config();

const directoryUrl = process.env.DIRECTORY_URL;
if (!directoryUrl) {
    throw new Error("DIRECTORY_URL environment variable is not set");
}

export const logger = pino({
    name: 'ACS UNS Ingester',
    level: process.env.LOG_LEVEL || 'info',
}, stream);


const client = await new ServiceClient({
    env: process.env
}).init();

// Overwrite MQTT server if specified in environment
if (process.env.MQTT_URL) {
    client.Discovery.set_service_url(UUIDs.Service.MQTT, process.env.MQTT_URL);
}

// Overwrite Command Escalation server if specified in environment
if (process.env.CMD_ESC_URL) {
    client.Discovery.set_service_url(UUIDs.Service.Command_Escalation, process.env.CMD_ESC_URL);
}

// Well known UUID for MQTT Component service function (see: https://factoryplus.app.amrc.co.uk/docs/framework-components/core-components/mqtt)
logger.info(client.service_urls('feb27ba3-bd2c-4916-9269-79a61ebc4a47'));

const mqtt = await new MQTTClient({
    e: {
        serviceClient: client,
    }
}).init();

mqtt.run();