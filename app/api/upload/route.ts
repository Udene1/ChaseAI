import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/server';

// Simplified PDF upload without pdf-parse for now
// pdf-parse has issues with Next.js serverless functions

// POST /api/upload - Upload and parse PDF
export async function POST(request: Request) {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        if (file.type !== 'application/pdf') {
            return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
        }

        const supabase = createClient();

        // Generate unique filename
        const timestamp = Date.now();
        const filename = `${user.id}/${timestamp}-${file.name}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('invoices')
            .upload(filename, file, {
                contentType: 'application/pdf',
                upsert: false,
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('invoices')
            .getPublicUrl(filename);

        // TODO: Parse PDF for amount and date using pdf-parse
        // For now, return just the URL
        // The user will need to enter the amount and date manually

        return NextResponse.json({
            success: true,
            url: urlData.publicUrl,
            parsedData: null, // PDF parsing disabled for now
            message: 'PDF uploaded. Please enter amount and date manually.',
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
