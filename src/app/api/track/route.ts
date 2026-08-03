import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const country = request.headers.get('x-vercel-ip-country') || 'Unknown';
    
    // Hash IP to maintain privacy while allowing unique counting
    const ipHash = crypto.createHash('sha256').update(ip + userAgent).digest('hex');

    // Simple rate limiting/deduplication (only log once per hour per IP hash)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const recentVisit = await prisma.siteVisit.findFirst({
      where: {
        ipHash,
        date: {
          gte: oneHourAgo,
        },
      },
    });

    if (!recentVisit) {
      await prisma.siteVisit.create({
        data: {
          ipHash,
          userAgent: userAgent.substring(0, 255), // Truncate if too long
          country,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking visit:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
