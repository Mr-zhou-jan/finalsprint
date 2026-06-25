#!/bin/bash
# LearnOS 一键部署 — Alibaba Cloud Ubuntu 24.04
set -e

echo "=== 1. Node.js 22 ==="
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs git nginx
npm install -g pm2

echo "=== 2. 克隆代码 ==="
cd /opt
git clone https://github.com/Mr-zhou-jan/finalsprint.git learnos 2>/dev/null || (cd learnos && git pull)
cd learnos

echo "=== 3. 环境变量 ==="
cat > .env << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://itstwizzdxtkjcvglofh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0c3R3aXp6ZHh0a2pjdmdsb2ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNjM0NjcsImV4cCI6MjA1NjgzOTQ2N30.Lx1RLVxBLqKsLOHQUuDDBoNG9BX0K5LRQNCjVlxEQfs
DEEPSEEK_API_KEY=sk-placeholder
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
EOF

echo "=== 4. 构建 ==="
npm ci
npm run build

echo "=== 5. Nginx ==="
cat > /etc/nginx/sites-available/learnos << 'NGINX'
server {
    listen 80;
    server_name learnos.site www.learnos.site _;
    location / {
        proxy_pass http://127.0.0.1:3456;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX
ln -sf /etc/nginx/sites-available/learnos /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

echo "=== 6. 启动 ==="
pm2 delete learnos 2>/dev/null || true
pm2 start npm --name "learnos" -- start -- -p 3456
pm2 save
pm2 startup systemd -u root --hp /root

echo "=== 完成！http://139.196.205.4 ==="
