# 作品集证据交接包

[English source](README.md) · [繁中（香港）](README.zh-HK.md) · [繁中（台湾）](README.zh-TW.md)

状态：读者自行保存的本机模板。它帮助你把一个 fixture-first 作品项目整理成 reviewer 可以检查的交接材料；不含 repository、credential、network step、自动发布，也不声称存在 live system。

这份包不是把 demo 包装成大型项目。它的作用是区分已经有本机证据支持的内容，以及仍然未知的内容。

## 文件和作用

| 文件 | 帮 reviewer 判断的问题 |
| --- | --- |
| project brief | 哪个人需要做哪个小决策，哪些事情不在范围内？ |
| source and data receipt | 每个 input 来自哪里，是否可用于这个用途？ |
| run receipt | 实际在本机运行了什么、使用哪些有边界材料、结果如何？ |
| claims and non-claims | 哪些结论有依据，哪些不能主张？ |
| reviewer decision | 谁检查过材料，做了什么决定？ |
| rollback record | 如果 candidate 有问题，哪些东西可以停止或回退？ |
| license decision | 是否有分享 code 或 material 的书面依据？ |
| repository candidate checklist | 是否可以交给 owner 考虑 GitHub candidate？ |

开始时出现“Not recorded”和“NOT_RUN”是正确状态。未知就保持未知，不要补上看起来完整但没有证据的内容。

## 使用方法

需要 Node.js 20 以上，不需要安装 package。

1. 将本包放在一个本机作品项目旁边。
2. 只记录你能亲自核对的资料；不知道就保留 unknown state。
3. 完成有边界的本机 run 后才更新 receipt，不要因为 code 存在就假定已执行。
4. 在 pack 目录执行：

       node scripts/validate-portfolio-evidence.mjs

5. 请合适的 owner 或 reviewer 决定未来是否可以分享。

`ci/local-evidence-check.yml.example` 是刻意不会生效的 CI candidate。它不在 `.github/workflows` 内，只示范未来经 owner 审查 repository、数据边界与 command path 后，可如何保留一条只读结构检查。原样不会运行，也不代表已有 CI、repository 或发布安排。

通过 check 只表示交接结构可供 owner review。它不证明 run、evaluation、data permission、repository 安全、approval、发布、deployment、business value 或 production readiness。

## 重要边界

- fixture、synthetic、public、licensed 和 owner-provided material 必须分开记录。
- 不要放入 secret、私人 prompt、internal screenshot、个人资料、customer data、employer material 或未批准的 source extract。
- 本机 pass 不等于真实业务会得到相同结果。
- checklist 没有自动批准机制；reviewer 可以要求修改、拒绝分享，或保持 private。
- 在 authorised owner 明确决定前，不要建立、命名、链接或发布 public repository。

建议 walkthrough 顺序：先说明 decision 与 non-goal，再看 source receipt，接着才看 run receipt，读清楚 non-claims，最后说明 reviewer decision 与 rollback。这样能体现判断，而不是只展示漂亮 output。
