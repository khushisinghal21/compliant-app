import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Complaint from '@/models/Complaint';
import { sendNewComplaintEmail } from '@/lib/email';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth';

// GET /api/complaints - Fetch complaints based on user role
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    if (authResult) return authResult;

    const authenticatedRequest = request as AuthenticatedRequest;
    const user = authenticatedRequest.user!;

    await dbConnect();
    
    let complaints;
    
    if (user.role === 'admin') {
      // Admin can see all complaints
      complaints = await Complaint.find({})
        .populate('submittedBy', 'name email')
        .sort({ dateSubmitted: -1 })
        .lean();
    } else {
      // Regular users can only see their own complaints
      complaints = await Complaint.find({ submittedBy: user.userId })
        .populate('submittedBy', 'name email')
        .sort({ dateSubmitted: -1 })
        .lean();
    }
    
    return NextResponse.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json(
      { error: 'Failed to fetch complaints' },
      { status: 500 }
    );
  }
}

// POST /api/complaints - Create new complaint (Authenticated users)
export async function POST(request: NextRequest) {
  try {
    // Check user authentication
    const authResult = await requireAuth(request);
    if (authResult) return authResult;

    const authenticatedRequest = request as AuthenticatedRequest;
    const userId = authenticatedRequest.user!.userId;

    await dbConnect();
    
    const body = await request.json();
    const { title, description, category, priority, attachments = [] } = body;
    
    // Validate required fields
    if (!title || !description || !category || !priority) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate category and priority
    const validCategories = ['Product', 'Service', 'Support', 'Technical', 'Billing'];
    const validPriorities = ['Low', 'Medium', 'High'];
    
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }
    
    if (!validPriorities.includes(priority)) {
      return NextResponse.json(
        { error: 'Invalid priority' },
        { status: 400 }
      );
    }
    
    // Validate attachments if provided
    if (attachments && !Array.isArray(attachments)) {
      return NextResponse.json(
        { error: 'Attachments must be an array' },
        { status: 400 }
      );
    }
    
    // Create new complaint with user reference and attachments
    const complaint = new Complaint({
      title,
      description,
      category,
      priority,
      status: 'Pending',
      dateSubmitted: new Date(),
      submittedBy: userId,
      attachments: attachments || []
    });
    
    const savedComplaint = await complaint.save();
    
    // Populate user info for email
    const populatedComplaint = await Complaint.findById(savedComplaint._id)
      .populate('submittedBy', 'name email');
    
    // Send email notification (don't await to avoid blocking the response)
    sendNewComplaintEmail({
      title: savedComplaint.title,
      description: savedComplaint.description,
      category: savedComplaint.category,
      priority: savedComplaint.priority,
      attachments: savedComplaint.attachments
    });
    
    return NextResponse.json(populatedComplaint, { status: 201 });
  } catch (error) {
    console.error('Error creating complaint:', error);
    return NextResponse.json(
      { error: 'Failed to create complaint' },
      { status: 500 }
    );
  }
} 