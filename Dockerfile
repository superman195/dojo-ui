FROM node:21.7.3

WORKDIR /dojo-ui

COPY . .

RUN chmod +x entrypoint.sh

ENTRYPOINT ["/dojo-ui/entrypoint.sh"]
