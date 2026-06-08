from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, ARRAY, JSON, Boolean
from sqlalchemy.sql import func
from .database import Base

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    slug = Column(String(50), unique=True, nullable=False)
    description = Column(Text)
    icon = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, nullable=False)
    description = Column(Text, nullable=False)
    core_features = Column(ARRAY(String), nullable=False)
    difficulty = Column(String(20), nullable=False)
    estimated_hours = Column(Integer, nullable=False)
    tech_stack = Column(ARRAY(String), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"))
    target = Column(Text)
    tech_recommendations = Column(JSON)
    implementation_steps = Column(ARRAY(Text))
    expected_outcomes = Column(JSON)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class UserFavorite(Base):
    __tablename__ = "user_favorites"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    __table_args__ = (
        {"unique_constraint": "unique_user_project"},
    )

class TrendingProject(Base):
    __tablename__ = "trending_projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    full_name = Column(String(300), unique=True, nullable=False)
    description = Column(Text)
    url = Column(String(500), nullable=False)
    language = Column(String(100))
    stars_24h = Column(Integer, default=0)
    stars_7d = Column(Integer, default=0)
    total_stars = Column(Integer, default=0)
    forks = Column(Integer, default=0)
    open_issues = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class SearchHistory(Base):
    __tablename__ = "search_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255))
    query = Column(String(500), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
