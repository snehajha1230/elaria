import express from 'express';
import Track from '../models/Track.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import axios from 'axios';

dotenv.config();

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create uploads directory if it doesn't exist
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    if (file.fieldname === 'audioFile') {
      const audioDir = 'uploads/audio/';
      if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
      }
      cb(null, audioDir);
    } else if (file.fieldname === 'coverImage') {
      const coverDir = 'uploads/covers/';
      if (!fs.existsSync(coverDir)) {
        fs.mkdirSync(coverDir, { recursive: true });
      }
      cb(null, coverDir);
    } else {
      cb(new Error('Invalid fieldname'), false);
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter for multer
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'audioFile') {
    // Allow audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'), false);
    }
  } else if (file.fieldname === 'coverImage') {
    // Allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  } else {
    cb(new Error('Invalid fieldname'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for audio files
  }
});

// Middleware to verify user token and attach userId
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Helper function to extract YouTube video ID
function extractYouTubeId(url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

// Helper function to extract Spotify track ID
function extractSpotifyId(url) {
  const regExp = /spotify\.com\/track\/([a-zA-Z0-9]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

// @route   POST /api/tracks/fetch-info
// @desc    Fetch track info from YouTube or Spotify
router.post('/fetch-info', verifyToken, async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    let trackInfo = {};
    
    // YouTube URL handling
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = extractYouTubeId(url);
      if (videoId) {
        trackInfo = await fetchYouTubeData(videoId);
      }
    } 
    // Spotify URL handling
    else if (url.includes('spotify.com')) {
      const trackId = extractSpotifyId(url);
      if (trackId) {
        trackInfo = await fetchSpotifyData(trackId);
      }
    }

    res.json(trackInfo);
  } catch (error) {
    console.error('Error fetching track info:', error);
    res.status(500).json({ error: 'Failed to fetch track information' });
  }
});

// Fetch data from YouTube
async function fetchYouTubeData(videoId) {
  try {
    // You'll need to use the YouTube Data API
    // This requires an API key from Google Cloud Console
    if (!process.env.YOUTUBE_API_KEY) {
      console.warn('YouTube API key not configured');
      return {};
    }
    
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${process.env.YOUTUBE_API_KEY}`
    );
    
    if (response.data.items && response.data.items.length > 0) {
      const snippet = response.data.items[0].snippet;
      return {
        title: snippet.title,
        artist: snippet.channelTitle,
        coverUrl: snippet.thumbnails.maxres?.url || snippet.thumbnails.high?.url || snippet.thumbnails.default?.url
      };
    }
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
  }
  
  return {};
}

// Fetch data from Spotify
async function fetchSpotifyData(trackId) {
  try {
    // You'll need to use the Spotify Web API
    // This requires client credentials flow
    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      console.warn('Spotify credentials not configured');
      return {};
    }
    
    const authResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
        }
      }
    );
    
    const accessToken = authResponse.data.access_token;
    
    const trackResponse = await axios.get(
      `https://api.spotify.com/v1/tracks/${trackId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
    
    const track = trackResponse.data;
    return {
      title: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      coverUrl: track.album.images[0]?.url
    };
  } catch (error) {
    console.error('Error fetching Spotify data:', error);
  }
  
  return {};
}

// @route   POST /api/tracks
// @desc    Add new track (with optional file uploads)
router.post('/', verifyToken, upload.fields([
  { name: 'audioFile', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, artist, coverUrl, trackUrl, isPublic } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Check if either trackUrl or audioFile is provided
    if (!trackUrl && (!req.files || !req.files.audioFile)) {
      return res.status(400).json({ message: 'Either track URL or audio file is required' });
    }

    // Check if either coverUrl or coverImage is provided
    if (!coverUrl && (!req.files || !req.files.coverImage)) {
      return res.status(400).json({ message: 'Either cover URL or cover image is required' });
    }

    const trackData = {
      user: req.userId,
      title,
      artist: artist || '',
      isPublic: isPublic !== undefined ? isPublic : true
    };

    // Handle track URL or file
    if (trackUrl) {
      trackData.trackUrl = trackUrl;
    } else if (req.files && req.files.audioFile) {
      trackData.audioFile = req.files.audioFile[0].filename;
    }

    // Handle cover URL or file
    if (coverUrl) {
      trackData.coverUrl = coverUrl;
    } else if (req.files && req.files.coverImage) {
      trackData.coverImage = req.files.coverImage[0].filename;
    }

    const newTrack = new Track(trackData);
    const saved = await newTrack.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error saving track:', err);
    
    // Clean up uploaded files if there was an error
    if (req.files) {
      if (req.files.audioFile) {
        fs.unlink(req.files.audioFile[0].path, () => {});
      }
      if (req.files.coverImage) {
        fs.unlink(req.files.coverImage[0].path, () => {});
      }
    }
    
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large' });
      }
    }
    
    res.status(500).json({ message: 'Server error while saving track' });
  }
});

