
import { Kafka } from 'kafkajs';
import { KafkaClient } from './app/client/kafka-client';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';

const client = new KafkaClient({
    clientId: 'my-app',
    brokers: ['kafka-server-1:9092', 'kafka-server-2:9092']
});

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['kafka-server-1:9092', 'kafka-server-2:9092']
});

const topicName = 'mi-topic-2';


if (process.env.MODE === 'producer') {
    const source = timer(0, 1000).pipe(map(i => ({ number: i })));
    client.createProducer(topicName, source).subscribe();
} else if(process.env.MODE === 'admin'){

    kafka.admin().describeCluster().then((result) => {
        console.log(result);
    });

    printTopicMetadata();

    kafka.admin().createTopics({ topics: [{ topic: topicName, numPartitions: 4, replicationFactor: 3 }], waitForLeaders: true }).then(() => {
        printTopicMetadata();
    });

    kafka.admin().fetchTopicOffsets(topicName).then(result => {
        result.forEach(o => console.log(o));
    });

} else {
    
    client.createConsumer(topicName, 'group-1').getMessages().subscribe((m) => {
        console.log('Message received in group 1 consumer 1: ', m);
    });
    client.createConsumer(topicName, 'group-1').getMessages().subscribe((m) => {
        console.log('Message received in group 1 consumer 2: ', m);
    });
    client.createConsumer(topicName, 'group-1').getMessages().subscribe((m) => {
        console.log('Message received in group 1 consumer 3: ', m);
    });
    
    client.createConsumer(topicName, 'group-2').getMessages().subscribe((m) => {
        console.log('Message received in group 2 consumer 1: ', m);
    });
}

function printTopicMetadata() {
    kafka.admin().fetchTopicMetadata().then((result) => {
        result.topics.filter(t => t.name !== '__consumer_offsets').forEach(t => {
            console.log('-----------------');
            console.log('-----------------');
            console.log(t.name);
            t.partitions.forEach(p => console.log(p));
            console.log('-----------------');
            console.log('-----------------');
        });
    });
}
