import sys
import subprocess
import json

def run_pipeline(product_url):
    # run the scraper
    print("Running scraper...", file=sys.stderr)
    scraper_result = subprocess.run(
        ["python", "ReviewsScraping.py", product_url],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    if scraper_result.returncode != 0:
        print(f"Scraper Error: {scraper_result.stderr}", file=sys.stderr)
        return None

    # run the prediction code
    print("Running prediction code...", file=sys.stderr)
    analysis_result = subprocess.run(
        ["python", "analyze_reviews.py"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    if analysis_result.returncode != 0:
        print(f"Analysis Error: {analysis_result.stderr}", file=sys.stderr)
        return None

    print("Pipeline completed.", file=sys.stderr)
    
    # parse the analysis output
    try:
        return json.loads(analysis_result.stdout)
    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {e}", file=sys.stderr)
        return None

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python run_pipeline.py <product_url>", file=sys.stderr)
        sys.exit(1)

    product_url = sys.argv[1]
    pipeline_result = run_pipeline(product_url)
    
    if pipeline_result:
        print(json.dumps(pipeline_result))
    else:
        sys.exit(1)