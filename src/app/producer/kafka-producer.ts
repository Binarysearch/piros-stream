import { Producer } from "kafkajs";
import { Observable, from } from "rxjs";
import { map } from "rxjs/operators";

export interface SendResult {
    topicName: string
    partition: number
    errorCode: number
    offset?: string
    timestamp?: string
    baseOffset?: string
    logAppendTime?: string
    logStartOffset?: string
}

export interface Message<T> {
    key?: Buffer | string | null;
    value: T;
}

export class KafkaProducer<T> {

    constructor(
        private producer: Producer,
        private topic: string,
    ) { }

    public send(message: Message<T>): Observable<SendResult> {
        return from(this.producer.send({ 
            topic: this.topic, 
            messages: [{key: message.key, value: JSON.stringify(message.value)}],
            acks: -1
        })).pipe(
            map(r => r[0])
        );
    }
}
