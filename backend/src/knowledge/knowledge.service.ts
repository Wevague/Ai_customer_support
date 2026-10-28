import { guardedFetch } from 'guarded-fetch';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import Tesseract from 'tesseract.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { extname } from 'node:path';
import { isIP } from 'node:net';
import { lookup } from 'node:dns/promises';
import { PDFParse } from 'pdf-parse';
import * as cheerio from 'cheerio';
import mammoth from 'mammoth';


@Injectable()
export class KnowledgeService {
  constructor(private readonly prisma: PrismaService) {}

  // Add text knowledge
  async addTextKnowledge(
    ownerId: string,
    title: string,
    content: string,
  ) {
    const business = await this.prisma.business.findUnique({
      where: { ownerId },
    });

    if (!business) {
      throw new UnauthorizedException(
        'Create your business profile first',
      );
    }

    return this.prisma.knowledgeSource.create({
      data: {
        businessId: business.id,
        type: 'TEXT',
        status: 'READY',
        title,
        extractedText: content,
      },
    });
  }

  // Upload and extract PDF, DOCX, or TXT knowledge
  async addDocumentKnowledge(
    ownerId: string,
    file: {
      originalname: string;
      mimetype: string;
      size: number;
      buffer: Buffer;
    },
    title?: string,
  ) {
    const business = await this.prisma.business.findUnique({
      where: { ownerId },
    });

    if (!business) {
      throw new UnauthorizedException(
        'Create your business profile first',
      );
    }

  const extension = extname(file.originalname).toLowerCase();

// Validate the actual file content for PDF and DOCX.
if (extension === '.pdf') {
  if (!file.buffer.subarray(0, 5).equals(Buffer.from('%PDF-'))) {
    throw new BadRequestException('Invalid PDF file content');
  }
} else if (extension === '.docx') {
  // DOCX files are ZIP archives and start with PK.
  if (
    file.buffer.length < 4 ||
    file.buffer[0] !== 0x50 ||
    file.buffer[1] !== 0x4b ||
    file.buffer[2] !== 0x03 ||
    file.buffer[3] !== 0x04
  ) {
    throw new BadRequestException('Invalid DOCX file content');
  }
} else if (extension !== '.txt') {
  throw new BadRequestException(
    'Only PDF, DOCX, and TXT files are supported',
  );
}

let extractedText = '';

    if (extension === '.txt') {
      extractedText = file.buffer.toString('utf8');
    } else if (extension === '.docx') {
      const result = await mammoth.extractRawText({
        buffer: file.buffer,
      });

      extractedText = result.value;
    } else if (extension === '.pdf') {
      const parser = new PDFParse({
        data: file.buffer,
      });

      try {
        const result = await parser.getText();
        extractedText = result.text;
      } finally {
        await parser.destroy();
      }
    } else {
      throw new BadRequestException(
        'Only PDF, DOCX, and TXT files are supported',
      );
    }

    extractedText = extractedText.trim();

if (!extractedText) {
  throw new BadRequestException(
    'No readable text found in the document',
  );
}

const MAX_TEXT_LENGTH = 100_000;

if (extractedText.length > MAX_TEXT_LENGTH) {
  throw new BadRequestException(
    'Document text is too long. Maximum allowed is 100,000 characters.',
  );
}
    return this.prisma.knowledgeSource.create({
      data: {
        businessId: business.id,
        type: 'DOCUMENT',
        status: 'READY',
        title: title?.trim() || file.originalname,
        originalName: file.originalname,
        mimeType: file.mimetype,
        extractedText,
      },
    });
  }

  async addImageKnowledge(
  ownerId: string,
  file: {
    originalname: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
  },
  title?: string,
) {
  const business = await this.prisma.business.findUnique({
    where: { ownerId },
  });

  if (!business) {
    throw new UnauthorizedException(
      'Create your business profile first',
    );
  }

  if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
    throw new BadRequestException(
      'Only JPG and PNG images are supported',
    );
  }

  const result = await Tesseract.recognize(file.buffer, 'eng');
  const extractedText = result.data.text.trim();

