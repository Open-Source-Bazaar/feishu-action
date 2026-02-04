import { convertAIAssistantToCard, parseAIAssistantContent } from '../src/ai-assistant'

describe('AI Assistant Message', () => {
  test('should convert basic AI assistant config to card', () => {
    const config = {
      title: '代码审查报告',
      assistant: 'Clawdbot',
      status: 'completed' as const,
      sections: [
        {
          type: 'header',
          text: '审查完成',
          level: 'info'
        },
        {
          type: 'summary',
          text: '已审查5个文件'
        }
      ]
    }

    const card = convertAIAssistantToCard(config)
    
    expect(card).toHaveProperty('config')
    expect(card).toHaveProperty('header')
    expect(card.header.title.content).toBe('代码审查报告')
    expect(card.elements.length).toBeGreaterThan(0)
  })

  test('should parse YAML content', () => {
    const yamlContent = `
ai_assistant:
  title: "测试报告"
  assistant: "TestBot"
  status: "running"
  sections:
    - type: "header"
      text: "测试中"
    
    - type: "code"
      language: "javascript"
      code: "console.log('test');"
    `

    const card = parseAIAssistantContent(yamlContent)
    
    expect(card).toBeDefined()
    expect(card.header.title.content).toBe('测试报告')
  })

  test('should handle code sections with suggestions', () => {
    const config = {
      sections: [
        {
          type: 'code',
          language: 'typescript',
          code: 'const x = 1;',
          suggestions: ['使用let代替const', '添加类型注解']
        }
      ]
    }

    const card = convertAIAssistantToCard(config)
    
    // Should contain code block
    expect(JSON.stringify(card)).toContain('```typescript')
    // Should contain suggestions
    expect(JSON.stringify(card)).toContain('建议')
  })

  test('should handle metrics sections', () => {
    const config = {
      sections: [
        {
          type: 'metrics',
          items: [
            { label: '质量', value: '90%', trend: '+5' },
            { label: '速度', value: '2s', trend: '-1' }
          ]
        }
      ]
    }

    const card = convertAIAssistantToCard(config)
    
    expect(JSON.stringify(card)).toContain('质量')
    expect(JSON.stringify(card)).toContain('速度')
  })

  test('should handle action buttons', () => {
    const config = {
      sections: [
        {
          type: 'actions',
          buttons: [
            { text: '查看详情', url: 'https://example.com' },
            { text: '确认操作', action: 'confirm', confirm: '确定吗？' }
          ]
        }
      ]
    }

    const card = convertAIAssistantToCard(config)
    
    // Should have action section
    const actionElement = card.elements.find((el: any) => el.type === 'action')
    expect(actionElement).toBeDefined()
    expect(actionElement.actions.length).toBe(2)
  })
})