import { Producer } from "kafkajs";
import { Subscription } from "rxjs";


export interface MessageSource<T> {
    subscribe(next?: (message: T) => void, complete?: () => void): Subscription;
}

export class KafkaProducer {

    constructor(
        private producer: Producer
    ) {}

}