  if (!extractedText) {
    throw new BadRequestException(
      'No readable text found in the image',
    );
  }

  const MAX_TEXT_LENGTH = 100_000;

  if (extractedText.length > MAX_TEXT_LENGTH) {
    throw new BadRequestException(
      'Extracted text is too long',
    );
  }

  return this.prisma.knowledgeSource.create({
    data: {
      businessId: business.id,
      type: 'IMAGE',
      status: 'READY',
      title: title?.trim() || file.originalname,
      originalName: file.originalname,
      mimeType: file.mimetype,
      extractedText,
    },
  });
}

  // Add knowledge from a website URL
  async addWebsiteKnowledge(
    ownerId: string,
    sourceUrl: string,
  ) {
    let url: URL;

    try {
      url = new URL(sourceUrl);
    } catch {
      throw new BadRequestException(
        'Please provide a valid website URL',
      );
    }

    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new BadRequestException(
        'Only HTTP and HTTPS URLs are supported',
      );
    }

    if (url.username || url.password) {
      throw new BadRequestException(
        'URLs containing credentials are not allowed',
      );
    }

    const hostname = url.hostname.toLowerCase();

    // Reject local hostnames and direct IP addresses.
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      hostname === 'metadata.google.internal' ||
      isIP(hostname) !== 0
    ) {
      throw new BadRequestException(
        'This website address is not allowed',
      );
    }

    // Reject hostnames resolving to non-public IP addresses.
    const addresses = await lookup(hostname, {
      all: true,
      verbatim: true,
    }).catch(() => []);

    const hasUnsafeAddress = addresses.some(({ address }) => {
      const version = isIP(address);

      if (version === 4) {
        const [a, b, c] = address.split('.').map(Number);

        return (
          a === 0 ||
          a === 10 ||
          a === 127 ||
          (a === 100 && b >= 64 && b <= 127) ||
          (a === 169 && b === 254) ||
          (a === 172 && b >= 16 && b <= 31) ||
          (a === 192 && b === 168) ||
          (a === 192 && b === 0) ||
          (a === 198 && (b === 18 || b === 19)) ||
          a >= 224 ||
          (a === 192 && b === 88 && c === 99)
        );
      }

      if (version === 6) {
        const normalized = address.toLowerCase();

        return (
          normalized === '::' ||
          normalized === '::1' ||
          normalized.startsWith('fc') ||
          normalized.startsWith('fd') ||
          /^fe[89ab]/i.test(normalized) ||
          normalized.startsWith('::ffff:')
        );
      }

      return true;
    });

    if (addresses.length === 0 || hasUnsafeAddress) {
      throw new BadRequestException(
        'This website address is not allowed or could not be resolved',
      );
    }

    const business = await this.prisma.business.findUnique({
      where: { ownerId },
    });

    if (!business) {
      throw new UnauthorizedException(
        'Create your business profile first',
      );
    }

    // const controller = new AbortController();
    // const timeout = setTimeout(
    //   () => controller.abort(),
    //   10000,
    // );

    let response: Response;

    try {
      response = await guardedFetch(url, {
  timeoutMs: 10_000,
  followRedirects: false,
  headers: {
    'User-Agent': 'AI-Customer-Support-KnowledgeBot/1.0',
    Accept: 'text/html',
  },
});
    } catch {
      throw new BadRequestException(
        'Could not fetch this website',
      );
    } 

    if (response.status >= 300 && response.status < 400) {
      throw new BadRequestException(
        'Website redirects are not supported. Provide the final page URL.',
      );
    }

    if (!response.ok) {
      throw new BadRequestException(
        `Website returned HTTP ${response.status}`,
      );
    }

    const contentType =
      response.headers.get('content-type') || '';

    if (!contentType.toLowerCase().includes('text/html')) {
      throw new BadRequestException(
        'The URL must point to an HTML webpage',
      );
    }

    // Read a limited amount of HTML to avoid processing huge pages.
    const reader = response.body?.getReader();

    if (!reader) {
      throw new BadRequestException(
        'Could not read website content',
      );
    }

    const chunks: Uint8Array[] = [];
    let totalBytes = 0;
    const maxBytes = 2_000_000;

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        totalBytes += value.byteLength;

        if (totalBytes > maxBytes) {
          await reader.cancel();
          throw new BadRequestException(
            'Website page is too large',
          );
        }

        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }

    const html = Buffer.concat(
      chunks.map((chunk) => Buffer.from(chunk)),
    ).toString('utf8');

    const $ = cheerio.load(html);

    const pageTitle = $('title').first().text().trim();

    $(
      'script, style, noscript, iframe, svg, nav, footer, header, form',
    ).remove();

    const extractedText = $('body')
      .text()
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 100_000);

    if (!extractedText) {
      throw new BadRequestException(
        'No readable text found on this webpage',
      );
    }

    return this.prisma.knowledgeSource.create({
      data: {
        businessId: business.id,
        type: 'WEBSITE',
        status: 'READY',
        title: pageTitle || url.hostname,
        sourceUrl: url.href,
        extractedText,
      },
    });
  }

  
  // List knowledge sources belonging to the logged-in business owner
  async getKnowledge(ownerId: string) {
    const business = await this.prisma.business.findUnique({
      where: { ownerId },
      select: { id: true },
    });

    if (!business) {
      throw new UnauthorizedException(
        'Create your business profile first',
      );
    }

    return this.prisma.knowledgeSource.findMany({
      where: {
        businessId: business.id,
      },
      select: {
        id: true,
        type: true,
        status: true,
        title: true,
        sourceUrl: true,
        originalName: true,
        mimeType: true,
        errorMessage: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

  }


  
async getKnowledgeById(
  ownerId: string,
  knowledgeId: string,
) {
  const business = await this.prisma.business.findUnique({
    where: { ownerId },
    select: { id: true },
  });

  if (!business) {
    throw new UnauthorizedException(
      'Create your business profile first',
    );
  }

  const knowledge = await this.prisma.knowledgeSource.findFirst({
    where: {
      id: knowledgeId,
      businessId: business.id,
    },
  });
  console.log('Knowledge lookup:', {
  knowledgeId,
  businessId: business.id,
  found: Boolean(knowledge),
});

  if (!knowledge) {
    throw new NotFoundException('Knowledge source not found');
  }

  return knowledge;
}



async deleteKnowledge(ownerId: string, knowledgeId: string) {
  const business = await this.prisma.business.findUnique({
    where: { ownerId },
    select: { id: true },
  });

  if (!business) {
    throw new UnauthorizedException(
      'Create your business profile first',
    );
  }

  const knowledge = await this.prisma.knowledgeSource.findFirst({
    where: {
      id: knowledgeId,
      businessId: business.id,
    },
    select: { id: true },
  });

  if (!knowledge) {
    throw new NotFoundException('Knowledge source not found');
  }

  return this.prisma.knowledgeSource.delete({
    where: { id: knowledge.id },
  });
}
 
async updateTextKnowledge(
  ownerId: string,
  knowledgeId: string,
  title: string,
  content: string,
) {
  const business = await this.prisma.business.findUnique({
    where: { ownerId },
    select: { id: true },
  });

  if (!business) {
    throw new UnauthorizedException(
      'Create your business profile first',
    );
  }

  const knowledge = await this.prisma.knowledgeSource.findFirst({
    where: {
      id: knowledgeId,
      businessId: business.id,
      type: {
        in: ['TEXT', 'DOCUMENT'],
      },
    },
    select: {
      id: true,
      type: true,
    },
  });
  console.log('Update knowledge debug:', {
  ownerId,
  knowledgeId,
  businessId: business.id,
  foundKnowledge: knowledge,
});

  if (!knowledge) {
    throw new NotFoundException(
      'Text or document knowledge source not found',
    );
  }

  return this.prisma.knowledgeSource.update({
    where: { id: knowledge.id },
    data: {
      title,
      extractedText: content,
      status: 'READY',
      errorMessage: null,
    },
  });
}


}
