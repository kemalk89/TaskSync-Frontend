/**
 * Provides a safe way to parse JSON responses from fetch API calls without risking unhandled exceptions
 * when the response body is not valid JSON.
 */
export const tryJson = async (response: Response) => {
  try {
    const json = await response.json();
    return json;
  } catch (err) {
    console.info("Could not parse response body text as JSON");
    return {};
  }
};
