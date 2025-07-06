import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';

// For Vercel deployment, we'll use a simple approach
// In production, you should use a proper cloud storage service like AWS S3, Cloudinary, etc.

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;

// File validation
const validateFile = (file: File) => {
  const errors: string[] = [];

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }

  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File size ${file.size} exceeds maximum allowed size of ${MAX_FILE_SIZE}`);
  }

  return errors;
};

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticateUser(request);
    if (authResult) {
      return authResult;
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_FILES} files allowed` },
        { status: 400 }
      );
    }

    const uploadedFiles = [];
    const errors = [];

    for (const file of files) {
      try {
        // Validate file
        const validationErrors = validateFile(file);
        if (validationErrors.length > 0) {
          errors.push(`${file.name}: ${validationErrors.join(', ')}`);
          continue;
        }

        // For Vercel deployment, we'll store file info in the database
        // and return a mock URL. In production, upload to cloud storage.
        const fileInfo = {
          originalName: file.name,
          filename: `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`,
          mimetype: file.type,
          size: file.size,
          // Mock URL for demonstration - in production, this would be a real cloud storage URL
          url: `https://example.com/uploads/${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`,
          uploadedAt: new Date().toISOString()
        };

        uploadedFiles.push(fileInfo);

      } catch (error) {
        console.error('File upload error:', error);
        errors.push(`${file.name}: Upload failed`);
      }
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json(
        { error: 'No files were uploaded successfully', details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles,
      errors: errors.length > 0 ? errors : undefined,
      note: 'File uploads are simulated for Vercel deployment. In production, implement cloud storage.'
    });

  } catch (error) {
    console.error('Upload route error:', error);
    return NextResponse.json(
      { error: 'File upload failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticateUser(request);
    if (authResult) {
      return authResult;
    }

    const { filename } = await request.json();

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }

    // For Vercel deployment, we'll just return success
    // In production, delete from cloud storage
    return NextResponse.json({
      message: 'File deleted successfully',
      note: 'File deletion is simulated for Vercel deployment.'
    });

  } catch (error) {
    console.error('File deletion error:', error);
    return NextResponse.json(
      { error: 'File deletion failed' },
      { status: 500 }
    );
  }
} 