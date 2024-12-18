const streamTokenProvider = async (userId: string) => {
  const token = await fetch('https://getstream.io/token/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return token;
};

export default streamTokenProvider;
