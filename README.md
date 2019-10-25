# She-Codes-BH-Project

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

**POST** `/auth/register/`

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

**POST** `/auth/verification-code/<email>`

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


### Resize Image

#### Send resized image 

**POST** `/resize-image/`


Request body:

The body of the request will contain image in form of non presentable series of bytes 


Possible responses:

* 200 Ok - The body of the response will contain JSON 

```json
{"resizedImageB64": "representation of the resized image in series of bytes" }
```
* 400 Bad Request - the request is malformed



### Family Tree

#### Generate and send gedcom

**POST** `/family-tree/`


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





