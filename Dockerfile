FROM node:14.15.4
WORKDIR /app
COPY . /app
RUN yarn build
CMD yarn serve
EXPOSE 5000
