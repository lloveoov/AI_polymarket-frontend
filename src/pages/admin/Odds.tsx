import { useState } from 'react'

interface OddsConfig {
  minProbability: number
  maxProbability: number
  defaultProbability: number
  liquidityWeight: number
  volumeWeight: number
  sentimentWeight: number
  minStake: number
  maxStake: number
  autoAdjustEnabled: boolean
}

const defaultConfig: OddsConfig = {
  minProbability: 1,
  maxProbability: 99,
  defaultProbability: 50,
  liquidityWeight: 0.4,
  volumeWeight: 0.3,
  sentimentWeight: 0.3,
  minStake: 1,
  maxStake: 10000,
  autoAdjustEnabled: true,
}

const initialMockData: OddsConfig[] = [
  { ...defaultConfig, minProbability: 5, maxProbability: 95, liquidityWeight: 0.5, volumeWeight: 0.3, sentimentWeight: 0.2, minStake: 10, maxStake: 5000 },
  { ...defaultConfig, minProbability: 1, maxProbability: 99, liquidityWeight: 0.3, volumeWeight: 0.4, sentimentWeight: 0.3, minStake: 5, maxStake: 10000 },
  { ...defaultConfig, minProbability: 10, maxProbability: 90, liquidityWeight: 0.6, volumeWeight: 0.2, sentimentWeight: 0.2, minStake: 1, maxStake: 2500, autoAdjustEnabled: false },
]

interface ValidationErrors {
  minProbability?: string
  maxProbability?: string
  defaultProbability?: string
  liquidityWeight?: string
  volumeWeight?: string
  sentimentWeight?: string
  minStake?: string
  maxStake?: string
}

function validateConfig(config: OddsConfig): ValidationErrors {
  const errors: ValidationErrors = {}

  if (config.minProbability < 0 || config.minProbability > 100) {
    errors.minProbability = 'Must be between 0 and 100'
  }
  if (config.maxProbability < 0 || config.maxProbability > 100) {
    errors.maxProbability = 'Must be between 0 and 100'
  }
  if (config.minProbability >= config.maxProbability) {
    errors.minProbability = 'Must be less than max probability'
  }
  if (config.defaultProbability < config.minProbability || config.defaultProbability > config.maxProbability) {
    errors.defaultProbability = 'Must be between min and max probability'
  }
  if (config.liquidityWeight < 0 || config.liquidityWeight > 1) {
    errors.liquidityWeight = 'Must be between 0 and 1'
  }
  if (config.volumeWeight < 0 || config.volumeWeight > 1) {
    errors.volumeWeight = 'Must be between 0 and 1'
  }
  if (config.sentimentWeight < 0 || config.sentimentWeight > 1) {
    errors.sentimentWeight = 'Must be between 0 and 1'
  }
  const totalWeight = config.liquidityWeight + config.volumeWeight + config.sentimentWeight
  if (Math.abs(totalWeight - 1) > 0.01) {
    errors.liquidityWeight = `Weights must sum to 1 (currently ${totalWeight.toFixed(2)})`
  }
  if (config.minStake < 0) {
    errors.minStake = 'Must be positive'
  }
  if (config.maxStake < config.minStake) {
    errors.maxStake = 'Must be greater than min stake'
  }

  return errors
}

