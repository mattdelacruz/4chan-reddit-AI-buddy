import json
import os
import asyncio
from dotenv import load_dotenv
from judgeval.common.tracer import Tracer
from judgeval.scorers import ContextualRelevancyScorer
from judgeval import JudgmentClient
from judgeval.data import Example
from custom_scorers import (
    FourChanStyleScorer,
    CharacterLimitScorer,
    RedditStyleScorer,
    EngagementScorer,
    ToxicityScorer,
)

# Load environment variables
load_dotenv()

# Initialize Judgeval
judgment = Tracer(
    api_key=os.getenv("JUDGMENT_API_KEY"),
    project_name="reddit_4chan_agent",
    enable_monitoring=True,
    deep_tracing=False,
)
client = JudgmentClient()


# Read logged responses
def evaluate_logs():
    logs = []
    with open("../agent_logs.jsonl", "r") as f:
        for line in f:
            logs.append(json.loads(line.strip()))

    print(f"Found {len(logs)} log entries to evaluate\n")

    for i, log in enumerate(logs, 1):
        input_data = log["input"]
        output_data = log["output"]
        system_instruction = log.get("system_instruction", "")
        thread_context = log.get("thread_context", "")
        model = log.get("model", "unknown")

        print(f"\n{'='*60}")
        print(f"EVALUATION {i}/{len(logs)}")
        print(f"Model: {model}")
        print(f"Input: {input_data[:100]}{'...' if len(input_data) > 100 else ''}")
        print(f"Output: {output_data}")
        print(f"Output length: {len(output_data)} characters")

        example = Example(
            input=input_data,
            actual_output=output_data,
            context=[system_instruction] if system_instruction else None,
        )

        # Use custom scorers
        custom_scorers = [
            FourChanStyleScorer(threshold=0.4),
            CharacterLimitScorer(max_chars=150, threshold=0.8),
            EngagementScorer(threshold=0.3),
            ToxicityScorer(threshold=0.7),  # Higher threshold = less toxic
        ]

        # Run custom evaluations
        print("\nCustom Scorer Results:")
        for scorer in custom_scorers:
            result = scorer.evaluate_example(example)
            status = "✅ PASS" if result.success else "❌ FAIL"
            print(f"  {scorer.score_type:15}: {result.score:.3f} {status}")

        # Run Judgment evaluation with built-in scorer
        try:
            judgment_result = client.run_evaluation(
                examples=[example],
                scorers=[
                    ContextualRelevancyScorer(threshold=0.5),
                ],
                eval_run_name="reddit_4chan_evaluation",
                override=True,
            )
            print(f"\nJudgment ContextualRelevancy: {judgment_result}")
        except Exception as e:
            print(f"\nJudgment evaluation failed: {e}")

        print(f"{'='*60}")


def reformat_logs():
    """Reformat original logs to the expected format"""
    with open("original_logs.jsonl", "r") as infile, open(
        "agent_logs.jsonl", "w"
    ) as outfile:
        for line in infile:
            log_entry = json.loads(line.strip())
            response = log_entry.get("response", {})

            flattened = {
                "input": response.get("input", ""),
                "output": response.get("output", ""),
                "system_instruction": response.get("system_instruction", ""),
                "thread_context": response.get("thread_context", ""),
                "model": response.get("model", "gemini"),
            }

            outfile.write(json.dumps(flattened) + "\n")


def analyze_results():
    """Analyze overall results from all evaluations"""
    logs = []
    with open("../agent_logs.jsonl", "r") as f:
        for line in f:
            logs.append(json.loads(line.strip()))

    print(f"\n{'='*60}")
    print("OVERALL ANALYSIS")
    print(f"{'='*60}")
    print(f"Total responses evaluated: {len(logs)}")

    # Character length analysis
    lengths = [len(log["output"]) for log in logs]
    avg_length = sum(lengths) / len(lengths)
    over_limit = sum(1 for l in lengths if l > 150)

    print(f"\nCharacter Length Analysis:")
    print(f"  Average length: {avg_length:.1f} characters")
    print(
        f"  Responses over 150 chars: {over_limit}/{len(logs)} ({over_limit/len(logs)*100:.1f}%)"
    )
    print(f"  Shortest response: {min(lengths)} characters")
    print(f"  Longest response: {max(lengths)} characters")

    # Model distribution
    models = {}
    for log in logs:
        model = log.get("model", "unknown")
        models[model] = models.get(model, 0) + 1

    print(f"\nModel Distribution:")
    for model, count in models.items():
        print(f"  {model}: {count} responses")


if __name__ == "__main__":
    # reformat_logs()  # Uncomment if you need to reformat logs
    evaluate_logs()
    analyze_results()
