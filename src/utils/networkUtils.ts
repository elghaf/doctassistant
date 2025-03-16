export const checkNetworkStatus = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors',
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const validateSupabaseConnection = async () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error('Supabase URL is not configured');
  }
  
  const isConnected = await checkNetworkStatus(supabaseUrl);
  if (!isConnected) {
    throw new Error('Cannot connect to Supabase. Please check your internet connection.');
  }
  
  return true;
};