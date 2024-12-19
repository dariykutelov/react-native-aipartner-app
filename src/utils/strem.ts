import { supabase } from '~/lib/supabase';

export const getStreamToken = async () => {
  const { data, error } = await supabase.functions.invoke('stream-token-provider');
  if (error) {
    console.error('Error fetching Stream token:', error);
    return null;
  }
  return data?.token;
};

// const streamTokenProvider = async (userId: string) => {
//   const token = await fetch('https://getstream.io/token/', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   return token;
// };

// export default streamTokenProvider;
