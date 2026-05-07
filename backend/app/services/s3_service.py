import boto3
from botocore.exceptions import ClientError
from app.config import get_settings
from app.s3_client import s3_client

settings = get_settings()

def generate_presigned_upload_url(user_id: str, file_id: str, filename: str) -> dict:
    key = f"uploads/{user_id}/{file_id}/original.xlsx"
    expires_in = 900 # 15 minutes
    
    try:
        url = s3_client.generate_presigned_url(
            'put_object',
            Params={
                'Bucket': settings.aws_s3_bucket_name,
                'Key': key,
                'ContentType': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            },
            ExpiresIn=expires_in
        )
        return {"url": url, "key": key, "expires_in": expires_in}
    except ClientError as e:
        raise ValueError(f"Failed to generate upload URL: {str(e)}")

def generate_presigned_download_url(s3_key: str) -> str:
    try:
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': settings.aws_s3_bucket_name, 'Key': s3_key},
            ExpiresIn=3600
        )
        return url
    except ClientError as e:
        raise ValueError(f"Failed to generate download URL: {str(e)}")

def download_file_to_memory(s3_key: str) -> bytes:
    try:
        response = s3_client.get_object(Bucket=settings.aws_s3_bucket_name, Key=s3_key)
        return response['Body'].read()
    except ClientError as e:
        raise ValueError(f"Failed to download file from S3: {str(e)}")

def upload_bytes_to_s3(file_bytes: bytes, s3_key: str) -> str:
    try:
        s3_client.put_object(
            Bucket=settings.aws_s3_bucket_name,
            Key=s3_key,
            Body=file_bytes
        )
        return s3_key
    except ClientError as e:
        raise ValueError(f"Failed to upload file to S3: {str(e)}")

def delete_file(s3_key: str) -> bool:
    try:
        s3_client.delete_object(Bucket=settings.aws_s3_bucket_name, Key=s3_key)
        return True
    except ClientError as e:
        raise ValueError(f"Failed to delete file from S3: {str(e)}")
