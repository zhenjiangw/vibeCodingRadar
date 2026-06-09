import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Project {
  id: number;
  name: string;
  slug: string;
  description: string;
  core_features: string[];
  difficulty: string;
  estimated_hours: number;
  tech_stack: string[];
  category_id: number;
  target: string;
  tech_recommendations: { main: string[]; auxiliary: string[] };
  implementation_steps: string[];
  expected_outcomes: { features: string[]; learning: string[] };
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  /* ── Extended fields for GitHub trending project mapping ── */
  url?: string;
  language?: string;
  full_name?: string;
  stars_24h?: number;
  stars_7d?: number;
  total_stars?: number;
  forks?: number;
  open_issues?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export interface TrendingProject {
  id: number;
  name: string;
  full_name: string;
  description: string;
  url: string;
  language: string;
  stars_24h: number;
  stars_7d: number;
  total_stars: number;
  forks: number;
  open_issues: number;
}

interface ProjectState {
  projects: Project[];
  categories: Category[];
  trendingProjects: TrendingProject[];
  favorites: number[];
  selectedProject: Project | null;
  searchQuery: string;
  selectedCategory: number | null;
  selectedDifficulty: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  categories: [],
  trendingProjects: [],
  favorites: [],
  selectedProject: null,
  searchQuery: '',
  selectedCategory: null,
  selectedDifficulty: null,
  isLoading: false,
  error: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async ({ categoryId, difficulty, search }: { categoryId?: number; difficulty?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (categoryId) params.append('category_id', categoryId.toString());
    if (difficulty) params.append('difficulty', difficulty);
    if (search) params.append('search', search);
    
    const response = await axios.get(`${API_URL}/api/projects?${params}`);
    return response.data;
  }
);

export const fetchCategories = createAsyncThunk('projects/fetchCategories', async () => {
  const response = await axios.get(`${API_URL}/api/categories`);
  return response.data;
});

export const fetchTrendingProjects = createAsyncThunk('projects/fetchTrendingProjects', async () => {
  const response = await axios.get(`${API_URL}/api/trending`);
  return response.data;
});

export const fetchProjectById = createAsyncThunk('projects/fetchProjectById', async (id: number) => {
  const response = await axios.get(`${API_URL}/api/projects/${id}`);
  return response.data;
});

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<number | null>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedDifficulty: (state, action: PayloadAction<string | null>) => {
      state.selectedDifficulty = action.payload;
    },
    setSelectedProject: (state, action: PayloadAction<Project | null>) => {
      state.selectedProject = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const projectId = action.payload;
      const index = state.favorites.indexOf(projectId);
      if (index === -1) {
        state.favorites.push(projectId);
      } else {
        state.favorites.splice(index, 1);
      }
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    loadFavorites: (state) => {
      const saved = localStorage.getItem('favorites');
      if (saved) {
        state.favorites = JSON.parse(saved);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch projects';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchTrendingProjects.fulfilled, (state, action) => {
        state.trendingProjects = action.payload;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.selectedProject = action.payload;
      });
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setSelectedDifficulty,
  setSelectedProject,
  toggleFavorite,
  loadFavorites,
} = projectSlice.actions;

export default projectSlice.reducer;
