import { Kafka } from 'kafkajs';
import { KafkaProducer } from '../producer/kafka-producer';
import { Observable, Subject, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { KafkaConsumer } from '../consumer/kafka-consumer';

export interface KafkaClientConfig {
    clientId: string;
    brokers: string[];
}

export class KafkaClient {
    
    private kafka: Kafka;

    constructor(
        config: KafkaClientConfig
    ) {
        this.kafka = new Kafka({
            clientId: config.clientId,
            brokers: config.brokers
        });
    }
    
    public createProducer<T>(topic: string): Observable<KafkaProducer<T>> {
        const producer = this.kafka.producer({ retry: { retries: 10 } });
        return from(producer.connect()).pipe(
            map(() => new KafkaProducer<T>(producer, topic))
        );
    }
    
    public createConsumer<T>(topic: string, groupId: string): KafkaConsumer<T> {
        const consumer = this.kafka.consumer({ groupId: groupId });
        const subject = new Subject<T>();

        consumer.connect().then(() => {
            consumer.subscribe({ topic: topic }).then(() => {
                consumer.run({
                    eachMessage: async ({ topic, partition, message }) => {
                        subject.next(JSON.parse(message.value.toString()));
                    },
                });
            }).catch((e) => subject.error(e));
        }).catch(e => subject.error(e));

        return new KafkaConsumer(consumer, subject);
    }
}