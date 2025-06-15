import { supabase } from '@/lib/supabaseClient';

const bucket:string = process.env.BUCKET_NAME! || "reports";

export async function uploadPDFToStorage(file: File, sessionId: string): Promise<string> {
  const filePath = `reports/${sessionId}/${file.name}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      upsert: true,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);
  return filePath;
}

export async function updateReportInSession(sessionId: string, newPath: string): Promise<void> {
  const { data: sessionData, error: fetchError } = await supabase
    .from('sessions')
    .select('report')
    .eq('id', sessionId)
    .single();

  if (fetchError) throw new Error(`Session fetch failed: ${fetchError.message}`);

  const updatedReport = [...(sessionData?.report || []), newPath];

  const { error: updateError } = await supabase
    .from('sessions')
    .update({ report: updatedReport })
    .eq('id', sessionId);

  if (updateError) throw new Error(`Update failed: ${updateError.message}`);
}
