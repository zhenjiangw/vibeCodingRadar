from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime

class CategoryBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = None

class Category(CategoryBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    name: str
    slug: str
    description: str = Field(..., max_length=150)
    core_features: List[str] = Field(..., max_items=5)
    difficulty: str
    estimated_hours: int
    tech_stack: List[str] = Field(..., max_items=5)
    category_id: int
    target: str
    tech_recommendations: Dict[str, List[str]]
    implementation_steps: List[str] = Field(..., min_items=5)
    expected_outcomes: Dict[str, List[str]]
    url: Optional[str] = None
    is_featured: bool = False

class Project(ProjectBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class UserFavoriteBase(BaseModel):
    user_id: str
    project_id: int

class UserFavorite(UserFavoriteBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class TrendingProjectBase(BaseModel):
    name: str
    full_name: str
    description: Optional[str] = Field(None, max_length=100)
    url: str
    language: Optional[str] = None
    stars_24h: int = 0
    stars_7d: int = 0
    total_stars: int = 0
    forks: int = 0
    open_issues: int = 0

class TrendingProject(TrendingProjectBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SearchQuery(BaseModel):
    query: str
    category_id: Optional[int] = None
    difficulty: Optional[str] = None

class SearchResult(BaseModel):
    projects: List[Project]
    total: int
