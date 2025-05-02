import json
import pymysql
import pymongo
from datetime import datetime
import os
import boto3
import time

# MongoDB connection
mongo_client = pymongo.MongoClient(os.environ['MONGODB_URI'])
mongo_db = mongo_client['your_database_name']
appointments_collection = mongo_db['appointments']

# Aurora connection with retry logic
def get_aurora_connection(max_retries=3, retry_delay=1):
    for attempt in range(max_retries):
        try:
            connection = pymysql.connect(
                host=os.environ['AURORA_HOST'],
                user=os.environ['AURORA_USER'],
                password=os.environ['AURORA_PASSWORD'],
                database=os.environ['AURORA_DATABASE'],
                connect_timeout=5,
                read_timeout=30,
                write_timeout=30
            )
            return connection
        except pymysql.Error as e:
            if attempt == max_retries - 1:
                raise e
            time.sleep(retry_delay)
            continue

def lambda_handler(event, context):
    try:
        # Connect to Aurora
        aurora_conn = get_aurora_connection()
        cursor = aurora_conn.cursor(pymysql.cursors.DictCursor)
        
        # Fetch appointments from Aurora
        query = """
        SELECT 
            ca.appointment_id,
            ca.client_name as patientName,
            u.calendly_name as CareNavigator,
            ca.local_start_time as appointmentDate,
            ca.status,
            ca.note as notes
        FROM client_appointments ca
        JOIN users u ON ca.client_name = u.username
        WHERE ca.created_timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
        """
        
        cursor.execute(query)
        appointments = cursor.fetchall()
        
        # Transform and sync to MongoDB
        for appointment in appointments:
            # Format the appointment data
            mongo_appointment = {
                'appointmentId': str(appointment['appointment_id']),
                'patientName': appointment['patientName'],
                'CareNavigator': appointment['CareNavigator'],
                'appointmentDate': appointment['appointmentDate'],
                'appointmentTime': appointment['appointmentDate'],  # Using same datetime for both
                'status': appointment['status'].capitalize(),
                'notes': appointment['notes'] or '',
                'syncTimestamp': datetime.utcnow()
            }
            
            # Upsert to MongoDB
            appointments_collection.update_one(
                {'appointmentId': mongo_appointment['appointmentId']},
                {'$set': mongo_appointment},
                upsert=True
            )
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': f'Successfully synced {len(appointments)} appointments'
            })
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")  # Log error for CloudWatch
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e)
            })
        }
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'aurora_conn' in locals():
            aurora_conn.close() 