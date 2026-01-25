#!/bin/bash
# Debug script to check container status

echo "=========================================="
echo "🔍 Container Diagnostics"
echo "=========================================="

# Check if container is running
echo ""
echo "1. Container Status:"
docker ps --filter "name=creation" --format "table {{.Names}}\t{{.Status}}\t{{.Image}}\t{{.Ports}}"

# Check container logs
echo ""
echo "2. Container Logs (last 30 lines):"
docker logs --tail 30 creation

# Check files inside container
echo ""
echo "3. Files in /app:"
docker exec creation ls -la /app

# Check .next directory
echo ""
echo "4. Files in /app/.next:"
docker exec creation ls -la /app/.next 2>/dev/null || echo "Directory not found"

# Check if server.js exists
echo ""
echo "5. Check server.js:"
docker exec creation ls -l /app/server.js 2>/dev/null || echo "server.js not found!"

# Check Node.js process
echo ""
echo "6. Running processes:"
docker exec creation ps aux

# Check environment variables
echo ""
echo "7. Environment variables:"
docker exec creation env | grep -E "NODE_ENV|PORT|HOSTNAME"

echo ""
echo "=========================================="
echo "✅ Diagnostics Complete"
echo "=========================================="
