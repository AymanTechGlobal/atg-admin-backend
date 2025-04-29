import json
import os
from datetime import datetime
import pymongo
from pymongo import MongoClient
import boto3
from botocore.exceptions import ClientError

# MongoDB connection string from environment variable
MONGODB_URI = os.environ.get('MONGODB_URI')

def connect_to_mongo():
    """Connect to MongoDB and return the client and database."""
    try:
        client = MongoClient(MONGODB_URI)
        db = client.get_database()
        print("Connected to MongoDB successfully")
        return client, db
    except Exception as e:
        print(f"Error connecting to MongoDB: {str(e)}")
        raise

def process_record(record, db):
    """Process a DynamoDB record and update MongoDB."""
    try:
        print(f"Processing record: {json.dumps(record, default=str)}")
        
        # Get the new image from DynamoDB record
        dynamo_data = record['dynamodb']['NewImage']
        
        # Transform DynamoDB data to match MongoDB schema
        patient_data = {
            'userId': dynamo_data['userId']['S'],
            'submittedAt': datetime.fromisoformat(dynamo_data['submittedAt']['S'].replace('Z', '+00:00')),
            'allergies': dynamo_data.get('allergies', {}).get('S', ''),
            'contactNumber': dynamo_data['contactNumber']['S'],
            'dateOfBirth': datetime.fromisoformat(dynamo_data['dateOfBirth']['S'].replace('Z', '+00:00')),
            'fullName': dynamo_data['fullName']['S'],
            'gender': dynamo_data['gender']['S']
        }
        
        print(f"Transformed data: {json.dumps(patient_data, default=str)}")
        
        # Update or insert in MongoDB
        result = db.patients.update_one(
            {'userId': patient_data['userId']},
            {'$set': patient_data},
            upsert=True
        )
        
        print(f"Successfully synced patient {patient_data['userId']}")
        return result
    except Exception as e:
        print(f"Error processing record: {str(e)}")
        raise

def lambda_handler(event, context):
    """Lambda function handler."""
    print(f"Lambda function triggered with event: {json.dumps(event, default=str)}")
    
    try:
        # Connect to MongoDB
        client, db = connect_to_mongo()
        
        # Process each record
        for record in event['Records']:
            print(f"Processing event type: {record['eventName']}")
            if record['eventName'] in ['INSERT', 'MODIFY']:
                process_record(record, db)
        
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Sync completed successfully'})
        }
    except Exception as e:
        print(f"Lambda execution error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': 'Sync failed',
                'details': str(e)
            })
        }
    finally:
        # Close MongoDB connection
        if 'client' in locals():
            client.close()
            print("MongoDB connection closed") 