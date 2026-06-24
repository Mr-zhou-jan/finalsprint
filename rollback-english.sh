#!/bin/bash
# ============================================
# LearnOS 英语模块回退脚本
# 用法: bash rollback-english.sh
# 备份标签: backup-english-20260625-0017
# ============================================
set -e
BACKUP_TAG="backup-english-20260625-0017"
echo "=== LearnOS 英语模块回退 ==="
echo "备份标签: $BACKUP_TAG"
ENGLISH_PATHS=(
  "src/app/english"
  "src/components/english"
  "src/app/api/english"
  "src/data/english"
  "src/data/vocab-cet4.ts"
  "src/data/vocab-cet6.ts"
  "src/data/listening-sets.ts"
)
echo "将要恢复的路径:"
for p in "${ENGLISH_PATHS[@]}"; do echo "  $p"; done
read -p "确认回退? (y/N): " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then echo "已取消"; exit 0; fi
for p in "${ENGLISH_PATHS[@]}"; do
  echo "恢复: $p"
  git checkout "$BACKUP_TAG" -- "$p" 2>/dev/null || echo "  (跳过,备份中不存在)"
done
echo "=== 回退完成,请 git diff --stat 确认后 commit ==="
