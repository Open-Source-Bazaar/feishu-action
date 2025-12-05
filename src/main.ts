import * as core from '@actions/core'
import got from 'got'
import yaml from 'js-yaml'

interface Message {
  msg_type: string
  content?: Record<string, unknown>
  card?: Record<string, unknown>
}

async function postMessage(): Promise<string> {
  const msg_type: string = core.getInput('msg_type')
  const content: string = core.getInput('content')
  if (msg_type === 'interactive') {
    return await post({
      msg_type,
      card: yaml.load(content) as Record<string, unknown>
    })
  }
  return await post({
    msg_type,
    content: yaml.load(content) as Record<string, unknown>
  })
}

async function post(body: Message): Promise<string> {
  const url: string = core.getInput('url')
  const rsp = await got.post(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  core.debug(rsp.body)
  return rsp.body
}

async function run(): Promise<void> {
  try {
    await postMessage()
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed(String(error))
    }
  }
}

run()
