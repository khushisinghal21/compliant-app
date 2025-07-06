import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Complaint from '@/models/Complaint';
import { sendStatusUpdateEmail } from '@/lib/email';
import { requireAdmin } from '@/lib/auth';

// PUT /api/complaints/[id] - Update complaint (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const authResult = await requireAdmin(request);
    if (authResult) return authResult;

    await dbConnect();
    
    const { id } = await params;
    const body = await request.json();
    const { status } = body;
    
    // Validate complaint ID
    if (!id) {
      return NextResponse.json(
        { error: 'Complaint ID is required' },
        { status: 400 }
      );
    }
    
    // Find the existing complaint to get the old status
    const existingComplaint = await Complaint.findById(id).populate('submittedBy', 'name email');
    if (!existingComplaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }
    
    const oldStatus = existingComplaint.status;
    
    // Validate status if provided
    if (status) {
      const validStatuses = ['Pending', 'In Progress', 'Resolved'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        );
      }
    }
    
    // Update the complaint
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true }
    ).populate('submittedBy', 'name email');
    
    if (!updatedComplaint) {
      return NextResponse.json(
        { error: 'Failed to update complaint' },
        { status: 500 }
      );
    }
    
    // Send email notification if status changed
    if (status && status !== oldStatus) {
      sendStatusUpdateEmail({
        title: updatedComplaint.title,
        description: updatedComplaint.description,
        category: updatedComplaint.category,
        priority: updatedComplaint.priority,
        status: updatedComplaint.status
      }, oldStatus);
    }
    
    return NextResponse.json(updatedComplaint);
  } catch (error) {
    console.error('Error updating complaint:', error);
    return NextResponse.json(
      { error: 'Failed to update complaint' },
      { status: 500 }
    );
  }
}

// DELETE /api/complaints/[id] - Delete complaint (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const authResult = await requireAdmin(request);
    if (authResult) return authResult;

    await dbConnect();
    
    const { id } = await params;
    
    // Validate complaint ID
    if (!id) {
      return NextResponse.json(
        { error: 'Complaint ID is required' },
        { status: 400 }
      );
    }
    
    // Check if complaint exists
    const existingComplaint = await Complaint.findById(id);
    if (!existingComplaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }
    
    // Delete the complaint
    await Complaint.findByIdAndDelete(id);
    
    return NextResponse.json(
      { message: 'Complaint deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting complaint:', error);
    return NextResponse.json(
      { error: 'Failed to delete complaint' },
      { status: 500 }
    );
  }
} 