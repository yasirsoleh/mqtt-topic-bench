import dotenv from "dotenv";
dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const env_found = dotenv.config();
if (env_found.error) {
  throw new Error("! .env file not found !");
}

export default {
  mqtt: {
    endpoint: process.env.MQTT_ENDPOINT || "test.mosquitto.org",
    port: parseInt(process.env.MQTT_PORT || "1883"),
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  },
  benchmark: {
    total_message: parseInt(process.env.BENCHMARK_TOTAL_MESSAGES || "1000"),
    total_topic: parseInt(process.env.BENCHMARK_TOTAL_TOPIC || "1"),
  },
  dev: process.env.NODE_ENV,
};
