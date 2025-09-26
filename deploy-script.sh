#!/bin/bash

echo "🚀 正弦余弦曲线可视化工具 - GitHub Pages 部署脚本"
echo "================================================"

# 检查Git状态
echo "📋 检查Git状态..."
git status

echo ""
echo "📝 请按照以下步骤操作："
echo ""
echo "1. 访问 https://github.com/new 创建新仓库"
echo "2. 仓库名称: sine-cosine-visualizer"
echo "3. 描述: 正弦余弦曲线可视化工具"
echo "4. 选择 Public (公开)"
echo "5. 不要初始化 README"
echo ""
echo "6. 创建成功后，复制仓库的HTTPS URL"
echo "   格式: https://github.com/您的用户名/sine-cosine-visualizer.git"
echo ""
echo "7. 返回此终端，运行以下命令："
echo "   git remote remove origin"
echo "   git remote add origin 您的仓库URL"
echo "   git push -u origin main"
echo ""
echo "8. 在GitHub仓库设置中启用 Pages > GitHub Actions"
echo ""
echo "9. 等待部署完成，访问：https://您的用户名.github.io/sine-cosine-visualizer"
echo ""
echo "🎉 部署完成后即可获得永久在线链接！"

# 显示当前remote信息
echo ""
echo "📡 当前remote配置："
git remote -v

echo ""
echo "💡 提示：如果您已经创建了仓库，请运行以下命令推送代码："
echo "git push -u origin main"