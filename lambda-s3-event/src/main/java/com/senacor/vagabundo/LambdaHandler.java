package com.senacor.vagabundo;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.S3Event;
import com.amazonaws.services.s3.event.S3EventNotification;

/**
 * Handler class to recieve the S3 Event
 */

@SuppressWarnings("unused")
public class LambdaHandler implements RequestHandler<S3Event, Void> {

    public Void handleRequest(S3Event s3event, Context context){
        context.getLogger().log("recieved event: " + s3event.toString());

        try {
            S3EventNotification.S3EventNotificationRecord record = s3event.getRecords().get(0);

            context.getLogger().log("Name of bucket: " + record.getS3().getBucket().getName());
            context.getLogger().log("Name of file: " + record.getS3().getObject().getKey());

        } catch (Exception e) {
            context.getLogger().log("ERROR");
            e.printStackTrace();
        }

        return null;
    }
}
