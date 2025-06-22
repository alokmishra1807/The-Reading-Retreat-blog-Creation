import amqp from "amqplib";

let channel: amqp.Channel;

export const connectRabbit = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: process.env.rabbitmq_host,
      port: 5672,
      username: process.env.rabbitmq_username,
      password: process.env.rabbitmq_password,
    });

    channel =await connection.createChannel();

    console.log("✅ connected to rabbitmq ");
  } catch (error) {
    console.error("failed to connect", error);
  }
};

export const publishToQueue = async (queueName: string, message: any) => {
  if (!channel) {
    console.error("Rabbitmq channel is not intialised");
    return;
  }

 await channel.assertQueue(queueName,{durable:true});

 channel.sendToQueue(queueName,Buffer.from(JSON.stringify(message)),{
    persistent:true,
 });
};



export const invalidateCacheJob = async (cacheKeys: string[]) => {
  try {
    console.log("🚀 invalidateCacheJob called with:", cacheKeys);

    const message = {
      action: "invalidateCache",
      keys: cacheKeys,
    };

    await publishToQueue("cache-invalidation", message);

    console.log("✅ Cache invalidation job published to RabbitMQ");
  } catch (error) {
    console.error("❌ Failed to publish cache on RabbitMQ", error);
  }
};