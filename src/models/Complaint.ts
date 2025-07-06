import mongoose from 'mongoose';

const fileAttachmentSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  processedUrl: {
    type: String
  }
}, { _id: false });

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Product', 'Service', 'Support', 'Technical', 'Billing'],
    default: 'Support'
  },
  priority: {
    type: String,
    required: [true, 'Priority is required'],
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  dateSubmitted: {
    type: Date,
    default: Date.now
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  attachments: {
    type: [fileAttachmentSchema],
    default: []
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
complaintSchema.index({ status: 1, priority: 1 });
complaintSchema.index({ dateSubmitted: -1 });
complaintSchema.index({ submittedBy: 1 });

const Complaint = mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema);

export default Complaint; 