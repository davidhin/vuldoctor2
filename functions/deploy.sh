gcloud functions deploy send_auto_repo_requests --runtime python37 --trigger-http --allow-unauthenticated --set-env-vars MONGODB_TOKEN=$MONGODB_TOKEN