import juno from "juno-sdk";

let initialized = false;

export function getJunoInstance() {
  if (!initialized) {
    juno.init({
      apiKey: process.env.JUNO_API_KEY,
      baseURL: process.env.JUNO_BASE_URL || "http://localhost:8888",
    });

    initialized = true;
  }

  return juno;
}
