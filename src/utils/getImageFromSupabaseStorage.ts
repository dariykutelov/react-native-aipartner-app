import { supabase } from '~/lib/supabase';

export const getImageUrl = (bucketName: string, imageName: string) => {
  return supabase.storage.from(bucketName).getPublicUrl(imageName);
};
