import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import { randomBytes, scryptSync, timingSafeEqual, createHmac } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import mongoose from 'mongoose';
import { BusinessSettingsModel, CategoryModel, ContactEnquiryModel, ProductModel, ServiceModel } from './models.js';

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  sku: string;
  category: string;
  brand?: string;
  price: number;
  images: string[];
  specifications?: Record<string, string>;
  stockQuantity?: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type Enquiry = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'archived';
  createdAt: string;
};

type Service = {
  id: string;
  name: string;
  description: string;
  price: number | null;
  isActive: boolean;
};

type Database = {
  products: Product[];
  categories: Category[];
  services: Service[];
  settings: Record<string, unknown>;
  enquiries: Enquiry[];
};

const initialDatabase: Database = {
  products: [],
  categories: [],
  services: [
    { id: 'black-and-white-printing', name: 'Black-and-white printing', price: null, description: '', isActive: true },
    { id: 'colour-printing', name: 'Colour printing', price: null, description: '', isActive: true },
    { id: 'xerox', name: 'Xerox and photocopying', price: null, description: '', isActive: true },
    { id: 'lamination', name: 'Lamination', price: null, description: '', isActive: true },
    { id: 'spiral-binding', name: 'Spiral binding', price: null, description: '', isActive: true },
    { id: 'photo-printing', name: 'Photo printing', price: null, description: '', isActive: true },
  ],
  settings: {
    businessName: 'S V COPIERS / XEROX',
    address: 'Shop 10, Siddhivinayak Height, Above Ratnaraj Green, Nana Chiloda, New Shahibaug, Ahmedabad, Gujarat 382330, India.',
    phone: '',
    email: '',
    whatsapp: '',
    openingHours: '08:30 AM',
    closingHours: '8:00 PM',
    operationalDays: 'Monday – Saturday, 8:30 AM – 8:00 PM (Sunday, 8:30 AM – 1:00 PM)',
    landmark: '',
    googleMapsQuery: '',
    socialLinks: {},
  },
  enquiries: [],
};

const configuredDataFile = process.env.DATA_FILE || './data/catalogue.json';
const dataFile = path.resolve(process.cwd(), configuredDataFile);
let database: Database;
let pendingWrite: Promise<void> = Promise.resolve();

function cleanMongoDocuments(documents: object[]): Array<Record<string, unknown>> {
  return documents.map((document) => {
    const value: unknown = JSON.parse(JSON.stringify(document));
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('MongoDB returned an invalid catalogue document.');
    }
    const record = value as Record<string, unknown>;
    delete record._id;
    delete record.__v;
    return record;
  });
}

async function loadDatabase(): Promise<void> {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
      const [products, categories, services, settings, enquiries] = await Promise.all([
        ProductModel.find().exec(),
        CategoryModel.find().exec(),
        ServiceModel.find().exec(),
        BusinessSettingsModel.findOne({ id: 'public' }).exec(),
        ContactEnquiryModel.find().sort({ createdAt: -1 }).exec(),
      ]);
      database = {
        products: cleanMongoDocuments(products) as unknown as Product[],
        categories: cleanMongoDocuments(categories) as unknown as Category[],
        services: cleanMongoDocuments(services) as unknown as Service[],
        settings: settings ? cleanMongoDocuments([settings])[0] : initialDatabase.settings,
        enquiries: cleanMongoDocuments(enquiries) as unknown as Enquiry[],
      };
      if (!settings) await persistDatabase();
      console.log('Connected to MongoDB.');
      return;
    } catch (error) {
      console.warn('MongoDB is unavailable. Falling back to local JSON data:', (error as Error).message);
      await mongoose.disconnect().catch(() => undefined);
    }
  }
  try {
    database = { ...initialDatabase, ...JSON.parse(await readFile(dataFile, 'utf8')) };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    database = structuredClone(initialDatabase);
    await persistDatabase();
  }
}

