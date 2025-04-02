
import { Request, Response } from 'express';
import Feedback from '../models/Feedback';

// Get dashboard stats
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Get total feedback count
    const total = await Feedback.countDocuments();
    
    // Get sentiment counts
    const positive = await Feedback.countDocuments({ sentiment: 'positive' });
    const neutral = await Feedback.countDocuments({ sentiment: 'neutral' });
    const negative = await Feedback.countDocuments({ sentiment: 'negative' });
    
    // Get response rate
    const responded = await Feedback.countDocuments({
      status: { $in: ['responded', 'closed'] },
    });
    const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;
    
    // Get feedback by categories
    const categories = await Feedback.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);
    
    // Get top tags
    const tags = await Feedback.aggregate([
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);
    
    // Get time-based trends
    const currentDate = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);
    
    const trends = await Feedback.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
          positive: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'positive'] }, 1, 0] },
          },
          neutral: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'neutral'] }, 1, 0] },
          },
          negative: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'negative'] }, 1, 0] },
          },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1,
        },
      },
    ]);
    
    // Calculate average response time
    // This is a simplified calculation; in a real app, you would calculate the time
    // between when feedback was submitted and when it was first responded to
    const avgResponseTime = 4.2; // placeholder value
    
    // Format the data for the frontend
    const formattedTrends = trends.map(item => ({
      date: new Date(item._id.year, item._id.month - 1, item._id.day).toISOString().split('T')[0],
      count: item.count,
      sentiment: {
        positive: item.positive,
        neutral: item.neutral,
        negative: item.negative,
      },
    }));
    
    const formattedCategories = categories.map(item => ({
      category: item._id,
      count: item.count,
    }));
    
    const formattedTags = tags.map(item => ({
      tag: item._id,
      count: item.count,
    }));
    
    res.status(200).json({
      stats: {
        total,
        positive,
        neutral,
        negative,
        responseRate,
        avgResponseTime,
        topCategories: formattedCategories,
        topTags: formattedTags,
        trend: formattedTrends,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get category distribution
export const getCategoryDistribution = async (req: Request, res: Response) => {
  try {
    const categories = await Feedback.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);
    
    const formattedCategories = categories.map(item => ({
      name: item._id,
      value: item.count,
    }));
    
    res.status(200).json({
      categories: formattedCategories,
    });
  } catch (error) {
    console.error('Get category distribution error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get sentiment trends
export const getSentimentTrends = async (req: Request, res: Response) => {
  try {
    const { period = 'week' } = req.query;
    
    let timeFrame: Date;
    const currentDate = new Date();
    
    if (period === 'day') {
      timeFrame = new Date(currentDate);
      timeFrame.setDate(currentDate.getDate() - 1);
    } else if (period === 'month') {
      timeFrame = new Date(currentDate);
      timeFrame.setMonth(currentDate.getMonth() - 1);
    } else {
      // Default to week
      timeFrame = new Date(currentDate);
      timeFrame.setDate(currentDate.getDate() - 7);
    }
    
    const trends = await Feedback.aggregate([
      {
        $match: {
          createdAt: { $gte: timeFrame },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          positive: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'positive'] }, 1, 0] },
          },
          neutral: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'neutral'] }, 1, 0] },
          },
          negative: {
            $sum: { $cond: [{ $eq: ['$sentiment', 'negative'] }, 1, 0] },
          },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1,
        },
      },
    ]);
    
    const formattedTrends = trends.map(item => {
      const date = new Date(item._id.year, item._id.month - 1, item._id.day);
      let name;
      
      if (period === 'day') {
        name = date.toLocaleTimeString([], { hour: '2-digit', hour12: true });
      } else {
        name = date.toLocaleDateString('en-US', { weekday: 'short' });
      }
      
      return {
        name,
        positive: item.positive,
        neutral: item.neutral,
        negative: item.negative,
      };
    });
    
    res.status(200).json({
      trends: formattedTrends,
    });
  } catch (error) {
    console.error('Get sentiment trends error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