// @route   PUT /api/tracks/:id
// @desc    Update a track by ID (with optional file uploads)
router.put('/:id', verifyToken, upload.fields([
  { name: 'audioFile', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, artist, coverUrl, trackUrl, isPublic } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Find the existing track
    const existingTrack = await Track.findOne({ _id: req.params.id, user: req.userId });
    if (!existingTrack) {
      return res.status(404).json({ message: 'Track not found' });
    }

    const updateData = {
      title,
      artist: artist || '',
      isPublic: isPublic !== undefined ? isPublic : true
    };

    // Handle track URL or file
    if (trackUrl) {
      updateData.trackUrl = trackUrl;
      // If switching from file to URL, remove the old file
      if (existingTrack.audioFile) {
        const oldFilePath = path.join('uploads/audio/', existingTrack.audioFile);
        fs.unlink(oldFilePath, () => {});
        updateData.audioFile = undefined;
      }
    } else if (req.files && req.files.audioFile) {
      updateData.audioFile = req.files.audioFile[0].filename;
      // If switching from URL to file, remove the URL
      if (existingTrack.trackUrl) {
        updateData.trackUrl = undefined;
      }
      // Remove the old file if it exists
      if (existingTrack.audioFile) {
        const oldFilePath = path.join('uploads/audio/', existingTrack.audioFile);
        fs.unlink(oldFilePath, () => {});
      }
    }

    // Handle cover URL or file
    if (coverUrl) {
      updateData.coverUrl = coverUrl;
      // If switching from file to URL, remove the old file
      if (existingTrack.coverImage) {
        const oldFilePath = path.join('uploads/covers/', existingTrack.coverImage);
        fs.unlink(oldFilePath, () => {});
        updateData.coverImage = undefined;
      }
    } else if (req.files && req.files.coverImage) {
      updateData.coverImage = req.files.coverImage[0].filename;
      // If switching from URL to file, remove the URL
      if (existingTrack.coverUrl) {
        updateData.coverUrl = undefined;
      }
      // Remove the old file if it exists
      if (existingTrack.coverImage) {
        const oldFilePath = path.join('uploads/covers/', existingTrack.coverImage);
        fs.unlink(oldFilePath, () => {});
      }
    }

    const track = await Track.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updateData,
      { new: true }
    );

    res.status(200).json(track);
  } catch (err) {
    console.error('Error updating track:', err);
    
    // Clean up uploaded files if there was an error
    if (req.files) {
      if (req.files.audioFile) {
        fs.unlink(req.files.audioFile[0].path, () => {});
      }
      if (req.files.coverImage) {
        fs.unlink(req.files.coverImage[0].path, () => {});
      }
    }
    
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large' });
      }
    }
    
    res.status(500).json({ message: 'Server error while updating track' });
  }
});

// @route   GET /api/tracks
// @desc    Get all tracks for the logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const tracks = await Track.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(tracks);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching tracks' });
  }
});

// @route   GET /api/tracks/public/:userId
// @desc    Get public tracks for a specific user
router.get('/public/:userId', async (req, res) => {
  try {
    const tracks = await Track.find({ 
      user: req.params.userId,
      isPublic: true 
    }).sort({ createdAt: -1 });
    
    res.status(200).json(tracks);
  } catch (err) {
    console.error('Error fetching public tracks:', err);
    res.status(500).json({ message: 'Server error while fetching public tracks' });
  }
});

// @route   DELETE /api/tracks/:id
// @desc    Delete a track by ID
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const track = await Track.findOneAndDelete({ _id: req.params.id, user: req.userId });

    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    // Delete associated files
    if (track.audioFile) {
      const audioPath = path.join('uploads/audio/', track.audioFile);
      fs.unlink(audioPath, () => {});
    }
    
    if (track.coverImage) {
      const coverPath = path.join('uploads/covers/', track.coverImage);
      fs.unlink(coverPath, () => {});
    }

    res.status(200).json({ message: 'Track deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error while deleting track' });
  }
});

// Serve uploaded files statically
router.use('/uploads', express.static('uploads'));

export default router;