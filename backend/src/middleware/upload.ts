import multer from 'multer';
import path from 'path';
import fs from 'fs';

export interface UploadConfig {
  destination: string;
  allowedMimeTypes?: string[];
  maxFileSize?: number; // in bytes
  fieldName?: string;
  fileFilter?: (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => void;
}

export class UploadMiddleware {
  private static createDirectory(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  private static generateUniqueFilename(originalname: string): string {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    return `file-${uniqueSuffix}${path.extname(originalname)}`;
  }

  static createUploadMiddleware(config: UploadConfig) {
    const {
      destination,
      allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxFileSize = 5 * 1024 * 1024, // 5MB default
      fieldName = 'file',
      fileFilter
    } = config;

    // Create upload directory
    this.createDirectory(destination);

    // Configure storage
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, destination);
      },
      filename: (req, file, cb) => {
        const uniqueFilename = this.generateUniqueFilename(file.originalname);
        cb(null, uniqueFilename);
      }
    });

    // Default file filter
    const defaultFileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Only ${allowedMimeTypes.join(', ')} files are allowed`));
      }
    };

    // Configure multer
    const upload = multer({
      storage: storage,
      fileFilter: fileFilter || defaultFileFilter,
      limits: {
        fileSize: maxFileSize
      }
    });

    return upload.single(fieldName);
  }

  // Pre-configured upload middlewares for common use cases
  static imageUpload(fieldName: string = 'image', maxSize: number = 5 * 1024 * 1024) {
    return this.createUploadMiddleware({
      destination: path.join(__dirname, '../../uploads/images'),
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxFileSize: maxSize,
      fieldName
    });
  }

  static documentUpload(fieldName: string = 'document', maxSize: number = 10 * 1024 * 1024) {
    return this.createUploadMiddleware({
      destination: path.join(__dirname, '../../uploads/documents'),
      allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      maxFileSize: maxSize,
      fieldName
    });
  }

  static avatarUpload(fieldName: string = 'avatar', maxSize: number = 2 * 1024 * 1024) {
    return this.createUploadMiddleware({
      destination: path.join(__dirname, '../../uploads/avatars'),
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
      maxFileSize: maxSize,
      fieldName
    });
  }

  static departmentImageUpload(fieldName: string = 'image', maxSize: number = 5 * 1024 * 1024) {
    return this.createUploadMiddleware({
      destination: path.join(__dirname, '../../uploads/departments'),
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxFileSize: maxSize,
      fieldName
    });
  }

  static newsImageUpload(fieldName: string = 'image', maxSize: number = 5 * 1024 * 1024) {
    return this.createUploadMiddleware({
      destination: path.join(__dirname, '../../uploads/news'),
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxFileSize: maxSize,
      fieldName
    });
  }

  static doctorImageUpload(fieldName: string = 'image', maxSize: number = 5 * 1024 * 1024) {
    return this.createUploadMiddleware({
      destination: path.join(__dirname, '../../uploads/doctors'),
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxFileSize: maxSize,
      fieldName
    });
  }

  static patientImageUpload(fieldName: string = 'image', maxSize: number = 5 * 1024 * 1024) {
    return this.createUploadMiddleware({
      destination: path.join(__dirname, '../../uploads/patients'),
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxFileSize: maxSize,
      fieldName
    });
  }

  // Multiple file upload middleware
  static multipleImageUpload(fieldName: string = 'images', maxFiles: number = 5, maxSize: number = 5 * 1024 * 1024) {
    const upload = this.createUploadMiddleware({
      destination: path.join(__dirname, '../../uploads/images'),
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxFileSize: maxSize,
      fieldName
    });

    return multer({
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, path.join(__dirname, '../../uploads/images'));
        },
        filename: (req, file, cb) => {
          const uniqueFilename = this.generateUniqueFilename(file.originalname);
          cb(null, uniqueFilename);
        }
      }),
      fileFilter: (req, file, cb) => {
        if (['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed'));
        }
      },
      limits: {
        fileSize: maxSize,
        files: maxFiles
      }
    }).array(fieldName, maxFiles);
  }

  // Error handling middleware
  static handleUploadError(error: any, req: any, res: any, next: any) {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          status: false,
          message: 'File too large. Please upload a smaller file.'
        });
      }
      if (error.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          status: false,
          message: 'Too many files. Please upload fewer files.'
        });
      }
      if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          status: false,
          message: 'Unexpected file field.'
        });
      }
    }

    if (error.message.includes('Only')) {
      return res.status(400).json({
        status: false,
        message: error.message
      });
    }

    return res.status(500).json({
      status: false,
      message: 'File upload failed. Please try again.'
    });
  }

  // Utility function to get file URL
  static getFileUrl(filename: string, uploadType: string = 'images'): string {
    return `/uploads/${uploadType}/${filename}`;
  }

  // Utility function to delete file
  static deleteFile(filepath: string): boolean {
    try {
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }
} 