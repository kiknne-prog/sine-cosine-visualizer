# GitHub Pages 部署详细指南

## 第一步：在 GitHub 创建仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - **Owner**: 选择您的账户
   - **Repository name**: `sine-cosine-visualizer` (推荐名称)
   - **Description**: "正弦余弦曲线可视化工具"
   - **Public**: ✅ 选择公开
   - **Initialize this repository with**: 全部不勾选
3. 点击 "Create repository"

## 第二步：获取仓库URL

创建成功后，复制仓库的HTTPS URL，格式为：
`https://github.com/您的用户名/sine-cosine-visualizer.git`

## 第三步：执行推送命令

在终端中运行以下命令（替换为您的实际URL）：

```bash
# 移除现有的remote（如果存在）
git remote remove origin

# 添加正确的remote
git remote add origin https://github.com/您的用户名/sine-cosine-visualizer.git

# 推送代码
git push -u origin main
```

## 第四步：启用GitHub Pages

1. 进入仓库页面：`https://github.com/您的用户名/sine-cosine-visualizer`
2. 点击 **Settings** 选项卡
3. 左侧菜单选择 **Pages**
4. 在 "Build and deployment" 部分：
   - Source: 选择 **GitHub Actions**
5. 保存设置

## 第五步：等待部署完成

GitHub会自动开始部署，通常需要1-5分钟。您可以在：
- **Actions** 选项卡查看部署状态
- **Settings > Pages** 查看部署完成的链接

## 第六步：获取在线链接

部署成功后，您的应用将在以下地址访问：
`https://您的用户名.github.io/sine-cosine-visualizer`

## 故障排除

### 如果推送失败：
```bash
# 强制推送（首次部署时使用）
git push -f origin main
```

### 如果仓库已存在内容：
```bash
# 拉取并合并
git pull origin main --allow-unrelated-histories
git push origin main
```

## 验证部署

1. 访问您的在线链接
2. 测试所有功能：
   - 正弦余弦曲线显示
   - 参数调节滑块
   - 动画功能
   - 响应式设计

## 分享链接

将以下链接分享给他人：
`https://您的用户名.github.io/sine-cosine-visualizer`

这个链接：
- ✅ 永久有效
- ✅ HTTPS安全
- ✅ 全球访问
- ✅ 支持所有设备
- ✅ 无需安装

---

**立即开始部署！几分钟内即可获得永久在线链接。**