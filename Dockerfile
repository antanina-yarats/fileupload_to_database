
FROM denoland/deno:1.37.1


WORKDIR /app


COPY . .


ENV PORT=7777

CMD ["run", "--allow-net", "--allow-env", "--allow-read", "app.js"]
