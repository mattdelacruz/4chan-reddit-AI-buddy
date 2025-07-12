# Judgeval Requirements Setup

## Installation

### Setup

```bash
# Create a virtual environment
python -m venv judgeval-env

# Activate the virtual environment
# On Windows:
judgeval-env\Scripts\activate
# On macOS/Linux:
source judgeval-env/bin/activate

# Install minimal requirements
pip install -r judgeval/requirements.txt
```

## Environment Setup

After installing the requirements, you'll need to set up your environment variables:

1. Create a `.env` file in the `judgeval` directory:

```bash
# Judgeval API credentials
JUDGMENT_API_KEY=your_judgment_api_key_here
JUDGMENT_ORG_ID=your_organization_id_here

# Optional: For self-hosted Judgment
# JUDGMENT_API_URL=https://your-self-hosted-instance.com
```

2. Get your API credentials:
   - Sign up at [Judgment Platform](https://judgment.ai)
   - Create a new project
   - Copy your API key and organization ID

## Usage

Once installed and configured, you can run the evaluation scripts:

```bash
# Test custom scorers with sample data
python judgeval/test_custom_scorers.py

# Evaluate your agent logs
python judgeval/test_agent_logs.py

# Run full evaluation pipeline
python judgeval/evaluation.py
```
