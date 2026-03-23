FROM ubuntu:22.04

# Install build tools (cmake is required — make server target no longer exists in ggml-org/whisper.cpp)
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Clone the repo
WORKDIR /app
RUN git clone https://github.com/ggml-org/whisper.cpp.git

# Build with CMake — compiles whisper-server into ./build/bin/
WORKDIR /app/whisper.cpp
RUN cmake -B build -DWHISPER_BUILD_SERVER=ON && \
    cmake --build build --config Release -j$(nproc)

# Download the base model into the models/ directory
RUN bash ./models/download-ggml-model.sh base

# Expose the server port
EXPOSE 4000

# Run the server (binary is at build/bin/whisper-server, not ./server)
CMD ["./build/bin/whisper-server", "-m", "./models/ggml-base.bin", "--host", "0.0.0.0", "--port", "4000"]