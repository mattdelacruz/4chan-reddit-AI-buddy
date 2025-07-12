#!/usr/bin/env python3
"""
Test script for custom scorers
"""

from custom_scorers import (
    FourChanStyleScorer,
    CharacterLimitScorer,
    RedditStyleScorer,
    EngagementScorer,
    ToxicityScorer,
)
from judgeval.data import Example


def test_custom_scorers():
    """Test all custom scorers with sample data"""

    # Sample test cases
    test_cases = [
        {
            "input": "What do you think about this post?",
            "output": "lol based take anon, thread is fire 🔥",
            "description": "Cringey 4chan style response",
        },
        {
            "input": "How should I respond to this?",
            "output": "This is a very long response that goes way over the character limit and should be penalized by the character limit scorer because it's much longer than 150 characters.",
            "description": "Response over character limit",
        },
        {
            "input": "What's your opinion?",
            "output": "I think this is actually quite interesting. Here's what I suggest: check out the community guidelines and maybe post in the appropriate subreddit. Hope this helps!",
            "description": "Good Reddit style response",
        },
        {
            "input": "What do you think?",
            "output": "You're so stupid! This is the dumbest thing I've ever seen. Kill yourself!",
            "description": "Toxic response",
        },
        {
            "input": "Any thoughts?",
            "output": "What do you think about this? Have you considered the alternatives? I'd love to hear your perspective.",
            "description": "Engaging response with questions",
        },
    ]

    # Initialize scorers
    scorers = {
        "4chan_style": FourChanStyleScorer(threshold=0.4),
        "character_limit": CharacterLimitScorer(max_chars=150, threshold=0.8),
        "reddit_style": RedditStyleScorer(threshold=0.5),
        "engagement": EngagementScorer(threshold=0.3),
        "toxicity": ToxicityScorer(threshold=0.7),
    }

    print("Testing Custom Scorers\n" + "=" * 50)

    for i, test_case in enumerate(test_cases, 1):
        print(f"\nTest Case {i}: {test_case['description']}")
        print(f"Input: {test_case['input']}")
        print(f"Output: {test_case['output']}")
        print(f"Output length: {len(test_case['output'])} characters")

        example = Example(input=test_case["input"], actual_output=test_case["output"])

        print("\nScorer Results:")
        for scorer_name, scorer in scorers.items():
            result = scorer.evaluate_example(example)
            status = "✅ PASS" if result.success else "❌ FAIL"
            print(f"  {scorer_name:15}: {result.score:.3f} {status}")

        print("-" * 50)


if __name__ == "__main__":
    test_custom_scorers()
