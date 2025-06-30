const express = require('express');
const router = express.Router();

// Mock data for community features
const communityPosts = [
  {
    id: 1,
    userId: 'user1',
    userName: 'Rajesh Kumar',
    userAvatar: '',
    title: 'Best practices for organic farming',
    content: 'I have been practicing organic farming for the past 5 years. Here are some tips that have worked well for me...',
    category: 'Organic Farming',
    tags: ['organic', 'best-practices', 'sustainable'],
    likes: 45,
    comments: 12,
    views: 234,
    createdAt: '2024-01-15T10:30:00Z',
    location: {
      state: 'Punjab',
      district: 'Amritsar'
    }
  },
  {
    id: 2,
    userId: 'user2',
    userName: 'Priya Sharma',
    userAvatar: '',
    title: 'Dealing with pest infestation in tomatoes',
    content: 'My tomato plants are showing signs of pest damage. Has anyone faced similar issues? Looking for organic solutions...',
    category: 'Pest Management',
    tags: ['tomatoes', 'pests', 'organic-solutions'],
    likes: 23,
    comments: 8,
    views: 156,
    createdAt: '2024-01-14T15:45:00Z',
    location: {
      state: 'Maharashtra',
      district: 'Nashik'
    }
  }
];

const comments = [
  {
    id: 1,
    postId: 1,
    userId: 'user3',
    userName: 'Amit Patel',
    content: 'Great tips! I especially liked the neem oil solution for pest control.',
    likes: 5,
    createdAt: '2024-01-15T11:00:00Z'
  },
  {
    id: 2,
    postId: 1,
    userId: 'user4',
    userName: 'Sita Devi',
    content: 'Have you tried companion planting? Marigolds work wonders for pest control.',
    likes: 8,
    createdAt: '2024-01-15T12:15:00Z'
  }
];

// @route   GET /api/community/posts
// @desc    Get community posts
// @access  Public
router.get('/posts', async (req, res) => {
  try {
    const { category, tag, state, limit = 10, page = 1 } = req.query;

    let filteredPosts = communityPosts;

    if (category) {
      filteredPosts = filteredPosts.filter(post => 
        post.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (tag) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags.includes(tag.toLowerCase())
      );
    }

    if (state) {
      filteredPosts = filteredPosts.filter(post => 
        post.location.state.toLowerCase() === state.toLowerCase()
      );
    }

    // Sort by creation date (newest first)
    filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    res.json({
      success: true,
      count: paginatedPosts.length,
      total: filteredPosts.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(filteredPosts.length / parseInt(limit))
      },
      data: paginatedPosts
    });

  } catch (error) {
    console.error('Get community posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/community/posts/:id
// @desc    Get specific post with comments
// @access  Public
router.get('/posts/:id', async (req, res) => {
  try {
    const post = communityPosts.find(p => p.id === parseInt(req.params.id));

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Get comments for this post
    const postComments = comments.filter(c => c.postId === post.id);

    res.json({
      success: true,
      data: {
        ...post,
        comments: postComments
      }
    });

  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/community/categories
// @desc    Get all post categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = [...new Set(communityPosts.map(post => post.category))];

    res.json({
      success: true,
      count: categories.length,
      data: categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/community/tags
// @desc    Get all tags
// @access  Public
router.get('/tags', async (req, res) => {
  try {
    const allTags = communityPosts.flatMap(post => post.tags);
    const uniqueTags = [...new Set(allTags)];

    res.json({
      success: true,
      count: uniqueTags.length,
      data: uniqueTags
    });

  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/community/trending
// @desc    Get trending posts
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    // Sort by engagement (likes + comments + views)
    const trendingPosts = communityPosts
      .map(post => ({
        ...post,
        engagement: post.likes + post.comments + post.views
      }))
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      count: trendingPosts.length,
      data: trendingPosts
    });

  } catch (error) {
    console.error('Get trending posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 