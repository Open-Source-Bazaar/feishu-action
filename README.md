<p align="center">
  <a href="https://github.com/Open-Source-Bazaar/feishu-action"><img alt="feishu-action status" src="https://github.com/Open-Source-Bazaar/feishu-action/workflows/build-test/badge.svg"></a>
</p>

## ✨ Example Usage

- text

```yml
- name: text message
  uses: Open-Source-Bazaar/feishu-action@v1
  with:
    url: ${{ secrets.FEISHU_BOT_WEBHOOK_URL }}
    msg_type: text
    content: |
      text: |
        hahahah
        from github action test
        repository: ${{ github.repository }}
        committer: ${{ github.actor }}
        compare: ${{ github.event.compare }}
        job status: ${{ job.status }}
```

- post

```yml
- name: post message
  uses: Open-Source-Bazaar/feishu-action@v1
  with:
    url: ${{ secrets.FEISHU_BOT_WEBHOOK_URL }}
    msg_type: post
    content: |
      post:
        zh_cn:
          title: 我是一个标题
          content:
          - - tag: text
              un_escape: true
              text: '第一行&nbsp;:'
            - tag: a
              text: 超链接
              href: http://www.feishu.cn
            - tag: at
              user_id: ou_18eac85d35a26f989317ad4f02e8bbbb
          - - tag: text
              text: '第二行 :'
            - tag: text
              text: 文本测试
          - - tag: img
              image_key: d640eeea-4d2f-4cb3-88d8-c964fab53987
              width: 300
              height: 300
```

- share_chat

```yml
- name: share_chat message
  uses: Open-Source-Bazaar/feishu-action@v1
  with:
    url: ${{ secrets.FEISHU_BOT_WEBHOOK_URL }}
    msg_type: share_chat
    content: |
      share_chat_id: oc_f5b1a7eb27ae2c7b6adc2a74faf339ff
```

- image

```yml
- name: image message
  uses: Open-Source-Bazaar/feishu-action@v1
  with:
    url: ${{ secrets.FEISHU_BOT_WEBHOOK_URL }}
    msg_type: image
    content: |
      image_key: img_ecffc3b9-8f14-400f-a014-05eca1a4310g
```

- ai_assistant (AI助手消息)

```yml
- name: AI Assistant Message
  uses: Open-Source-Bazaar/feishu-action@v1
  with:
    url: ${{ secrets.FEISHU_BOT_WEBHOOK_URL }}
    msg_type: ai_assistant
    content: |
      ai_assistant:
        title: "代码审查报告 - ${{ github.event.pull_request.title }}"
        assistant: "Clawdbot AI Assistant"
        status: "completed"
        timestamp: "${{ steps.date.outputs.iso }}"
        sections:
          - type: "header"
            text: "代码审查完成"
            level: "info"
          
          - type: "summary"
            text: "已审查 ${{ steps.count.outputs.files_changed }} 个文件，发现3个建议和1个严重问题"
          
          - type: "code"
            language: "typescript"
            code: |
              // 建议：使用const代替let
              const result = calculate();
              
              // 问题：缺少错误处理
              function riskyOperation() {
                // 需要添加try-catch
              }
            suggestions:
              - "使用const声明不变的值"
              - "添加错误处理机制"
          
          - type: "metrics"
            items:
              - label: "代码质量评分"
                value: "85/100"
                trend: "+5"
              - label: "潜在bug数量"
                value: "2"
                trend: "-1"
          
          - type: "divider"
          
          - type: "text"
            text: "**详细报告已生成，请查看以下链接：**"
          
          - type: "actions"
            buttons:
              - text: "查看详细报告"
                url: "${{ github.event.pull_request.html_url }}"
              - text: "运行自动修复"
                action: "run_fix"
                confirm: "确定要运行自动修复吗？"
```

🔐 Set your secrets here: `https://github.com/USERNAME/REPO/settings/secrets`.

Contexts and expression syntax for GitHub Actions, here: https://help.github.com/en/articles/contexts-and-expression-syntax-for-github-actions#github-context

**Result**

## Options

| option   | type   | description                                                               |
| -------- | ------ | ------------------------------------------------------------------------- |
| url      | string | webhook url: https://open.feishu.cn/open-apis/bot/hook/7c5a4a4ba83bxxxxxx |
| msg_type | string | message type                                                              |
| content  | string | message content , yaml string                                             |

> [How do I use a robot in a group chat?](https://getfeishu.cn/hc/zh-cn/articles/360024984973-%E5%9C%A8%E7%BE%A4%E8%81%8A%E4%B8%AD%E4%BD%BF%E7%94%A8%E6%9C%BA%E5%99%A8%E4%BA%BA)
