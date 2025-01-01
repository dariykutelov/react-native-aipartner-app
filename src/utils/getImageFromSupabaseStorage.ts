import { supabase } from '~/lib/supabase';

export const getImageUrl = (
  bucketName: string,
  imageName: string,
  width: number = 500,
  height: number = 500
) => {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(imageName);

  // Works only for supabase pro plan: https://supabase.com/docs/guides/storage/serving/image-transformations
  return `${data.publicUrl}?width=${width}&height=${height}&crop=face`;
};
