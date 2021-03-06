# Update database (mongodb)

Enter mongodb URL in environment variable $MONGODB_TOKEN

To update database from scratch (drop):

```
GET /update_drop
```

To update the database using recent/modified:

```
GET /
```

### Docker commands

Deploy Docker Container

```
docker build . --tag gcr.io/solid-mantra-301604/nvdrefresh
docker push gcr.io/solid-mantra-301604/nvdrefresh:latest
gcloud run deploy nvdrefresh --image gcr.io/solid-mantra-301604/nvdrefresh:latest --platform managed --region asia-east1 --allow-unauthenticated
```

Run Docker Container Locally

```
docker run --env PORT=5001 --env MONGODB_TOKEN=$MONGODB_TOKEN -p 5001:5001 gcr.io/solid-mantra-301604/nvdrefresh:latest
```

### Upload CAPEC-CWE Mappings

`python capec_cwe_mappings.py`
Used to upload CAPEC/CWE mappings to mongoatlas
