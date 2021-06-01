# Family Tree Project

## Run Project In Production Environment

### Database

A Postgres database is required with two tables:

`verification_codes` table with the following schema:

```sql
CREATE TABLE IF NOT EXISTS verification_codes (
    email VARCHAR UNIQUE NOT NULL,
    verification_code VARCHAR NOT NULL,
    attempts INT DEFAULT(0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT(now() at time zone 'utc')
);
```

`family_tree_upload_log` table with the following schema:

```sql
CREATE TABLE IF NOT EXISTS family_tree_upload_log (
    id SERIAL PRIMARY KEY,
    email character varying NOT NULL,
    gedcom_language character varying(2) NOT NULL,
    creation_time timestamp with time zone,
    num_of_people integer,
    num_of_photos integer,
    is_new_tree boolean,
    gedcom_url character varying(2048)
);
```

`users` table with the following schema:

```sql
CREATE TABLE IF NOT EXISTS users
(
    email character varying(256) NOT NULL,
    first_name character varying(128) NOT NULL,
    last_name character varying(128) NOT NULL,
    address character varying(1024) NOT NULL,
    city character varying(128) NOT NULL,
    zip character varying(64) NOT NULL,
    country character varying(128) NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (email)
);
```

The application does not support automatic migrations so the database schema should be ready before running the application.

### Docker Images


#### Web Server

Build Docker image for web server:

```bash
docker build -f Dockerfile -t bh-project:latest .
```

This is a web server process. See `Environment Variables` section for configuration information.

#### Weekly Submissions Report

Build Docker image for weekly report job:

```bash
docker build -f Dockerfile -t bh-project-weekly-report:latest .
```

This container should be scheduled to run automatically once a week.

### Environment Variables

The following environment variables are required to run containers:

* `PORT` - Port number for web server to accept connections inside docker container. For example if you map port `80` on host to port `3000` in container you should set `PORT=3000` 
* `DATABASE_URL` - Connection string to the project's Postgres database. Example: "postgres://db_user:db_password@ec2-xx-xx-xx-xx.eu-west-1.compute.amazonaws.com:5432/bh-project".
* `ACTIVETRAIL_API_BASE_URL` - Base URL for ActiveTrail API. Example: "https://webapi.mymarketing.co.il".
* `ACTIVETRAIL_API_KEY` - ActiveTrail API key.
* `SENDGRID_API_KEY` - Sendgrid API key.
* `GEDCOM_EMAIL_FROM` - Email address that will appear in "From" field of the email with Gedcom attachment sent with Sendgrid and in an email with verification code.
* `GEDCOM_EMAIL_TO` - A comma-separated list of recipient email addresses for the email with Gedcom attachment. Example: "email1@bh.org.il,email2@bh.org.il".
* `REPORT_EMAIL_FROM` - Email address that will appear in "From" field of the email with weekly family-tree submissions CSV report sent with Sendgrid.
* `REPORT_EMAIL_TO` - A comma-separated list of recipient email addresses for the email with weekly family-tree submissions CSV report.

Optional environment variables:

* `LOGGLY_CUSTOMER_TOKEN` - Customer token for [Loggly](https://www.loggly.com/) account to receive all application logs.

## Run Client Locally

* Install project dependencies

```bash
cd client
npm install
```

* Start the project with webpack development server

```bash
npm start
```

## Run Server Locally

* Install project dependencies

```bash
pip install -r requirements.txt
```

* Start the project with Flask development server

```bash
FLASK_APP=./src/server.py flask run
```

## API Documentation

### Verification Code

#### Register and Send Verification Code

**POST** `/api/auth/register/`

Request body:

```json
{
  "email": "email@server.com",
  "phone": "123-456-789"
}
```

Possible responses:

* 200 Ok - sent verification code successfully 
* 400 Bad Request - the request is malformed
* 500 Internal Server Error - failed to send verification code

**POST** `/api/auth/verification-code/<email>`

Path parameters:

* email - email address of the user verification code was sent to

Request body:

```json
{"verificationCode": 12345}
```

where `12345` is a code received by the user 

Possible responses:

* 200 Ok - verification code matches the one that was sent to the user
* 400 Bad Request - the request is malformed
* 401 Unauthorized - verification code did not match the one that was sent to the user
* 404 Not Found - verification code was never sent to the user


### Family Tree

#### Generate and send gedcom

**POST** `/api/family-tree/`


Request body:

```json
{
  "1": {
    "ID": "1",
    "firstName": "Alex",
    "lastName": "Smith",
    "maidenName": "none",
    "birthDate": "10/02/1955",
    "birthPlace": "New York",
    "gender": "male",
    "motherID": "10",
    "fatherID": "20",
    "isAlive": false,
    "deathPlace": "Boston",
    "deathDate": "07/07/2015",
    "image": "image_1",
    "siblings": ["1000", "2000", "3000"]
  }
}
```

Possible responses:

* 200 Ok
* 400 Bad Request - JSON did not pass the validation 
* 500 Internal Server Error - failed to send family tree 
