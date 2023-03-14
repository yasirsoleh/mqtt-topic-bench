import { error } from "console";
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
    const start = Date.now();
    Promise.all([
      create_messages(
        client,
        config.benchmark.total_topic,
        config.benchmark.total_message
      ),
    ]).finally(() => {
      const end = Date.now();
      const total_time = end - start;
      console.log("TOTAL TIME: ", total_time, " ms");
      process.exit(0);
    });
  });
}

function create_messages(
  client: mqtt.Client,
  total_topic: number,
  total_message: number
) {
  const messages = [];
  const increment = Math.floor(total_message / total_topic);
  for (let topic = 0; topic < total_topic; topic++) {
    for (
      let message = topic * increment;
      message < (topic + 1) * increment;
      message++
    ) {
      messages.push(message_publish(client, topic, message));
    }
  }
  return messages;
}

async function message_publish(
  client: mqtt.Client,
  topic_no: number,
  message_no: number
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      client.publish(
        `benchmark/${topic_no}`,
        `message ${message_no}`,
        { qos: 0 },
        (error) => {
          if (error) {
            resolve(false);
          }

          resolve(true);
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

main();
