FROM node:10-alpine as client-buider

WORKDIR /client
COPY ./client .
RUN npm ci
RUN npm run build


FROM python:3.7

WORKDIR /server
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
RUN mkdir src
COPY ./src ./src

RUN mkdir ./static
COPY --from=client-buider /client/build ./static

CMD gunicorn --bind 0.0.0.0:$PORT --chdir src server
