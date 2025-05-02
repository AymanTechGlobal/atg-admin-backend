#!/bin/bash

# Create a temporary directory for the deployment package
mkdir -p deployment_package

# Install dependencies
pip install -r requirements.txt -t deployment_package/

# Copy the Lambda function code
cp syncAppointments.py deployment_package/

# Create the deployment package
cd deployment_package
zip -r ../lambda_deployment.zip .
cd ..

# Clean up
rm -rf deployment_package

echo "Deployment package created: lambda_deployment.zip" 