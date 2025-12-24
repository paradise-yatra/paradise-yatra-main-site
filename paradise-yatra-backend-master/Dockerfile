# Use Node.js 20 LTS Alpine as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./

# Install dependencies with npm ci for faster, reliable builds
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Create uploads directory and set permissions
RUN mkdir -p uploads && chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port 5000
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000


ENV MONGODB_URI=mongodb+srv://dikshusharma11:dikshant1140@cluster0.w6ybkdx.mongodb.net/paradise-yatra
# MONGODB_URI=mongodb+srv://shubham230mamgain:15cse23@tvc.g822y.mongodb.net/paradise_sample?retryWrites=true&w=majority&appName=tvc
ENV CLIENT_ORIGIN=http://localhost:3000
ENV CLOUDINARY_CLOUD_NAME=dwuwpxu0y
ENV CLOUDINARY_API_KEY=294911685234965
ENV CLOUDINARY_API_SECRET=sAAZBp3NnuwDkCZFsC1SAPDj9xs
ENV  JWT_SECRET=naruto_uzumaki

ENV CLIENT_ORIGIN=https://frontendparadise-frontend.glwcvg.easypanel.host

ENV BACKEND_URL=https://backendparadise-backend.glwcvg.easypanel.host

ENV GMAIL_USER=Digiversion11@gmail.com
ENV GMAIL_APP_PASSWORD=eubfqhzsdmwdmaqk



# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["npm", "start"]
