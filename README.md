# TrainTrack

一个专门为 GitHub Pages 发布整理过的轻量健身记录 Web 应用，适合手机访问和添加到主屏幕。

## 已包含的核心能力

- 月历视图：按天查看过去训练记录
- 周视图：按周查看训练完成情况与当天计划
- 快速新增：日期、动作、组数、次数、重量、备注一屏完成
- 肌群筛选：按胸、背、腿、肩、手臂、核心等维度回看训练
- 热门动作：内置高频训练动作，点击即可快速填入
- 当天详情：查看某天练了哪些动作，并支持单条删除
- PR 曲线：按动作查看重量与估算 1RM 的进步趋势
- 周计划联动：周计划动作可一键带入当天记录表单
- 本地存储：记录保存在浏览器 `localStorage` 中，刷新不会丢
- 动作统计：自动汇总常练动作，方便看训练重心

## 本地使用

1. 直接打开 [index.html](E:\codex\work out\docs\index.html)
2. 在右侧填写训练记录并保存
3. 在左侧月历点击任意日期查看详情

## 手机使用

- 当前版本已做移动端适配，小屏下会变成底部弹出式录入面板
- 可以使用“导出记录 / 导入记录”在不同设备之间迁移数据
- 如果把这些文件放到静态网页地址上访问，支持添加到手机主屏幕
- 直接用 `file://` 本地文件打开时，也能使用，但无法完整启用安装能力

## GitHub Pages 发布

这个仓库已经按 GitHub Pages 目标整理好了，关键文件如下：

- [站点目录](E:\codex\work out\docs)
- [入口页面](E:\codex\work out\docs\index.html)
- [静态资源目录](E:\codex\work out\docs\assets)
- [PWA 清单](E:\codex\work out\docs\manifest.webmanifest)
- [离线缓存](E:\codex\work out\docs\service-worker.js)
- [Pages 工作流](E:\codex\work out\.github\workflows\deploy-pages.yml)
- [Jekyll 关闭标记](E:\codex\work out\docs\.nojekyll)

发布步骤：

1. 把整个目录推到 GitHub 仓库
2. 仓库默认分支使用 `main` 或 `master`
3. 打开仓库 `Settings > Pages`
4. `Build and deployment` 选择 `GitHub Actions`
5. 推送代码后等待 Actions 完成部署
6. 用手机打开生成的网址即可访问

### 手机安装说明

- Android Chrome：打开网址后可直接“添加到主屏幕”或点击页面里的“安装到手机”
- iPhone Safari：打开网址后，点分享菜单，再点“添加到主屏幕”
- 只有通过 `https://` 网页地址访问时，PWA 安装和离线缓存才会完整生效

## 文件结构

- [docs](E:\codex\work out\docs)
- [docs/index.html](E:\codex\work out\docs\index.html)
- [docs/assets](E:\codex\work out\docs\assets)
- [docs/manifest.webmanifest](E:\codex\work out\docs\manifest.webmanifest)
- [docs/service-worker.js](E:\codex\work out\docs\service-worker.js)
- [.github/workflows/deploy-pages.yml](E:\codex\work out\.github\workflows\deploy-pages.yml)

## 后续可扩展

- 登录与云同步
- 训练模板
- PR 曲线和重量进步图表
- 按肌群筛选
- 周视图 / 训练计划联动
