import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: '' },
  sku: { type: String, default: '', index: true },
  category: { type: String, required: true, trim: true },
  brand: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  images: { type: [String], default: [] },
  specifications: { type: Schema.Types.Mixed, default: {} },
  stockQuantity: { type: Number, min: 0 },
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const categorySchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const serviceSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, min: 0, default: null },
  isActive: { type: Boolean, default: true },
});

const settingsSchema = new Schema({
  id: { type: String, required: true, unique: true },
  businessName: { type: String, required: true },
  logo: { type: String, default: '' },
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  openingHours: { type: Schema.Types.Mixed, default: '' },
  closingHours: { type: Schema.Types.Mixed, default: '8:00 PM' },
  socialLinks: { type: Schema.Types.Mixed, default: {} },
});

const enquirySchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'archived'], default: 'new' },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const ProductModel = mongoose.models.CatalogueProduct || mongoose.model('CatalogueProduct', productSchema);
export const CategoryModel = mongoose.models.CatalogueCategory || mongoose.model('CatalogueCategory', categorySchema);
export const ServiceModel = mongoose.models.CatalogueService || mongoose.model('CatalogueService', serviceSchema);
export const BusinessSettingsModel = mongoose.models.BusinessSettings || mongoose.model('BusinessSettings', settingsSchema);
export const ContactEnquiryModel = mongoose.models.ContactEnquiry || mongoose.model('ContactEnquiry', enquirySchema);
