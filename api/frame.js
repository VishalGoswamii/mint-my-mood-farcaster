// =============================================================================
// FILE: /api/frame.js
// PURPOSE: Handles Frame interactions and button clicks
// =============================================================================

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    const { buttonIndex, fid, frameUrl, inputText } = body;
    
    console.log('Frame interaction:', { buttonIndex, fid, frameUrl });
    
    // Define moods mapping
    const moodMapping = {
      1: { name: 'Happy', emoji: '😊' },
      2: { name: 'Excited', emoji: '🤩' },
      3: { name: 'Calm', emoji: '😌' },
      4: { name: 'More', emoji: '🤔' } // This will show more options
    };
    
    // Get current step from URL or default to mood selection
    const urlParams = new URLSearchParams(frameUrl?.split('?')[1] || '');
    const currentStep = urlParams.get('step') || 'mood-selection';
    const selectedMood = urlParams.get('mood');
    
    if (currentStep === 'mood-selection') {
      if (buttonIndex === 4) {
        // "More..." button clicked - show additional moods
        return res.status(200).json({
          "fc:frame": "vNext",
          "fc:frame:image": `${getBaseUrl(req)}/api/frame-image?step=more-moods`,
          "fc:frame:button:1": "😴 Tired",
          "fc:frame:button:2": "😰 Anxious", 
          "fc:frame:button:3": "🙏 Grateful",
          "fc:frame:button:4": "🎨 Creative",
          "fc:frame:post_url": `${getBaseUrl(req)}/api/frame?step=more-moods`
        });
      } else {
        // Mood selected - go to privacy selection
        const mood = moodMapping[buttonIndex];
        return res.status(200).json({
          "fc:frame": "vNext",
          "fc:frame:image": `${getBaseUrl(req)}/api/frame-image?step=privacy-selection&mood=${mood.name}`,
          "fc:frame:button:1": "🌍 Public",
          "fc:frame:button:2": "🥸 Anonymous",
          "fc:frame:button:3": "🔒 Private",
          "fc:frame:button:4": "← Back",
          "fc:frame:post_url": `${getBaseUrl(req)}/api/frame?step=privacy-selection&mood=${mood.name}`
        });
      }
    } else if (currentStep === 'more-moods') {
      const moreMoodMapping = {
        1: { name: 'Tired', emoji: '😴' },
        2: { name: 'Anxious', emoji: '😰' },
        3: { name: 'Grateful', emoji: '🙏' },
        4: { name: 'Creative', emoji: '🎨' }
      };
      
      const mood = moreMoodMapping[buttonIndex];
      return res.status(200).json({
        "fc:frame": "vNext",
        "fc:frame:image": `${getBaseUrl(req)}/api/frame-image?step=privacy-selection&mood=${mood.name}`,
        "fc:frame:button:1": "🌍 Public",
        "fc:frame:button:2": "🥸 Anonymous", 
        "fc:frame:button:3": "🔒 Private",
        "fc:frame:button:4": "← Back",
        "fc:frame:post_url": `${getBaseUrl(req)}/api/frame?step=privacy-selection&mood=${mood.name}`
      });
    } else if (currentStep === 'privacy-selection') {
      if (buttonIndex === 4) {
        // Back button - return to mood selection
        return res.status(200).json({
          "fc:frame": "vNext",
          "fc:frame:image": `${getBaseUrl(req)}/api/frame-image?step=mood-selection`,
          "fc:frame:button:1": "😊 Happy",
          "fc:frame:button:2": "🤩 Excited",
          "fc:frame:button:3": "😌 Calm", 
          "fc:frame:button:4": "🤔 More...",
          "fc:frame:post_url": `${getBaseUrl(req)}/api/frame`
        });
      } else {
        // Privacy selected - save mood and show success
        const privacyOptions = ['Public', 'Anonymous', 'Private'];
        const selectedPrivacy = privacyOptions[buttonIndex - 1];
        
        // Here you would save the mood to your database
        await saveMoodToDatabase(fid, selectedMood, selectedPrivacy);
        
        // Show success screen
        return res.status(200).json({
          "fc:frame": "vNext",
          "fc:frame:image": `${getBaseUrl(req)}/api/frame-image?step=success&mood=${selectedMood}`,
          "fc:frame:button:1": "🪙 Mint NFT",
          "fc:frame:button:2": "📱 New Mood",
          "fc:frame:button:3": "🔗 Visit App",
          "fc:frame:post_url": `${getBaseUrl(req)}/api/frame?step=success&mood=${selectedMood}`
        });
      }
    } else if (currentStep === 'success') {
      if (buttonIndex === 1) {
        // Mint NFT
        return res.status(200).json({
          "fc:frame": "vNext", 
          "fc:frame:image": `${getBaseUrl(req)}/api/frame-image?step=mint-success&mood=${selectedMood}`,
          "fc:frame:button:1": "📱 New Mood",
          "fc:frame:button:2": "🔗 Visit App",
          "fc:frame:post_url": `${getBaseUrl(req)}/api/frame?step=mint-success&mood=${selectedMood}`
        });
      } else if (buttonIndex === 2) {
        // New Mood - restart
        return res.status(200).json({
          "fc:frame": "vNext",
          "fc:frame:image": `${getBaseUrl(req)}/api/frame-image?step=mood-selection`,
          "fc:frame:button:1": "😊 Happy",
          "fc:frame:button:2": "🤩 Excited", 
          "fc:frame:button:3": "😌 Calm",
          "fc:frame:button:4": "🤔 More...",
          "fc:frame:post_url": `${getBaseUrl(req)}/api/frame`
        });
      } else if (buttonIndex === 3) {
        // Visit App - redirect
        return res.status(302).redirect(`${getBaseUrl(req)}`);
      }
    }
    
    // Default fallback
    return res.status(200).json({
      "fc:frame": "vNext",
      "fc:frame:image": `${getBaseUrl(req)}/api/frame-image`,
      "fc:frame:button:1": "😊 Happy",
      "fc:frame:button:2": "🤩 Excited",
      "fc:frame:button:3": "😌 Calm",
      "fc:frame:button:4": "🤔 More...",
      "fc:frame:post_url": `${getBaseUrl(req)}/api/frame`
    });
    
  } catch (error) {
    console.error('Frame handler error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Helper function to get base URL
function getBaseUrl(req) {
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `${protocol}://${host}`;
}

// Mock database function - replace with your actual database logic
async function saveMoodToDatabase(fid, mood, privacy) {
  // TODO: Implement your database logic here
  console.log('Saving mood:', { fid, mood, privacy, timestamp: new Date() });
  
  // Example: Save to database
  // await db.moods.create({
  //   farcaster_id: fid,
  //   mood: mood,
  //   privacy: privacy,
  //   created_at: new Date()
  // });
}

// =============================================================================
// SETUP INSTRUCTIONS:
// 
// 1. Create these two files in your /api folder:
//    - /api/frame-image.js
//    - /api/frame.js
//
// 2. Deploy to Vercel
//
// 3. Update your HTML meta tags with your actual domain:
//    <meta property="fc:frame:image" content="https://YOUR-DOMAIN.vercel.app/api/frame-image" />
//    <meta property="fc:frame:post_url" content="https://YOUR-DOMAIN.vercel.app/api/frame" />
//
// 4. Test your Frame:
//    - Share your URL in Warpcast
//    - Or use a Frame validator tool
//
// 5. Optional: Add database integration in saveMoodToDatabase function
// =============================================================================
