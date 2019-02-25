package com.senacor.vagabundo;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.S3Event;
import com.amazonaws.services.s3.event.S3EventNotification;

import software.amazon.awssdk.core.sync.ResponseTransformer;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Paths;

/**
 * Handler class to recieve the S3 event and save the object
 */

@SuppressWarnings("unused")
public class LambdaHandler implements RequestHandler<S3Event, Void> {
    private static S3Client s3Client;
    private Context context = null;

    public Void handleRequest(S3Event s3event, Context context){
        Region region = Region.EU_CENTRAL_1;
        s3Client = S3Client.builder().region(region).build();

        this.context = context;

        try {
            S3EventNotification.S3EventNotificationRecord record = s3event.getRecords().get(0);

            String bucketName = record.getS3().getBucket().getName();
            String fileName = record.getS3().getObject().getKey();

            context.getLogger().log("Name of bucket: " + record.getS3().getBucket().getName());
            context.getLogger().log("Name of file: " + record.getS3().getObject().getKey());

            s3Client.getObject(GetObjectRequest.builder().bucket(bucketName).key(fileName).build(),
                    ResponseTransformer.toFile(Paths.get(fileName)));

        } catch (Exception e) {
            context.getLogger().log("ERROR");
            e.printStackTrace();
        }

        return null;
    }

    private void readFile(String fileName) {
        ClassLoader classLoader = getClass().getClassLoader();
        File file = new File(classLoader.getResource(fileName).getFile());

        FileInputStream fis;

        try {
            fis = new FileInputStream(file);
            this.context.getLogger().log("Total file size to read (in bytes) : " + fis.available());
        }
        catch (IOException e) {
            e.printStackTrace();
        }
    }

}