function persistDatabase(): Promise<void> {
  const write = async () => {
    if (mongoose.connection.readyState === 1) {
      const synchronize = async <T extends { id: string }>(model: import('mongoose').Model<T>, items: T[]) => {
        const ids = items.map((item) => item.id);
        await model.deleteMany({ id: { $nin: ids } });
        if (items.length) {
          const operations = items.map((item) => {
            const document = Object.fromEntries(Object.entries(item));
            return { updateOne: { filter: { id: item.id }, update: { $set: document }, upsert: true } };
          }) as Parameters<typeof model.collection.bulkWrite>[0];
          await model.collection.bulkWrite(operations);
        }
      };
      await Promise.all([
        synchronize(ProductModel, database.products),
        synchronize(CategoryModel, database.categories),
        synchronize(ServiceModel, database.services),
        synchronize(ContactEnquiryModel, database.enquiries),
        BusinessSettingsModel.findOneAndUpdate(
          { id: 'public' },
          { $set: { ...database.settings, id: 'public' } },
          { upsert: true, new: true },
        ),
      ]);
      return;
    }
    await mkdir(path.dirname(dataFile), { recursive: true });
    const temporaryFile = `${dataFile}.${process.pid}.tmp`;
    await writeFile(temporaryFile, JSON.stringify(database, null, 2), 'utf8');
    await rename(temporaryFile, dataFile);
  };
  pendingWrite = pendingWrite.then(write, write);
  return pendingWrite;
}

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));

const requestWindows = new Map<string, { count: number; resetAt: number }>();
function rateLimit(limit: number, windowMs: number) {
  return (request: Request, response: Response, next: NextFunction) => {
    const key = `${request.path}:${request.ip}`;
    const now = Date.now();
    let window = requestWindows.get(key);
    if (!window || window.resetAt <= now) {
      window = { count: 0, resetAt: now + windowMs };
      requestWindows.set(key, window);
    }
    window.count += 1;
    if (window.count > limit) {
      response.status(429).json({ error: 'Too many requests. Please try again later.' });
      return;
    }
    next();
  };
}

const adminUsername = process.env.ADMIN_USERNAME || 'admin';
const generatedPassword = !process.env.ADMIN_PASSWORD;
const adminPassword = process.env.ADMIN_PASSWORD || randomBytes(12).toString('base64url');
const tokenSecret = process.env.ADMIN_TOKEN_SECRET || randomBytes(32).toString('hex');
const passwordSalt = randomBytes(16);
const passwordHash = scryptSync(adminPassword, passwordSalt, 64);

function issueToken(): string {
  const payload = Buffer.from(JSON.stringify({ sub: adminUsername, exp: Date.now() + 8 * 60 * 60 * 1000 })).toString('base64url');
  const signature = createHmac('sha256', tokenSecret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function requireAdmin(request: Request, response: Response, next: NextFunction): void {
  const token = request.header('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) {
    response.status(401).json({ error: 'Admin authentication required.' });
    return;
  }
  const [payload, signature] = token.split('.');
  if (!payload || !signature) {
    response.status(401).json({ error: 'Invalid admin token.' });
    return;
  }
  const expected = createHmac('sha256', tokenSecret).update(payload).digest();
  let supplied: Buffer;
  try {
    supplied = Buffer.from(signature, 'base64url');
  } catch {
    response.status(401).json({ error: 'Invalid admin token.' });
    return;
  }
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    response.status(401).json({ error: 'Invalid admin token.' });
    return;
  }
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { sub?: string; exp?: number };
    if (decoded.sub !== adminUsername || !decoded.exp || decoded.exp <= Date.now()) {
      response.status(401).json({ error: 'Admin token has expired.' });
      return;
    }
  } catch {
    response.status(401).json({ error: 'Invalid admin token.' });
    return;
  }
  next();
}

function slugify(value: string): string {
  return value.trim().toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function validText(value: unknown, max = 2000): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max;
}

