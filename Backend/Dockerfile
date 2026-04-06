FROM public.ecr.aws/lambda/nodejs:18

# Create app directory
WORKDIR /var/task

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy project files
COPY . .

# Lambda handler
CMD ["server.handler"]