export function OddsPage() {
  const [configs] = useState<OddsConfig[]>(initialMockData)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [config, setConfig] = useState<OddsConfig>({ ...configs[0] })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [saved, setSaved] = useState(false)

  const selectedConfig = configs[selectedIndex]

  const handleSelectChange = (index: number) => {
    setSelectedIndex(index)
    setConfig({ ...configs[index] })
    setErrors({})
    setSaved(false)
  }

  const handleChange = (field: keyof OddsConfig, value: number | boolean) => {
    const newConfig = { ...config, [field]: value }
    setConfig(newConfig)
    setErrors(validateConfig(newConfig))
    setSaved(false)
  }

  const handleSave = () => {
    const validationErrors = validateConfig(config)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setSaved(true)
  }

  const handleReset = () => {
    setConfig({ ...selectedConfig })
    setErrors({})
    setSaved(false)
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Odds Configuration</h1>
        <p>Configure and adjust market odds parameters and probability calculations.</p>
      </div>

      <div className="config-selector">
        <label>Select Market Category:</label>
        <select value={selectedIndex} onChange={(e) => handleSelectChange(Number(e.target.value))}>
          {['Crypto', 'AI', 'Politics', 'Sports'].map((cat, idx) => (
            <option key={idx} value={idx}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="config-section">
        <h2>Probability Bounds</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Minimum Probability (%)</label>
            <input
              type="number"
              value={config.minProbability}
              onChange={(e) => handleChange('minProbability', Number(e.target.value))}
              className={errors.minProbability ? 'error' : ''}
            />
            {errors.minProbability && <span className="error-text">{errors.minProbability}</span>}
          </div>
          <div className="form-group">
            <label>Maximum Probability (%)</label>
            <input
              type="number"
              value={config.maxProbability}
              onChange={(e) => handleChange('maxProbability', Number(e.target.value))}
              className={errors.maxProbability ? 'error' : ''}
            />
            {errors.maxProbability && <span className="error-text">{errors.maxProbability}</span>}
          </div>
          <div className="form-group">
            <label>Default Probability (%)</label>
            <input
              type="number"
              value={config.defaultProbability}
              onChange={(e) => handleChange('defaultProbability', Number(e.target.value))}
              className={errors.defaultProbability ? 'error' : ''}
            />
            {errors.defaultProbability && <span className="error-text">{errors.defaultProbability}</span>}
          </div>
        </div>
      </div>

      <div className="config-section">
        <h2>Odds Calculation Weights</h2>
        <p className="section-desc">Weights determine how each factor influences odds calculations. Must sum to 1.0.</p>
        <div className="form-row">
          <div className="form-group">
            <label>Liquidity Weight</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              value={config.liquidityWeight}
              onChange={(e) => handleChange('liquidityWeight', Number(e.target.value))}
              className={errors.liquidityWeight ? 'error' : ''}
            />
            {errors.liquidityWeight && <span className="error-text">{errors.liquidityWeight}</span>}
          </div>
          <div className="form-group">
            <label>Volume Weight</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              value={config.volumeWeight}
              onChange={(e) => handleChange('volumeWeight', Number(e.target.value))}
              className={errors.volumeWeight ? 'error' : ''}
            />
            {errors.volumeWeight && <span className="error-text">{errors.volumeWeight}</span>}
          </div>
          <div className="form-group">
            <label>Sentiment Weight</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              value={config.sentimentWeight}
              onChange={(e) => handleChange('sentimentWeight', Number(e.target.value))}
              className={errors.sentimentWeight ? 'error' : ''}
            />
            {errors.sentimentWeight && <span className="error-text">{errors.sentimentWeight}</span>}
          </div>
        </div>
      </div>

      <div className="config-section">
        <h2>Stake Limits</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Minimum Stake ($)</label>
            <input
              type="number"
              value={config.minStake}
              onChange={(e) => handleChange('minStake', Number(e.target.value))}
              className={errors.minStake ? 'error' : ''}
            />
            {errors.minStake && <span className="error-text">{errors.minStake}</span>}
          </div>
          <div className="form-group">
            <label>Maximum Stake ($)</label>
            <input
              type="number"
              value={config.maxStake}
              onChange={(e) => handleChange('maxStake', Number(e.target.value))}
              className={errors.maxStake ? 'error' : ''}
            />
            {errors.maxStake && <span className="error-text">{errors.maxStake}</span>}
          </div>
        </div>
      </div>

      <div className="config-section">
        <h2>Auto-Adjustment</h2>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={config.autoAdjustEnabled}
              onChange={(e) => handleChange('autoAdjustEnabled', e.target.checked)}
            />
            <span>Enable automatic odds adjustment based on market activity</span>
          </label>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-secondary" onClick={handleReset}>Reset</button>
        <button className="btn-primary" onClick={handleSave}>Save Changes</button>
      </div>

      {saved && <div className="success-message">Configuration saved successfully!</div>}
    </div>
  )
}
