'use strict';

const AWS        = require('aws-sdk');
const moment     = require('moment-timezone');
const util       = require('util');
const zlib       = require('zlib');
const { v4: uuidv4 } = require('uuid');

const gzip = util.promisify(zlib.gzip);


class S3 {
    constructor(bucketName, bucketPrefix, options = {}) {
        this.bucketName   = bucketName
        this.bucketPrefix = bucketPrefix
        this.s3           = new AWS.S3(
            { apiVersion: '2012-11-05', accessKeyId: options.accessKeyId, secretAccessKey: options.secretAccessKey });
    }

    async upload(message) {
        const params = {
            Bucket         : this.bucketName,
            Key            : this._generateFilePath(),
            Body           : await this._objectToStream(message),
            ContentType    : 'text/plain',
            ContentEncoding: 'gzip'
        };
        console.info(`upload file to ${params.key}`);
        await this.s3.upload(params).promise();

        return params.Key;
    }

    async _objectToStream(str) {
        const buffer = new Buffer.from(str)
        return await gzip(buffer);
    }

    _generateFilePath() {
        const now = moment();
        return `${this.bucketPrefix}/${now.format('YYYY')}/${now.format('MM')}/${now.format(
            'DD')}/${now.format('HH')}/${now.format('mm')}/${uuidv4()}.gz`;
    }
}

module.exports = S3;