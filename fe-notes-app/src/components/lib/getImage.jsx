async function getImage({ content }) {
  const apiKey = import.meta.env.VITE_GEN_AI_API_KEY;

  const myHeaders = new Headers();
  myHeaders.append("provider", "open-ai");
  myHeaders.append("mode", "production");
  const authorizationValue = `${apiKey}`;
  myHeaders.append("Authorization", authorizationValue); // Ensure this is correctly set
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    model: "dall-e-3",
    prompt: `JSON mode. Generate an image that portrays the following content: ${content}.
    Return the image as a key named image-url.`,
    size: "1024x1024",
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const getResponse = async () => {
    try {
      const response = await fetch(
        "https://gen-ai-wbs-consumer-api.onrender.com/api/v1/images/generations",
        requestOptions
      );

      const data = await response.json();
      console.log(data[0].url);
      return (data[0].url);
    } catch (error) {
      console.error(error);
    }
  };

  return await getResponse();

}

export default getImage;
