#!/usr/bin/env python3
"""
Test script for evaluating agent_logs.jsonl with custom scorers
"""

import json
from custom_scorers import (
    FourChanStyleScorer,
    CharacterLimitScorer,
    RedditStyleScorer,
    EngagementScorer,
    ToxicityScorer,
)
from judgeval.data import Example


def test_agent_logs():
    """Test custom scorers on agent_logs.jsonl data"""

    # Load agent logs
    logs = []
    try:
        with open("../agent_logs.jsonl", "r") as f:
            for line in f:
                logs.append(json.loads(line.strip()))
        print(f"Loaded {len(logs)} log entries from agent_logs.jsonl")
    except FileNotFoundError:
        print("agent_logs.jsonl not found. Please ensure the file exists.")
        return

    # Initialize scorers
    scorers = {
        "4chan_style": FourChanStyleScorer(threshold=0.4),
        "character_limit": CharacterLimitScorer(max_chars=150, threshold=0.8),
        "engagement": EngagementScorer(threshold=0.3),
        "toxicity": ToxicityScorer(threshold=0.7),
    }

    print("\n" + "=" * 80)
    print("AGENT LOGS EVALUATION")
    print("=" * 80)

    # Track overall statistics
    stats = {
        "total": len(logs),
        "passed_4chan": 0,
        "passed_char_limit": 0,
        "passed_engagement": 0,
        "passed_toxicity": 0,
        "scores": {
            "4chan_style": [],
            "character_limit": [],
            "engagement": [],
            "toxicity": [],
        },
    }

    for i, log in enumerate(logs, 1):
        print(f"\n{'='*60}")
        print(f"RESPONSE {i}/{len(logs)}")
        print(f"Model: {log.get('model', 'unknown')}")

        # Truncate long inputs for display
        input_text = log["input"]
        if len(input_text) > 100:
            input_text = input_text[:100] + "..."
        print(f"Input: {input_text}")

        output_text = log["output"]
        print(f"Output: {output_text}")
        print(f"Length: {len(output_text)} characters")

        # Create example
        example = Example(
            input=log["input"],
            actual_output=log["output"],
            context=(
                [log.get("system_instruction", "")]
                if log.get("system_instruction")
                else None
            ),
        )

        # Score with all scorers
        print("\nScorer Results:")
        for scorer_name, scorer in scorers.items():
            result = scorer.evaluate_example(example)
            status = "✅ PASS" if result.success else "❌ FAIL"
            print(f"  {scorer_name:15}: {result.score:.3f} {status}")

            # Track statistics
            stats["scores"][scorer_name].append(result.score)
            if result.success:
                stats[f"passed_{scorer_name.replace('_', '')}"] += 1

    # Print overall statistics
    print(f"\n{'='*80}")
    print("OVERALL STATISTICS")
    print(f"{'='*80}")
    print(f"Total responses: {stats['total']}")

    for scorer_name in scorers.keys():
        passed_count = stats[f"passed_{scorer_name.replace('_', '')}"]
        avg_score = sum(stats["scores"][scorer_name]) / len(
            stats["scores"][scorer_name]
        )
        pass_rate = (passed_count / stats["total"]) * 100

        print(f"\n{scorer_name.replace('_', ' ').title()}:")
        print(f"  Pass rate: {pass_rate:.1f}% ({passed_count}/{stats['total']})")
        print(f"  Average score: {avg_score:.3f}")
        print(f"  Best score: {max(stats['scores'][scorer_name]):.3f}")
        print(f"  Worst score: {min(stats['scores'][scorer_name]):.3f}")

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


if __name__ == "__main__":
    test_agent_logs()
