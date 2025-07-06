import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import { upload, processImage, generateThumbnail, validateFile, getFileInfo, deleteFile } from '@/lib/upload';
import { UPLOAD_CONFIG } from '@/lib/upload';
import fs from 'fs/promises';

// Configure multer for this route
const uploadMiddleware = upload.array('files', UPLOAD_CONFIG.MAX_FILES);

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticateUser(request);
    if (authResult) {
      return authResult;
    }

    // Handle file upload using multer
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    if (files.length > UPLOAD_CONFIG.MAX_FILES) {
      return NextResponse.json(
        { error: `Maximum ${UPLOAD_CONFIG.MAX_FILES} files allowed` },
        { status: 400 }
      );
    }

    const uploadedFiles = [];
    const errors = [];

    for (const file of files) {
      try {
        // Validate file
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const mockFile = {
          originalname: file.name,
          mimetype: file.type,
          size: file.size,
          buffer: fileBuffer
        } as any;

        const validationErrors = validateFile(mockFile);
        if (validationErrors.length > 0) {
          errors.push(`${file.name}: ${validationErrors.join(', ')}`);
          continue;
        }

        // Save file to disk
        const uploadsDir = process.cwd() + '/public/uploads';
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
        const filePath = `${uploadsDir}/${filename}`;
        
        await fs.writeFile(filePath, fileBuffer);

        // Process file info
        const fileInfo: any = {
          originalName: file.name,
          filename,
          mimetype: file.type,
          size: file.size,
          path: filePath,
          url: `/uploads/${filename}`
        };

        // Process images if applicable
        if (file.type.startsWith('image/')) {
          try {
            // Generate thumbnail
            const thumbnailPath = await generateThumbnail(filePath);
            const thumbnailUrl = thumbnailPath.replace(process.cwd() + '/public', '');
            fileInfo.thumbnailUrl = thumbnailUrl;

            // Process image for web optimization
            const processedPath = await processImage(filePath, {
              width: 800,
              height: 600,
              quality: 80,
              format: 'jpeg'
            });
            const processedUrl = processedPath.replace(process.cwd() + '/public', '');
            fileInfo.processedUrl = processedUrl;
          } catch (processingError) {
            console.error('Image processing failed:', processingError);
            // Continue without processed versions
          }
        }

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
      errors: errors.length > 0 ? errors : undefined
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

    const filePath = `${process.cwd()}/public/uploads/${filename}`;
    const deleted = await deleteFile(filePath);

    if (!deleted) {
      return NextResponse.json(
        { error: 'File not found or could not be deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('File deletion error:', error);
    return NextResponse.json(
      { error: 'File deletion failed' },
      { status: 500 }
    );
  }
} 