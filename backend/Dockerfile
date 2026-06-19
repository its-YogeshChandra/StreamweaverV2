#will run and create the build cache first then use the build artifacts to speed up subsequent Docker builds

#rust language 
FROM rust:1.75-slim

#the main working dir 
WORKDIR /app

#copying the elemment
COPY . .

RUN cargo build --release

CMD ["cargo", "run", "--release"]