function validPrice(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function productFrom(body: Record<string, unknown>, existing?: Product): Product | null {
  if (!validText(body.name, 160) || !validText(body.category, 120) || !validPrice(body.price)) return null;
  const now = new Date().toISOString();
  const name = body.name.trim();
  const slug = validText(body.slug, 180) ? slugify(body.slug) : slugify(name);
  if (!slug) return null;
  const images = Array.isArray(body.images) && body.images.every((item) => typeof item === 'string')
    ? body.images.slice(0, 10)
    : typeof body.image === 'string' && body.image ? [body.image] : [];
  const specifications = body.specifications && typeof body.specifications === 'object' && !Array.isArray(body.specifications)
    ? body.specifications as Record<string, string>
    : {};
  return {
    id: existing?.id || randomBytes(12).toString('hex'),
    name,
    slug,
    description: typeof body.description === 'string' ? body.description.trim().slice(0, 5000) : '',
    sku: typeof body.sku === 'string' ? body.sku.trim().slice(0, 80) : '',
    category: body.category.trim(),
    brand: typeof body.brand === 'string' ? body.brand.trim().slice(0, 120) : '',
    price: body.price,
    images,
    specifications,
    stockQuantity: Number.isInteger(body.stockQuantity) && (body.stockQuantity as number) >= 0 ? body.stockQuantity as number : undefined,
    isAvailable: typeof body.isAvailable === 'boolean' ? body.isAvailable : true,
    isFeatured: typeof body.isFeatured === 'boolean' ? body.isFeatured : false,
    isActive: typeof body.isActive === 'boolean' ? body.isActive : true,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
}

function categoryFrom(body: Record<string, unknown>, existing?: Category): Category | null {
  if (!validText(body.name, 120)) return null;
  const name = body.name.trim();
  const slug = validText(body.slug, 140) ? slugify(body.slug) : slugify(name);
  if (!slug) return null;
  const now = new Date().toISOString();
  return {
    id: existing?.id || randomBytes(12).toString('hex'),
    name,
    slug,
    description: typeof body.description === 'string' ? body.description.trim().slice(0, 2000) : '',
    image: typeof body.image === 'string' ? body.image.trim().slice(0, 2000) : '',
    isActive: typeof body.isActive === 'boolean' ? body.isActive : true,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
}

function duplicateSlug(slug: string, items: Array<{ slug: string; id: string }>, currentId?: string): boolean {
  return items.some((item) => item.slug === slug && item.id !== currentId);
}

function asyncRoute(handler: (request: Request, response: Response) => Promise<void>) {
  return (request: Request, response: Response, next: NextFunction) => {
    handler(request, response).catch(next);
  };
}

app.get('/api/v1/health', (_request, response) => response.json({ status: 'ok' }));

app.post('/api/v1/admin/login', rateLimit(8, 15 * 60 * 1000), (request, response) => {
  const { username, password } = request.body || {};
  const candidate = typeof password === 'string' ? scryptSync(password, passwordSalt, 64) : Buffer.alloc(64);
  const valid = typeof username === 'string' && username === adminUsername &&
    candidate.length === passwordHash.length && timingSafeEqual(candidate, passwordHash);
  if (!valid) {
    response.status(401).json({ error: 'Invalid username or password.' });
    return;
  }
  response.json({ token: issueToken(), expiresIn: 28800 });
});

app.get('/api/v1/products', (request, response) => {
  const page = Math.max(1, Number.parseInt(String(request.query.page || '1'), 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(String(request.query.limit || '12'), 10) || 12));
  const search = String(request.query.search || '').trim().toLowerCase();
  const category = String(request.query.category || '').trim().toLowerCase();
  const minPrice = request.query.minPrice === undefined ? 0 : Number(request.query.minPrice);
  const maxPrice = request.query.maxPrice === undefined ? Number.POSITIVE_INFINITY : Number(request.query.maxPrice);
  if (!Number.isFinite(minPrice) || minPrice < 0 || Number.isNaN(maxPrice) || maxPrice < minPrice) {
    response.status(400).json({ error: 'Invalid price range.' });
    return;
  }
  const sort = String(request.query.sort || 'newest');
  if (!['newest', 'name', 'price-asc', 'price-desc'].includes(sort)) {
    response.status(400).json({ error: 'Sort must be newest, name, price-asc, or price-desc.' });
    return;
  }
  let products = database.products.filter((product) =>
    product.isActive && product.name.toLowerCase().includes(search) &&
    (!category || product.category.toLowerCase() === category || database.categories.find((item) => item.slug === category)?.name.toLowerCase() === product.category.toLowerCase()) &&
    product.price >= minPrice && product.price <= maxPrice
  );
  products = [...products].sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name)
    : sort === 'price-asc' ? a.price - b.price
    : sort === 'price-desc' ? b.price - a.price
    : b.createdAt.localeCompare(a.createdAt));
  const total = products.length;
  response.json({ data: products.slice((page - 1) * limit, page * limit), pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

app.get('/api/v1/products/:slug', (request, response) => {
  const product = database.products.find((item) => item.slug === request.params.slug && item.isActive);
  if (!product) {
    response.status(404).json({ error: 'Product not found.' });
    return;
  }
  response.json({ data: product });
});

app.get('/api/v1/categories', (_request, response) => {
  response.json({ data: database.categories.filter((category) => category.isActive) });
});

app.get('/api/v1/categories/:slug', (request, response) => {
  const category = database.categories.find((item) => item.slug === request.params.slug && item.isActive);
  if (!category) {
    response.status(404).json({ error: 'Category not found.' });
    return;
  }
  response.json({ data: { ...category, products: database.products.filter((product) => product.isActive && product.category.toLowerCase() === category.name.toLowerCase()) } });
});

app.get('/api/v1/services', (_request, response) => {
  response.json({ data: database.services.filter((service) => service.isActive !== false) });
});

app.get('/api/v1/settings/public', (_request, response) => {
  response.json({ data: database.settings });
});

app.post('/api/v1/contact', rateLimit(5, 15 * 60 * 1000), asyncRoute(async (request, response) => {
  const { name, email, phone, subject, message } = request.body || {};
  if (!validText(name, 120) || !validText(subject, 160) || !validText(message, 3000) ||
      (email !== undefined && (typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) ||
      (phone !== undefined && (typeof phone !== 'string' || phone.length > 40))) {
    response.status(400).json({ error: 'Enter a valid name, subject, message, and optional contact details.' });
    return;
  }
  const enquiry: Enquiry = {
    id: randomBytes(12).toString('hex'),
    name: name.trim(),
    email: email?.trim(),
    phone: phone?.trim(),
    subject: subject.trim(),
    message: message.trim(),
    status: 'new',
    createdAt: new Date().toISOString(),
  };
  database.enquiries.unshift(enquiry);
  await persistDatabase();
  response.status(201).json({ message: 'Enquiry received.', data: { id: enquiry.id } });
}));

app.use('/api/v1/admin', requireAdmin);

const imageMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const imageExtensions: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

function matchesImageSignature(buffer: Buffer, mimeType: string): boolean {
  if (mimeType === 'image/jpeg') return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (mimeType === 'image/png') return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (mimeType === 'image/gif') return buffer.subarray(0, 6).toString('ascii').match(/^GIF8[79]a$/) !== null;
  if (mimeType === 'image/webp') return buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP';
  return false;
}

app.post(
  '/api/v1/admin/images',
  rateLimit(10, 15 * 60 * 1000),
  express.raw({ type: [...imageMimeTypes], limit: '5mb' }),
  asyncRoute(async (request, response) => {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (!privateKey) {
      response.status(503).json({ error: 'Image uploads are not configured on the server.' });
      return;
    }

    const mimeType = request.header('content-type')?.toLowerCase() || '';
    const fileName = request.query.fileName;
    if (!imageMimeTypes.has(mimeType) || !Buffer.isBuffer(request.body) ||
        request.body.length === 0 || !matchesImageSignature(request.body, mimeType)) {
      response.status(400).json({ error: 'Choose a valid JPEG, PNG, WebP, or GIF image.' });
      return;
    }
    if (typeof fileName !== 'string' || fileName.length > 255) {
      response.status(400).json({ error: 'A valid image file name is required.' });
      return;
    }

    const baseName = fileName.replace(/\.[^.]*$/, '').replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 80) || 'product-image';
    const uploadFileName = `${baseName}${imageExtensions[mimeType]}`;
    const formData = new FormData();
    const imageBytes = new Uint8Array(request.body.length);
    imageBytes.set(request.body);
    formData.append('file', new Blob([imageBytes], { type: mimeType }), uploadFileName);
    formData.append('fileName', uploadFileName);
    formData.append('folder', '/products');

    const imageKitResponse = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${privateKey}:`).toString('base64')}`,
      },
      body: formData,
      signal: AbortSignal.timeout(30_000),
    });
    const imageKitResult: unknown = await imageKitResponse.json().catch(() => null);
    if (!imageKitResponse.ok) {
      console.error(`ImageKit upload failed with status ${imageKitResponse.status}.`);
      response.status(502).json({ error: 'ImageKit could not upload this image.' });
      return;
    }
    if (!imageKitResult || typeof imageKitResult !== 'object' || !('url' in imageKitResult) ||
        typeof imageKitResult.url !== 'string') {
      console.error('ImageKit returned an invalid image upload response.');
      response.status(502).json({ error: 'ImageKit returned an invalid upload response.' });
      return;
    }
    response.status(201).json({ data: { url: imageKitResult.url } });
  }),
  (error: unknown, _request: Request, response: Response, next: NextFunction) => {
    if (error && typeof error === 'object' && 'status' in error && error.status === 413) {
      response.status(413).json({ error: 'Image files must be 5 MB or smaller.' });
      return;
    }
    next(error);
  },
);

app.get('/api/v1/admin/products', (_request, response) => {
  response.json({ data: database.products });
});

app.post('/api/v1/admin/products', asyncRoute(async (request, response) => {
  const product = productFrom(request.body || {});
  if (!product) {
    response.status(400).json({ error: 'A product name, category, and non-negative price are required.' });
    return;
  }
  if (duplicateSlug(product.slug, database.products) || (product.sku && database.products.some((item) => item.sku === product.sku))) {
    response.status(409).json({ error: 'Product slug or SKU already exists.' });
    return;
  }
  database.products.unshift(product);
  await persistDatabase();
  response.status(201).json({ data: product });
}));

app.put('/api/v1/admin/products/:id', asyncRoute(async (request, response) => {
  const index = database.products.findIndex((product) => product.id === request.params.id);
  if (index < 0) {
    response.status(404).json({ error: 'Product not found.' });
    return;
  }
  const product = productFrom(request.body || {}, database.products[index]);
  if (!product) {
    response.status(400).json({ error: 'A product name, category, and non-negative price are required.' });
    return;
  }
  if (duplicateSlug(product.slug, database.products, product.id) || (product.sku && database.products.some((item) => item.id !== product.id && item.sku === product.sku))) {
    response.status(409).json({ error: 'Product slug or SKU already exists.' });
    return;
  }
  database.products[index] = product;
  await persistDatabase();
  response.json({ data: product });
}));

app.delete('/api/v1/admin/products/:id', asyncRoute(async (request, response) => {
  const product = database.products.find((item) => item.id === request.params.id);
  if (!product) {
    response.status(404).json({ error: 'Product not found.' });
    return;
  }
  product.isActive = false;
  product.updatedAt = new Date().toISOString();
  await persistDatabase();
  response.json({ message: 'Product archived.' });
}));

app.post('/api/v1/admin/categories', asyncRoute(async (request, response) => {
  const category = categoryFrom(request.body || {});
  if (!category) {
    response.status(400).json({ error: 'A valid category name is required.' });
    return;
  }
  if (duplicateSlug(category.slug, database.categories)) {
    response.status(409).json({ error: 'Category slug already exists.' });
    return;
  }
  database.categories.push(category);
  await persistDatabase();
  response.status(201).json({ data: category });
}));

app.put('/api/v1/admin/categories/:id', asyncRoute(async (request, response) => {
  const index = database.categories.findIndex((item) => item.id === request.params.id);
  if (index < 0) {
    response.status(404).json({ error: 'Category not found.' });
    return;
  }
  const category = categoryFrom(request.body || {}, database.categories[index]);
  if (!category) {
    response.status(400).json({ error: 'A valid category name is required.' });
    return;
  }
  if (duplicateSlug(category.slug, database.categories, category.id)) {
    response.status(409).json({ error: 'Category slug already exists.' });
    return;
  }
  database.categories[index] = category;
  await persistDatabase();
  response.json({ data: category });
}));

app.get('/api/v1/admin/enquiries', (_request, response) => {
  response.json({ data: database.enquiries });
});

app.patch('/api/v1/admin/enquiries/:id', asyncRoute(async (request, response) => {
  const enquiry = database.enquiries.find((item) => item.id === request.params.id);
  const status = request.body?.status;
  if (!enquiry) {
    response.status(404).json({ error: 'Enquiry not found.' });
    return;
  }
  if (!['new', 'read', 'archived'].includes(status)) {
    response.status(400).json({ error: 'Status must be new, read, or archived.' });
    return;
  }
  enquiry.status = status;
  await persistDatabase();
  response.json({ data: enquiry });
}));

app.patch('/api/v1/admin/settings', asyncRoute(async (request, response) => {
  const allowed = ['businessName', 'logo', 'address', 'phone', 'email', 'whatsapp', 'landmark', 'googleMapsQuery', 'operationalDays', 'openingHours', 'closingHours', 'socialLinks'];
  const changes = Object.fromEntries(Object.entries(request.body || {}).filter(([key]) => allowed.includes(key)));
  if (Object.keys(changes).length === 0) {
    response.status(400).json({ error: 'Provide at least one supported settings field.' });
    return;
  }
  database.settings = { ...database.settings, ...changes };
  await persistDatabase();
  response.json({ data: database.settings });
}));

app.put('/api/v1/admin/services/:id', asyncRoute(async (request, response) => {
  const service = database.services.find((item) => item.id === request.params.id);
  if (!service) {
    response.status(404).json({ error: 'Service not found.' });
    return;
  }
  const { name, description, price, isActive } = request.body || {};
  if (name !== undefined && !validText(name, 160)) {
    response.status(400).json({ error: 'Service name is invalid.' });
    return;
  }
  if (description !== undefined && typeof description !== 'string') {
    response.status(400).json({ error: 'Service description must be text.' });
    return;
  }
  if (price !== undefined && price !== null && !validPrice(price)) {
    response.status(400).json({ error: 'Service price must be a non-negative number or null.' });
    return;
  }
  Object.assign(service, { ...(name !== undefined ? { name: name.trim() } : {}), ...(description !== undefined ? { description: description.trim() } : {}), ...(price !== undefined ? { price } : {}), ...(typeof isActive === 'boolean' ? { isActive } : {}) });
  await persistDatabase();
  response.json({ data: service });
}));

app.use('/api', (_request, response) => {
  response.status(404).json({ error: 'API route not found.' });
});
app.use(express.static(path.resolve(process.cwd(), 'dist')));
app.get('*', (_request, response, next) => {
  response.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'), (error) => {
    if (error) next(error);
  });
});
app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  console.error('API request failed:', error);
  response.status(500).json({ error: 'An unexpected server error occurred.' });
});

const port = Number(process.env.PORT || process.env.API_PORT || 3001);
loadDatabase().then(() => {
  app.listen(port, '0.0.0.0', () => {
    console.log(`S V Copiers API listening on http://localhost:${port}/api/v1`);
    if (generatedPassword) {
      console.warn(`Temporary development admin credentials: ${adminUsername} / ${adminPassword}`);
      console.warn('Set ADMIN_PASSWORD and ADMIN_TOKEN_SECRET in .env before deployment.');
    }
    console.log(`Local data file: ${dataFile}`);
  });
}).catch((error) => {
  console.error(`Could not load API data file at ${dataFile}:`, error);
  process.exitCode = 1;
});
