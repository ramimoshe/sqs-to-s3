'use strict';
const { Consumer } = require('sqs-consumer');

class SqsConsumer {
    constructor(queueUrl, handleMessagesFn) {
        if (this.sqsConsumer && this.sqsConsumer.isRunning) return

        this.sqsConsumer = Consumer.create({
            queueUrl          : queueUrl,
            batchSize         : 10,
            handleMessageBatch: handleMessagesFn
        });

        this.sqsConsumer.on('error', (err) => {
            console.error(err.message);
        });

        this.sqsConsumer.on('processing_error', (err) => {
            console.error(err.message);
        });
    }

    start() {
        this.sqsConsumer.start();
    }

    stop() {
        this.sqsConsumer.stop()
    }
}

module.exports = SqsConsumer;