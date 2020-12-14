FROM node:11

# https://github.com/eirslett/chrome-karma-docker

# Install Google Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -y google-chrome-stable

# Install AWS CLI
RUN apt-get update \
    && apt-get install -y python python-dev python-pip python-setuptools groff less \
    && pip install --upgrade awscli

# Create app directory
WORKDIR /usr/src/app

# Copy app source
COPY . .
