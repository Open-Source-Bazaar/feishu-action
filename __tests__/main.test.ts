import * as fs from 'fs'
import * as path from 'path'
import yaml from 'js-yaml'

test('action uses setup-node lts in composite wrapper', () => {
  const actionPath = path.join(__dirname, '..', 'action.yml')
  const action = yaml.load(fs.readFileSync(actionPath, 'utf8'), {
    schema: yaml.FAILSAFE_SCHEMA
  }) as {
    runs: {
      using: string
      steps: Array<{
        uses?: string
        with?: {
          'node-version'?: string
        }
      }>
    }
  }

  expect(action.runs.using).toBe('composite')
  expect(action.runs.steps[0]).toMatchObject({
    uses: 'actions/setup-node@v4',
    with: {
      'node-version': 'lts/*'
    }
  })
  expect(action.runs.steps[1]).toMatchObject({
    shell:
      "${{ runner.os == 'Windows' && 'pwsh' || ((runner.os == 'Linux' || runner.os == 'macOS') && 'bash') }}",
    run: 'node dist/index.js'
  })
})
