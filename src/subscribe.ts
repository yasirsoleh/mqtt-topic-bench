import * as mqtt from "mqtt";
import config from "./config";

function main() {
  const client = mqtt.connect(config.mqtt.endpoint, {
    username: config.mqtt.username,
    password: config.mqtt.password,
    port: config.mqtt.port,
  });
  client.on("error", console.log);
  client.on("connect", async () => {
    console.log("CONNECTED");
    client.subscribe("benchmark/#", () => {
      console.log("SUBSCRIBED");
    });
  });
  let count = 0;
  let start = 0;
  let end = 0;
  client.on("message", (topic, data) => {
    if (count == 0) {
      start = Date.now();
    }
    console.log("\nTOPIC\t: ", topic);
    console.log("DATA\t: ", data.toString());
    count = count + 1;
    if (
      !(
        count <
        config.benchmark.total_message -
          (config.benchmark.total_message % config.benchmark.total_topic)
      )
    ) {
      end = Date.now();
      console.log("\nTIME TAKEN\t: ", end - start, "ms");
      process.exit(0);
    }
  });
}

main();
