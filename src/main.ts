import { setMaxListeners } from "events";
import * as mqtt from "mqtt";
import config from "./config";

function main() {
  setMaxListeners(config.benchmark.total_message);
  const client = mqtt.connect(config.mqtt.endpoint, {
    username: config.mqtt.username,
    password: config.mqtt.password,
    port: config.mqtt.port,
  });

  client.on("error", console.log);

  client.on("connect", async () => {
    console.log("CONNECTED");
    const start = Date.now();
    const messages_sent = await Promise.all(
      create_messages(
        client,
        config.benchmark.total_topic,
        config.benchmark.total_message
      )
    );
    const end = Date.now();
    let success = 0,
      failed = 0;
    messages_sent.forEach((value) => {
      value ? (success = success + 1) : (failed = failed + 1);
    });
    console.log("MESSAGE SENT : ", messages_sent.length);
    console.log("TOTAL TOPIC  : ", config.benchmark.total_topic);
    console.log("TOTAL SUCCESS: ", success);
    console.log("TOTAL FAILED : ", failed);
    console.log("TIME TAKEN   : ", end - start, "ms");
    process.exit(0);
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
