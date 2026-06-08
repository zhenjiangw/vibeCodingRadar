from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import get_db, engine, Base
from .models import Project, Category, UserFavorite, TrendingProject, SearchHistory
from .schemas import Project as ProjectSchema, Category as CategorySchema
from typing import List, Optional
import redis
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Vibe Coding Radar API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

redis_client = redis.Redis.from_url(os.getenv("REDIS_URL", "redis://redis:6379/0"))

@app.get("/api/categories", response_model=List[CategorySchema])
def get_categories(db: Session = Depends(get_db)):
    cache_key = "categories"
    cached = redis_client.get(cache_key)
    if cached:
        import json
        return json.loads(cached)
    
    categories = db.query(Category).all()
    result = [CategorySchema.from_orm(c) for c in categories]
    
    import json
    from datetime import datetime
    def serialize(obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return obj
    redis_client.setex(cache_key, 3600, json.dumps([r.dict() for r in result], default=serialize))
    return result

@app.get("/api/projects", response_model=List[ProjectSchema])
def get_projects(
    category_id: Optional[int] = None,
    difficulty: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Project)
    
    if category_id:
        query = query.filter(Project.category_id == category_id)
    if difficulty:
        query = query.filter(Project.difficulty == difficulty)
    if search:
        search_lower = search.lower()
        query = query.filter(
            (Project.name.ilike(f"%{search_lower}%")) |
            (Project.description.ilike(f"%{search_lower}%")) |
            (Project.tech_stack.any(search_lower))
        )
    
    return [ProjectSchema.from_orm(p) for p in query.all()]

@app.get("/api/projects/{project_id}", response_model=ProjectSchema)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectSchema.from_orm(project)

@app.post("/api/favorites/{project_id}")
def add_favorite(project_id: int, user_id: str = Query(...), db: Session = Depends(get_db)):
    existing = db.query(UserFavorite).filter(
        UserFavorite.user_id == user_id,
        UserFavorite.project_id == project_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already favorited")
    
    favorite = UserFavorite(user_id=user_id, project_id=project_id)
    db.add(favorite)
    db.commit()
    return {"message": "Favorite added"}

@app.delete("/api/favorites/{project_id}")
def remove_favorite(project_id: int, user_id: str = Query(...), db: Session = Depends(get_db)):
    favorite = db.query(UserFavorite).filter(
        UserFavorite.user_id == user_id,
        UserFavorite.project_id == project_id
    ).first()
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")
    
    db.delete(favorite)
    db.commit()
    return {"message": "Favorite removed"}

@app.get("/api/favorites")
def get_favorites(user_id: str = Query(...), db: Session = Depends(get_db)):
    favorites = db.query(UserFavorite).filter(UserFavorite.user_id == user_id).all()
    project_ids = [f.project_id for f in favorites]
    projects = db.query(Project).filter(Project.id.in_(project_ids)).all()
    return [ProjectSchema.from_orm(p) for p in projects]

@app.get("/api/trending", response_model=List[dict])
def get_trending_projects(limit: int = 10, db: Session = Depends(get_db)):
    cache_key = f"trending_{limit}"
    cached = redis_client.get(cache_key)
    if cached:
        import json
        return json.loads(cached)
    
    projects = db.query(TrendingProject).order_by(TrendingProject.stars_7d.desc()).limit(limit).all()
    result = [
        {
            "id": p.id,
            "name": p.name,
            "full_name": p.full_name,
            "description": p.description,
            "url": p.url,
            "language": p.language,
            "stars_24h": p.stars_24h,
            "stars_7d": p.stars_7d,
            "total_stars": p.total_stars,
            "forks": p.forks,
            "open_issues": p.open_issues
        }
        for p in projects
    ]
    
    redis_client.setex(cache_key, 1800, str(result).replace("'", '"'))
    return result

@app.post("/api/search")
def search_projects(query: str, user_id: Optional[str] = None, db: Session = Depends(get_db)):
    if user_id:
        history = SearchHistory(user_id=user_id, query=query)
        db.add(history)
        db.commit()
    
    projects = db.query(Project).filter(
        (Project.name.ilike(f"%{query}%")) |
        (Project.description.ilike(f"%{query}%")) |
        (Project.tech_stack.any(query))
    ).all()
    
    return {"projects": [ProjectSchema.from_orm(p) for p in projects], "total": len(projects)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
