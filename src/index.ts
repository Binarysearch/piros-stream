console.log('Hola');

import { Kafka } from 'kafkajs';
import { KafkaClient } from './app/client/kafka-client';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';

const client = new KafkaClient({
    clientId: 'my-app',
    brokers: ['kafka-server:9092']
});

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['kafka-server:9092']
});

kafka.admin().deleteTopics({ topics: [ 'test-topic4' ]}).then(()=>{
    kafka.admin().createTopics({ topics: [{ topic: 'test-topic5', numPartitions: 2 }]}).then(() => {

        const source = timer(0, 1000).pipe(map(i => ({ number: i })));
    
        client.createProducer('test-topic5', source).subscribe();
        
        client.createConsumer('test-topic5', 'test-group-2').getMessages().subscribe((m) => {
            console.log('Message received-2-1: ', m);
        });
        client.createConsumer('test-topic5', 'test-group-2').getMessages().subscribe((m) => {
            console.log('Message received-2-2: ', m);
        });
        
        client.createConsumer('test-topic5', 'test-group-3').getMessages().subscribe((m) => {
            console.log('Message received-3-1: ', m);
        });
    
    });
});
