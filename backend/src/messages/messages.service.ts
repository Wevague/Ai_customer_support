  import { Injectable ,NotFoundException} from '@nestjs/common';
  import { randomUUID } from 'node:crypto';
  import { PrismaService } from '../prisma/prisma.service.js';
  import { AiService } from '../ai/ai.service.js';


  @Injectable()
  export class MessagesService {
      constructor(private readonly prisma: PrismaService,
          private readonly aiService: AiService,

      ) {}
  
  async addMessage(
    message: string,
    ownerId: string,
    sessionId?: string,
  ) {
    const business = await this.prisma.business.findUnique({
      where: { ownerId },
    });

    if (!business) {
      throw new NotFoundException('Business not found for this owner');
    }

    const currentSessionId = sessionId ?? randomUUID();

    await this.prisma.conversation.upsert({
  where: {
    businessId_sessionId: {
      businessId: business.id,
      sessionId: currentSessionId,
    },
  },
  create: {
    businessId: business.id,
    sessionId: currentSessionId,
    status: 'OPEN',
  },
  update: {},
});
    // 1. Save the customer's message
    const customerMessage = await this.prisma.supportMessage.create({
      data: {
        businessId: business.id,
        sessionId: currentSessionId,
        message,
        sender: 'SHOPPER',
      },
    });

    // 2. Get this business's saved knowledge
    const knowledgeSources =
      await this.prisma.knowledgeSource.findMany({
        where: {
          businessId: business.id,
          status: 'READY',
        },
        select: {
          title: true,
          extractedText: true,
        },
      });

    // 3. Remove common words from the customer's question
    const stopWords = new Set([
      'the', 'and', 'for', 'are', 'was', 'were',
      'what', 'when', 'where', 'who', 'why', 'how',
      'does', 'did', 'can', 'could', 'would', 'will',
      'you', 'your', 'our', 'with', 'from', 'that',
      'this', 'have', 'has', 'had', 'not', 'please',
      'tell', 'about', 'business', 'information',
      'my', 'is', 'a', 'an', 'to', 'of', 'in',
    ]);

    const questionWords = [
      ...new Set(
        message
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter(
            (word) => word.length > 2 && !stopWords.has(word),
          ),
      ),
    ];

    // 4. Expand question keywords with synonyms
   
const synonyms: Record<string, string[]> = {
  delivery: ['delivered', 'deliver', 'shipping', 'shipped', 'ship', 'arrive', 'arrival', 'order'],
  delivered: ['delivery', 'deliver', 'shipping', 'shipped', 'ship', 'arrive', 'arrival'],
  deliver: ['delivery', 'delivered', 'shipping', 'shipped'],
  shipping: ['delivery', 'delivered', 'shipped', 'ship', 'arrive', 'arrival', 'order'],
  shipped: ['shipping', 'delivery', 'delivered', 'ship'],
  ship: ['shipping', 'delivery', 'delivered', 'shipped'],
  arrive: ['arrival', 'delivery', 'delivered', 'shipping'],
  arrival: ['arrive', 'delivery', 'delivered', 'shipping'],
  parcel: ['delivery', 'shipping', 'order'],
  order: ['delivery', 'shipping', 'parcel'],
  cost: ['price', 'fee'],
  refund: ['return', 'money'],
};

    const expandedQuestionWords = [
      ...new Set([
        ...questionWords,
        ...questionWords.flatMap((word) => synonyms[word] ?? []),
      ]),
    ];

    // 5. Find relevant knowledge sources
    const relevantSources = knowledgeSources
      .map((source) => {
        const searchableWords = new Set(
          `${source.title ?? ''} ${source.extractedText ?? ''}`
            .toLowerCase()
            .split(/[^a-z0-9]+/)
            .filter(Boolean),
        );

        const score = expandedQuestionWords.reduce(
          (total, word) =>
            total + (searchableWords.has(word) ? 1 : 0),
          0,
        );

        return { source, score };
      })
      .filter((item) => item.score >= 2)
.sort((a, b) => b.score - a.score)
.slice(0, 3);

    // 6. Prepare relevant knowledge for Gemini
    const knowledgeContext = relevantSources
      .map(
        ({ source }) =>
          `Title: ${source.title ?? 'Business Information'}\n${
            source.extractedText ?? ''
          }`,
      )
      .join('\n\n');

      console.log('Question:', message);
console.log('Expanded keywords:', expandedQuestionWords);
console.log(
  'Relevant sources:',
  relevantSources.map(({ source, score }) => ({
    title: source.title,
    score,
    extractedText: source.extractedText,
  })),
);
console.log('Knowledge context sent to Gemini:', knowledgeContext);

    // 7. Generate the AI reply
    const aiReply = await this.aiService.generateReply(
      message,
      knowledgeContext,
    );

    // 8. Save the AI reply in the same conversation
    const aiMessage = await this.prisma.supportMessage.create({
      data: {
        businessId: business.id,
        sessionId: currentSessionId,
        message: aiReply,
        sender: 'AI',
      },
    });

    // 9. Return both messages
    return {
      sessionId: currentSessionId,
      customerMessage,
      aiMessage,
    };
  }




          async getMessage(ownerId: string){
              const business = await this.prisma.business.findUnique({
                  where: {ownerId},
              });

              if(!business) {
                  throw new NotFoundException("Business not found for this owner")
              }

              return this.prisma.supportMessage.findMany({
                  where : {businessId:business.id},
                  orderBy :{createdAt: 'desc'},
              });
          }


        
  async getMessagesBySession(
    ownerId: string,
    sessionId: string,
  ) {
    const business = await this.prisma.business.findUnique({
      where: { ownerId },
    });

    if (!business) {
      throw new NotFoundException(
        'Business not found for this owner',
      );
    }

    return this.prisma.supportMessage.findMany({
      where: {
        businessId: business.id,
        sessionId: sessionId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }


  async getConversations(ownerId: string) {
      console.log('Owner ID:', ownerId);
    const business = await this.prisma.business.findUnique({
      where: { ownerId },
    });

    if (!business) {
      throw new NotFoundException(
        'Business not found for this owner',
      );
    }

    const messages = await this.prisma.supportMessage.findMany({
      where: {
        businessId: business.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

      console.log('Messages found:', messages.length);

    const conversations = new Map();


    for (const message of messages) {
      if (!conversations.has(message.sessionId)) {
        conversations.set(message.sessionId, {
          sessionId: message.sessionId,
          latestMessage: message.message,
          latestMessageAt: message.createdAt,
        });
      }
    }

    return Array.from(conversations.values());
  }

  
async getConversationStatuses(ownerId: string) {
  const business = await this.prisma.business.findUnique({
    where: { ownerId },
    select: { id: true },
  });

  if (!business) {
    throw new NotFoundException('Business not found');
  }

  return this.prisma.conversation.findMany({
    where: {
      businessId: business.id,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
}




async updateConversationStatus(
  ownerId: string,
  sessionId: string,
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED',
) {
  const business = await this.prisma.business.findUnique({
    where: { ownerId },
    select: { id: true },
  });

  if (!business) {
    throw new NotFoundException('Business not found');
  }

  const conversation = await this.prisma.conversation.findFirst({
    where: {
      businessId: business.id,
      sessionId,
    },
    select: { id: true },
  });

  if (!conversation) {
    throw new NotFoundException('Conversation not found');
  }

  return this.prisma.conversation.update({
    where: { id: conversation.id },
    data: {
      status,
      needsHuman: status === 'IN_PROGRESS'
        ? true
        : status === 'RESOLVED'
          ? false
          : false,
    },
  });
}

async requestHumanHandoff(
  ownerId: string,
  sessionId: string,
) {
  const business = await this.prisma.business.findUnique({
    where: { ownerId },
    select: { id: true },
  });

  if (!business) {
    throw new NotFoundException('Business not found');
  }

  const conversation = await this.prisma.conversation.findFirst({
    where: {
      businessId: business.id,
      sessionId,
    },
  });

  if (!conversation) {
    throw new NotFoundException('Conversation not found');
  }

  return this.prisma.conversation.update({
    where: { id: conversation.id },
    data: {
      needsHuman: true,
      humanHandoffAt: new Date(),
      status: 'IN_PROGRESS',
    },
  });
}
  
  }




