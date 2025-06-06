// =============================================================================
// FILE: /api/frame-image.js
// PURPOSE: Generates the Frame image (955x500px, 1.91:1 aspect ratio)
// =============================================================================

export default async function handler(req, res) {
  const { mood, step = 'mood-selection' } = req.query;
  
  // Set proper headers for image response
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, immutable, no-transform, max-age=31536000');
  
  try {
    // Generate SVG image
    const svg = generateFrameImage(step, mood);
    
    // For production, you'd convert SVG to PNG here
    // For now, return SVG (most Frame clients support it)
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(200).send(svg);
  } catch (error) {
    console.error('Error generating frame image:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
}

function generateFrameImage(step, selectedMood) {
  const moods = [
    { emoji: '😊', name: 'Happy' },
    { emoji: '🤩', name: 'Excited' },
    { emoji: '😌', name: 'Calm' },
    { emoji: '🤔', name: 'Thoughtful' },
    { emoji: '😴', name: 'Tired' },
    { emoji: '😰', name: 'Anxious' },
    { emoji: '🙏', name: 'Grateful' },
    { emoji: '🎨', name: 'Creative' },
    { emoji: '💪', name: 'Motivated' }
  ];
  
  if (step === 'mood-selection') {
    return `
      <svg width="955" height="500" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Background -->
        <rect width="955" height="500" fill="url(#bg)"/>
        
        <!-- Title Section -->
        <text x="477.5" y="80" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white">
          🎭 Mint My Mood
        </text>
        
        <text x="477.5" y="120" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="rgba(255,255,255,0.9)">
          How are you feeling today?
        </text>
        
        <!-- Mood Grid Preview -->
        <g transform="translate(277.5, 160)">
          <!-- Row 1 -->
          <g transform="translate(0, 0)">
            <circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
            <text x="50" y="65" font-size="32" text-anchor="middle">😊</text>
          </g>
          <g transform="translate(133, 0)">
            <circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
            <text x="50" y="65" font-size="32" text-anchor="middle">🤩</text>
          </g>
          <g transform="translate(267, 0)">
            <circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
            <text x="50" y="65" font-size="32" text-anchor="middle">😌</text>
          </g>
          <g transform="translate(400, 0)">
            <circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
            <text x="50" y="65" font-size="32" text-anchor="middle">🤔</text>
          </g>
          
          <!-- Row 2 -->
          <g transform="translate(67, 120)">
            <circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
            <text x="50" y="65" font-size="32" text-anchor="middle">😴</text>
          </g>
          <g transform="translate(200, 120)">
            <circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
            <text x="50" y="65" font-size="32" text-anchor="middle">😰</text>
          </g>
          <g transform="translate(333, 120)">
            <circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
            <text x="50" y="65" font-size="32" text-anchor="middle">🙏</text>
          </g>
        </g>
        
        <!-- Instructions -->
        <text x="477.5" y="450" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="rgba(255,255,255,0.8)">
          Choose your mood using the buttons below
        </text>
      </svg>
    `;
  } else if (step === 'privacy-selection') {
    const mood = moods.find(m => m.name.toLowerCase() === selectedMood?.toLowerCase()) || moods[0];
    return `
      <svg width="955" height="500" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Background -->
        <rect width="955" height="500" fill="url(#bg)"/>
        
        <!-- Selected Mood Display -->
        <text x="477.5" y="100" font-size="80" text-anchor="middle">${mood.emoji}</text>
        <text x="477.5" y="150" font-family="Arial, sans-serif" font-size="36" font-weight="bold" text-anchor="middle" fill="white">
          Feeling ${mood.name}
        </text>
        
        <!-- Privacy Options -->
        <text x="477.5" y="220" font-family="Arial, sans-serif" font-size="28" text-anchor="middle" fill="rgba(255,255,255,0.9)">
          Choose your privacy setting:
        </text>
        
        <g transform="translate(177.5, 260)">
          <rect x="0" y="0" width="200" height="60" rx="10" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
          <text x="100" y="25" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="white">🌍 Public</text>
          <text x="100" y="45" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="rgba(255,255,255,0.8)">Visible to everyone</text>
        </g>
        
        <g transform="translate(377.5, 260)">
          <rect x="0" y="0" width="200" height="60" rx="10" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
          <text x="100" y="25" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="white">🥸 Anonymous</text>
          <text x="100" y="45" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="rgba(255,255,255,0.8)">Hide identity</text>
        </g>
        
        <g transform="translate(577.5, 260)">
          <rect x="0" y="0" width="200" height="60" rx="10" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
          <text x="100" y="25" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="white">🔒 Private</text>
          <text x="100" y="45" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="rgba(255,255,255,0.8)">Only for you</text>
        </g>
        
        <text x="477.5" y="450" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="rgba(255,255,255,0.8)">
          Select privacy level for your mood
        </text>
      </svg>
    `;
  } else if (step === 'success') {
    const mood = moods.find(m => m.name.toLowerCase() === selectedMood?.toLowerCase()) || moods[0];
    return `
      <svg width="955" height="500" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Background -->
        <rect width="955" height="500" fill="url(#bg)"/>
        
        <!-- Success Animation -->
        <text x="477.5" y="120" font-size="100" text-anchor="middle">🎉</text>
        <text x="477.5" y="200" font-family="Arial, sans-serif" font-size="42" font-weight="bold" text-anchor="middle" fill="white">
          Mood Shared!
        </text>
        
        <text x="477.5" y="250" font-size="60" text-anchor="middle">${mood.emoji}</text>
        <text x="477.5" y="300" font-family="Arial, sans-serif" font-size="28" text-anchor="middle" fill="rgba(255,255,255,0.9)">
          ${mood.name} mood recorded
        </text>
        
        <text x="477.5" y="380" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="rgba(255,255,255,0.8)">
          Thank you for sharing your mood!
        </text>
        
        <text x="477.5" y="450" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="rgba(255,255,255,0.7)">
          Track your mood journey at mint-my-mood-farcaster.vercel.app
        </text>
      </svg>
    `;
  }
}
