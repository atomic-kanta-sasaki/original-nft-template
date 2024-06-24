import { NextResponse } from 'next/server';

export async function GET() {
 try {
   return NextResponse.json({
    name: 'Mike',
  });
  } catch (error) {
    throw error
  }
}