'use strict';
const config      = require('config');
const SqsConsumer = require('./services/SqsConsumer');
const S3          = require('./services/S3');


class Consumer {
    constructor() {
        this.sqsConsumer = new SqsConsumer(config.aws.sqs.queueUrl, this.handleMessages.bind(this))
        this.s3          = new S3(config.aws.s3.bucketName, config.aws.s3.bucketPrefix);
    }

    start() {
        this.sqsConsumer.start();
    }

    stop() {
        this.sqsConsumer.stop()
    }

    async handleMessages(messages) {
        console.log('handle messages...');

        try {
            const messagesToUploadStr = messages.map(m => m.Body).join('\n');
            const uploadedFilePath    = await this.s3.upload(messagesToUploadStr);
            console.log(`${messages.length} messages was uploaded to s3, filePath: ${uploadedFilePath}`);
        } catch (error) {
            console.log('failed to upload to s3', error);
            throw error;
        }
    }
}

module.exports = Consumer;