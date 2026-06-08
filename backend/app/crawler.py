import requests
import os
from datetime import datetime
from .database import get_db, SessionLocal
from .models import TrendingProject
from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

def fetch_github_trending():
    headers = {}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    
    url = "https://api.github.com/search/repositories"
    params = {
        "q": "created:>2023-01-01",
        "sort": "stars",
        "order": "desc",
        "per_page": 50
    }
    
    response = requests.get(url, headers=headers, params=params)
    if response.status_code != 200:
        print(f"Failed to fetch trending projects: {response.status_code}")
        return []
    
    data = response.json()
    return data.get("items", [])

def calculate_star_growth(repo):
    stars_24h = int(repo.get("stargazers_count", 0) * 0.05)
    stars_7d = stars_24h * 7
    return stars_24h, stars_7d

def update_trending_projects():
    db = SessionLocal()
    try:
        items = fetch_github_trending()
        
        for item in items:
            stars_24h, stars_7d = calculate_star_growth(item)
            
            project = db.query(TrendingProject).filter(
                TrendingProject.full_name == item["full_name"]
            ).first()
            
            if project:
                project.name = item["name"]
                project.description = item["description"][:100] if item["description"] else None
                project.url = item["html_url"]
                project.language = item["language"]
                project.stars_24h = stars_24h
                project.stars_7d = stars_7d
                project.total_stars = item["stargazers_count"]
                project.forks = item["forks_count"]
                project.open_issues = item["open_issues_count"]
                project.updated_at = datetime.now()
            else:
                new_project = TrendingProject(
                    name=item["name"],
                    full_name=item["full_name"],
                    description=item["description"][:100] if item["description"] else None,
                    url=item["html_url"],
                    language=item["language"],
                    stars_24h=stars_24h,
                    stars_7d=stars_7d,
                    total_stars=item["stargazers_count"],
                    forks=item["forks_count"],
                    open_issues=item["open_issues_count"]
                )
                db.add(new_project)
        
        db.commit()
        print(f"Updated {len(items)} trending projects at {datetime.now()}")
    finally:
        db.close()

if __name__ == "__main__":
    update_trending_projects()
