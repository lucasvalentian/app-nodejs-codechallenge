import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'transaction-service',
    brokers: ['localhost:9092'],
});

export const kafkaProducer = kafka.producer();
export const kafkaConsumer = kafka.consumer({ groupId: 'transaction-group' });

export async function connectKafka() {
    await kafkaProducer.connect();
    await kafkaConsumer.connect();
    console.log("Conectado a Kafka");
}