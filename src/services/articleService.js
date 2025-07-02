// src/services/articleService.js
import { supabase } from '../services/supabaseClient';

export const articleService = {
  /**
   * Fetches all articles.
   */
  async getAllArticles() {
    const { data, error } = await supabase
      .from('articles')
      .select('*, profiles(full_name)') // Get author's name
      .order('published_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching articles: ${error.message}`);
    }
    return data;
  },

  /**
   * Fetches a single article by its ID.
   */
  async getArticleById(id) {
    const { data, error } = await supabase
      .from('articles')
      .select('*, profiles(full_name)')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Error fetching article with ID ${id}: ${error.message}`);
    }
    return data;
  },

  /**
   * Creates a new article (Admin only, RLS handles this).
   */
  async createArticle(articleData) {
    const { data, error } = await supabase
      .from('articles')
      .insert(articleData)
      .select();

    if (error) {
      throw new Error(`Error creating article: ${error.message}`);
    }
    return data[0];
  },

  /**
   * Updates an existing article (Admin only, RLS handles this).
   */
  async updateArticle(articleId, updates) {
    const { data, error } = await supabase
      .from('articles')
      .update(updates)
      .eq('id', articleId)
      .select();

    if (error) {
      throw new Error(`Error updating article ${articleId}: ${error.message}`);
    }
    return data[0];
  },

  /**
   * Deletes an article (Admin only, RLS handles this).
   */
  async deleteArticle(articleId) {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', articleId);

    if (error) {
      throw new Error(`Error deleting article ${articleId}: ${error.message}`);
    }
    return true;
  },
};