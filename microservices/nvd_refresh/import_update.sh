mongoimport --uri $MONGODB_TOKEN --collection cve --upsert --upsertFields cve_id --file cve.json --jsonArray