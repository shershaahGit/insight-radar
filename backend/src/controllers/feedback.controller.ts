
import { Request, Response } from 'express';
import Feedback from '../models/Feedback';
import { analyzeSentiment } from '../utils/ai';

// Get all feedback with filtering
export const getAllFeedback = async (req: Request, res: Response) => {
  try {
    const {
      status,
      sentiment,
      category,
      source,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build query
    const query: any = {};
    
    if (status) query.status = status;
    if (sentiment) query.sentiment = sentiment;
    if (category) query.category = category;
    if (source) query.source = source;
    
    if (search) {
      query.$or = [
        { text: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Sorting
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;
    
    const feedback = await Feedback.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Feedback.countDocuments(query);
    
    res.status(200).json({
      feedback,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get all feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get feedback by ID
export const getFeedbackById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const feedback = await Feedback.findById(id).populate('responses.userId', 'name avatar');
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    res.status(200).json({ feedback });
  } catch (error) {
    console.error('Get feedback by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new feedback
export const createFeedback = async (req: Request, res: Response) => {
  try {
    const {
      userName,
      userEmail,
      companyName,
      category,
      text,
      source = 'form',
      tags = [],
    } = req.body;
    
    // Use AI to analyze sentiment
    const sentimentAnalysis = await analyzeSentiment(text);
    
    const feedback = await Feedback.create({
      userName,
      userEmail,
      companyName,
      category,
      text,
      source,
      tags,
      sentiment: sentimentAnalysis.sentiment,
      score: sentimentAnalysis.score,
      status: 'new',
    });
    
    res.status(201).json({
      message: 'Feedback created successfully',
      feedback,
    });
  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update feedback status
export const updateFeedbackStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const feedback = await Feedback.findById(id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    feedback.status = status;
    await feedback.save();
    
    res.status(200).json({
      message: 'Feedback status updated successfully',
      feedback,
    });
  } catch (error) {
    console.error('Update feedback status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a response to feedback
export const addResponse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const feedback = await Feedback.findById(id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    feedback.responses = feedback.responses || [];
    feedback.responses.push({
      userId,
      text,
      createdAt: new Date(),
    });
    
    feedback.status = 'responded';
    await feedback.save();
    
    res.status(200).json({
      message: 'Response added successfully',
      feedback,
    });
  } catch (error) {
    console.error('Add response error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
