import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
import os
pwd = os.environ.get('SVR_PASS', 'Zhou110166')
ssh.connect('139.196.205.4', username='root', password=pwd, timeout=15)
print('connected')

def run(cmd, t=120):
    print(f'> {cmd[:60]}...')
    i,o,e = ssh.exec_command(cmd, timeout=t)
    o.channel.recv_exit_status()
    out = o.read().decode()
    if out: print(out[-150:])

run('apt-get update -qq')
run('curl -fsSL https://deb.nodesource.com/setup_22.x | bash -', 180)
run('apt-get install -y nodejs git nginx', 180)
run('npm install -g pm2', 120)
run('mkdir -p /opt && cd /opt && git clone https://github.com/Mr-zhou-jan/finalsprint.git learnos 2>/dev/null || (cd /opt/learnos && git pull)', 180)

env = """cat > /opt/learnos/.env << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://itstwizzdxtkjcvglofh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0c3R3aXp6ZHh0a2pjdmdsb2ZoIiwicm9zZSI6ImFub24iLCJpYXQiOjE3NDEyNjM0NjcsImV4cCI6MjA1NjgzOTQ2N30.Lx1RLVxBLqKsLOHQUuDDBoNG9BX0K5LRQNCjVlxEQfs
DEEPSEEK_API_KEY=sk-placeholder
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
EOF"""
run(env)
run('cd /opt/learnos && npm ci 2>&1', 300)
run('cd /opt/learnos && npm run build 2>&1', 600)

ngx = """cat > /etc/nginx/sites-available/learnos << 'EOF'
server {
    listen 80;
    server_name learnos.site www.learnos.site _;
    location / {
        proxy_pass http://127.0.0.1:3456;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF"""
run(ngx)
run('ln -sf /etc/nginx/sites-available/learnos /etc/nginx/sites-enabled/ && rm -f /etc/nginx/sites-enabled/default && nginx -t && systemctl restart nginx')
run('cd /opt/learnos && pm2 delete learnos 2>/dev/null; pm2 start npm --name learnos -- start -- -p 3456 && pm2 save', 30)
print('DONE: http://139.196.205.4')
ssh.close()
