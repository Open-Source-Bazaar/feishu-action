import yaml from 'js-yaml'

export interface AIAssistantSection {
  type: string
  [key: string]: any
}

export interface AIAssistantConfig {
  title?: string
  assistant?: string
  avatar?: string
  status?: 'pending' | 'running' | 'completed' | 'failed'
  timestamp?: string
  sections?: AIAssistantSection[]
}

/**
 * Convert AI Assistant YAML config to Feishu card JSON
 */
export function convertAIAssistantToCard(config: AIAssistantConfig): Record<string, any> {
  const statusColors: Record<string, string> = {
    pending: 'blue',
    running: 'orange',
    completed: 'green',
    failed: 'red'
  }

  const statusIcons: Record<string, string> = {
    pending: '⏳',
    running: '⚙️',
    completed: '✅',
    failed: '❌'
  }

  const statusText: Record<string, string> = {
    pending: '等待中',
    running: '运行中',
    completed: '已完成',
    failed: '失败'
  }

  const sections: any[] = []

  // Header section
  if (config.title || config.assistant) {
    const headerElements = []
    
    if (config.assistant) {
      headerElements.push({
        tag: 'plain_text',
        content: `${config.assistant}`
      })
    }
    
    if (config.status) {
      headerElements.push({
        tag: 'plain_text',
        content: `${statusIcons[config.status] || '📝'} ${statusText[config.status] || config.status}`
      })
    }

    sections.push({
      type: 'div',
      text: {
        tag: 'div',
        content: headerElements.map(el => ({
          tag: 'span',
          text: el.content,
          style: config.status && el.content.includes(statusIcons[config.status]) 
            ? { color: statusColors[config.status] || 'default', bold: true }
            : { bold: true }
        }))
      }
    })
  }

  // Process custom sections
  if (config.sections) {
    for (const section of config.sections) {
      switch (section.type) {
        case 'header':
          sections.push({
            type: 'header',
            text: {
              tag: 'plain_text',
              content: section.text || ''
            },
            style: section.level === 'warning' ? 'warning' : 
                   section.level === 'danger' ? 'danger' : 'default'
          })
          break

        case 'summary':
          sections.push({
            type: 'div',
            text: {
              tag: 'lark_md',
              content: `**📊 ${section.text}**`
            }
          })
          break

        case 'code':
          if (section.code) {
            sections.push({
              type: 'div',
              text: {
                tag: 'lark_md',
                content: `\`\`\`${section.language || ''}\n${section.code}\n\`\`\``
              }
            })
            
            if (section.suggestions && section.suggestions.length > 0) {
              sections.push({
                type: 'div',
                text: {
                  tag: 'lark_md',
                  content: `**💡 建议:**\n${section.suggestions.map(s => `• ${s}`).join('\n')}`
                }
              })
            }
          }
          break

        case 'metrics':
          if (section.items && section.items.length > 0) {
            const metricElements = section.items.map((item: any) => {
              let trendText = ''
              if (item.trend) {
                const trend = item.trend.startsWith('+') ? 'green' : 
                             item.trend.startsWith('-') ? 'red' : 'default'
                trendText = ` <font color="${trend}">${item.trend}</font>`
              }
              
              return `**${item.label}:** ${item.value}${trendText}`
            }).join('  |  ')
            
            sections.push({
              type: 'div',
              text: {
                tag: 'lark_md',
                content: metricElements
              }
            })
          }
          break

        case 'text':
          sections.push({
            type: 'div',
            text: {
              tag: 'lark_md',
              content: section.text || ''
            }
          })
          break

        case 'divider':
          sections.push({ type: 'hr' })
          break
      }
    }
  }

  // Actions section
  const actions: any[] = []
  const actionSection = config.sections?.find(s => s.type === 'actions')
  
  if (actionSection?.buttons) {
    for (const button of actionSection.buttons) {
      if (button.url) {
        actions.push({
          tag: 'button',
          text: {
            tag: 'plain_text',
            content: button.text || '按钮'
          },
          type: 'primary',
          url: button.url
        })
      } else if (button.action) {
        actions.push({
          tag: 'button',
          text: {
            tag: 'plain_text',
            content: button.text || '按钮'
          },
          type: button.type || 'default',
          value: JSON.stringify({ action: button.action }),
          confirm: button.confirm ? {
            title: { tag: 'plain_text', content: '确认操作' },
            text: { tag: 'plain_text', content: button.confirm }
          } : undefined
        })
      }
    }
  }

  // Add timestamp if provided
  if (config.timestamp) {
    const date = new Date(config.timestamp)
    sections.push({
      type: 'note',
      elements: [{
        tag: 'plain_text',
        content: `🕒 ${date.toLocaleString('zh-CN')}`
      }]
    })
  }

  // Build the card
  const card: Record<string, any> = {
    config: {
      wide_screen_mode: true
    },
    header: config.title ? {
      title: {
        tag: 'plain_text',
        content: config.title
      },
      template: config.status ? statusColors[config.status] : 'blue'
    } : undefined,
    elements: sections
  }

  if (actions.length > 0) {
    card.elements.push({
      type: 'action',
      actions: actions
    })
  }

  return card
}

/**
 * Parse AI Assistant YAML content
 */
export function parseAIAssistantContent(content: string): Record<string, any> {
  const parsed = yaml.load(content) as any
  const aiConfig = parsed.ai_assistant || parsed
  
  // Convert to Feishu card
  const card = convertAIAssistantToCard(aiConfig)
  
  return card
}