import juno from "juno-sdk";


let initialized = false;

export function getJunoInstance() {
  if (!initialized) {
    juno.init({
      "apiKey": "insert key here",
      "baseURL": "http://localhost:32774",
    });

    initialized = true;
  }

  return juno;
}
