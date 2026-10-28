
import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Delete,
  Patch,
  Param,
  UseGuards,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { KnowledgeService } from './knowledge.service.js';
import { AuthGuard } from '@nestjs/passport';

@Controller('knowledge')
@UseGuards(AuthGuard('jwt'))
export class KnowledgeController {
  constructor(
    private readonly knowledgeService: KnowledgeService,
  ) {}

  @Get()
  async getKnowledge(@Req() req: Request) {
    const user = req.user as { customerId: string };

    return this.knowledgeService.getKnowledge(
      user.customerId,
    );
  }


  
@Get(':id')
async getKnowledgeById(
  @Req() req: Request,
  @Param('id') id: string,
) {
  const user = req.user as { customerId: string };

  return this.knowledgeService.getKnowledgeById(
    user.customerId,
    id,
  );
}



  @Delete(':id')
  async deleteKnowledge(
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    const user = req.user as { customerId: string };

    return this.knowledgeService.deleteKnowledge(
      user.customerId,
      id,
    );
  }

  // Update existing text knowledge
  @Patch(':id')
  async updateTextKnowledge(
    @Req() req: Request,
    @Param('id') id: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    if (!title?.trim() || !content?.trim()) {
      throw new BadRequestException(
        'Title and content are required',
      );
    }

    const user = req.user as { customerId: string };

    return this.knowledgeService.updateTextKnowledge(
      user.customerId,
      id,
      title.trim(),
      content.trim(),
    );
  }

  @Post('text')
  async addTextKnowledge(
    @Req() req: Request,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
   if (
  typeof title !== 'string' ||
  typeof content !== 'string' ||
  !title.trim() ||
  !content.trim()
) {
  throw new BadRequestException(
    'Title and content must be non-empty strings',
  );
}
    const user = req.user as { customerId: string };

    return this.knowledgeService.addTextKnowledge(
      user.customerId,
      title.trim(),
      content.trim(),
    );
  }

 
  @Post('document')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
      },
    }),
  )
 
async uploadDocument(
  @Req() req: Request,
  @UploadedFile(
    new ParseFilePipe({
    validators: [
  new MaxFileSizeValidator({
    maxSize: 5 * 1024 * 1024,
  }),
  new FileTypeValidator({
    fileType:
      /^(application\/pdf|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|text\/plain)$/,
  }),
],
    }),
  )
  file: {
    originalname: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
  },

    @Body('title') title?: string,
  ) {
    const user = req.user as { customerId: string };

    return this.knowledgeService.addDocumentKnowledge(
      user.customerId,
      file,
      title,
    );
  }

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
      },
    }),
  )
  async uploadImage(
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024,
          }),
          new FileTypeValidator({
            fileType: /^image\/(jpeg|png)$/,
          }),
        ],
      }),
    )
    file: {
      originalname: string;
      mimetype: string;
      size: number;
      buffer: Buffer;
    },
    @Body('title') title?: string,
  ) {
    const user = req.user as { customerId: string };

    return this.knowledgeService.addImageKnowledge(
      user.customerId,
      file,
      title,
    );
  }

  @Post('website')
  async addWebsiteKnowledge(
    @Req() req: Request,
    @Body('url') sourceUrl: string,
  ) {
    if (
  typeof sourceUrl !== 'string' ||
  !sourceUrl.trim()
) {
  throw new BadRequestException(
    'Website URL must be a non-empty string',
  );
}

let parsedUrl: URL;

try {
  parsedUrl = new URL(sourceUrl.trim());
} catch {
  throw new BadRequestException(
    'Please provide a valid website URL',
  );
}

if (
  parsedUrl.protocol !== 'http:' &&
  parsedUrl.protocol !== 'https:'
) {
  throw new BadRequestException(
    'Only HTTP and HTTPS website URLs are allowed',
  );
}

    const user = req.user as { customerId: string };

    return this.knowledgeService.addWebsiteKnowledge(
      user.customerId,
      sourceUrl.trim(),
    );
  }
}
