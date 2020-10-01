import { Kafka, PartitionMetadata, Message, ICustomPartitioner } from 'kafkajs';
import { KafkaProducer, MessageSource } from '../producer/kafka-producer';
import { Observable, Subject } from 'rxjs';
import { KafkaConsumer } from '../consumer/consumer';

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
    
    public createProducer<T>(topic: string, source: MessageSource<T>): Observable<KafkaProducer> {
        return new Observable((obs) => {
            const producer = this.kafka.producer();
            producer.connect().then(() => {

                source.subscribe(
                    (m) => {
                        producer.send({
                            topic: topic,
                            messages: [{ value: JSON.stringify(m) }]
                        });
                    },
                    () => {
                        producer.disconnect().then(() => {

                        });
                    }
                );

                obs.next(new KafkaProducer(producer));
                obs.complete();
            }).catch((e) => obs.error(e));
        });
    }
    
    public createConsumer<T>(topic: string, groupId: string): KafkaConsumer<T> {
        const consumer = this.kafka.consumer({ groupId: groupId });
        const subject = new Subject<T>();

        consumer.connect().then(() => {
            consumer.subscribe({ topic: topic, fromBeginning: true }).then(() => {
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