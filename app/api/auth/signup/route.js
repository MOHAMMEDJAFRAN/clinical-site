import connectDB from '@/backend/lib/mongodb';
import UserDetails from '@/backend/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    await connectDB();

    const { full_name, username, phone_number, date_of_birth, password, role } = await request.json();

    // Validate input data
    if (!username || !password || !full_name) {
      return new Response(JSON.stringify({ 
        success: false,
        message: 'Username, password, and full name are required'
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check for existing user by username or email (if username is email)
    const query = { username };
    if (username.includes('@')) {
      query.$or = [
        { username },
        { email: username }
      ];
    }

    const existingUser = await UserDetails.findOne(query);

    if (existingUser) {
      const message = existingUser.username === username 
        ? 'Username already exists' 
        : 'Email already exists';
      return new Response(JSON.stringify({ 
        success: false,
        message
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds

    // Create new user document
    const userData = {
      full_name,
      username,
      phone_number,
      date_of_birth: new Date(date_of_birth),
      password: hashedPassword,
      role: role || 'patient', // Default to patient if not specified
      is_active: true,
      is_verified: false,
      created_at: new Date(),
      updated_at: new Date()
    };

    // Only add email if username is actually an email
    userData.username = username.toLowerCase();
    if (username.includes('@')) {
      userData.email = username.toLowerCase();
    }

    const newUser = new UserDetails(userData);
    await newUser.save();

    // Return success without sensitive data
    return new Response(JSON.stringify({ 
      success: true,
      message: 'User registered successfully',
      userId: newUser._id,
      username: newUser.username
    }), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle duplicate key error specifically
    if (error.code === 11000) {
      return new Response(JSON.stringify({ 
        success: false,
        message: 'Username or email already exists'
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: false,
      message: 'Internal server error. Please try again later.'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}