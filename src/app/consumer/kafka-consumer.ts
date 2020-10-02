import { Consumer } from "kafkajs";
import { Subject, Observable } from "rxjs";

export class KafkaConsumer<T> {

    constructor(
        private consumer: Consumer,
        private subject: Subject<T>
    ) {}

    public getMessages(): Observable<T> {
        return this.subject.asObservable();
    }
}