package com.senacor.vagabundo;

import com.amazonaws.auth.DefaultAWSCredentialsProviderChain;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.S3Event;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.event.S3EventNotification;
import com.amazonaws.services.s3.transfer.Download;
import com.amazonaws.services.s3.transfer.TransferManager;
import com.amazonaws.services.s3.transfer.TransferManagerBuilder;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.File;

/**
 * Handler class to receive the S3 event and save the object
 */

@SuppressWarnings("unused")
public class LambdaHandler implements RequestHandler<S3Event, Void> {
    private static final Logger logger = LogManager.getLogger(LambdaHandler.class);

    public Void handleRequest(S3Event s3event, Context context){
        logger.debug("recieved event: " + s3event.toString());

        try {
            S3EventNotification.S3EventNotificationRecord record = s3event.getRecords().get(0);

            String bucketName = record.getS3().getBucket().getName();
            String fileName = record.getS3().getObject().getKey();

            logger.debug("Name of bucket: " + bucketName);
            logger.debug("Name of file: " + fileName);

            downloadFile(bucketName, fileName);

        } catch (Exception e) {
            logger.error("Could not download file from bucket {}", e.toString());
            e.printStackTrace();
        }

        return null;
    }

    private void downloadFile(String bucketName, String fileName) throws Exception {
        File file = new File("/tmp/" + fileName);
        file.createNewFile();

        AmazonS3 s3Client = AmazonS3ClientBuilder
                .standard()
                .withCredentials(new DefaultAWSCredentialsProviderChain())
                .withRegion(Regions.EU_CENTRAL_1)
                .build();

        TransferManager transferManager = TransferManagerBuilder
                .standard()
                .withS3Client(s3Client)
                .build();

        Download download = transferManager.download(bucketName, fileName, file);
        download.waitForCompletion();

        logger.debug("Successfully downloaded file from bucket {}", file.getAbsolutePath());

        transferManager.shutdownNow();
    }
}
