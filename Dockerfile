FROM node:20.17.0-alpine AS build

WORKDIR /usr/src/booksaw-api

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN npm prune --omit=dev

FROM node:20.17.0-alpine AS production

WORKDIR /usr/src/booksaw-api
ENV NODE_ENV=production
ENV PORT=1001

COPY --from=build /usr/src/booksaw-api/node_modules ./node_modules
COPY --from=build /usr/src/booksaw-api/package*.json ./
COPY --from=build /usr/src/booksaw-api/dist ./dist

RUN mkdir -p uploads/members uploads/products && chown -R node:node /usr/src/booksaw-api

USER node
EXPOSE 1001

CMD ["npm", "run", "start:prod"]
