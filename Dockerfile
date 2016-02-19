#################################
# Dockerfile for - Sad Beakon API
#################################
FROM node
MAINTAINER Fernando Valverde <fdov88@gmail.com>

# Copy dependencies & install them
# This layer will cache dependencies while they don't change
ADD package.json /opt/marvin/package.json
RUN cd /opt/marvin && \
    npm install
EXPOSE 3000

WORKDIR /opt/marvin

# Source->Deploy->Cleanup
ADD . /opt/marvin
CMD node ./bin/www
